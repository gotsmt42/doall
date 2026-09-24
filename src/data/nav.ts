import { SERVICES } from "@/data/services";

/**
 * โครงเมนูของทั้งเว็บ — แถบบน เมนูมือถือ และลิงก์ในฟุตเตอร์ อ่านจากที่นี่ที่เดียว
 *
 * ⚠️ ลูกค้า B2B ที่เข้ามาหาผู้รับเหมา มองหาไม่กี่อย่าง: ทำอะไรได้บ้าง · เคยทำที่ไหนมาแล้ว ·
 *    ติดต่อยังไง เมนูจึงเรียงตามลำดับนั้น ไม่ใช่เรียงตามโครงสร้างภายในบริษัท
 * ⚠️ เมนูหลักมี 6 รายการโดยตั้งใจ — เกิน 7 รายการเมื่อไร คนจะเลิกอ่านแล้วกดอันแรกที่เห็น
 */

export type NavItem = {
  label: string;
  href: string;
  /** เมนูย่อย (มีเฉพาะ "บริการ") */
  children?: { label: string; href: string; description: string }[];
};

export const MAIN_NAV: readonly NavItem[] = [
  { label: "หน้าแรก", href: "/" },
  { label: "เกี่ยวกับเรา", href: "/about" },
  {
    label: "บริการ",
    href: "/services",
    // ⚠️ สร้างจาก SERVICES เสมอ — เพิ่มบริการใหม่แล้วเมนูขึ้นเองโดยไม่ต้องแก้ไฟล์นี้
    children: SERVICES.map((s) => ({
      label: s.title,
      href: `/services/${s.slug}`,
      description: s.summary,
    })),
  },
  { label: "สินค้า", href: "/products" },
  { label: "ผลงาน", href: "/projects" },
  { label: "บทความ", href: "/articles" },
] as const;

/** ลิงก์ในฟุตเตอร์ที่ไม่ได้อยู่ในเมนูหลัก */
export const FOOTER_NAV = {
  company: [
    { label: "เกี่ยวกับเรา", href: "/about" },
    { label: "ผลงานที่ผ่านมา", href: "/projects" },
    { label: "บทความและความรู้", href: "/articles" },
    { label: "ติดต่อเรา", href: "/contact" },
  ],
  legal: [
    { label: "นโยบายความเป็นส่วนตัว", href: "/privacy" },
    { label: "เงื่อนไขการใช้งาน", href: "/terms" },
    { label: "นโยบายคุกกี้", href: "/cookies" },
  ],
} as const;
