import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ServiceIcon from "@/components/ServiceIcon";
import { Card, CheckList, Container, Section, SectionHeading } from "@/components/ui";
import { SERVICES } from "@/data/services";
import Breadcrumb, { PageHeader } from "@/layouts/Breadcrumb";
import { pageMetadata } from "@/lib/seo";
import { CtaBand } from "@/sections/BrandsAndCta";

export const metadata = pageMetadata({
  title: "บริการงานระบบ Fire Alarm, Fire Pump, CCTV, Access Control และ Network",
  description:
    "บริการออกแบบ ติดตั้ง ทดสอบ และบำรุงรักษางานระบบแจ้งเหตุเพลิงไหม้ กล้องวงจรปิด ระบบควบคุมการเข้าออก " +
    "ระบบเครือข่าย และระบบเครื่องสูบน้ำดับเพลิง (Fire Pump) พร้อมบริการ PM/CM",
  path: "/services",
  keywords: ["บริการงานระบบ", "รับติดตั้งระบบ", "ผู้รับเหมางานระบบ"],
});

/** ขั้นตอนการทำงานมาตรฐาน — ลูกค้า B2B อยากรู้ว่าหลังจากติดต่อแล้วจะเกิดอะไรขึ้นบ้าง */
const PROCESS = [
  { title: "รับเรื่องและสอบถามความต้องการ", detail: "ทีมงานติดต่อกลับเพื่อสอบถามรายละเอียดงาน พื้นที่ และกรอบเวลา" },
  { title: "สำรวจหน้างาน", detail: "เข้าดูพื้นที่จริงเพื่อประเมินงานให้ถูกต้อง ไม่ประเมินจากแบบอย่างเดียว" },
  { title: "เสนอแนวทางและราคา", detail: "ใบเสนอราคาระบุขอบเขตงาน อุปกรณ์ ระยะเวลา และเงื่อนไขรับประกันชัดเจน" },
  { title: "ติดตั้งและควบคุมงาน", detail: "วิศวกรหรือหัวหน้างานกำกับดูแลตามแผนงานตลอดโครงการ" },
  { title: "ทดสอบและส่งมอบ", detail: "ทดสอบระบบครบทุกจุด ส่งมอบพร้อมเอกสาร แบบ As-built และอบรมการใช้งาน" },
  { title: "ดูแลหลังการขาย", detail: "รับประกันงานติดตั้ง และบริการบำรุงรักษาตามรอบสำหรับลูกค้าที่ต้องการ" },
] as const;

export default function ServicesPage() {
  return (
    <>
      <Breadcrumb items={[{ name: "บริการ", href: "/services" }]} />
      <PageHeader
        eyebrow="บริการของเรา"
        title="งานระบบที่เรารับผิดชอบตั้งแต่ออกแบบจนส่งมอบ"
        description="ครอบคลุมระบบความปลอดภัยและระบบป้องกันอัคคีภัย ดูแลโดยทีมวิศวกรที่มีประสบการณ์ทำงานมากกว่า 10 ปี"
      />

      <Section>
        <Container>
          <ul className="grid gap-6 lg:grid-cols-2">
            {SERVICES.map((s) => (
              <li key={s.slug} data-reveal>
                <Card interactive className="group h-full">
                  <Link href={`/services/${s.slug}`} className="flex h-full flex-col p-6 sm:p-8">
                    <div className="flex items-start gap-4">
                      <ServiceIcon name={s.icon} />
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{s.title}</h2>
                        <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{s.summary}</p>
                      </div>
                    </div>
                    {/* ตัวอย่างขอบเขตงาน 4 ข้อแรก — ให้เห็นความลึกของบริการโดยไม่ต้องกดเข้าไป */}
                    <CheckList items={s.scope.slice(0, 4)} className="mt-6 flex-1 border-t border-slate-100 pt-6" />
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-red-600">
                      ดูรายละเอียดบริการ
                      <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container>
          <SectionHeading
            eyebrow="ขั้นตอนการทำงาน"
            title="ตั้งแต่ติดต่อครั้งแรกจนถึงหลังส่งมอบ"
            description="ทุกโครงการเดินตามขั้นตอนเดียวกัน ลูกค้าจึงรู้เสมอว่างานอยู่ตรงไหนและขั้นต่อไปคืออะไร"
          />
          <ol className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS.map((step, i) => (
              <li key={step.title} className="relative pl-14" data-reveal>
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 grid size-10 place-items-center rounded-full border-2 border-red-600 text-sm font-bold text-red-600"
                >
                  {i + 1}
                </span>
                <h3 className="text-base font-bold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.detail}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
