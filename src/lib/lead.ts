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

// กติกาที่ไม่ต้องใช้ zod อยู่อีกไฟล์ — re-export ไว้ให้ฝั่ง server ใช้ที่เดียวเหมือนเดิม
export { BUDGET_OPTIONS, FILE_RULES, detectFileType, formatBytes } from "@/lib/lead-rules";
export type { AllowedFileType } from "@/lib/lead-rules";
