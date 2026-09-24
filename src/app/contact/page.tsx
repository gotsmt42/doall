import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone, Siren } from "lucide-react";

import LeadForm from "@/components/LeadForm";
import { Card, Container, Section } from "@/components/ui";
import { COMPANY, contactChannels, fullAddress, locations } from "@/data/company";
import { serviceOptions } from "@/data/services";
import Breadcrumb, { PageHeader } from "@/layouts/Breadcrumb";
import { getContent } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "ติดต่อเรา — สอบถามงานระบบและนัดสำรวจหน้างาน",
  description: `ติดต่อ ${COMPANY.nameTh} ออฟฟิศรามอินทรา เขตคันนายาว กรุงเทพฯ สอบถามงานระบบ Fire Alarm, CCTV, Access Control, Network และ Fire Pump หรือนัดสำรวจหน้างาน`,
  path: "/contact",
  keywords: ["ติดต่อผู้รับเหมางานระบบ", "ติดตั้ง fire alarm รามอินทรา", "ผู้รับเหมางานระบบ คันนายาว", "ผู้รับเหมางานระบบ กรุงเทพ", "ผู้รับเหมางานระบบ นนทบุรี"],
});

/**
 * ⚠️ แผนที่แสดง "ที่ตั้งออฟฟิศ" (ที่ลูกค้าเดินทางไปจริง) ไม่ใช่สำนักงานใหญ่ตามทะเบียน
 * ⚠️ ค้นจากที่อยู่ ไม่ใช่พิกัด — ยังไม่มีพิกัดจริง (ดู TODO ที่ data/company.ts)
 * ⚠️ loading="lazy" สำคัญมาก: iframe แผนที่หนักหลาย MB ถ้าโหลดทันทีจะฉุดคะแนน Performance ทั้งหน้า
 */
const MAP_QUERY = fullAddress(COMPANY.office);
const MAP_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&hl=th&z=16&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;

export default async function ContactPage() {
  const { contact, settings } = await getContent();
  const channels = contactChannels(contact);

  return (
    <>
      <Breadcrumb items={[{ name: "ติดต่อเรา", href: "/contact" }]} />
      <PageHeader
        eyebrow="ติดต่อเรา"
        title="พูดคุยกับทีมวิศวกรของเรา"
        description="สอบถามข้อมูล ขอคำปรึกษา หรือนัดสำรวจหน้างาน ทีมงานจะติดต่อกลับภายในวันทำการถัดไป"
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="min-w-0 lg:col-span-7">
              <h2 className="text-xl font-bold sm:text-2xl">ส่งข้อความถึงเรา</h2>
              <p className="mt-2 text-slate-600">
                ต้องการราคาสำหรับงานที่ชัดเจนแล้ว?{" "}
                <Link href="/quotation" className="font-semibold text-red-700 underline underline-offset-2">ขอใบเสนอราคาโดยตรง</Link>
              </p>
              <div className="mt-8">
                <LeadForm kind="contact" serviceOptions={serviceOptions()} />
              </div>
            </div>

            <aside className="min-w-0 space-y-5 lg:col-span-5">
              <Card className="p-6 sm:p-7">
                <h2 className="text-base font-bold">{COMPANY.nameTh}</h2>
                <p className="mt-1 text-sm text-slate-500">{COMPANY.nameEn}</p>
                <address className="mt-5 space-y-4 text-sm not-italic">
                  {locations().map((l) => (
                    <p key={l.label} className="flex gap-3">
                      <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-red-600" />
                      <span className="leading-relaxed text-slate-700">
                        <span className="block text-xs text-slate-500">{l.label}</span>
                        {l.line}
                        <a href={l.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-0.5 block text-xs font-semibold text-red-700 hover:underline">
                          นำทางด้วย Google Maps
                        </a>
                      </span>
                    </p>
                  ))}
                  {channels.map((c) => {
                    const Icon = c.key === "tel" ? Phone : c.key === "email" ? Mail : MessageCircle;
                    return (
                      <p key={c.key} className="flex gap-3">
                        <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-red-600" />
                        <span>
                          <span className="block text-xs text-slate-500">{c.label}</span>
                          <a
                            href={c.href}
                            {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            className="font-semibold text-slate-900 hover:text-red-700"
                          >
                            {c.value}
                          </a>
                        </span>
                      </p>
                    );
                  })}
                  <p className="flex gap-3">
                    <Clock aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-red-600" />
                    <span className="leading-relaxed text-slate-700">
                      {settings.businessHoursWeekdays}
                      <span className="block">{settings.businessHoursSaturday}</span>
                      <span className="block text-slate-500">ปิด{settings.businessHoursClosed}</span>
                    </span>
                  </p>
                </address>
              </Card>

              <Card className="flex gap-3 border-red-100 bg-red-50/60 p-5">
                <Siren aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-red-600" />
                <p className="text-sm leading-relaxed text-slate-700">{settings.emergencyNote}</p>
              </Card>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <iframe
                  src={MAP_EMBED}
                  title={`แผนที่ที่ตั้งออฟฟิศ ${COMPANY.nameTh}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block aspect-[4/3] w-full border-0"
                />
                <a
                  href={MAP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border-t border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:text-red-700"
                >
                  นำทางไปออฟฟิศด้วย Google Maps →
                </a>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
