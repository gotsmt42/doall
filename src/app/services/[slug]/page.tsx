import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Building2, ChevronDown } from "lucide-react";

import BrandMark from "@/components/BrandMark";
import ProjectCard from "@/components/ProjectCard";
import ServiceIcon from "@/components/ServiceIcon";
import { ButtonLink, Card, CheckList, Container, JsonLd, Section, SectionHeading } from "@/components/ui";
import { getContent } from "@/lib/cms";
import { logoFor } from "@/data/brands";
import { SERVICES, serviceBySlug } from "@/data/services";
import Breadcrumb from "@/layouts/Breadcrumb";
import { faqJsonLd, serviceJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { CtaBand } from "@/sections/BrandsAndCta";

/**
 * หน้าบริการแต่ละตัว — หน้าที่สำคัญที่สุดสำหรับ SEO ของทั้งเว็บ
 * เพราะเป็นหน้าที่ตรงกับสิ่งที่ลูกค้าพิมพ์ค้นหามากที่สุด ("ติดตั้ง cctv โรงงาน")
 *
 * ⚠️ Next.js 16: params เป็น Promise และต้อง await เสมอ — เข้าถึงแบบ sync ถูกถอดออกแล้ว
 *    (ดู node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md)
 * 🐛 ต้องเป็น dynamicParams = true — เคยตั้งเป็น false แล้วพบว่า (Next.js 16) พอระบบหลังบ้านสั่ง
 *    revalidate หน้าบริการทั้ง 6 หน้าถูกสร้างใหม่ไม่ผ่าน (NoFallbackError) กลายเป็น 404 และ 404 นั้น
 *    ถูกแคชไว้ = ทุกครั้งที่ผู้ดูแลกดบันทึกอะไรก็ตาม หน้าที่สำคัญที่สุดต่อ SEO ของเว็บจะหายหมด
 *    (ตรวจเจอจากการทดสอบบนเซิร์ฟเวอร์ production จริง ไม่ใช่ตอน dev)
 * ✅ slug ที่ไม่มีจริงยังได้ 404 จริงจาก notFound() ด้านล่าง (ตรวจแล้วด้วย curl — ไม่ใช่ soft 404)
 */
export const dynamicParams = true;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.title,
    description: service.summary,
    path: `/services/${service.slug}`,
    keywords: service.keywords,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) notFound();

  // ⚠️ ชื่อบริการที่ขึ้นต้นด้วย "งาน" อยู่แล้ว ห้ามต่อ "งาน" หน้าซ้ำ (เคยได้ "ขอใบเสนอราคางาน งานระบบ…")
  //    จึงเติมเฉพาะชื่อที่ยังไม่มี
  const job = service.name.startsWith("งาน") ? service.name : `งาน ${service.name}`;
  const content = await getContent();
  const related = content.projects.filter((p) => p.systems.includes(service.slug)).slice(0, 3);
  // โลโก้จากหลังบ้านชนะ ไม่มีใช้ไฟล์ตั้งต้น ไม่มีทั้งคู่แสดงเป็นชื่อ
  const brandLogo = (name: string) =>
    content.brands.find((b) => b.name.toLowerCase() === name.toLowerCase())?.logo ?? logoFor(name);
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({ name: service.title, description: service.summary, href: `/services/${service.slug}`, serviceTypes: service.scope }),
          faqJsonLd(service.faq),
        ]}
      />
      <Breadcrumb
        items={[
          { name: "บริการ", href: "/services" },
          { name: service.name, href: `/services/${service.slug}` },
        ]}
      />

      {/* ── หัวหน้า ── */}
      <div className="border-b border-slate-200 bg-white">
        <Container className="py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <ServiceIcon name={service.icon} />
              <h1 className="mt-6 text-3xl font-bold sm:text-4xl lg:leading-[1.2]">{service.title}</h1>
              <div className="mt-6 space-y-4 text-base leading-[1.9] text-slate-600">
                {service.intro.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={`/quotation?service=${service.slug}`} size="lg">
                  ขอใบเสนอราคา{job}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </ButtonLink>
                <ButtonLink href="/contact" variant="secondary" size="lg">สอบถามรายละเอียด</ButtonLink>
              </div>
            </div>

            {/* ประเภทอาคารที่ใช้ — ให้ลูกค้ารู้ตัวทันทีว่า "งานแบบของเขา" เราทำได้ */}
            <aside className="lg:col-span-5">
              <Card className="p-6 sm:p-7">
                <h2 className="flex items-center gap-2 text-base font-bold">
                  <Building2 aria-hidden="true" className="size-5 text-red-600" />
                  เหมาะสำหรับ
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {service.applications.map((a) => (
                    <li key={a} className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">{a}</li>
                  ))}
                </ul>
                {service.brands && service.brands.length > 0 && (
                  <>
                    <h2 className="mt-6 border-t border-slate-100 pt-6 text-base font-bold">ยี่ห้อที่เราติดตั้งและดูแล</h2>
                    <ul className={`mt-4 grid gap-2 ${service.brands.length <= 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                      {service.brands.map((b) => (
                        <li key={b} className="flex h-14 items-center justify-center rounded-lg border border-slate-200 bg-white px-2">
                          <BrandMark brand={{ name: b, logo: brandLogo(b) }} base={20} textClassName="text-xs" />
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Card>
            </aside>
          </div>
        </Container>
      </div>

      {/* ── ขอบเขตงาน + ประโยชน์ ── */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading eyebrow="ขอบเขตงาน" title="สิ่งที่รวมอยู่ในบริการ" />
              <CheckList items={service.scope} className="mt-8" />
            </div>
            <div>
              <SectionHeading eyebrow="สิ่งที่ลูกค้าได้" title="ผลลัพธ์ที่วัดได้จริง" />
              <ul className="mt-8 space-y-4">
                {service.benefits.map((b) => (
                  <li key={b.title}>
                    <Card className="p-5">
                      <h3 className="text-base font-bold">{b.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{b.detail}</p>
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── คำถามที่พบบ่อย ── */}
      <Section tone="subtle">
        <Container>
          <SectionHeading eyebrow="คำถามที่พบบ่อย" title={`คำถามเกี่ยวกับ${job}`} />
          {/* ⚠️ ใช้ <details> ของเบราว์เซอร์ ไม่เขียน accordion เอง — กดได้ด้วยแป้นพิมพ์ อ่านได้ด้วย
              โปรแกรมอ่านหน้าจอ และทำงานโดยไม่ต้องส่ง JS ลงเบราว์เซอร์เลย
              ⚠️ คำตอบอยู่ใน HTML ตั้งแต่แรก (แค่พับไว้) จึงตรงกับ FAQ structured data ที่ประกาศไว้ */}
          <div className="mt-8 max-w-3xl divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {service.faq.map((f) => (
              <details key={f.q} className="group px-5 sm:px-6">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown aria-hidden="true" className="size-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="pb-5 text-[15px] leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── ผลงานที่เกี่ยวข้อง (แสดงเมื่อมี) ── */}
      {related.length > 0 && (
        <Section>
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow="ผลงานที่เกี่ยวข้อง" title={`ตัวอย่าง${job} ที่ผ่านมา`} />
              <ButtonLink href="/projects" variant="secondary">ดูผลงานทั้งหมด</ButtonLink>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <ProjectCard key={p.slug} project={p} />)}
            </div>
          </Container>
        </Section>
      )}

      {/* ── บริการอื่น — ลิงก์ภายในช่วยให้ Google เข้าใจโครงสร้างเว็บ และพาผู้ใช้ไปต่อ ── */}
      <Section tone="subtle" className="!py-14">
        <Container>
          <h2 className="text-lg font-bold">บริการอื่นของเรา</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="flex h-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-red-300 hover:text-red-700"
                >
                  <ServiceIcon name={s.icon} boxed={false} className="size-5 shrink-0" />
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand title={`ต้องการใบเสนอราคา${job}?`} />
    </>
  );
}
