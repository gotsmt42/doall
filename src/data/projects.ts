/**
 * ผลงานที่ผ่านมา — ชนิดข้อมูล + ตัวช่วย
 *
 * ✅ ผลงานจริงเพิ่มจากระบบหลังบ้าน (แอป da-app → เว็บไซต์บริษัท → ผลงาน) ไม่ได้อยู่ในโค้ดแล้ว
 * 🗑️ เอาผลงานตัวอย่าง 6 รายการที่เคยอยู่ในไฟล์นี้ออกแล้ว (24 ก.ย. 2569) — เป็นเรื่องที่แต่งขึ้น
 *    เพื่อทดสอบหน้าตา ถ้าเก็บไว้เป็นเนื้อหาตั้งต้น วันที่หลังบ้านล่มตอน build ผลงานปลอมจะขึ้นเว็บจริง
 *    การอ้างผลงานที่ไม่ได้ทำคือความเสี่ยงทางกฎหมายและความน่าเชื่อถือ
 * ⚠️ ชื่อลูกค้าต้องได้รับอนุญาตก่อนเผยแพร่เสมอ ถ้ายังไม่ได้ ให้เว้นช่องลูกค้าไว้
 */

import { SERVICES } from "@/data/services";
import type { SiteImage } from "@/data/products";

export type Project = {
  slug: string;
  title: string;
  /** ชื่อลูกค้า — เว้นว่างได้ถ้ายังไม่ได้รับอนุญาตให้เปิดเผย */
  customer: string;
  location: string;
  /** ต้องตรงกับ slug ใน SERVICES เสมอ (ใช้เป็นตัวกรองและลิงก์ข้ามไปหน้าบริการ) */
  systems: readonly string[];
  /** ปีที่ส่งมอบ (พ.ศ.) */
  year: number;
  completedAt: string;
  summary: string;
  scope: readonly string[];
  /** ปัญหาหน้างานจริง — ส่วนที่ทำให้ผลงานน่าเชื่อถือกว่าการลงรูปเฉยๆ */
  challenge: string;
  solution: string;
  result: string;
  /** รูปแรก = รูปหน้าปก · ไม่มีรูปได้ หน้าเว็บแสดงกรอบแทนที่ดูตั้งใจ ไม่ใช่รูปเสีย */
  images: readonly SiteImage[];
};

/** ⚠️ ว่างโดยตั้งใจ — ผลงานจริงมาจากระบบหลังบ้าน (ดูหัวไฟล์) */
export const PROJECTS: readonly Project[] = [];



/**
 * ตัวกรองบนหน้าผลงาน — สร้างจากบริการจริง แล้วนับจำนวนผลงานของแต่ละหมวด
 * ⚠️ ซ่อนหมวดที่ไม่มีผลงานเลย — ตัวกรองที่กดแล้วได้ศูนย์รายการเสมอ คือตัวกรองที่ไม่ควรมี
 */
export const projectFilters = (projects: readonly Project[]): { value: string; label: string; count: number }[] => {
  const filters = SERVICES.map((s) => ({
    value: s.slug,
    label: s.name,
    count: projects.filter((p) => p.systems.includes(s.slug)).length,
  })).filter((f) => f.count > 0);
  return [{ value: "all", label: "ทั้งหมด", count: projects.length }, ...filters];
};
