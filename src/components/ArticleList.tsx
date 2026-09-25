"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Clock } from "lucide-react";

import { Badge, Card, cx } from "@/components/ui";

export type ArticleSummary = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  dateLabel: string;
  minutes: number;
};

/**
 * รายการบทความ + ปุ่มกรองตามหมวด
 *
 * ✅ บทความเพิ่มเป็น 20 เรื่อง (24 ก.ย. 2569) — เลื่อนหาเรื่องที่สนใจยากแล้ว จึงมีปุ่มกรองหมวด
 * ⚠️ กรองฝั่งเบราว์เซอร์ ไม่ใช้ ?category= ใน URL โดยตั้งใจ — ไม่สร้าง URL ซ้ำเนื้อหาเดิมให้ Google
 *    และบทความทุกเรื่องยังอยู่ใน HTML ตั้งแต่แรก (เสิร์ชเอนจินเห็นครบ)
 * ⚠️ ส่งมาแค่ข้อมูลสรุป ไม่ส่งเนื้อหาเต็ม — ไม่งั้นเนื้อหาทุกบทความจะถูกฝังซ้ำในหน้า (หน้าหนักเกินจำเป็น)
 */
const ORDER = ["Fire Alarm", "Fire Protection", "Fire Pump", "CCTV", "Access Control", "Maintenance"];
const rank = (c: string) => (ORDER.includes(c) ? ORDER.indexOf(c) : ORDER.length);

export default function ArticleList({ articles }: { articles: readonly ArticleSummary[] }) {
  const [cat, setCat] = useState("all");
  // เรียงหมวดตามลำดับบริการบนเว็บ (Fire Alarm ขึ้นก่อน) — หมวดใหม่จากหลังบ้านต่อท้าย
  const cats = [...new Set(articles.map((a) => a.category))].sort((x, y) => rank(x) - rank(y));
  const shown = cat === "all" ? articles : articles.filter((a) => a.category === cat);

  return (
    <>
      {cats.length > 1 && (
        <div role="group" aria-label="กรองตามหมวด" className="mb-8 flex flex-wrap gap-2">
          {[["all", `ทั้งหมด (${articles.length})`], ...cats.map((c) => [c, c])].map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={cat === key}
              onClick={() => setCat(key)}
              className={cx(
                "min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors",
                cat === key
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((a) => (
          <li key={a.slug}>
            <Card interactive className="group h-full">
              <Link href={`/articles/${a.slug}`} className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <Badge tone="brand">{a.category}</Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <Clock aria-hidden="true" className="size-3.5" />
                    อ่าน {a.minutes} นาที
                  </span>
                </div>
                <h2 className="mt-4 text-lg leading-snug font-bold text-slate-900">{a.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{a.description}</p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <time dateTime={a.publishedAt}>{a.dateLabel}</time>
                  <span className="inline-flex items-center gap-1 font-semibold text-red-600">
                    อ่านต่อ
                    <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
