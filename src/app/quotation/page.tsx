import { ClipboardList, FileSearch, PhoneCall } from "lucide-react";

import LeadForm from "@/components/LeadForm";
import { Card, Container, Section } from "@/components/ui";
import { SERVICES, serviceOptions } from "@/data/services";
import Breadcrumb, { PageHeader } from "@/layouts/Breadcrumb";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "ขอใบเสนอราคา — งานระบบ Fire Alarm, CCTV, Access Control, Network",
  description:
    "ขอใบเสนอราคางานติดตั้งและบำรุงรักษาระบบ Fire Alarm, CCTV, Access Control, Network และ Fire Pump " +
    "แนบแบบหรือรูปหน้างานได้ ทีมงานติดต่อกลับเพื่อประเมินงานภายในวันทำการถัดไป",
  path: "/quotation",
  keywords: ["ขอใบเสนอราคา fire alarm", "ราคาติดตั้ง cctv", "ใบเสนอราคางานระบบ"],
});

const NEXT_STEPS = [
  { icon: PhoneCall, title: "ติดต่อกลับ", detail: "ทีมงานโทรสอบถามรายละเอียดเพิ่มเติมภายในวันทำการถัดไป" },
  { icon: FileSearch, title: "สำรวจหน้างาน", detail: "นัดเข้าดูพื้นที่จริงเพื่อประเมินงานให้ถูกต้อง" },
  { icon: ClipboardList, title: "เสนอราคา", detail: "ใบเสนอราคาระบุขอบเขตงาน อุปกรณ์ ระยะเวลา และการรับประกันชัดเจน" },
] as const;

type Props = { searchParams: Promise<{ service?: string; product?: string }> };

/**
 * ⚠️ รับ ?service= (จากปุ่มในหน้าบริการ) และ ?product= (จากปุ่มในหน้าสินค้า) มาเติมฟอร์มให้
 *    ลูกค้าไม่ต้องเลือกซ้ำสิ่งที่เพิ่งกดมา — ลดขั้นตอนตรงจุดที่คนออกจากฟอร์มมากที่สุด
 * ⚠️ ค่า service ที่ไม่ตรงกับบริการจริงจะถูกทิ้ง ไม่ส่งค่ามั่วเข้าฟอร์ม
 * ⚠️ Next.js 16: searchParams เป็น Promise ต้อง await
 */
export default async function QuotationPage({ searchParams }: Props) {
  const { service, product } = await searchParams;
  const defaultService = SERVICES.some((s) => s.slug === service) ? String(service) : "";
  const defaultDetails = product ? `สนใจสินค้า: ${String(product).slice(0, 150)}\n` : "";

  return (
    <>
      <Breadcrumb items={[{ name: "ขอใบเสนอราคา", href: "/quotation" }]} />
      <PageHeader
        eyebrow="ขอใบเสนอราคา"
        title="เล่ารายละเอียดงาน แล้วเราจะประเมินให้"
        description="ยิ่งให้ข้อมูลมาก เราก็ประเมินได้แม่นขึ้น แต่ถ้ายังไม่แน่ใจรายละเอียด กรอกเท่าที่ทราบก่อนได้ ทีมงานจะช่วยสอบถามต่อ"
      />
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="min-w-0 lg:col-span-8">
              <LeadForm
                kind="quotation"
                serviceOptions={serviceOptions()}
                defaultService={defaultService}
                defaultDetails={defaultDetails}
              />
            </div>
            <aside className="min-w-0 lg:col-span-4">
              <Card className="p-6 lg:sticky lg:top-24">
                <h2 className="text-base font-bold">หลังจากส่งคำขอ</h2>
                <ol className="mt-5 space-y-5">
                  {NEXT_STEPS.map((s, i) => (
                    <li key={s.title} className="flex gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
                        <s.icon aria-hidden="true" className="size-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-slate-900">{i + 1}. {s.title}</span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-slate-600">{s.detail}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </Card>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
