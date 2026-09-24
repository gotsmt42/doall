import Link from "next/link";
import {
  ArrowRight, Camera, Fingerprint, Flame, Info, Network, Package, ShieldCheck, type LucideIcon,
} from "lucide-react";

import BrandMark from "@/components/BrandMark";
import { ButtonLink, Container, Section, SectionHeading, cx } from "@/components/ui";
import { BRANDS_DISCLAIMER, type Brand } from "@/data/brands";
import { getContent } from "@/lib/cms";

/** ไอคอนของแต่ละหมวด — หมวดที่ไม่รู้จัก (เพิ่มใหม่จากหลังบ้าน) ใช้ไอคอนกลาง */
const CATEGORY_ICON: Record<string, LucideIcon> = {
  "Fire Alarm": Flame,
  CCTV: Camera,
  "Access Control": Fingerprint,
  Network: Network,
  Security: ShieldCheck,
};
const CATEGORY_TH: Record<string, string> = {
  "Fire Alarm": "ระบบแจ้งเหตุเพลิงไหม้",
  CCTV: "ระบบกล้องวงจรปิด",
  "Access Control": "ระบบควบคุมการเข้าออก",
  Network: "ระบบเครือข่าย",
  Security: "ระบบรักษาความปลอดภัย",
};

/**
 * ยี่ห้ออุปกรณ์ที่เราทำงานด้วย — จัดกลุ่มตามระบบ
 *
 * ✅ บริษัทสั่ง "ว้าวกว่านี้ มืออาชีพ" — จากการ์ดชื่อเรียงกันเป็นตาราง เปลี่ยนเป็น:
 *    • หมวดที่มีแบรนด์หลัก (ตอนนี้ Fire Alarm) เป็นแผงใหญ่ ชูแบรนด์หลักตัวใหญ่ (ไม่มีป้ายคำว่า "แบรนด์หลัก" — บริษัทสั่งเอาออก)
 *    • ✅ ใช้โลโก้จริงที่บริษัทส่งมา (24 ก.ย. 2569) ในกล่องขนาดเท่ากัน — ไม่มีโลโก้แสดงเป็นชื่อ (ดู BrandMark)
 *    • หมวดอื่นเป็นการ์ดย่อยพร้อมไอคอน — กวาดตาเดียวรู้ว่าแต่ละระบบรองรับยี่ห้ออะไร
 *    • ชวนต่อ: "ระบบเดิมเป็นยี่ห้ออื่น?" — ลูกค้าที่มีระบบอยู่แล้วคือกลุ่มงาน PM ที่ใหญ่ที่สุด
 * ⚠️ หัวข้อต้องเป็น "ยี่ห้อที่เราทำงานด้วย" เสมอ ห้ามเปลี่ยนเป็น "พาร์ตเนอร์" หรือ
 *    "ตัวแทนจำหน่าย" จนกว่าจะมีหนังสือแต่งตั้งจริง (เหตุผลเต็มอยู่ใน data/brands.ts)
 * ⚠️ หมวดและลำดับมาจากหลังบ้านทั้งหมด (เพิ่ม/ลบ/ตั้งแบรนด์หลักได้) — ห้ามเขียนชื่อยี่ห้อตายตัวที่นี่
 */
export function Brands({ brands }: { brands: readonly Brand[] }) {
  // จัดกลุ่มตามหมวด โดยคงลำดับที่หลังบ้านเรียงไว้ (แบรนด์หลักขึ้นก่อนอยู่แล้ว)
  const groups: { category: string; items: Brand[] }[] = [];
  for (const b of brands) {
    const g = groups.find((x) => x.category === b.category);
    if (g) g.items.push(b);
    else groups.push({ category: b.category, items: [b] });
  }
  const hero = groups.filter((g) => g.items.some((b) => b.featured));
  const rest = groups.filter((g) => !g.items.some((b) => b.featured));

  return (
    <Section tone="subtle" className="relative overflow-hidden">
      {/* ลายเส้นตารางจางๆ มุมขวาบน — ให้ส่วนนี้มีมิติ (CSS ล้วน ไม่มีต้นทุนโหลด) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 60% 70% at 100% 0%, #000 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 100% 0%, #000 20%, transparent 70%)",
        }}
      />
      <Container className="relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Brands & Products We Work With"
            title="ยี่ห้ออุปกรณ์ที่เราจัดหาและติดตั้ง"
            description="เลือกอุปกรณ์จากผู้ผลิตที่มีมาตรฐานรองรับและหาอะไหล่ทดแทนได้ พร้อมดูแลระบบเดิมได้หลายยี่ห้อ"
          />
          <Link
            href="/contact"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-red-700 hover:text-red-800"
          >
            ระบบเดิมเป็นยี่ห้ออื่น? สอบถามได้
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* ── หมวดที่มีแบรนด์หลัก ── */}
        {hero.map((g) => {
          const Icon = CATEGORY_ICON[g.category] ?? Package;
          const main = g.items.filter((b) => b.featured);
          const others = g.items.filter((b) => !b.featured);
          return (
            <div key={g.category} data-reveal className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="grid lg:grid-cols-[17rem_1fr]">
                {/* แถบหัวหมวดด้านซ้าย — พื้นเข้ม ทำให้แผงนี้เป็นจุดเด่นของทั้งส่วน */}
                <div className="flex items-center gap-4 bg-slate-900 p-6 lg:flex-col lg:items-start lg:justify-center lg:p-8">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-red-600 text-white">
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                  <span>
                    <span className="block text-lg font-bold text-white">{g.category}</span>
                    <span className="block text-sm text-slate-400">{CATEGORY_TH[g.category] ?? "ยี่ห้อที่เราติดตั้งและดูแล"}</span>
                  </span>
                </div>

                <div className="p-5 sm:p-8">
                  {/* ⚠️ บริษัทสั่งไม่ให้มีคำว่า "แบรนด์หลัก" บนหน้าเว็บ — เน้นด้วยขนาดตัวอักษรและการ์ดแทน */}
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {main.map((b) => (
                      <li key={b.name} className="flex h-28 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 transition-[border-color,box-shadow] duration-200 hover:border-slate-300 hover:shadow-md sm:h-32">
                        <BrandMark brand={b} base={50} textClassName="text-2xl text-slate-900 sm:text-[1.75rem]" />
                      </li>
                    ))}
                  </ul>

                  {others.length > 0 && (
                    <>
                      <p className="mt-6 text-xs font-semibold tracking-wide text-slate-500 uppercase">รองรับเพิ่มเติม</p>
                      <ul className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                        {others.map((b) => (
                          <li key={b.name} className="flex h-16 items-center justify-center rounded-xl border border-slate-200 bg-white px-2.5 sm:h-20 sm:px-4 transition-[border-color,box-shadow] duration-200 hover:border-slate-300 hover:shadow-sm">
                            <BrandMark brand={b} base={30} textClassName="text-lg" />
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* ── หมวดอื่น ── (มี 2 หมวดใช้ 2 คอลัมน์ ไม่เหลือช่องว่างบนจอใหญ่) */}
        {rest.length > 0 && (
          <ul className={cx("mt-5 grid gap-5 sm:grid-cols-2", rest.length >= 3 && "lg:grid-cols-3")}>
            {rest.map((g, i) => {
              const Icon = CATEGORY_ICON[g.category] ?? Package;
              return (
                <li
                  key={g.category}
                  data-reveal
                  style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition-[box-shadow,border-color] duration-200 hover:border-slate-300 hover:shadow-md sm:p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-lg bg-red-50 text-red-600">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <span>
                      <span className="block font-bold text-slate-900">{g.category}</span>
                      <span className="block text-xs text-slate-500">{CATEGORY_TH[g.category] ?? "ยี่ห้อที่เราติดตั้งและดูแล"}</span>
                    </span>
                  </div>
                  <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-100 pt-3 sm:mt-5 sm:pt-4">
                    {g.items.map((b) => (
                      <li key={b.name} className="flex h-8 items-center"><BrandMark brand={b} base={22} textClassName="text-base" /></li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
          <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          {BRANDS_DISCLAIMER}
        </p>
      </Container>
    </Section>
  );
}

/**
 * แถบชวนติดต่อท้ายหน้า — ใช้ซ้ำทุกหน้าที่เนื้อหาจบแล้ว
 * ⚠️ ทุกหน้าต้องจบด้วยทางไปต่อเสมอ คนที่อ่านจนสุดหน้าคือคนที่สนใจที่สุด
 *    ถ้าปล่อยให้เจอแค่ฟุตเตอร์ เท่ากับปล่อยคนที่พร้อมที่สุดหลุดไป
 */
export async function CtaBand({
  title = "กำลังมองหาผู้เชี่ยวชาญด้านระบบความปลอดภัยและงานวิศวกรรม?",
  description = "เล่ารายละเอียดงานให้เราฟัง ทีมงานจะติดต่อกลับเพื่อสอบถามเพิ่มเติมและนัดสำรวจหน้างาน ให้คำปรึกษาฟรี",
}: {
  title?: string;
  description?: string;
}) {
  // ⚠️ เบอร์โทรมาจากหลังบ้าน (ตั้งค่าองค์กร) — getContent() ใช้ผลเดียวกับทั้งหน้า ไม่ยิงซ้ำ
  const { contact } = await getContent();
  return (
    <section className="bg-slate-900" data-no-print>
      <Container className="py-16 sm:py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-400">{description}</p>
            {contact.telRaw && (
              <p className="mt-4 text-sm text-slate-400">
                หรือโทร{" "}
                <a href={`tel:${contact.telRaw}`} className="font-semibold text-white underline-offset-4 hover:underline">
                  {contact.tel || contact.telRaw}
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
