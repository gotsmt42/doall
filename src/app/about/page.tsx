import Link from "next/link";
import { Building2, Compass, Handshake, MapPin, ShieldCheck, Sparkles, Target } from "lucide-react";

import ServiceIcon from "@/components/ServiceIcon";
import { Badge, Card, CheckList, Container, Section, SectionHeading } from "@/components/ui";
import { ABOUT } from "@/data/about";
import { COMPANY, fullAddress } from "@/data/company";
import { SERVICES } from "@/data/services";
import Breadcrumb, { PageHeader } from "@/layouts/Breadcrumb";
import { getContent } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";
import { CtaBand } from "@/sections/BrandsAndCta";

export const metadata = pageMetadata({
  title: "เกี่ยวกับเรา — ประวัติบริษัท วิสัยทัศน์ และพันธกิจ",
  description:
    `${COMPANY.nameTh} รับออกแบบ จำหน่าย ติดตั้ง และบำรุงรักษาระบบ Fire Alarm ` +
    "Fire Protection, Fire Pump, CCTV และ Access Control ดูแลโดยทีมวิศวกรประสบการณ์กว่า 10 ปี",
  path: "/about",
  keywords: ["ประวัติบริษัท", "ผู้รับเหมางานระบบ", "บริษัทรับเหมางานระบบ นนทบุรี", "DO ALL ARCHITECT AND ENGINEERING"],
});

const POLICY_ICONS = [Handshake, ShieldCheck, Sparkles] as const;

export default async function AboutPage() {
  const { settings } = await getContent();
  return (
    <>
      <Breadcrumb items={[{ name: "เกี่ยวกับเรา", href: "/about" }]} />
      <PageHeader
        eyebrow="เกี่ยวกับเรา"
        title={COMPANY.nameTh}
        description={COMPANY.tagline}
      />

      {/* ── ประวัติบริษัท ── */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <SectionHeading eyebrow="ประวัติบริษัท" title="ผู้รับเหมางานระบบแบบครบวงจร" />
              <div className="mt-6 space-y-5 text-base leading-[1.9] text-slate-600">
                {ABOUT.history.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
              </div>
            </div>

            {/* ข้อมูลนิติบุคคล — ลูกค้า B2B ใช้ข้อมูลชุดนี้ตรวจสอบบริษัทก่อนออกใบสั่งซื้อจริง */}
            <aside className="lg:col-span-5">
              <Card className="p-6 sm:p-7">
                <h2 className="text-base font-bold text-slate-900">ข้อมูลบริษัท</h2>
                <dl className="mt-5 space-y-4 text-sm">
                  {[
                    ["ชื่อบริษัท", COMPANY.nameTh],
                    ["ชื่อภาษาอังกฤษ", COMPANY.nameEn],
                    ["เลขประจำตัวผู้เสียภาษี", COMPANY.taxId],
                    ["ที่ตั้งออฟฟิศ", fullAddress(COMPANY.office)],
                    ["สำนักงานใหญ่", fullAddress(COMPANY.address)],
                  ].map(([k, v]) => (
                    <div key={k} className="grid gap-1 border-b border-slate-100 pb-4 last:border-0 last:pb-0 sm:grid-cols-[9.5rem_1fr] sm:gap-4">
                      <dt className="text-slate-500">{k}</dt>
                      <dd className="font-medium text-slate-900">{v}</dd>
                    </div>
                  ))}
                </dl>
              </Card>

              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-900">ลูกค้าของเรา</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ABOUT.customers.map((c) => <Badge key={c}>{c}</Badge>)}
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {/* ── วิสัยทัศน์ / พันธกิจ ── */}
      <Section tone="subtle">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-7 sm:p-9">
              <Compass aria-hidden="true" className="size-7 text-red-600" />
              <h2 className="mt-5 text-xl font-bold sm:text-2xl">วิสัยทัศน์</h2>
              <p className="mt-4 text-base leading-[1.9] text-slate-600">{ABOUT.vision}</p>
            </Card>
            <Card className="p-7 sm:p-9">
              <Target aria-hidden="true" className="size-7 text-red-600" />
              <h2 className="mt-5 text-xl font-bold sm:text-2xl">พันธกิจขององค์กร</h2>
              <CheckList items={ABOUT.mission} className="mt-5" />
            </Card>
          </div>
        </Container>
      </Section>

      {/* ── นโยบาย ── */}
      <Section>
        <Container>
          <SectionHeading eyebrow="นโยบายของบริษัท" title="หลักที่เรายึดในการทำงานทุกโครงการ" />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {ABOUT.policy.map((p, i) => {
              const Icon = POLICY_ICONS[i] ?? ShieldCheck;
              return (
                <li key={p.title} className="border-t-2 border-red-600 pt-6" data-reveal>
                  <Icon aria-hidden="true" className="size-6 text-red-600" />
                  <h3 className="mt-4 text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{p.detail}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* ── ความเชี่ยวชาญ ── */}
      <Section tone="subtle">
        <Container>
          <SectionHeading
            eyebrow="ความเชี่ยวชาญของเรา"
            title="งานระบบที่เรารับผิดชอบ"
            description="ครอบคลุมระบบความปลอดภัยและระบบป้องกันอัคคีภัย จึงดูแลได้ทั้งโครงการในผู้รับเหมารายเดียว"
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="flex h-full items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300">
                  <ServiceIcon name={s.icon} />
                  <span>
                    <span className="block font-bold text-slate-900">{s.name}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-600">{s.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── พื้นที่ให้บริการ ── */}
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <SectionHeading
              eyebrow="พื้นที่ให้บริการ"
              title="ให้บริการครอบคลุมทั่วประเทศ"
              description="สำนักงานตั้งอยู่ที่รามอินทรา กรุงเทพฯ พร้อมให้บริการงานระบบป้องกันอัคคีภัยและความปลอดภัยอาคารครอบคลุมทุกภูมิภาคทั่วประเทศไทย ทั้งงานติดตั้งระบบใหม่และงานบำรุงรักษา ทีมงานพร้อมเข้าสำรวจหน้างานและดูแลโครงการได้ในทุกจังหวัด"
            />
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {settings.serviceAreas.map((a) => (
                <li key={a} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-3 text-sm font-medium text-slate-700">
                  <MapPin aria-hidden="true" className="size-4 shrink-0 text-red-600" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ── ใบรับรอง: แสดงเมื่อมีข้อมูลจริงเท่านั้น ── */}
      {ABOUT.certifications.length > 0 && (
        <Section tone="subtle">
          <Container>
            <SectionHeading eyebrow="มาตรฐานและใบรับรอง" title="คุณสมบัติที่ตรวจสอบได้" />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ABOUT.certifications.map((c) => (
                <li key={c.title}>
                  <Card className="h-full p-5">
                    <Building2 aria-hidden="true" className="size-5 text-red-600" />
                    <p className="mt-3 font-bold text-slate-900">{c.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{c.issuer}</p>
                  </Card>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
