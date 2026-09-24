/**
 * กติกาของฟอร์มที่ "ไม่ต้องใช้ zod" — ตัวเลือกงบประมาณ ขนาด/ชนิดไฟล์ และตัวตรวจเนื้อไฟล์
 *
 * ⚠️ แยกออกจาก lib/lead.ts โดยตั้งใจ (ด้วยเหตุผลด้านความเร็ว):
 *    ปุ่ม "ขอใบเสนอราคา" อยู่บนแถบบนทุกหน้า Next.js จึง prefetch โค้ดของหน้าฟอร์มล่วงหน้า
 *    ถ้าฟอร์ม import zod ตรงๆ ผู้เข้าชมทุกคนจะโหลด zod (~94 KB) ตั้งแต่หน้าแรก แย่งแบนด์วิดท์กับฟอนต์
 *    จนคะแนน Lighthouse Performance ตก (วัดจริง: 77) — ไฟล์นี้จึงห้าม import zod เด็ดขาด
 *    ฟอร์มโหลด schema จาก lib/lead.ts เฉพาะตอนผู้ใช้เริ่มกรอก (ดู LeadForm.tsx)
 */

/** ช่วงงบประมาณ — เป็นช่วงแทนตัวเลขตรงๆ เพราะลูกค้าส่วนใหญ่ยังไม่รู้ตัวเลขแน่นอน */
export const BUDGET_OPTIONS = [
  "ต่ำกว่า 50,000 บาท",
  "50,000 – 200,000 บาท",
  "200,000 – 500,000 บาท",
  "500,000 – 1,000,000 บาท",
  "มากกว่า 1,000,000 บาท",
  "ยังไม่แน่ใจ",
] as const;

/* ── ไฟล์แนบ ───────────────────────────────────────────────────────────── */

/**
 * ⚠️ ตรวจชนิดไฟล์จาก "เนื้อไฟล์จริง" (magic bytes) ที่ฝั่ง server ไม่ใช่เชื่อนามสกุลหรือ
 *    Content-Type ที่เบราว์เซอร์ส่งมา — ทั้งสองอย่างผู้ส่งปลอมได้ทันที (ตั้งชื่อ virus.exe
 *    เป็น แบบ.pdf ก็ผ่านการตรวจนามสกุล) ดู detectFileType() ด้านล่าง
 */
/**
 * ⚠️ ขนาดรวมต้องไม่เกิน ~4 MB เพราะ Vercel (ที่เว็บในเครือใช้อยู่) ปฏิเสธ request ที่ใหญ่กว่า 4.5 MB
 *    ด้วย error 413 ก่อนถึงโค้ดเราด้วยซ้ำ — ตั้งไว้ 25 MB เท่ากับลูกค้าแนบแบบใหญ่แล้วส่งไม่ผ่าน
 *    โดยไม่รู้สาเหตุ ไฟล์ที่ใหญ่กว่านี้ ให้ทีมงานขอรับทาง LINE/อีเมลหลังติดต่อกลับ
 *    (ถ้าย้ายไปเซิร์ฟเวอร์ที่ไม่มีเพดานนี้ ค่อยขยายได้ — หรือเปลี่ยนเป็นอัปโหลดตรงขึ้น Cloudinary)
 */
export const FILE_RULES = {
  maxFiles: 5,
  maxFileBytes: 4 * 1024 * 1024, // 4 MB ต่อไฟล์
  maxTotalBytes: 4 * 1024 * 1024, // รวมไม่เกิน 4 MB
  /** ใช้กับ <input accept> เพื่อกรองในหน้าต่างเลือกไฟล์ (ช่วยผู้ใช้ ไม่ใช่ความปลอดภัย) */
  accept: ".pdf,.jpg,.jpeg,.png,.docx,.xlsx",
  label: "PDF, JPG, PNG, DOCX, XLSX",
} as const;

export type AllowedFileType = "pdf" | "jpg" | "png" | "docx" | "xlsx";

/**
 * ระบุชนิดไฟล์จากไบต์แรกๆ ของไฟล์
 * ⚠️ DOCX กับ XLSX เป็นไฟล์ ZIP ทั้งคู่ (ขึ้นต้นด้วย PK) — แยกด้วยนามสกุลได้ก็ต่อเมื่อ
 *    เนื้อไฟล์เป็น ZIP จริงแล้วเท่านั้น (เนื้อผ่าน + นามสกุลตรง = ยอมรับ)
 * @returns ชนิดไฟล์ หรือ null ถ้าไม่ใช่ชนิดที่ยอมรับ
 */
export function detectFileType(bytes: Uint8Array, filename: string): AllowedFileType | null {
  const b = bytes;
  const ext = filename.toLowerCase().split(".").pop() || "";
  const starts = (sig: number[]) => sig.every((v, i) => b[i] === v);

  if (starts([0x25, 0x50, 0x44, 0x46, 0x2d])) return ext === "pdf" ? "pdf" : null; // %PDF-
  if (starts([0xff, 0xd8, 0xff])) return ext === "jpg" || ext === "jpeg" ? "jpg" : null;
  if (starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return ext === "png" ? "png" : null;
  if (starts([0x50, 0x4b, 0x03, 0x04])) {
    if (ext === "docx") return "docx";
    if (ext === "xlsx") return "xlsx";
  }
  return null;
}

/** ข้อความขนาดไฟล์แบบอ่านง่าย */
export const formatBytes = (n: number) =>
  n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`;
