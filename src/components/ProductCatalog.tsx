"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { FileDown, Search, X } from "lucide-react";

import { Badge, ButtonLink, EmptyState, cx } from "@/components/ui";
import { PRODUCT_CATEGORIES, type Product, type ProductCategory, categoryLabel } from "@/data/products";

/**
 * แค็ตตาล็อกสินค้า พร้อมค้นหาและกรอง 3 ชั้น (หมวด · ยี่ห้อ · ประเภท)
 *
 * ⚠️ ข้อมูลทั้งหมดมาจาก Server Component จึงอยู่ใน HTML ตั้งแต่แรก — เสิร์ชเอนจินเห็นสินค้าครบ
 *    การกรองเป็นแค่การซ่อน/แสดงในเบราว์เซอร์ ไม่สร้าง URL ใหม่ที่เนื้อหาซ้ำกัน
 * ⚠️ useDeferredValue ทำให้พิมพ์ค้นหาแล้วตัวอักษรขึ้นทันที ส่วนการกรองตามมาทีหลัง
 *    (สินค้าหลักร้อยรายการ ถ้ากรองทุกครั้งที่กดแป้น ช่องค้นหาจะรู้สึกหน่วงบนมือถือรุ่นเก่า)
 * ⚠️ ค้นหาได้ทั้ง ชื่อ รุ่น ยี่ห้อ ประเภท และคำอธิบาย แบบไม่สนตัวพิมพ์เล็ก-ใหญ่
 */
export default function ProductCatalog({ products }: { products: readonly Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [brand, setBrand] = useState("all");
  const [type, setType] = useState("all");
  const deferredQuery = useDeferredValue(query);

  // ตัวเลือกยี่ห้อ/ประเภท ขึ้นกับหมวดที่เลือก — ไม่ให้เลือกคู่ที่ไม่มีสินค้าอยู่จริง
  const inCategory = category === "all" ? products : products.filter((p) => p.category === category);
  const brands = useMemo(() => [...new Set(inCategory.map((p) => p.brand))].sort(), [inCategory]);
  const types = useMemo(() => [...new Set(inCategory.map((p) => p.type))].sort((a, b) => a.localeCompare(b, "th")), [inCategory]);

  const shown = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return inCategory.filter((p) => {
      if (brand !== "all" && p.brand !== brand) return false;
      if (type !== "all" && p.type !== type) return false;
      if (!q) return true;
      return [p.name, p.model, p.brand, p.type, p.description].some((f) => f.toLowerCase().includes(q));
    });
  }, [inCategory, brand, type, deferredQuery]);

  const changeCategory = (c: ProductCategory | "all") => {
    setCategory(c);
    // ⚠️ ล้างตัวกรองย่อยเสมอเมื่อเปลี่ยนหมวด — ยี่ห้อที่เลือกไว้อาจไม่มีในหมวดใหม่
    //    แล้วผู้ใช้จะเห็น "ไม่พบสินค้า" โดยไม่รู้ว่าติดตัวกรองที่ซ่อนอยู่
    setBrand("all");
    setType("all");
  };

  const hasFilter = query || category !== "all" || brand !== "all" || type !== "all";
  const reset = () => { setQuery(""); changeCategory("all"); };

  return (
    <>
      {/* ── หมวดสินค้า ── */}
      <div role="group" aria-label="หมวดสินค้า" className="flex flex-wrap gap-2">
        {[{ value: "all" as const, label: "ทั้งหมด" }, ...PRODUCT_CATEGORIES.filter((c) => products.some((p) => p.category === c.value))].map((c) => (
          <button
            key={c.value}
            type="button"
            aria-pressed={category === c.value}
            onClick={() => changeCategory(c.value)}
            className={cx(
              "min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors",
              category === c.value ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-400",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* ── ค้นหา + กรองย่อย ── */}
      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <label className="relative block">
          <span className="sr-only">ค้นหาสินค้า</span>
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อสินค้า รุ่น หรือยี่ห้อ"
            className="h-11 w-full rounded-lg border border-slate-300 bg-white pr-3 pl-10 text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
          />
        </label>
        <Select label="ยี่ห้อ" value={brand} onChange={setBrand} options={brands} />
        <Select label="ประเภท" value={type} onChange={setType} options={types} />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-slate-500">
          พบ {shown.length} รายการ{category !== "all" && ` ในหมวด ${categoryLabel(category)}`}
        </p>
        {hasFilter && (
          <button type="button" onClick={reset} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-red-600">
            <X aria-hidden="true" className="size-4" />
            ล้างตัวกรอง
          </button>
        )}
      </div>

      {shown.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="ไม่พบสินค้าที่ค้นหา"
            description="ลองใช้คำค้นอื่น หรือล้างตัวกรอง — ถ้าต้องการอุปกรณ์รุ่นที่ไม่มีในรายการ แจ้งทีมงานได้ เราจัดหาให้ได้อีกหลายยี่ห้อ"
            action={<ButtonLink href="/quotation" variant="secondary">สอบถามอุปกรณ์ที่ต้องการ</ButtonLink>}
          />
        </div>
      ) : (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <li key={p.id}>
              <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap gap-1.5">
                  <Badge tone="brand">{categoryLabel(p.category)}</Badge>
                  <Badge>{p.type}</Badge>
                </div>
                <h2 className="mt-3 text-base leading-snug font-bold text-slate-900">{p.name}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {p.brand}
                  {p.model && <span className="font-normal"> · รุ่น {p.model}</span>}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.description}</p>

                <dl className="mt-4 flex-1 space-y-1.5 border-t border-slate-100 pt-4 text-sm">
                  {p.specs.map((s) => (
                    <div key={s.label} className="grid grid-cols-[7rem_1fr] gap-2">
                      <dt className="text-slate-500">{s.label}</dt>
                      <dd className="text-slate-800">{s.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href={`/quotation?product=${encodeURIComponent(p.name)}`}
                    className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                  >
                    ขอใบเสนอราคา
                  </Link>
                  {/* ⚠️ ปุ่มเอกสารขึ้นเฉพาะเมื่อมีลิงก์จริง — ไม่มีปุ่มที่กดแล้วไม่ได้ไฟล์ */}
                  {p.datasheet && (
                    <a
                      href={p.datasheet}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <FileDown aria-hidden="true" className="size-4" />
                      Datasheet
                    </a>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-[15px] text-slate-900 focus:border-slate-500 focus:outline-none sm:w-44"
      >
        <option value="all">{label}ทั้งหมด</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
