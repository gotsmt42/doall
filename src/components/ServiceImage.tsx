import Image from "next/image";

import { cx } from "@/components/ui";
import type { SiteSettings } from "@/lib/cms";

/**
 * รูปของบริการ — ภาพถ่ายที่อัปจากหลังบ้านชนะ ไม่มีใช้ภาพประกอบที่ติดมากับเว็บ
 *
 * ✅ บริษัทสั่ง "พวกระบบ อยากให้มีรูปภาพด้วย" (25 ก.ย. 2569)
 * ⚠️ ภาพประกอบ (public/services/<slug>.svg) สร้างจาก scripts/make-service-art.mjs — แก้ที่สคริปต์
 * ⚠️ SVG ส่งแบบ unoptimized — ตัวย่อรูปของ Next ไม่รับ SVG (และ SVG คมทุกขนาดอยู่แล้ว)
 * ⚠️ กรอบบังคับสัดส่วน 16:10 + object-cover — ภาพถ่ายที่อัปมาคนละขนาดจะเรียงเท่ากันบนการ์ดเสมอ
 */
export default function ServiceImage({
  slug,
  title,
  settings,
  sizes,
  priority = false,
  className,
}: {
  slug: string;
  title: string;
  settings: Pick<SiteSettings, "serviceImages">;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const photo = settings.serviceImages.find((x) => x.slug === slug);
  const src = photo?.src ?? `/services/${slug}.svg`;
  return (
    <div className={cx("relative aspect-[16/10] overflow-hidden bg-slate-100", className)}>
      <Image
        src={src}
        alt={photo?.alt || title}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={src.endsWith(".svg")}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </div>
  );
}
