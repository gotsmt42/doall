import { ArrowRight } from "lucide-react";

import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import { BRANDS, BRANDS_DISCLAIMER } from "@/data/brands";
import { COMPANY } from "@/data/company";

/**
 * ยี่ห้ออุปกรณ์ที่เราทำงานด้วย
 * ⚠️ หัวข้อต้องเป็น "ยี่ห้อที่เราทำงานด้วย" เสมอ ห้ามเปลี่ยนเป็น "พาร์ตเนอร์" หรือ
 *    "ตัวแทนจำหน่าย" จนกว่าจะมีหนังสือแต่งตั้งจริง (เหตุผลเต็มอยู่ใน data/brands.ts)
 */
export function Brands() {
  return (
    <Section tone="subtle" className="!py-14 sm:!py-16">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Brands & Products We Work With"
          title="ยี่ห้ออุปกรณ์ที่เราจัดหาและติดตั้ง"
        />
        <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-3 lg:grid-cols-6">
          {BRANDS.map((b) => (
            <li key={b.name} className="flex flex-col items-center justify-center bg-white px-4 py-6 text-center">
              <span className="text-base font-bold tracking-tight text-slate-800">{b.name}</span>
              <span className="mt-1 text-xs text-slate-500">{b.category}</span>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-relaxed text-slate-500">{BRANDS_DISCLAIMER}</p>
      </Container>
    </Section>
  );
}

/**
 * แถบชวนติดต่อท้ายหน้า — ใช้ซ้ำทุกหน้าที่เนื้อหาจบแล้ว
 * ⚠️ ทุกหน้าต้องจบด้วยทางไปต่อเสมอ คนที่อ่านจนสุดหน้าคือคนที่สนใจที่สุด
 *    ถ้าปล่อยให้เจอแค่ฟุตเตอร์ เท่ากับปล่อยคนที่พร้อมที่สุดหลุดไป
 */
export function CtaBand({
  title = "กำลังมองหาผู้เชี่ยวชาญด้านระบบความปลอดภัยและงานวิศวกรรม?",
  description = "เล่ารายละเอียดงานให้เราฟัง ทีมงานจะติดต่อกลับเพื่อสอบถามเพิ่มเติมและนัดสำรวจหน้างาน ปรึกษาเบื้องต้นไม่มีค่าใช้จ่าย",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="bg-slate-900" data-no-print>
      <Container className="py-16 sm:py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-400">{description}</p>
            {COMPANY.telRaw && (
              <p className="mt-4 text-sm text-slate-400">
                หรือโทร{" "}
                <a href={`tel:${COMPANY.telRaw}`} className="font-semibold text-white underline-offset-4 hover:underline">
                  {COMPANY.tel}
                </a>
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <ButtonLink href="/quotation" size="lg">
              ขอใบเสนอราคา
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
            <ButtonLink href="/contact" variant="onDark" size="lg">
              ติดต่อเรา
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
