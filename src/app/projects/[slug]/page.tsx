import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, Calendar, CheckCircle2, Lightbulb, MapPin, User } from "lucide-react";

import ProjectCard from "@/components/ProjectCard";
import { Badge, ButtonLink, Card, CheckList, Container, Section, SectionHeading } from "@/components/ui";
import { PROJECTS, projectBySlug } from "@/data/projects";
import { serviceBySlug } from "@/data/services";
import Breadcrumb from "@/layouts/Breadcrumb";
import { pageMetadata } from "@/lib/seo";
import { CtaBand } from "@/sections/BrandsAndCta";

/** ⚠️ slug ที่ไม่มีจริง = 404 จริง (ดูเหตุผลที่ services/[slug]/page.tsx) */
export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};
  return pageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    keywords: project.systems.map((s) => serviceBySlug(s)?.name ?? s),
    image: project.images[0]?.src,
  });
}

/** วันที่แบบไทย พ.ศ. — ไม่ใช้ toLocaleDateString เพราะผลลัพธ์ต่างกันระหว่าง server กับเบราว์เซอร์ */
const thaiMonth = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
const thaiDate = (iso: string) => {
  const [y, m] = iso.split("-").map(Number);
  return `${thaiMonth[m - 1]} ${y + 543}`;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const others = PROJECTS.filter((p) => p.slug !== project.slug && p.systems.some((s) => project.systems.includes(s))).slice(0, 3);

  const facts = [
    { icon: User, label: "ลูกค้า", value: project.customer || "ขอสงวนชื่อลูกค้า" },
    { icon: MapPin, label: "สถานที่", value: project.location },
    { icon: Calendar, label: "ส่งมอบงาน", value: thaiDate(project.completedAt) },
  ];

  return (
    <>
      <Breadcrumb
        items={[
          { name: "ผลงาน", href: "/projects" },
          { name: project.title, href: `/projects/${project.slug}` },
        ]}
      />

      <article>
        <header className="border-b border-slate-200 bg-white">
          <Container className="py-12 sm:py-16">
            <div className="flex flex-wrap gap-2">
              {project.systems.map((s) => (
                <Link key={s} href={`/services/${s}`}>
                  <Badge tone="brand">{serviceBySlug(s)?.name ?? s}</Badge>
                </Link>
              ))}
            </div>
            <h1 className="mt-5 max-w-3xl text-3xl font-bold sm:text-4xl lg:leading-[1.2]">{project.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">{project.summary}</p>

            <dl className="mt-8 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="flex gap-3">
                  <f.icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-red-600" />
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">{f.label}</dt>
                    <dd className="mt-0.5 font-semibold text-slate-900">{f.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </Container>
        </header>

        <Section>
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="space-y-12 lg:col-span-8">
                {/* โจทย์ → วิธีแก้ → ผลลัพธ์: โครงเรื่องที่ทำให้ผลงานน่าเชื่อถือกว่าการลงรูปอย่างเดียว */}
                {[
                  { icon: AlertTriangle, title: "โจทย์และปัญหาหน้างาน", body: project.challenge },
                  { icon: Lightbulb, title: "แนวทางที่เราเลือกใช้", body: project.solution },
                  { icon: CheckCircle2, title: "ผลลัพธ์", body: project.result },
                ].map((b) => (
                  <section key={b.title}>
                    <h2 className="flex items-center gap-2.5 text-xl font-bold sm:text-2xl">
                      <b.icon aria-hidden="true" className="size-6 text-red-600" />
                      {b.title}
                    </h2>
                    <p className="mt-4 text-base leading-[1.9] text-slate-600">{b.body}</p>
                  </section>
                ))}

                {project.images.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold sm:text-2xl">ภาพหน้างาน</h2>
                    <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                      {project.images.map((img) => (
                        <li key={img.src} className="overflow-hidden rounded-xl border border-slate-200">
                          {/* eslint-disable-next-line @next/next/no-img-element -- เปลี่ยนเป็น next/image เมื่อมีรูปจริงและรู้ขนาด */}
                          <img src={img.src} alt={img.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              <aside className="lg:col-span-4">
                <Card className="p-6 lg:sticky lg:top-24">
                  <h2 className="text-base font-bold">ขอบเขตงาน</h2>
                  <CheckList items={project.scope} className="mt-4" />
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <p className="text-sm text-slate-600">มีงานลักษณะใกล้เคียงกันหรือไม่?</p>
                    <ButtonLink href="/quotation" className="mt-3 w-full">ขอใบเสนอราคา</ButtonLink>
                  </div>
                </Card>
              </aside>
            </div>
          </Container>
        </Section>
      </article>

      {others.length > 0 && (
        <Section tone="subtle">
          <Container>
            <SectionHeading eyebrow="ผลงานอื่น" title="โครงการที่เกี่ยวข้อง" />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((p) => <ProjectCard key={p.slug} project={p} />)}
            </div>
            <Link href="/projects" className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-red-600">
              <ArrowLeft aria-hidden="true" className="size-4" />
              กลับไปดูผลงานทั้งหมด
            </Link>
          </Container>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
