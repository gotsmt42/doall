import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { Container } from "@/components/ui";
import { COMPANY, contactChannels, locations } from "@/data/company";
import { getContent } from "@/lib/cms";
import { FOOTER_NAV } from "@/data/nav";
import { SERVICES } from "@/data/services";

/**
 * ฟุตเตอร์ — ที่สุดท้ายที่ลูกค้าจะหาเบอร์โทรเมื่ออ่านจบ
 *
 * ⚠️ เป็น Server Component (ไม่มี "use client") จึงไม่ส่ง JS ลงเบราว์เซอร์เลยแม้แต่ไบต์เดียว
 * ⚠️ ที่อยู่และเบอร์ในฟุตเตอร์คือสิ่งที่ Google ใช้ยืนยันตัวตนธุรกิจ (ต้องตรงกับที่เขียนใน
 *    Google Business Profile เป๊ะ ทั้งตัวสะกดและรูปแบบ) จึงอ่านจาก company.ts ที่เดียว
 */
/**
 * ⚠️ ลิงก์ในฟุตเตอร์ทั้งหมด prefetch={false} — อยู่ท้ายหน้า คนส่วนน้อยกด แต่ถ้าปล่อย prefetch
 *    ทุกหน้าจะโหลดล่วงหน้าอีกเป็นสิบหน้าทุกครั้งที่เลื่อนถึงท้าย (ยังโหลดตอนชี้/แตะอยู่ ไม่ช้าลง)
 */
export default async function Footer() {
  const { contact, settings } = await getContent();
  const channels = contactChannels(contact);
  const company = FOOTER_NAV.company.filter((l) => settings.showArticles || l.href !== "/articles");
  const year = new Date().getFullYear() + 543; // แสดงเป็น พ.ศ. ตามที่เอกสารไทยใช้กัน

  return (
    <footer data-no-print className="border-t border-slate-800 bg-slate-900 text-slate-400">
      {/* ⚠️ ข้อความรองในฟุตเตอร์ใช้ slate-400 ขั้นต่ำ — slate-500 บนพื้น slate-900 ได้คอนทราสต์แค่ 3.74
          ต่ำกว่าเกณฑ์ 4.5 ของ WCAG AA */}
      <Container className="py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* ── บริษัท ── */}
          <div className="lg:col-span-4">
            {/* โลโก้แบบตัวหนังสือขาวสำหรับพื้นเข้ม — ห้ามใช้แบบตัวหนังสือดำตรงนี้ จะมองไม่เห็นเลย */}
            {/* ⚠️ ต้องมี sizes — ไม่ใส่ Next จะเลือกไฟล์กว้าง 2048px (19 KB) ทั้งที่แสดงจริงกว้างราว 125px
                (วัดจากรายงาน Lighthouse) */}
            <Image src="/brand/logo-on-dark.png" alt={COMPANY.shortName} width={1003} height={454} sizes="130px" className="h-14 w-auto" />
            <p className="mt-4 text-sm font-medium text-slate-300">{COMPANY.nameTh}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">{COMPANY.tagline}</p>
            <p className="mt-4 text-xs text-slate-400">เลขประจำตัวผู้เสียภาษี {COMPANY.taxId}</p>
          </div>

          {/* ── บริการ ── */}
          <nav aria-labelledby="footer-services" className="lg:col-span-3">
            <p id="footer-services" className="text-sm font-semibold text-white">บริการ</p>
            <ul className="mt-4 space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link prefetch={false} href={`/services/${s.slug}`} className="text-sm transition-colors hover:text-white">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── บริษัท / ข้อกำหนด ── */}
          <nav aria-labelledby="footer-company" className="lg:col-span-2">
            <p id="footer-company" className="text-sm font-semibold text-white">บริษัท</p>
            <ul className="mt-4 space-y-2.5">
              {company.map((l) => (
                <li key={l.href}>
                  <Link prefetch={false} href={l.href} className="text-sm transition-colors hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── ติดต่อ ── */}
          <div className="lg:col-span-3">
            <p className="text-sm font-semibold text-white">ติดต่อเรา</p>
            <address className="mt-4 space-y-3 text-sm not-italic">
              {locations().map((l) => (
                <p key={l.label} className="flex gap-2.5">
                  <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-slate-500" />
                  <span className="leading-relaxed">
                    <span className="block font-semibold text-slate-300">{l.label}</span>
                    {l.line}
                  </span>
                </p>
              ))}

              {/* ⚠️ ช่องทางที่ยังไม่มีข้อมูลจริงจะไม่ถูกแสดง — ไม่มีลิงก์เปล่าให้กดแล้วไม่ไปไหน */}
              {channels.map((c) => {
                const Icon = c.key === "tel" ? Phone : c.key === "email" ? Mail : MessageCircle;
                return (
                  <p key={c.key} className="flex gap-2.5">
                    <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-slate-500" />
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="transition-colors hover:text-white"
                    >
                      {c.value}
                    </a>
                  </p>
                );
              })}

              <p className="flex gap-2.5">
                <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-slate-500" />
                <span className="leading-relaxed">
                  {settings.businessHoursWeekdays}
                  <span className="block text-slate-400">{settings.businessHoursClosed}</span>
                </span>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            © {year} {COMPANY.nameTh} สงวนลิขสิทธิ์
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {FOOTER_NAV.legal.map((l) => (
              <li key={l.href}>
                <Link prefetch={false} href={l.href} className="text-xs text-slate-400 transition-colors hover:text-slate-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
