import { NextResponse, type NextRequest } from "next/server";

import { FILE_RULES, detectFileType, leadSchema } from "@/lib/lead";

/**
 * รับฟอร์ม "ติดต่อเรา" / "ขอใบเสนอราคา" แล้วส่งต่อเข้าระบบหลังบ้าน (da-app-server)
 * ซึ่งเป็นคนบันทึกลงระบบ แจ้งเตือนทีมขาย และส่งอีเมล
 *
 * ⚠️ ทำไมไม่ให้เบราว์เซอร์ยิงเข้า da-app-server ตรงๆ:
 *    1) กุญแจ LEAD_API_KEY อยู่ฝั่ง server เท่านั้น ใครดูโค้ดหน้าเว็บก็ไม่เห็น
 *    2) ตรวจสแปม/ไฟล์ที่นี่ก่อน ของเสียไม่ถึงระบบภายในเลย
 *    3) ที่อยู่ของระบบภายในไม่ถูกเปิดเผยในหน้าเว็บสาธารณะ
 * ⚠️ **ห้ามตอบ "ส่งสำเร็จ" ถ้าระบบหลังบ้านยังไม่ยืนยันว่าบันทึกแล้ว** — ฟอร์มที่บอกลูกค้าว่า
 *    ส่งแล้วทั้งที่ข้อมูลหาย คือความเสียหายที่แย่ที่สุดของเว็บผู้รับเหมา ลูกค้ารอสายที่ไม่มีวันมา
 */

export const runtime = "nodejs";

/* ── กันสแปม: จำกัดจำนวนครั้งต่อ IP ─────────────────────────────────────── */

/**
 * ⚠️ เก็บในหน่วยความจำของเครื่องเดียว — บนระบบที่รันหลายเครื่องพร้อมกัน (serverless)
 *    ขีดจำกัดจะหลวมกว่าตัวเลขนี้ จึงเป็นแค่ด่านแรก ฝั่ง da-app-server ต้องจำกัดซ้ำอีกชั้นเสมอ
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // กันแผนที่โตไม่หยุด — ล้างรายการเก่าเป็นระยะ
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_PER_WINDOW;
}

/** ⚠️ เชื่อ x-forwarded-for ตัวแรกได้ก็ต่อเมื่ออยู่หลัง proxy ที่เราควบคุม (Vercel/Nginx) */
const clientIp = (req: NextRequest) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

/** ⚠️ กรอกฟอร์มเสร็จใน 3 วินาทีทำไม่ได้สำหรับคน — ถ้าเร็วกว่านั้นคือบอทแทบแน่นอน */
const MIN_FILL_MS = 3000;

const fail = (status: number, error: string, fieldErrors?: Record<string, string>) =>
  NextResponse.json({ ok: false, error, fieldErrors }, { status });

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail(400, "รูปแบบข้อมูลไม่ถูกต้อง");
  }

  // ── 1) ด่านบอท ──
  // ⚠️ ตอบ "สำเร็จ" หลอกบอท ไม่บอกว่าจับได้ — ถ้าตอบ error บอทจะรู้แล้วปรับตัวหลบ
  if (String(form.get("website") || "") !== "") return NextResponse.json({ ok: true, ref: "" });
  const startedAt = Number(form.get("t") || 0);
  if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) return NextResponse.json({ ok: true, ref: "" });

  const ip = clientIp(req);
  if (rateLimited(ip)) return fail(429, "ส่งข้อมูลบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่ หรือโทรหาเราโดยตรง");

  // ── 2) ตรวจข้อมูลด้วยกติกาเดียวกับหน้าเว็บ ──
  const raw: Record<string, unknown> = {};
  for (const [k, v] of form.entries()) if (typeof v === "string") raw[k] = v;
  raw.consent = raw.consent === "true" || raw.consent === "on";

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return fail(422, "กรุณาตรวจสอบข้อมูลที่กรอกอีกครั้ง", fieldErrors);
  }
  const lead = parsed.data;

  // ── 3) ตรวจไฟล์แนบ (เฉพาะขอใบเสนอราคา) ──
  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length && lead.kind !== "quotation") return fail(422, "ฟอร์มนี้ไม่รองรับไฟล์แนบ");
  if (files.length > FILE_RULES.maxFiles) return fail(422, `แนบไฟล์ได้ไม่เกิน ${FILE_RULES.maxFiles} ไฟล์`);
  let total = 0;
  for (const f of files) {
    total += f.size;
    if (f.size > FILE_RULES.maxFileBytes) return fail(422, `ไฟล์ "${f.name}" ใหญ่เกิน 4 MB — ไฟล์ขนาดใหญ่ส่งให้ทีมงานทาง LINE หรืออีเมลได้หลังเราติดต่อกลับ`);
    const head = new Uint8Array(await f.slice(0, 16).arrayBuffer());
    if (!detectFileType(head, f.name)) {
      return fail(422, `ไฟล์ "${f.name}" ไม่ใช่ชนิดที่รองรับ (${FILE_RULES.label}) หรือเนื้อไฟล์ไม่ตรงกับนามสกุล`);
    }
  }
  if (total > FILE_RULES.maxTotalBytes) return fail(422, "ไฟล์แนบรวมกันใหญ่เกิน 4 MB — ไฟล์ขนาดใหญ่ส่งให้ทีมงานทาง LINE หรืออีเมลได้หลังเราติดต่อกลับ");

  // ── 4) ส่งต่อเข้าระบบหลังบ้าน ──
  const target = process.env.LEAD_API_URL;
  const key = process.env.LEAD_API_KEY;
  if (!target || !key) {
    // ⚠️ ยังไม่ได้ตั้งค่าปลายทาง = บอกผู้ใช้ตรงๆ ให้ติดต่อทางอื่น ห้ามแกล้งตอบว่าส่งสำเร็จ
    console.error("[lead] LEAD_API_URL / LEAD_API_KEY ยังไม่ได้ตั้งค่า — ข้อมูลไม่ได้ถูกบันทึก");
    return fail(503, "ระบบรับข้อมูลยังไม่พร้อมใช้งาน กรุณาติดต่อเราทางโทรศัพท์หรืออีเมลโดยตรง");
  }

  const out = new FormData();
  out.set("payload", JSON.stringify({ ...lead, meta: { ip, userAgent: req.headers.get("user-agent") || "", page: req.headers.get("referer") || "" } }));
  for (const f of files) out.append("files", f, f.name);

  try {
    const res = await fetch(target, {
      method: "POST",
      headers: { "x-lead-key": key },
      body: out,
      // ⚠️ ไม่ให้ผู้ใช้ค้างหน้ารอนานไม่มีกำหนดถ้าระบบหลังบ้านช้า
      signal: AbortSignal.timeout(20_000),
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as { ref?: string; error?: string };
    if (!res.ok) {
      console.error("[lead] ระบบหลังบ้านปฏิเสธ", res.status, data?.error);
      return fail(502, "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง หรือติดต่อเราทางโทรศัพท์");
    }
    return NextResponse.json({ ok: true, ref: data.ref || "" });
  } catch (err) {
    console.error("[lead] ติดต่อระบบหลังบ้านไม่ได้", err);
    return fail(502, "ขณะนี้ส่งข้อมูลไม่ได้ กรุณาลองใหม่อีกครั้ง หรือติดต่อเราทางโทรศัพท์");
  }
}
