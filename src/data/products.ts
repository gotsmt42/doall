/**
 * สินค้าและอุปกรณ์ที่บริษัทจัดหาและติดตั้ง
 *
 * ⚠️ TODO(ข้อมูลจริง): รายการชุดนี้เป็น "ประเภทสินค้า" ที่บริษัทจัดหาได้ พร้อมคุณสมบัติทั่วไป
 *    ของสินค้าประเภทนั้น — **ยังไม่ได้ระบุรุ่นจริง** โดยตั้งใจ
 *    การใส่รุ่นสินค้าจริงคู่กับสเปกที่แต่งขึ้นเอง คือข้อมูลผิดที่ลูกค้าจะเอาไปอ้างอิงตอนสั่งซื้อ
 *    เมื่อได้แค็ตตาล็อกจริงจากทางบริษัท ให้เติม model/specs/datasheet ตามเอกสารของผู้ผลิต
 * ⚠️ model หรือ datasheet ที่ยังว่าง จะถูกซ่อนบนหน้าเว็บอัตโนมัติ ไม่ขึ้นเป็นช่องว่างหรือปุ่มเสีย
 * ⚠️ ห้ามใส่ราคาในนี้ — ราคางานระบบขึ้นกับหน้างาน ราคาที่แสดงบนเว็บจะกลายเป็นราคาที่ลูกค้า
 *    ยึดไว้ต่อรองทุกครั้ง ให้ลูกค้าขอใบเสนอราคาแทน
 */

export type ProductCategory = "fire-alarm" | "cctv" | "access-control" | "network" | "security" | "accessories";

export const PRODUCT_CATEGORIES: readonly { value: ProductCategory; label: string }[] = [
  { value: "fire-alarm", label: "Fire Alarm" },
  { value: "cctv", label: "CCTV" },
  { value: "access-control", label: "Access Control" },
  { value: "network", label: "Network" },
  { value: "security", label: "Security" },
  { value: "accessories", label: "อุปกรณ์เสริม" },
] as const;

/** รูปหนึ่งรูป — มาจากระบบหลังบ้าน (Cloudinary) · width/height ใช้กันหน้ากระตุกตอนรูปโหลด (CLS) */
export type SiteImage = { src: string; alt: string; width: number; height: number };

export type Product = {
  id: string;
  category: ProductCategory;
  /** ประเภทย่อย — ใช้เป็นตัวกรองชุดที่สาม */
  type: string;
  name: string;
  brand: string;
  /** รุ่นจริงจากแค็ตตาล็อก — ว่างได้ (ไม่แสดง) */
  model: string;
  description: string;
  /** คุณสมบัติทั่วไปของประเภทนี้ — เปลี่ยนเป็นสเปกของรุ่นจริงเมื่อระบุรุ่นแล้ว */
  specs: readonly { label: string; value: string }[];
  /** ลิงก์เอกสารข้อมูลจำเพาะของผู้ผลิต — ว่างได้ (ไม่แสดงปุ่ม) */
  datasheet: string;
  /**
   * ✅ บริษัทสั่ง "สินค้าต้องมีรูปภาพ" — ระบบหลังบ้านไม่ยอมให้เผยแพร่สินค้าที่ไม่มีรูป
   * ⚠️ เนื้อหาตั้งต้นในไฟล์นี้ไม่มีรูป (ไม่ใช้ภาพสต็อกที่ไม่รู้ที่มา) — ใช้เฉพาะตอนหลังบ้านล่ม
   */
  images?: readonly SiteImage[];
};

export const PRODUCTS: readonly Product[] = [
  // ── Fire Alarm ──
  {
    id: "fa-panel-addressable",
    category: "fire-alarm",
    type: "ตู้ควบคุม",
    name: "ตู้ควบคุมระบบแจ้งเหตุเพลิงไหม้แบบระบุตำแหน่ง",
    brand: "Notifier",
    model: "",
    description: "ตู้ควบคุมแบบ Addressable ระบุจุดเกิดเหตุได้ถึงระดับอุปกรณ์ เหมาะกับอาคารขนาดกลางถึงใหญ่",
    specs: [
      { label: "ชนิดระบบ", value: "Addressable" },
      { label: "การแสดงผล", value: "จอแสดงตำแหน่งจุดเกิดเหตุ" },
      { label: "แหล่งจ่ายไฟสำรอง", value: "แบตเตอรี่สำรองในตัว" },
    ],
    datasheet: "",
  },
  {
    id: "fa-panel-conventional",
    category: "fire-alarm",
    type: "ตู้ควบคุม",
    name: "ตู้ควบคุมระบบแจ้งเหตุเพลิงไหม้แบบแบ่งโซน",
    brand: "Notifier",
    model: "",
    description: "ตู้ควบคุมแบบ Conventional แบ่งพื้นที่เป็นโซน เหมาะกับอาคารขนาดเล็กและงบประมาณจำกัด",
    specs: [
      { label: "ชนิดระบบ", value: "Conventional (แบ่งโซน)" },
      { label: "การแสดงผล", value: "ไฟแสดงสถานะรายโซน" },
    ],
    datasheet: "",
  },
  {
    id: "fa-smoke-detector",
    category: "fire-alarm",
    type: "อุปกรณ์ตรวจจับ",
    name: "อุปกรณ์ตรวจจับควัน (Smoke Detector)",
    brand: "Notifier",
    model: "",
    description: "ตรวจจับควันในระยะเริ่มต้นของเพลิงไหม้ เหมาะกับห้องทำงาน ทางเดิน และห้องพัก",
    specs: [
      { label: "หลักการตรวจจับ", value: "Photoelectric" },
      { label: "การติดตั้ง", value: "ติดเพดาน" },
    ],
    datasheet: "",
  },
  {
    id: "fa-heat-detector",
    category: "fire-alarm",
    type: "อุปกรณ์ตรวจจับ",
    name: "อุปกรณ์ตรวจจับความร้อน (Heat Detector)",
    brand: "Notifier",
    model: "",
    description: "เหมาะกับพื้นที่ที่มีฝุ่นหรือไอน้ำซึ่งอุปกรณ์ตรวจจับควันจะแจ้งเหตุหลอก เช่น ครัว ลานจอดรถ",
    specs: [
      { label: "หลักการตรวจจับ", value: "อุณหภูมิคงที่ / อัตราการเพิ่มอุณหภูมิ" },
      { label: "การติดตั้ง", value: "ติดเพดาน" },
    ],
    datasheet: "",
  },
  {
    id: "fa-manual-station",
    category: "fire-alarm",
    type: "อุปกรณ์แจ้งเหตุ",
    name: "อุปกรณ์แจ้งเหตุด้วยมือ (Manual Pull Station)",
    brand: "Edwards",
    model: "",
    description: "ให้ผู้พบเหตุแจ้งเพลิงไหม้ได้ทันที ติดตั้งตามเส้นทางหนีไฟและใกล้ทางออก",
    specs: [{ label: "การใช้งาน", value: "ดึงหรือกดเพื่อแจ้งเหตุ" }],
    datasheet: "",
  },

  // ── Fire Alarm: ยี่ห้อที่บริษัทระบุ (24 ก.ย. 2569) ──
  // ⚠️ ระบุเป็น "ประเภทสินค้าที่ยี่ห้อนั้นผลิต" เท่านั้น ยังไม่ใส่รุ่น — เติมรุ่นจริงจากแค็ตตาล็อกภายหลัง
  {
    id: "fa-edwards-panel",
    category: "fire-alarm",
    type: "ตู้ควบคุม",
    name: "ตู้ควบคุมระบบแจ้งเหตุเพลิงไหม้แบบระบุตำแหน่ง",
    brand: "Edwards",
    model: "",
    description: "ตู้ควบคุมแบบ Addressable สำหรับอาคารขนาดกลางถึงใหญ่ ระบุตำแหน่งจุดเกิดเหตุได้รายอุปกรณ์ ขยายระบบเพิ่มได้ภายหลัง",
    specs: [
      { label: "ชนิดระบบ", value: "Addressable" },
      { label: "การแสดงผล", value: "จอแสดงตำแหน่งจุดเกิดเหตุ" },
    ],
    datasheet: "",
  },
  {
    id: "fa-edwards-horn-strobe",
    category: "fire-alarm",
    type: "อุปกรณ์แจ้งเตือน",
    name: "อุปกรณ์แจ้งเตือนเสียงและแสง (Horn / Strobe)",
    brand: "Edwards",
    model: "",
    description: "แจ้งเตือนด้วยเสียงและไฟกะพริบพร้อมกัน ให้คนในพื้นที่เสียงดังหรือผู้บกพร่องทางการได้ยินรับรู้เหตุได้",
    specs: [{ label: "การแจ้งเตือน", value: "เสียง + แสงกะพริบ" }],
    datasheet: "",
  },
  {
    id: "fa-hochiki-smoke",
    category: "fire-alarm",
    type: "อุปกรณ์ตรวจจับ",
    name: "อุปกรณ์ตรวจจับควันแบบระบุตำแหน่ง",
    brand: "Hochiki",
    model: "",
    description: "อุปกรณ์ตรวจจับควันสำหรับระบบ Addressable ตู้ควบคุมระบุได้ว่าตัวไหนทำงาน และแจ้งเมื่ออุปกรณ์สกปรกหรือผิดปกติ",
    specs: [
      { label: "ชนิดระบบ", value: "Addressable" },
      { label: "หลักการตรวจจับ", value: "Photoelectric" },
    ],
    datasheet: "",
  },
  {
    id: "fa-hochiki-panel",
    category: "fire-alarm",
    type: "ตู้ควบคุม",
    name: "ตู้ควบคุมระบบแจ้งเหตุเพลิงไหม้",
    brand: "Hochiki",
    model: "",
    description: "ตู้ควบคุมระบบแจ้งเหตุเพลิงไหม้ มีทั้งแบบแบ่งโซนและแบบระบุตำแหน่ง เลือกตามขนาดและลักษณะอาคาร",
    specs: [{ label: "ชนิดระบบ", value: "Conventional / Addressable (ตามรุ่น)" }],
    datasheet: "",
  },
  {
    id: "fa-nohmi-heat",
    category: "fire-alarm",
    type: "อุปกรณ์ตรวจจับ",
    name: "อุปกรณ์ตรวจจับความร้อน",
    brand: "Nohmi",
    model: "",
    description: "เหมาะกับพื้นที่ฝุ่นหรือไอน้ำมาก เช่น พื้นที่ผลิตในโรงงาน ครัว และลานจอดรถ ซึ่งอุปกรณ์ตรวจจับควันจะแจ้งเหตุหลอกบ่อย",
    specs: [{ label: "หลักการตรวจจับ", value: "อุณหภูมิคงที่ / อัตราการเพิ่มอุณหภูมิ" }],
    datasheet: "",
  },
  {
    id: "fa-nohmi-panel",
    category: "fire-alarm",
    type: "ตู้ควบคุม",
    name: "ตู้ควบคุมระบบแจ้งเหตุเพลิงไหม้",
    brand: "Nohmi",
    model: "",
    description: "ตู้ควบคุมระบบแจ้งเหตุเพลิงไหม้ พบได้บ่อยในโรงงานและอาคารของกลุ่มบริษัทญี่ปุ่น รับติดตั้งเพิ่มและดูแลระบบเดิม",
    specs: [{ label: "การบริการ", value: "ติดตั้ง ขยายระบบ และบำรุงรักษา" }],
    datasheet: "",
  },
  {
    id: "fa-asenware-panel",
    category: "fire-alarm",
    type: "ตู้ควบคุม",
    name: "ตู้ควบคุมระบบแจ้งเหตุเพลิงไหม้แบบแบ่งโซน",
    brand: "Asenware",
    model: "",
    description: "ตู้ควบคุมแบบ Conventional สำหรับอาคารขนาดเล็กถึงกลาง เป็นทางเลือกที่คุ้มค่าเมื่องบประมาณจำกัด",
    specs: [{ label: "ชนิดระบบ", value: "Conventional (แบ่งโซน)" }],
    datasheet: "",
  },
  {
    id: "fa-asenware-call-point",
    category: "fire-alarm",
    type: "อุปกรณ์แจ้งเหตุ",
    name: "อุปกรณ์แจ้งเหตุด้วยมือ (Manual Call Point)",
    brand: "Asenware",
    model: "",
    description: "ให้ผู้พบเหตุแจ้งเพลิงไหม้ได้ทันที ติดตั้งตามเส้นทางหนีไฟและใกล้ทางออก",
    specs: [{ label: "การใช้งาน", value: "กดเพื่อแจ้งเหตุ" }],
    datasheet: "",
  },

  // ── CCTV ──
  {
    id: "cctv-ip-bullet",
    category: "cctv",
    type: "กล้อง IP",
    name: "กล้องวงจรปิด IP แบบกระบอก",
    brand: "Hikvision",
    model: "",
    description: "กล้องสำหรับพื้นที่ภายนอกอาคาร ทนแดดทนฝน มองเห็นในที่มืดด้วยไฟอินฟราเรด",
    specs: [
      { label: "ชนิด", value: "IP Camera แบบกระบอก" },
      { label: "การใช้งาน", value: "ภายนอกอาคาร" },
      { label: "กลางคืน", value: "อินฟราเรดในตัว" },
    ],
    datasheet: "",
  },
  {
    id: "cctv-ip-dome",
    category: "cctv",
    type: "กล้อง IP",
    name: "กล้องวงจรปิด IP แบบโดม",
    brand: "Dahua",
    model: "",
    description: "กล้องทรงโดมสำหรับภายในอาคาร ติดเพดานได้กลมกลืน ปรับมุมภายนอกได้ยาก",
    specs: [
      { label: "ชนิด", value: "IP Camera แบบโดม" },
      { label: "การใช้งาน", value: "ภายในอาคาร" },
    ],
    datasheet: "",
  },
  {
    id: "cctv-nvr",
    category: "cctv",
    type: "เครื่องบันทึก",
    name: "เครื่องบันทึกภาพ NVR",
    brand: "Hikvision",
    model: "",
    description: "บันทึกภาพจากกล้อง IP เลือกจำนวนช่องและพื้นที่จัดเก็บตามจำนวนวันที่ต้องการดูย้อนหลัง",
    specs: [
      { label: "ชนิด", value: "Network Video Recorder" },
      { label: "การดูภาพ", value: "ผ่านมือถือและคอมพิวเตอร์" },
    ],
    datasheet: "",
  },

  // ── Access Control ──
  {
    id: "ac-card-reader",
    category: "access-control",
    type: "เครื่องอ่าน",
    name: "เครื่องอ่านบัตรควบคุมการเข้าออก",
    brand: "Bosch",
    model: "",
    description: "อ่านบัตรพนักงานเพื่อเปิดประตู เก็บประวัติการเข้าออกรายบุคคล",
    specs: [{ label: "การยืนยันตัวตน", value: "บัตร (Card)" }],
    datasheet: "",
  },
  {
    id: "ac-face-terminal",
    category: "access-control",
    type: "เครื่องอ่าน",
    name: "เครื่องสแกนใบหน้า (Face Recognition)",
    brand: "Hikvision",
    model: "",
    description: "ยืนยันตัวตนด้วยใบหน้าโดยไม่ต้องสัมผัส ใช้ได้ทั้งควบคุมประตูและบันทึกเวลาทำงาน",
    specs: [{ label: "การยืนยันตัวตน", value: "ใบหน้า / บัตร / รหัส" }],
    datasheet: "",
  },
  {
    id: "ac-maglock",
    category: "access-control",
    type: "กลอนประตู",
    name: "กลอนแม่เหล็กไฟฟ้า (Magnetic Lock)",
    brand: "Bosch",
    model: "",
    description: "ล็อกประตูด้วยแม่เหล็กไฟฟ้า ปลดล็อกเมื่อไฟดับหรือเมื่อระบบแจ้งเหตุเพลิงไหม้ทำงาน",
    specs: [{ label: "การทำงานเมื่อไฟดับ", value: "ปลดล็อก (Fail-safe)" }],
    datasheet: "",
  },

  // ── Network ──
  {
    id: "net-switch",
    category: "network",
    type: "อุปกรณ์เครือข่าย",
    name: "Network Switch สำหรับองค์กร",
    brand: "Cisco",
    model: "",
    description: "สวิตช์เครือข่ายสำหรับเชื่อมต่อคอมพิวเตอร์ กล้อง และอุปกรณ์ในองค์กร รองรับการจ่ายไฟผ่านสาย LAN",
    specs: [{ label: "การจ่ายไฟผ่านสาย", value: "รองรับ PoE (ตามรุ่น)" }],
    datasheet: "",
  },
  {
    id: "net-access-point",
    category: "network",
    type: "อุปกรณ์เครือข่าย",
    name: "จุดกระจายสัญญาณ Wi-Fi (Access Point)",
    brand: "Ubiquiti",
    model: "",
    description: "กระจายสัญญาณ Wi-Fi ครอบคลุมทั้งชั้น บริหารจัดการจากศูนย์กลางได้",
    specs: [{ label: "การติดตั้ง", value: "ติดเพดานหรือผนัง" }],
    datasheet: "",
  },
  {
    id: "net-rack",
    category: "network",
    type: "ตู้และสาย",
    name: "ตู้ Rack และ Patch Panel",
    brand: "หลายยี่ห้อ",
    model: "",
    description: "ตู้จัดเก็บอุปกรณ์เครือข่ายพร้อมแผงเชื่อมต่อสาย จัดระเบียบสายให้ตรวจสอบและแก้ไขได้ง่าย",
    specs: [{ label: "ขนาด", value: "เลือกตามจำนวนอุปกรณ์" }],
    datasheet: "",
  },

  // ── Security ──
  {
    id: "sec-intrusion",
    category: "security",
    type: "ระบบกันขโมย",
    name: "ระบบแจ้งเตือนผู้บุกรุก",
    brand: "Bosch",
    model: "",
    description: "ตรวจจับการบุกรุกด้วยเซนเซอร์ตรวจจับความเคลื่อนไหวและเซนเซอร์ประตู แจ้งเตือนเมื่อเกิดเหตุ",
    specs: [{ label: "อุปกรณ์", value: "แผงควบคุม เซนเซอร์ และไซเรน" }],
    datasheet: "",
  },

  // ── Accessories ──
  // ⚠️ เดิมมี UPS และเบรกเกอร์ — ตัดออกตามที่บริษัทสั่ง "ตัดระบบไฟฟ้าออกก่อน" (24 ก.ย. 2569)
  {
    id: "acc-fire-cable",
    category: "accessories",
    type: "สายสัญญาณ",
    name: "สายสัญญาณทนไฟสำหรับระบบแจ้งเหตุเพลิงไหม้",
    brand: "หลายยี่ห้อ",
    model: "",
    description: "สายสัญญาณทนไฟสำหรับเดินในระบบแจ้งเหตุเพลิงไหม้ ให้ระบบยังส่งสัญญาณได้ระหว่างเกิดเพลิงไหม้",
    specs: [{ label: "การใช้งาน", value: "เดินสายระบบแจ้งเหตุเพลิงไหม้" }],
    datasheet: "",
  },
  {
    id: "acc-fa-battery",
    category: "accessories",
    type: "แบตเตอรี่",
    name: "แบตเตอรี่สำรองสำหรับตู้ควบคุมระบบแจ้งเหตุเพลิงไหม้",
    brand: "หลายยี่ห้อ",
    model: "",
    description: "แบตเตอรี่สำรองให้ตู้ควบคุมทำงานต่อได้เมื่อไฟฟ้าดับ ควรตรวจและเปลี่ยนตามรอบบำรุงรักษา",
    specs: [{ label: "การใช้งาน", value: "สำรองไฟตู้ควบคุม Fire Alarm" }],
    datasheet: "",
  },
] as const;

export const categoryLabel = (c: ProductCategory) => PRODUCT_CATEGORIES.find((x) => x.value === c)?.label ?? c;
