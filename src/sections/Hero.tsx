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

      <Container className="relative py-12 sm:py-20 lg:py-28">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-700 sm:text-sm">
            <ShieldCheck aria-hidden="true" className="size-4" />
            ผู้รับเหมางานระบบอาคารครบวงจร
          </p>

          {/* ✅ บริษัทสั่ง (25 ก.ย. 2569): "หน้าแรกในมือถือดูรก" + "คำอธิบายไม่มืออาชีพ ให้ใช้สำหรับอาคารทุกขนาด"
              🐛 เดิม h1 ไล่ชื่อระบบ 6 ชื่อเป็นตัวแดงใหญ่ บนมือถือยาว 6 บรรทัดจนกินทั้งจอ
              ✅ h1 สั้นลงเหลือ "สิ่งที่เราทำ" · ชื่อระบบย้ายไปเป็นป้ายลิงก์เล็กใต้ย่อหน้า (ยังเป็นลิงก์ภายใน ช่วย SEO เหมือนเดิม)
              ⚠️ คำค้นชื่อระบบ (Fire Alarm, CCTV ...) ยังอยู่ใน <title> และคำอธิบายหน้าครบ ไม่เสียอันดับ */}
          <h1 className="mt-6 text-[1.9rem] leading-[1.25] font-bold text-slate-900 sm:text-4xl lg:text-[3.25rem] lg:leading-[1.15]">
            ออกแบบ ติดตั้ง และดูแล
            {/* ⚠️ ห่อเป็นสองวลีห้ามตัดกลาง — ภาษาไทยไม่มีช่องว่าง เบราว์เซอร์เคยตัดเป็น "…และความ / ปลอดภัยอาคาร" */}
            <span className="mt-1 block text-red-600">
              <span className="whitespace-nowrap">งานระบบป้องกันอัคคีภัย</span>{" "}
              <span className="whitespace-nowrap">และความปลอดภัยอาคาร</span>
            </span>
          </h1>

          {/* ⚠️ พูดถึง "ทั้งบริษัท" และ "อาคารทุกขนาด" (บริษัทสั่ง) — ไม่ไล่ประเภทลูกค้าเป็นรายการยาว */}
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:mt-6 sm:text-lg">
            บริการครบวงจรสำหรับอาคารทุกขนาด ตั้งแต่สำรวจ ออกแบบ ติดตั้ง ทดสอบ
            จนถึงบำรุงรักษา โดยทีมวิศวกรผู้เชี่ยวชาญ
          </p>

          {/* ระบบที่ให้บริการ — ป้ายลิงก์เล็ก กวาดตาเดียวเห็นครบ และเป็นลิงก์ภายในเว็บสำหรับ SEO */}
          <nav aria-label="ระบบที่ให้บริการ" className="mt-6">
            <ul className="flex flex-wrap gap-2">
              {SERVICES.filter((s) => s.slug !== "maintenance").map((s) => (
                <li key={s.slug}>
                  {/* ⚠️ ลิงก์ภายในต้องเป็น <Link> เสมอ — <a> ธรรมดาทำให้โหลดหน้าใหม่ทั้งหน้า */}
                  <Link
                    href={`/services/${s.slug}`}
                    prefetch={false}
                    className="inline-flex min-h-9 items-center rounded-full border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ปุ่มสองปุ่มวางคู่กันตั้งแต่มือถือ — ไม่ต้องเลื่อนลงไปหาปุ่มที่สอง */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:flex">
            <ButtonLink href="/quotation" size="lg" className="px-4 whitespace-nowrap">
              ขอใบเสนอราคา
              <ArrowRight aria-hidden="true" className="hidden size-4 sm:block" />
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary" size="lg" className="px-4 whitespace-nowrap">
              ปรึกษาทีมงาน
            </ButtonLink>
          </div>

          {/* จุดเด่นสามข้อ — ย้ายมาใต้ปุ่มเป็นแถบเล็ก ให้ปุ่มขึ้นมาอยู่ในจอแรกของมือถือ
              ⚠️ ทุกข้อต้องเป็นเรื่องจริงที่บริษัทยืนยันแล้ว: ประสบการณ์ 10 ปี (บริษัทแจ้ง) ·
                 ปรึกษาฟรี (มีในเว็บเดิมของบริษัท) · รายงานผล/PM (ขอบเขตงานบริการจริง) */}
          <ul className="mt-8 grid gap-2 border-t border-slate-200 pt-6 sm:grid-cols-3 sm:gap-4">
            {["ทีมวิศวกรประสบการณ์กว่า 10 ปี", "ให้คำปรึกษาก่อนตัดสินใจ ฟรี", "รายงานผลและบริการ PM หลังส่งมอบ"].map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-red-600" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
