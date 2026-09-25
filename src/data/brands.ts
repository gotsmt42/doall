/**
 * ยี่ห้ออุปกรณ์ที่บริษัททำงานด้วย
 *
 * ⚠️ **ห้ามใช้คำว่า "ตัวแทนจำหน่าย" "พาร์ตเนอร์" หรือ "Authorized Dealer" กับยี่ห้อใด
 *    โดยไม่มีหนังสือแต่งตั้งจริง** — เป็นการกล่าวอ้างที่เจ้าของแบรนด์ดำเนินคดีได้
 *    และลูกค้า B2B ตรวจสอบได้ง่ายมากด้วยการโทรถามเจ้าของแบรนด์โดยตรง
 *    หัวข้อบนหน้าเว็บจึงใช้คำว่า "ยี่ห้อและผลิตภัณฑ์ที่เราทำงานด้วย" เท่านั้น
 * ✅ โลโก้: บริษัทส่งไฟล์มาและสั่งให้ใส่ (24 ก.ย. 2569) — ไฟล์อยู่ที่ public/brands/
 *    ⚠️ ห้ามแต่งตัวโลโก้ (เปลี่ยนสี บิด ตัดส่วน) — ทำได้แค่ตัดขอบว่าง/ทำพื้นโปร่งใส
 *    ⚠️ ยี่ห้อไหนไม่มีไฟล์โลโก้ แสดงเป็นชื่อตัวอักษรแทน
 * ⚠️ TODO(ข้อมูลจริง): ให้บริษัทยืนยันว่าทำงานกับยี่ห้อใดจริงบ้าง แล้วลบที่เหลือออก
 */

export type BrandLogo = { src: string; width: number; height: number };

/** featured = แบรนด์หลัก — แสดงเด่นกว่ายี่ห้ออื่นในหมวดเดียวกัน (ตั้งได้จากหลังบ้าน ปุ่มดาว) */
export type Brand = { name: string; category: string; featured?: boolean; logo?: BrandLogo };

/**
 * โลโก้ตั้งต้นในโค้ด (ขนาดคือขนาดไฟล์จริงหลังตัดขอบ) — ค้นด้วยชื่อยี่ห้อแบบไม่สนตัวพิมพ์
 * ⚠️ โลโก้ที่อัปจากหลังบ้านชนะเสมอ ตัวนี้ใช้เมื่อหลังบ้านไม่ได้อัปไว้ (ดู lib/cms.ts)
 * ⚠️ ไฟล์สร้างจากรูปที่บริษัทส่งมา: ตัดขอบว่าง · Edwards เอาพื้นลายหมากรุกที่ฝังในรูปออก
 */
const LOGOS: Record<string, BrandLogo> = {
  notifier: { src: "/brands/notifier.png", width: 170, height: 48 },
  edwards: { src: "/brands/edwards.png", width: 591, height: 113 },
  hochiki: { src: "/brands/hochiki.png", width: 493, height: 87 },
  asenware: { src: "/brands/asenware.png", width: 600, height: 376 },
  gst: { src: "/brands/gst.png", width: 283, height: 96 },
  hikvision: { src: "/brands/hikvision.png", width: 1200, height: 152 },
  dahua: { src: "/brands/dahua.png", width: 882, height: 264 },
  hip: { src: "/brands/hip.png", width: 266, height: 132 },
  zkteco: { src: "/brands/zkteco.png", width: 911, height: 210 },
};
export const logoFor = (name: string): BrandLogo | undefined => LOGOS[name.trim().toLowerCase()];

/**
 * ⚠️ เรียง Fire Alarm ขึ้นก่อนโดยตั้งใจ — บริษัทต้องการเน้นระบบนี้เป็นหลัก
 * ✅ แบรนด์หลัก Fire Alarm คือ Notifier และ Edwards · รองลงมา Hochiki, Asenware, GST
 *    ⚠️ ตัด Nohmi ออกตามที่บริษัทสั่ง (24 ก.ย. 2569) — ห้ามใส่กลับ
 *    (บริษัทยืนยันทั้งหมด 24 ก.ย. 2569) — ห้ามสลับลำดับสองตัวแรก
 * ⚠️ ตัด Honeywell ออก — บริษัทระบุยี่ห้อ Fire Alarm มาสองครั้งแล้วไม่มี Honeywell
 * ✅ CCTV: Hikvision, Dahua (บริษัทส่งโลโก้มา 24 ก.ย. 2569) · ⚠️ ตัด Axis ออกตามที่บริษัทสั่ง — ห้ามใส่กลับ
 * ✅ Access Control: มีแค่ ZKTeco, HIP, Hikvision (บริษัทสั่ง 24 ก.ย. 2569)
 *    ⚠️ Hikvision อยู่ได้สองหมวด — ยี่ห้อเดียวกันซ้ำได้ถ้าคนละหมวด (ฐานข้อมูลบังคับไม่ซ้ำแค่ ชื่อ+หมวด)
 *    ✅ ZKTeco: รูปที่บริษัทส่งมามีลายน้ำเว็บแจกรูปทับ — บริษัทยืนยันให้ใช้ จึงวาดใหม่เป็นสีเรียบ 2 สีของโลโก้
 *       (เทาเข้ม #494949 + เขียว #7DBD2F วัดจากรูปต้นฉบับ) · ได้ไฟล์ทางการเมื่อไรให้เปลี่ยนเป็นไฟล์นั้น
 * ⚠️ Security / Network: บริษัทสั่ง "ยังไม่ต้องใส่แบรนด์" (24 ก.ย. 2569) — ไม่มีการ์ดหมวดนี้ในส่วนยี่ห้อ
 * ⚠️ ตัดยี่ห้อหมวดไฟฟ้า (Schneider Electric, ABB) ออกตามที่บริษัทสั่ง "ตัดระบบไฟฟ้าออกก่อน"
 */
export const BRANDS: readonly Brand[] = [
  { name: "Notifier", category: "Fire Alarm", featured: true },
  { name: "Edwards", category: "Fire Alarm", featured: true },
  { name: "Hochiki", category: "Fire Alarm" },
  { name: "Asenware", category: "Fire Alarm" },
  { name: "GST", category: "Fire Alarm" },
  { name: "Hikvision", category: "CCTV" },
  { name: "Dahua", category: "CCTV" },
  { name: "ZKTeco", category: "Access Control" },
  { name: "HIP", category: "Access Control" },
  { name: "Hikvision", category: "Access Control" },
].map((b) => ({ ...b, logo: logoFor(b.name) }));

/**
 * ⚠️ ไม่มีข้อความกำกับ "มิได้หมายความว่าเป็นตัวแทนจำหน่ายอย่างเป็นทางการ" ใต้รายชื่อแล้ว — บริษัทสั่งตัดออก
 *    (25 ก.ย. 2569) ข้อห้ามด้านบนยังใช้อยู่: ห้ามเขียนว่าเป็นตัวแทน/พาร์ตเนอร์โดยไม่มีหนังสือแต่งตั้ง
 */
