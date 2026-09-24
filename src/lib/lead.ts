import { z } from "zod";

/**
 * กติกาของฟอร์ม "ติดต่อเรา" และ "ขอใบเสนอราคา" — ใช้ไฟล์เดียวกันทั้งฝั่งเบราว์เซอร์และฝั่ง server
 *
 * ⚠️ ฝั่งเบราว์เซอร์ตรวจเพื่อ "บอกผู้ใช้เร็ว" เท่านั้น — ความปลอดภัยจริงอยู่ที่ฝั่ง server
 *    ซึ่งตรวจซ้ำด้วยกติกาชุดเดียวกันนี้ทุกครั้ง (ใครก็ยิง request ตรงโดยไม่ผ่านฟอร์มได้)
 * ⚠️ ห้ามแยกกติกาเป็นสองชุด — ถ้าฝั่งหน้าเว็บยอมแต่ฝั่ง server ปฏิเสธ ผู้ใช้จะกรอกผ่านแล้ว
 *    ได้ error ลึกลับตอนกดส่ง ซึ่งคือจุดที่ลูกค้าหายไปมากที่สุดของทั้งเว็บ
 */

/** เบอร์โทรไทย: มือถือ 10 หลัก หรือเบอร์บ้าน 9 หลัก ยอมให้มีขีด/เว้นวรรค/วงเล็บ/+66 */
const thaiPhone = z
  .string()
  .trim()
  .min(1, "กรุณากรอกเบอร์โทรศัพท์")
  .transform((v) => v.replace(/[\s\-().]/g, "").replace(/^\+66/, "0"))
  .refine((v) => /^0\d{8,9}$/.test(v), "เบอร์โทรศัพท์ไม่ถูกต้อง (เช่น 081-234-5678 หรือ 02-123-4567)");

const optionalEmail = z
  .string()
  .trim()
  .max(120)
  .refine((v) => v === "" || z.email().safeParse(v).success, "รูปแบบอีเมลไม่ถูกต้อง");

/**
 * ⚠️ ความยาวสูงสุดทุกช่องมีไว้กันสแปม/โจมตีด้วยข้อความยักษ์ ไม่ใช่เรื่องหน้าตา
 *    ช่องที่ไม่จำกัดความยาว คือช่องที่ใครก็ส่งข้อความ 10 MB มาถ่วงอีเมลและฐานข้อมูลได้
 */
const base = {
  name: z.string().trim().min(2, "กรุณากรอกชื่อผู้ติดต่อ").max(100, "ชื่อยาวเกินไป"),
  company: z.string().trim().max(150, "ชื่อบริษัทยาวเกินไป").default(""),
  phone: thaiPhone,
  email: optionalEmail.default(""),
  serviceType: z.string().trim().max(60).default(""),
  details: z.string().trim().min(10, "กรุณาอธิบายรายละเอียดอย่างน้อย 10 ตัวอักษร").max(4000, "รายละเอียดยาวเกินไป (ไม่เกิน 4,000 ตัวอักษร)"),
  /** ต้องติ๊กยินยอมตาม PDPA ก่อนส่งทุกครั้ง */
  consent: z.literal(true, { error: "กรุณายอมรับนโยบายความเป็นส่วนตัวก่อนส่งข้อมูล" }),
};

export const contactSchema = z.object({
  kind: z.literal("contact"),
  ...base,
  subject: z.string().trim().min(2, "กรุณากรอกหัวข้อ").max(150, "หัวข้อยาวเกินไป"),
});

export const quotationSchema = z.object({
  kind: z.literal("quotation"),
  ...base,
  serviceType: z.string().trim().min(1, "กรุณาเลือกประเภทงาน").max(60),
  siteLocation: z.string().trim().max(200, "สถานที่ยาวเกินไป").default(""),
  budget: z.string().trim().max(40).default(""),
  /** YYYY-MM-DD หรือว่าง */
  preferredDate: z
    .string()
    .trim()
    .default("")
    .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "รูปแบบวันที่ไม่ถูกต้อง"),
});

export const leadSchema = z.discriminatedUnion("kind", [contactSchema, quotationSchema]);
export type Lead = z.infer<typeof leadSchema>;

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
