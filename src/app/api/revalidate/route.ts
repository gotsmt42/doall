import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";

import { CONTENT_TAG } from "@/lib/cms";

/**
 * ให้ระบบหลังบ้าน (da-app-server) สั่งเว็บดึงเนื้อหาใหม่ทันทีหลังผู้ดูแลกดบันทึก
 *
 * ⚠️ ใช้ { expire: 0 } ไม่ใช่ "max" — "max" คือเสิร์ฟของเก่าให้คนแรกที่เข้ามาหลังบันทึก
 *    ผู้ดูแลที่กดบันทึกแล้วเปิดเว็บดูทันทีจะเห็นของเก่า แล้วคิดว่าบันทึกไม่ติด
 *    เอกสาร Next.js 16 แนะนำ { expire: 0 } สำหรับกรณีที่ถูกเรียกจากบริการภายนอก (webhook) แบบนี้
 *    (node_modules/next/dist/docs/01-app/03-api-reference/04-functions/revalidateTag.md)
 * 🔒 ต้องมีรหัสลับตรงกัน — ไม่งั้นใครก็ยิงให้เว็บล้างแคชวนซ้ำจนช้าได้
 */

export const runtime = "nodejs";

/** เทียบรหัสลับแบบเวลาคงที่ — กันการเดารหัสทีละตัวอักษรจากเวลาตอบกลับ */
const sameSecret = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "not configured" }, { status: 503 });
  if (!sameSecret(req.headers.get("x-revalidate-secret") || "", secret)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidateTag(CONTENT_TAG, { expire: 0 });
  return NextResponse.json({ ok: true, revalidated: [CONTENT_TAG], at: Date.now() });
}
