import ArticleList from "@/components/ArticleList";
import { Container, EmptyState, Section } from "@/components/ui";
import { readingMinutes, thaiShortDate } from "@/data/articles";
import { getContent } from "@/lib/cms";
import Breadcrumb, { PageHeader } from "@/layouts/Breadcrumb";
import { pageMetadata } from "@/lib/seo";
import { CtaBand } from "@/sections/BrandsAndCta";

export const metadata = pageMetadata({
  title: "บทความและความรู้งานระบบ Fire Alarm, Fire Protection, Fire Pump, CCTV และ Access Control",
  description:
    "บทความความรู้สำหรับเจ้าของอาคารและผู้จัดการโครงการ เรื่องระบบแจ้งเหตุเพลิงไหม้ ระบบ Fire Pump กล้องวงจรปิด " +
    "ระบบควบคุมการเข้าออก และการบำรุงรักษา เขียนโดยทีมวิศวกร",
  path: "/articles",
  keywords: ["ความรู้ fire alarm", "ความรู้ fire pump", "ความรู้กล้องวงจรปิด", "access control", "บทความงานระบบ"],
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
            <ArticleList
              articles={articles.map((a) => ({
                slug: a.slug, title: a.title, description: a.description, category: a.category,
                publishedAt: a.publishedAt, dateLabel: thaiShortDate(a.publishedAt), minutes: readingMinutes(a),
              }))}
            />
          )}
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
