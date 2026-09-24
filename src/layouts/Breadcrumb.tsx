import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Container, JsonLd } from "@/components/ui";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export type Crumb = { name: string; href: string };

/**
 * เส้นทางนำทางด้านบนของหน้าย่อย
 *
 * ⚠️ ใส่ JSON-LD ให้ในตัวเลย — เพื่อให้ "หน้าที่มี breadcrumb บนจอ" กับ "หน้าที่มี
 *    breadcrumb ใน structured data" เป็นเรื่องเดียวกันเสมอ ลืมไม่ได้แม้อยากลืม
 *    (Google ต้องการให้ข้อมูลโครงสร้างตรงกับสิ่งที่ผู้ใช้เห็นจริงบนหน้า)
 * ⚠️ รายการสุดท้ายคือหน้าปัจจุบัน ไม่ทำเป็นลิงก์ — ลิงก์ที่กดแล้วอยู่ที่เดิมสร้างความสับสน
 */
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ name: "หน้าแรก", href: "/" }, ...items];

  return (
    <div className="border-b border-slate-200 bg-slate-50">
      <JsonLd data={breadcrumbJsonLd(all)} />
      <Container>
        <nav aria-label="เส้นทางนำทาง" className="py-3.5">
          {/* ⚠️ จอแคบให้เลื่อนในแถบตัวเองได้ ไม่ใช่ดันทั้งหน้าให้เลื่อนออกด้านข้าง */}
          <ol className="flex items-center gap-1.5 overflow-x-auto text-sm whitespace-nowrap">
            {all.map((c, i) => {
              const last = i === all.length - 1;
              return (
                <li key={c.href} className="flex shrink-0 items-center gap-1.5">
                  {i > 0 && <ChevronRight aria-hidden="true" className="size-3.5 text-slate-400" />}
                  {last ? (
                    // ⚠️ ชื่อบทความ/ผลงานยาวมาก — จอแคบตัดเป็น … ไว้ (ชื่อเต็มอยู่ใน h1 ด้านล่างอยู่แล้ว)
                    <span aria-current="page" title={c.name} className="block max-w-[13rem] truncate font-medium text-slate-900 sm:max-w-md">{c.name}</span>
                  ) : (
                    <Link href={c.href} className="text-slate-500 transition-colors hover:text-red-600">{c.name}</Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </Container>
    </div>
  );
}

/** หัวหน้าย่อยมาตรฐาน — ใช้ร่วมกันทุกหน้าที่ไม่ใช่หน้าแรก เพื่อให้ทุกหน้ามีจังหวะเดียวกัน */
export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <Container className="py-12 sm:py-16">
        {eyebrow && <p className="mb-3 text-sm font-semibold tracking-wide text-red-600 uppercase">{eyebrow}</p>}
        <h1 className="max-w-3xl text-3xl font-bold sm:text-4xl lg:text-[2.75rem] lg:leading-[1.2]">{title}</h1>
        {description && <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">{description}</p>}
      </Container>
    </div>
  );
}
