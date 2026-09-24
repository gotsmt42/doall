import ProjectGrid from "@/components/ProjectGrid";
import { ButtonLink, Container, EmptyState, Section } from "@/components/ui";
import { projectFilters } from "@/data/projects";
import { getContent } from "@/lib/cms";
import Breadcrumb, { PageHeader } from "@/layouts/Breadcrumb";
import { pageMetadata } from "@/lib/seo";
import { CtaBand } from "@/sections/BrandsAndCta";

export const metadata = pageMetadata({
  title: "ผลงานที่ผ่านมา — งานติดตั้งระบบ Fire Alarm, CCTV, Access Control และ Fire Pump",
  description:
    "ตัวอย่างโครงการติดตั้งและบำรุงรักษางานระบบ พร้อมปัญหาหน้างาน แนวทางแก้ไข และผลลัพธ์ที่ได้ " +
    "สำหรับโรงงาน หน่วยงานราชการ คลังสินค้า อาคารพาณิชย์ และสำนักงาน",
  path: "/projects",
  keywords: ["ผลงานติดตั้ง cctv", "ผลงานติดตั้ง fire alarm", "ตัวอย่างงานระบบ"],
});

export default async function ProjectsPage() {
  // เรียงใหม่สุดก่อน — ผลงานล่าสุดบอกความพร้อมของบริษัทได้ดีกว่าผลงานเก่า
  const projects = [...(await getContent()).projects].sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  return (
    <>
      <Breadcrumb items={[{ name: "ผลงาน", href: "/projects" }]} />
      <PageHeader
        eyebrow="ผลงานที่ผ่านมา"
        title="ตัวอย่างโครงการที่เราส่งมอบ"
        description="ทุกโครงการระบุปัญหาหน้างานจริง แนวทางที่เลือกใช้ และผลที่ได้ เพื่อให้เห็นวิธีทำงานของเรา ไม่ใช่เพียงรายการอุปกรณ์"
      />
      <Section>
        <Container>
          {projects.length === 0 ? (
            <EmptyState
              title="กำลังรวบรวมผลงาน"
              description="เรากำลังจัดเตรียมรายละเอียดโครงการที่ผ่านมาเพื่อเผยแพร่ ระหว่างนี้ติดต่อทีมงานเพื่อขอดูตัวอย่างผลงานที่ใกล้เคียงกับงานของท่านได้"
              action={<ButtonLink href="/contact">ติดต่อทีมงาน</ButtonLink>}
            />
          ) : (
            <ProjectGrid projects={projects} filters={projectFilters(projects)} />
          )}
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
