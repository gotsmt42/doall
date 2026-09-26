import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { Badge, Container, EmptyState, Section } from "@/components/ui";
import { getContent } from "@/lib/cms";
import Breadcrumb, { PageHeader } from "@/layouts/Breadcrumb";
import { pageMetadata } from "@/lib/seo";
import { KIND_LABEL, groupHits, searchSite } from "@/lib/search";
import { CtaBand } from "@/sections/BrandsAndCta";

/**
 * หน้าผลการค้นหาทั้งเว็บ (บริการ · สินค้า · ผลงาน · บทความ)
 *
 * ⚠️ เป็น Server Component และรับคำค้นทาง ?q= ล้วนๆ — ช่องค้นหาบนแถบบนเป็นฟอร์มธรรมดา
 *    จึงใช้งานได้ตั้งแต่ HTML ชุดแรก ไม่ต้องรอ JavaScript โหลด (สำคัญกับมือถือเน็ตช้าหน้างาน)
 * ⚠️ ไม่ให้เสิร์ชเอนจินเก็บหน้านี้ (noindex) — หน้าผลการค้นหาที่มีเนื้อหาซ้ำกับหน้าจริง
 *    ทำให้อันดับของหน้าจริงเสียเปล่าๆ
 */
export const metadata = {
  ...pageMetadata({
    title: "ค้นหา",
    description: "ค้นหาบริการ สินค้า ผลงาน และบทความทั้งหมดของบริษัท",
    path: "/search",
  }),
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const content = await getContent();
  const hits = query ? searchSite(query, content) : [];
  const groups = groupHits(hits);

  return (
    <>
      <Breadcrumb items={[{ name: "ค้นหา", href: "/search" }]} />
      <PageHeader
        eyebrow="ค้นหา"
        title={query ? `ผลการค้นหา “${query}”` : "ค้นหาทั้งเว็บไซต์"}
        description={
          query
            ? `พบ ${hits.length} รายการจากบริการ สินค้า ผลงาน และบทความ`
            : "พิมพ์ชื่อระบบ ยี่ห้อ รุ่นสินค้า ชื่อโครงการ หรือเรื่องที่สนใจ"
        }
      />

      <Section>
        <Container>
          {/* ช่องค้นหาในหน้า — คนที่เข้ามาจากลิงก์ตรงจะได้แก้คำค้นได้โดยไม่ต้องเลื่อนขึ้นไปบนแถบบน */}
          <form action="/search" role="search" className="mx-auto mb-10 flex max-w-2xl gap-2">
            <div className="relative flex-1">
              <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="เช่น fire alarm, ปั๊มดับเพลิง, กล้องวงจรปิด, โรงงาน"
                aria-label="คำค้นหา"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white pr-4 pl-11 text-[15px] outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>
            <button type="submit" className="h-12 shrink-0 rounded-xl bg-red-600 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-red-700">
              ค้นหา
            </button>
          </form>

          {!query ? (
            <EmptyState
              title="ยังไม่ได้พิมพ์คำค้นหา"
              description="ค้นได้ทั้งชื่อบริการ ยี่ห้อและรุ่นสินค้า ชื่อโครงการที่เคยทำ และบทความความรู้"
            />
          ) : hits.length === 0 ? (
            <EmptyState
              title={`ไม่พบผลลัพธ์สำหรับ “${query}”`}
              description="ลองใช้คำสั้นลงหรือคำที่กว้างกว่าเดิม เช่น “fire alarm” แทนชื่อรุ่นเต็ม — หรือติดต่อทีมงานให้ช่วยหาให้"
              action={
                <Link href="/contact" className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700">
                  ติดต่อทีมงาน <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              }
            />
          ) : (
            <div className="space-y-10">
              {groups.map((group) => (
                <section key={group.kind}>
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                    {KIND_LABEL[group.kind]}
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{group.items.length}</span>
                  </h2>
                  <ul className="grid gap-3">
                    {group.items.map((hit) => (
                      <li key={`${hit.kind}-${hit.href}-${hit.title}`}>
                        <Link
                          href={hit.href}
                          className="group block rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-red-300 hover:bg-red-50/40"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge tone="brand">{KIND_LABEL[hit.kind]}</Badge>
                            {hit.subtitle && <span className="text-xs text-slate-500">{hit.subtitle}</span>}
                          </div>
                          <p className="mt-2 flex items-center gap-1.5 font-bold text-slate-900 group-hover:text-red-700">
                            {hit.title}
                            <ArrowRight aria-hidden="true" className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                          </p>
                          {hit.snippet && <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{hit.snippet}</p>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
