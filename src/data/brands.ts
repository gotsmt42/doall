/**
 * ยี่ห้ออุปกรณ์ที่บริษัททำงานด้วย
 *
 * ⚠️ **ห้ามใช้คำว่า "ตัวแทนจำหน่าย" "พาร์ตเนอร์" หรือ "Authorized Dealer" กับยี่ห้อใด
 *    โดยไม่มีหนังสือแต่งตั้งจริง** — เป็นการกล่าวอ้างที่เจ้าของแบรนด์ดำเนินคดีได้
 *    และลูกค้า B2B ตรวจสอบได้ง่ายมากด้วยการโทรถามเจ้าของแบรนด์โดยตรง
 *    หัวข้อบนหน้าเว็บจึงใช้คำว่า "ยี่ห้อและผลิตภัณฑ์ที่เราทำงานด้วย" เท่านั้น
 * ⚠️ ไม่ใช้โลโก้ของแบรนด์ — การใช้เครื่องหมายการค้าของผู้อื่นบนเว็บเชิงพาณิชย์
 *    ต้องได้รับอนุญาต จึงแสดงเป็นชื่อตัวอักษรแทน ซึ่งเป็นการอ้างถึงตามปกติที่ทำได้
 * ⚠️ TODO(ข้อมูลจริง): ให้บริษัทยืนยันว่าทำงานกับยี่ห้อใดจริงบ้าง แล้วลบที่เหลือออก
 */

export type Brand = { name: string; category: string };

/**
 * ⚠️ เรียง Fire Alarm ขึ้นก่อนโดยตั้งใจ — บริษัทต้องการเน้นระบบนี้เป็นหลัก
 * ✅ แบรนด์หลัก Fire Alarm คือ Notifier และ Edwards · รองลงมา Hochiki, Nohmi, Asenware
 *    (บริษัทยืนยันทั้งหมด 24 ก.ย. 2569) — ห้ามสลับลำดับสองตัวแรก
 * ⚠️ ตัด Honeywell ออก — บริษัทระบุยี่ห้อ Fire Alarm มาสองครั้งแล้วไม่มี Honeywell
 * ⚠️ TODO(ข้อมูลจริง): ยี่ห้อหมวดอื่น (CCTV / Security / Network) ยังไม่ได้ยืนยันกับบริษัท
 * ⚠️ ตัดยี่ห้อหมวดไฟฟ้า (Schneider Electric, ABB) ออกตามที่บริษัทสั่ง "ตัดระบบไฟฟ้าออกก่อน"
 */
export const BRANDS: readonly Brand[] = [
  { name: "Notifier", category: "Fire Alarm" },
  { name: "Edwards", category: "Fire Alarm" },
  { name: "Hochiki", category: "Fire Alarm" },
  { name: "Nohmi", category: "Fire Alarm" },
  { name: "Asenware", category: "Fire Alarm" },
  { name: "Hikvision", category: "CCTV" },
  { name: "Dahua", category: "CCTV" },
  { name: "Axis", category: "CCTV" },
  { name: "Bosch", category: "Security" },
  { name: "Cisco", category: "Network" },
  { name: "Ubiquiti", category: "Network" },
] as const;

/** ข้อความกำกับที่ต้องแสดงคู่กับรายชื่อเสมอ — กันการเข้าใจผิดว่าเป็นตัวแทนจำหน่าย */
export const BRANDS_DISCLAIMER =
  "รายชื่อข้างต้นคือยี่ห้อของอุปกรณ์ที่เราจัดหาและติดตั้งให้ลูกค้า " +
  "มิได้หมายความว่าบริษัทเป็นตัวแทนจำหน่ายอย่างเป็นทางการของยี่ห้อดังกล่าว";
