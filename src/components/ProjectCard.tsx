import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type { Project } from "@/data/projects";
import { serviceBySlug } from "@/data/services";

/**
 * การ์ดผลงานหนึ่งใบ — ใช้ทั้งหน้าแรกและหน้ารวมผลงาน
 *
 * ⚠️ ต้องเป็นคอมโพเนนต์เดียวกันทั้งสองที่ ไม่ใช่เขียนสองแบบให้หน้าตาคล้ายกัน
 *    การ์ดที่ "คล้ายกัน" จะค่อยๆ ห่างกันขึ้นทุกครั้งที่แก้ฝั่งเดียว
 * ⚠️ ยังไม่มีรูปจริง จึงวาดกรอบแทนที่ดูตั้งใจ ไม่ใช่ปล่อยรูปเสียหรือช่องว่าง
 *    เมื่อมีรูปจริงแล้ว ให้เปลี่ยนมาใช้ next/image พร้อม sizes ที่ตรงกับตารางนี้
 */
export default function ProjectCard({ project }: { project: Project }) {
  const cover = project.images[0];

  return (
    <Card interactive className="group h-full overflow-hidden">
      <Link href={`/projects/${project.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          {cover ? (
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <PlaceholderArt />
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap gap-1.5">
            {project.systems.map((sys) => (
              <Badge key={sys} tone="brand">{serviceBySlug(sys)?.name ?? sys}</Badge>
            ))}
          </div>

          <h3 className="mt-3 text-base leading-snug font-bold text-slate-900">{project.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{project.summary}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="size-3.5" />
              {project.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar aria-hidden="true" className="size-3.5" />
              ส่งมอบปี {project.year}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 font-semibold text-red-600">
              รายละเอียด
              <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}

/**
 * กรอบแทนรูป — ลายเส้นแบบแบบก่อสร้าง
 * ⚠️ ตั้งใจให้ดูเป็น "ยังไม่ได้ลงรูป" อย่างเป็นระบบ ดีกว่าใช้ภาพสต็อกที่ไม่ใช่งานของบริษัท
 *    ซึ่งลูกค้าดูออกและทำให้ความน่าเชื่อถือลดลงมากกว่าไม่มีรูป
 */
function PlaceholderArt() {
  return (
    <div
      aria-hidden="true"
      className="grid size-full place-items-center"
      style={{
        backgroundImage:
          "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <svg viewBox="0 0 48 48" className="size-10 stroke-slate-300" fill="none" strokeWidth="2">
        <rect x="6" y="10" width="36" height="28" rx="3" />
        <path d="M6 30l9-9 7 7 6-6 14 14" />
        <circle cx="17" cy="19" r="3" />
      </svg>
    </div>
  );
}
