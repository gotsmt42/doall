import { ClipboardCheck, FileText, Headset, PackageCheck, Ruler, ShieldCheck, Users, Wrench } from "lucide-react";

import { Container, Section, SectionHeading } from "@/components/ui";

/**
 * จุดเด่นของบริษัท
 *
 * ⚠️ เขียนเป็น "สิ่งที่ลูกค้าได้" ไม่ใช่ "สิ่งที่เราภูมิใจ" — ประโยคอย่าง "เรามุ่งมั่นพัฒนา
 *    อย่างไม่หยุดยั้ง" ไม่ได้บอกอะไรกับคนที่กำลังเลือกผู้รับเหมา และเป็นสัญญาณแรกที่ทำให้
 *    เว็บดูเหมือนเทมเพลตสำเร็จรูป ทุกข้อในนี้จึงต้องตรวจสอบได้หรือเห็นผลจริงตอนทำงาน
 */
const POINTS = [
  { icon: Users, title: "ทีมช่างที่มีประสบการณ์", detail: "ทีมที่ทำงานระบบความปลอดภัยเป็นหลัก ไม่ใช่ทีมรับเหมาทั่วไปที่รับงานระบบเป็นงานเสริม" },
  { icon: Ruler, title: "ออกแบบจากหน้างานจริง", detail: "เข้าสำรวจก่อนเสนอราคาเสมอ ไม่ประเมินจากแบบอย่างเดียว ลดงานเพิ่มระหว่างทาง" },
  { icon: PackageCheck, title: "อุปกรณ์ที่มีมาตรฐานรองรับ", detail: "เลือกอุปกรณ์ที่มีเอกสารรับรองและหาอะไหล่ทดแทนได้ ไม่ใช่ของที่ถูกที่สุดแล้วซ่อมไม่ได้" },
  { icon: FileText, title: "มีเอกสารและรายงานครบ", detail: "ส่งมอบแบบ As-built รายงานผลทดสอบ และรายงาน PM ทุกครั้ง ใช้ยื่นตรวจอาคารได้ทันที" },
  { icon: ShieldCheck, title: "รับประกันงานติดตั้ง", detail: "ระบุเงื่อนไขและระยะเวลารับประกันไว้ในใบเสนอราคาตั้งแต่ต้น ไม่ใช่มาตกลงกันทีหลัง" },
  { icon: Wrench, title: "มีบริการบำรุงรักษาต่อเนื่อง", detail: "ดูแลตามรอบพร้อมรายงาน ทั้งระบบที่เราติดตั้งเองและระบบที่ติดตั้งโดยผู้รับเหมารายอื่น" },
  { icon: ClipboardCheck, title: "ให้คำปรึกษาก่อนตัดสินใจ", detail: "บอกตรงไปตรงมาว่าส่วนไหนจำเป็นและส่วนไหนยังรอได้ ไม่เสนอเกินความต้องการจริง" },
  { icon: Headset, title: "ติดต่อได้เมื่อเกิดเหตุ", detail: "ลูกค้าในสัญญาบำรุงรักษาติดต่อทีมได้นอกเวลาทำการสำหรับงานฉุกเฉินของระบบความปลอดภัย" },
] as const;

export default function WhyUs() {
  return (
    <Section tone="subtle">
      <Container>
        <SectionHeading
          eyebrow="ทำไมต้องเลือกเรา"
          title="สิ่งที่ลูกค้าได้จากการทำงานกับเรา"
          description="เกณฑ์ที่เจ้าของอาคารและผู้จัดการโครงการใช้ตัดสินใจจริงเวลาคัดเลือกผู้รับเหมางานระบบ"
        />

        <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((p, i) => (
            <li key={p.title} data-reveal style={{ "--reveal-delay": `${(i % 4) * 60}ms` } as React.CSSProperties}>
              <p.icon aria-hidden="true" className="size-6 text-red-600" />
              <h3 className="mt-4 text-base font-bold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.detail}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
