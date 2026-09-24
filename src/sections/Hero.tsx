import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

import { ButtonLink, Container } from "@/components/ui";
import { SERVICES } from "@/data/services";

/**
 * ส่วนหัวของหน้าแรก
 *
 * ⚠️ นี่คือส่วนที่วัด LCP (เวลาที่เนื้อหาชิ้นใหญ่สุดแสดงผล) — ตั้งใจใช้ข้อความล้วน
 *    ไม่มีรูปพื้นหลังขนาดใหญ่ จึงแสดงผลได้เกือบทันทีโดยไม่ต้องรอโหลดรูป
 *    ถ้าจะใส่รูปจริงภายหลัง ต้องใช้ next/image พร้อม priority และกำหนด sizes ให้ถูก
 *    ไม่งั้นคะแนน Performance จะตกทันทีจากจุดนี้จุดเดียว
 * ⚠️ h1 ต้องมีหน้าละหนึ่งอันเท่านั้น และต้องมีคำที่ลูกค้าค้นหาจริงอยู่ในนั้น
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white">
      {/* ลายเส้นตารางจางๆ เป็นพื้นหลัง — สื่อความเป็นงานเขียนแบบวิศวกรรมโดยไม่รบกวนการอ่าน
          ⚠️ เป็น CSS ล้วน ไม่ใช่ไฟล์รูป จึงไม่มีต้นทุนการโหลดเลย */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 40%, transparent 100%)",
        }}
      />

      <Container className="relative py-16 sm:py-20 lg:py-28">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-700 sm:text-sm">
            <ShieldCheck aria-hidden="true" className="size-4" />
            งานระบบความปลอดภัยและวิศวกรรมครบวงจร
          </p>

          <h1 className="mt-6 text-[1.75rem] leading-[1.25] font-bold text-slate-900 sm:text-4xl lg:text-[3.25rem] lg:leading-[1.15]">
            ออกแบบ ติดตั้ง และดูแลระบบ
            {/* ⚠️ เขียนเป็นประโยคปกติ "A, B, C และ D" โดยห่อแต่ละชื่อไม่ให้ตัดกลางคำ
                🐛 แบบแรกตัดเป็น "Access / Control" คนละบรรทัด · แบบที่สองใช้จุดคั่น แล้วพอขึ้น
                   บรรทัดใหม่ จุดไปขึ้นต้นบรรทัด ("• Access Control") ดูผิดที่ทุกความกว้างจอ
                ✅ ขึ้นบรรทัดหลังจุลภาคเป็นการเรียงพิมพ์ปกติ จึงดูถูกต้องไม่ว่าจะตัดตรงไหน */}
            <span className="mt-1 block text-red-600">
              {["Fire Alarm", "Fire Pump", "CCTV", "Access Control", "Network"].map((name, i, all) => (
                <span key={name}>
                  {i > 0 && (i === all.length - 1 ? " และ " : ", ")}
                  <span className="whitespace-nowrap">{name}</span>
                </span>
              ))}
            </span>
          </h1>

          {/* ✅ บริษัทสั่ง: "แสดงรายละเอียดให้มืออาชีพกว่านี้ ไม่ใช่แสดงแค่ระบบเดียว เอาสั้นๆ ได้ใจความ"
              ⚠️ ย่อหน้านี้ต้องพูดถึง "ทั้งบริษัท" ไม่ใช่ระบบใดระบบหนึ่ง — รายชื่อยี่ห้ออยู่ส่วน "ยี่ห้อ" ท้ายหน้าแล้ว
              ⚠️ ยาวไม่เกินสองบรรทัดบนจอใหญ่ — ส่วนหัวของหน้าแรกคือที่ที่คนอ่านน้อยที่สุด ตัดสินใจเร็วที่สุด */}
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            ดูแลครบทุกขั้นตอน ตั้งแต่สำรวจหน้างาน ออกแบบ ติดตั้ง ทดสอบ จนถึงบำรุงรักษา
            ให้ระบบพร้อมใช้งานจริงทุกวัน สำหรับโรงงาน หน่วยงานราชการ คลังสินค้า และอาคารพาณิชย์
          </p>

          {/* จุดเด่นสามข้อ — กวาดตาเดียวรู้ว่าต่างจากผู้รับเหมาทั่วไปตรงไหน
              ⚠️ ทุกข้อต้องเป็นเรื่องจริงที่บริษัทยืนยันแล้ว: ประสบการณ์ 10 ปี (บริษัทแจ้ง) ·
                 ปรึกษาฟรี (มีในเว็บเดิมของบริษัท) · รายงานผล/PM (ขอบเขตงานบริการจริง) */}
          <ul className="mt-5 grid gap-2 sm:grid-cols-3 sm:gap-4">
            {["ทีมวิศวกรประสบการณ์กว่า 10 ปี", "ให้คำปรึกษาก่อนตัดสินใจ ฟรี", "รายงานผลและบริการ PM หลังส่งมอบ"].map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-red-600" />
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/quotation" size="lg">
              ขอใบเสนอราคา
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary" size="lg">
              ปรึกษาทีมงาน
            </ButtonLink>
          </div>

          {/* ลิงก์ลัดไปบริการแต่ละตัว — ช่วยทั้งผู้ใช้และการเชื่อมโยงภายในเว็บสำหรับ SEO */}
          <nav aria-label="บริการหลัก" className="mt-10 border-t border-slate-200 pt-6">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">บริการของเรา</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  {/* ⚠️ ลิงก์ภายในต้องเป็น <Link> เสมอ — <a> ธรรมดาทำให้โหลดหน้าใหม่ทั้งหน้า
                      (ทิ้ง JS/CSS ที่โหลดไว้แล้ว) แทนที่จะสลับหน้าทันทีแบบ SPA */}
                  <Link
                    href={`/services/${s.slug}`}
                    prefetch={false}
                    className="text-sm font-medium text-slate-700 underline-offset-4 transition-colors hover:text-red-600 hover:underline"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </section>
  );
}
