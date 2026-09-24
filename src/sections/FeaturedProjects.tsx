import ProjectCard from "@/components/ProjectCard";
import { ButtonLink, Container, EmptyState, Section, SectionHeading } from "@/components/ui";
import type { Project } from "@/data/projects";

/**
 * ผลงานล่าสุดบนหน้าแรก
 * ⚠️ รองรับกรณี "ยังไม่มีผลงานให้แสดง" ไว้แล้ว — ถ้าลบข้อมูลตัวอย่างออกจนหมด
 *    ส่วนนี้จะขึ้นข้อความที่อ่านแล้วเข้าใจ พร้อมปุ่มติดต่อ แทนที่จะเป็นพื้นที่ว่างเปล่า
 */
export default function FeaturedProjects({ projects }: { projects: readonly Project[] }) {
  const featured = [...projects].sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, 6);

  return (
    <Section>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="ผลงานที่ผ่านมา"
            title="ตัวอย่างงานที่เราส่งมอบ"
            description="แต่ละโครงการระบุปัญหาหน้างานจริง แนวทางที่เลือกใช้ และผลที่ได้ ไม่ใช่เพียงรายการอุปกรณ์"
          />
          {featured.length > 0 && (
            <ButtonLink href="/projects" variant="secondary" className="shrink-0">
              ดูผลงานทั้งหมด
            </ButtonLink>
          )}
        </div>

        {featured.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="กำลังรวบรวมผลงาน"
              description="เรากำลังจัดเตรียมรายละเอียดโครงการที่ผ่านมาเพื่อเผยแพร่ ระหว่างนี้ติดต่อทีมงานเพื่อขอดูตัวอย่างผลงานที่ใกล้เคียงกับงานของท่านได้"
              action={<ButtonLink href="/contact">ติดต่อทีมงาน</ButtonLink>}
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <div key={p.slug} data-reveal style={{ "--reveal-delay": `${(i % 3) * 70}ms` } as React.CSSProperties}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
