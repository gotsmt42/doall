import { Camera, Droplets, Fingerprint, Flame, Network, Ruler, Wrench } from "lucide-react";

import { cx } from "@/components/ui";
import type { ServiceIconKey } from "@/data/services";

/**
 * ⚠️ ไอคอนถูกเลือกด้วย "คีย์" ที่เก็บในไฟล์ข้อมูล ไม่ใช่เก็บคอมโพเนนต์ไอคอนไว้ในข้อมูลโดยตรง
 *    เพราะไฟล์ข้อมูลต้องเป็นข้อมูลล้วน (ไม่มี JSX) จึงย้ายไป CMS หรือส่งข้าม server/client
 *    ได้ในอนาคตโดยไม่ต้องแก้อะไร
 */
const MAP = {
  flame: Flame,
  camera: Camera,
  fingerprint: Fingerprint,
  network: Network,
  wrench: Wrench,
  ruler: Ruler,
  pump: Droplets,
} as const;

export default function ServiceIcon({
  name,
  className,
  boxed = true,
}: {
  name: ServiceIconKey;
  className?: string;
  /** true = มีกรอบสี่เหลี่ยมมนรองด้านหลัง (ใช้บนการ์ด) */
  boxed?: boolean;
}) {
  const Icon = MAP[name];
  if (!boxed) return <Icon aria-hidden="true" className={cx("size-6 text-red-600", className)} />;
  return (
    <span className={cx("grid size-12 shrink-0 place-items-center rounded-lg bg-red-50", className)} aria-hidden="true">
      <Icon className="size-6 text-red-600" />
    </span>
  );
}
