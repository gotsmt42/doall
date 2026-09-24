"use client";

import { useState } from "react";

import ProjectCard from "@/components/ProjectCard";
import { ButtonLink, EmptyState, cx } from "@/components/ui";
import type { Project } from "@/data/projects";

/**
 * ตารางผลงานพร้อมตัวกรองตามระบบ
 *
 * ⚠️ รับข้อมูลทั้งหมดมาจาก Server Component แล้วกรองในเบราว์เซอร์ — ผลงานทุกชิ้นจึงอยู่ใน HTML
 *    ตั้งแต่แรก เสิร์ชเอนจินเห็นครบ (ถ้ากรองฝั่ง server ด้วย ?system= จะได้ URL ซ้ำหลายชุด
 *    ที่เนื้อหาเกือบเหมือนกัน ซึ่งกระจายคะแนน SEO โดยไม่ได้อะไร)
 * ⚠️ ปุ่มกรองใช้ aria-pressed — โปรแกรมอ่านหน้าจอบอกได้ว่าตอนนี้เลือกหมวดไหนอยู่
 */
export default function ProjectGrid({
  projects,
  filters,
}: {
  projects: readonly Project[];
  filters: { value: string; label: string; count: number }[];
}) {
  const [active, setActive] = useState("all");
  const shown = active === "all" ? projects : projects.filter((p) => p.systems.includes(active));

  return (
    <>
      <div role="group" aria-label="กรองผลงานตามระบบ" className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={active === f.value}
            onClick={() => setActive(f.value)}
            className={cx(
              "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
              active === f.value
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-slate-400",
            )}
          >
            {f.label}
            <span className={cx("text-xs", active === f.value ? "text-slate-300" : "text-slate-500")}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* ⚠️ aria-live บอกผู้ใช้โปรแกรมอ่านหน้าจอว่าผลลัพธ์เปลี่ยนแล้ว — ไม่งั้นกดกรองแล้วเงียบ ไม่รู้ว่าเกิดอะไรขึ้น */}
      <p aria-live="polite" className="mt-6 text-sm text-slate-500">
        แสดง {shown.length} จาก {projects.length} โครงการ
      </p>

      {shown.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="ยังไม่มีผลงานในหมวดนี้"
            description="ลองเลือกหมวดอื่น หรือติดต่อทีมงานเพื่อขอดูตัวอย่างงานที่ใกล้เคียงกับงานของท่าน"
            action={<ButtonLink href="/contact">ติดต่อทีมงาน</ButtonLink>}
          />
        </div>
      ) : (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
