import { Container } from "@/components/ui";
import { thaiShortDate } from "@/data/articles";
import type { LegalDoc } from "@/data/legal";
import Breadcrumb, { PageHeader } from "@/layouts/Breadcrumb";

/** หน้าเอกสารทางกฎหมายทั้งสามหน้าใช้โครงเดียวกัน — แก้หน้าตาที่เดียว */
export default function LegalPage({ doc, href }: { doc: LegalDoc; href: string }) {
  return (
    <>
      <Breadcrumb items={[{ name: doc.title, href }]} />
      <PageHeader title={doc.title} description={doc.description} />
      <Container className="py-12 sm:py-16">
        <article className="max-w-[68ch]">
          <p className="text-sm text-slate-500">
            ปรับปรุงล่าสุด <time dateTime={doc.updatedAt}>{thaiShortDate(doc.updatedAt)}</time>
          </p>
          {doc.sections.map((s, i) => (
            <section key={s.heading} className="mt-10">
              <h2 className="text-xl font-bold">{i + 1}. {s.heading}</h2>
              {s.paragraphs?.map((p) => (
                <p key={p.slice(0, 30)} className="mt-4 leading-[1.9] text-slate-700">{p}</p>
              ))}
              {s.list && (
                <ul className="mt-4 list-disc space-y-2 pl-6 leading-[1.85] text-slate-700 marker:text-red-600">
                  {s.list.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}
        </article>
      </Container>
    </>
  );
}
