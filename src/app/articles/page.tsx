import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { Badge, Card, Container, EmptyState, Section } from "@/components/ui";
import { readingMinutes, thaiShortDate } from "@/data/articles";
import { getContent } from "@/lib/cms";
import Breadcrumb, { PageHeader } from "@/layouts/Breadcrumb";
import { pageMetadata } from "@/lib/seo";
import { CtaBand } from "@/sections/BrandsAndCta";

export const metadata = pageMetadata({
  title: "บทความและความรู้งานระบบ Fire Alarm, CCTV และการบำรุงรักษา",
  description:
    "บทความความรู้สำหรับเจ้าของอาคารและผู้จัดการโครงการ เรื่องการเลือกระบบแจ้งเหตุเพลิงไหม้ กล้องวงจรปิด " +
    "และการบำรุงรักษาระบบความปลอดภัย เขียนโดยทีมวิศวกร",
  path: "/articles",
  keywords: ["ความรู้ fire alarm", "ความรู้กล้องวงจรปิด", "บทความงานระบบ"],
});

export default async function ArticlesPage() {
  const articles = [...(await getContent()).articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <>
      <Breadcrumb items={[{ name: "บทความ", href: "/articles" }]} />
      <PageHeader
        eyebrow="บทความและความรู้"
        title="ความรู้งานระบบสำหรับเจ้าของอาคาร"
        description="คำอธิบายตรงไปตรงมาจากทีมวิศวกร ช่วยให้ตัดสินใจเรื่องระบบความปลอดภัยได้อย่างมีข้อมูล"
      />
      <Section>
        <Container>
          {articles.length === 0 ? (
            <EmptyState title="ยังไม่มีบทความ" description="เรากำลังเตรียมบทความความรู้งานระบบ แวะกลับมาอีกครั้งเร็วๆ นี้" />
          ) : (
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <li key={a.slug} data-reveal>
                  <Card interactive className="group h-full">
                    <Link href={`/articles/${a.slug}`} className="flex h-full flex-col p-6">
                      <div className="flex items-center justify-between gap-3">
                        <Badge tone="brand">{a.category}</Badge>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <Clock aria-hidden="true" className="size-3.5" />
                          อ่าน {readingMinutes(a)} นาที
                        </span>
                      </div>
                      <h2 className="mt-4 text-lg leading-snug font-bold text-slate-900">{a.title}</h2>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{a.description}</p>
                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                        <time dateTime={a.publishedAt}>{thaiShortDate(a.publishedAt)}</time>
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
          )}
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
