import Link from "next/link";
import type { Metadata } from "next";

import ServiceIcon from "@/components/ServiceIcon";
import { ButtonLink, Container } from "@/components/ui";
import { SERVICES } from "@/data/services";

export const metadata: Metadata = {
  title: "ไม่พบหน้าที่ต้องการ",
  // ⚠️ หน้า 404 ต้องไม่ถูกเก็บเข้า Google เด็ดขาด
  robots: { index: false, follow: true },
};

/**
 * หน้า 404
 * ⚠️ ไม่มี loading.tsx ที่ระดับราก "โดยตั้งใจ" — ถ้ามี ทุกหน้าจะถูกส่งแบบ streaming แล้ว
 *    หน้าที่ไม่มีจริงจะได้สถานะ 200 แทน 404 (soft 404 — ดู node_modules/next/dist/docs/
 *    01-app/03-api-reference/03-file-conventions/loading.md หัวข้อ Status Codes)
 *    ทุกหน้าของเว็บนี้สร้างไว้ล่วงหน้าตอน build อยู่แล้ว จึงไม่มีจังหวะให้ต้องรอโหลด
 * ⚠️ หน้า 404 ที่ดีต้องพาไปต่อได้ ไม่ใช่แค่บอกว่า "ไม่พบ" — คนที่หลงมาจากลิงก์เก่า
 *    ส่วนใหญ่ตามหาบริการใดบริการหนึ่งอยู่
 */
export default function NotFound() {
  return (
    <Container className="py-20 sm:py-28">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-wide text-red-600">ข้อผิดพลาด 404</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">ไม่พบหน้าที่คุณต้องการ</h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          หน้านี้อาจถูกย้าย เปลี่ยนชื่อ หรือไม่มีอยู่แล้ว ลองเลือกบริการที่ต้องการด้านล่าง หรือกลับไปหน้าแรก
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/">กลับหน้าแรก</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">ติดต่อเรา</ButtonLink>
        </div>
      </div>

      <nav aria-label="บริการของเรา" className="mt-14 border-t border-slate-200 pt-8">
        <p className="text-sm font-semibold text-slate-900">บริการของเรา</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-red-300 hover:text-red-700"
              >
                <ServiceIcon name={s.icon} boxed={false} className="size-5 shrink-0" />
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
