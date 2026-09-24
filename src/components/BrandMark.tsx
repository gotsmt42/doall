import Image from "next/image";

import { cx } from "@/components/ui";
import type { Brand } from "@/data/brands";

/**
 * โลโก้ยี่ห้อ — ไม่มีไฟล์โลโก้แสดงเป็นชื่อตัวอักษรแทน
 *
 * ✅ ปรับความสูงตามสัดส่วนโลโก้ ให้ทุกยี่ห้อ "ดูหนักเท่ากัน" ในแถวเดียวกัน
 *    ถ้าตั้งสูงเท่ากันหมด โลโก้แนวยาว (Hochiki 5.7:1) จะดูใหญ่กว่าโลโก้ทรงกล่อง (Asenware 1.6:1) มาก
 *    สูตร: สูง = base × √(3 ÷ สัดส่วน) โดยจำกัดไม่เกิน 1.15 เท่า — โลโก้สัดส่วน 3:1 สูงเท่า base พอดี
 * ⚠️ sizes = ความกว้างที่แสดงจริง — ไม่ใส่ Next จะส่งไฟล์กว้างเต็มจอให้ ทั้งที่แสดงแค่ร้อยกว่า px
 */
export default function BrandMark({
  brand,
  base,
  textClassName,
}: {
  brand: Pick<Brand, "name" | "logo">;
  /** ความสูง (px) ของโลโก้สัดส่วน 3:1 */
  base: number;
  /** รูปแบบตัวอักษรตอนไม่มีโลโก้ */
  textClassName?: string;
}) {
  const { logo, name } = brand;
  if (!logo) {
    return (
      <span className={cx("font-bold tracking-[0.08em] text-slate-600 uppercase", textClassName)}>{name}</span>
    );
  }
  const ratio = logo.width / logo.height;
  const height = Math.round(base * Math.min(1.15, Math.sqrt(3 / ratio)));
  const width = Math.round(height * ratio);
  return (
    <Image
      src={logo.src}
      alt={name}
      width={logo.width}
      height={logo.height}
      sizes={`${width}px`}
      style={{ height, width: "auto" }}
      className="max-w-full object-contain"
    />
  );
}
