import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ServiceIcon from "@/components/ServiceIcon";
import ServiceImage from "@/components/ServiceImage";
import { ButtonLink, Card, Container, Section, SectionHeading } from "@/components/ui";
import { SERVICES } from "@/data/services";
import { getContent } from "@/lib/cms";

/**
 * การ์ดบริการ
 * ⚠️ ทั้งการ์ดคือลิงก์เดียว ไม่ใช่การ์ดที่มีปุ่ม "ดูเพิ่มเติม" เล็กๆ ซ่อนอยู่มุมหนึ่ง
 *    เป้ากดใหญ่เท่าการ์ดทั้งใบ = กดง่ายบนมือถือ และคาดเดาได้ว่ากดตรงไหนก็ไปที่เดียวกัน
 */
export default async function ServicesGrid() {
  const { settings } = await getContent();
  return (
    <Section>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="บริการของเรา"
            title="บริการงานระบบครบวงจร"
            description="ครอบคลุมระบบป้องกันอัคคีภัยและระบบความปลอดภัยของอาคาร ตั้งแต่ออกแบบ ติดตั้ง ทดสอบ ส่งมอบ จนถึงบำรุงรักษาหลังการขาย"
          />
          <ButtonLink href="/services" variant="secondary" className="shrink-0">
            ดูบริการทั้งหมด
          </ButtonLink>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            // ⚠️ data-reveal ต้องอยู่บน DOM element จริง — ใส่ที่ <Card> ตรงๆ ไม่ได้ เพราะ Card
            //    ไม่ได้ส่งต่อ prop ลง DOM และ TypeScript ไม่ตรวจ prop ที่มีขีดกลาง จึงเงียบหายไม่ฟ้อง
            <div key={s.slug} data-reveal style={{ "--reveal-delay": `${(i % 3) * 60}ms` } as React.CSSProperties}>
              <Card interactive className="group h-full">
                <Link href={`/services/${s.slug}`} className="flex h-full flex-col overflow-hidden">
                  {/* ✅ รูปด้านบนการ์ด (บริษัทสั่ง) — ไอคอนเล็กมุมล่างซ้ายของรูป บอกระบบได้แม้ภาพยังไม่โหลด */}
                  <div className="relative">
                    <ServiceImage slug={s.slug} title={s.title} settings={settings} sizes="(min-width:1024px) 380px, (min-width:640px) 50vw, 100vw" />
                    <span className="absolute bottom-3 left-3 rounded-lg bg-white shadow-sm"><ServiceIcon name={s.icon} /></span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600">{s.summary}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-red-600">
                      ดูรายละเอียด
                      <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
