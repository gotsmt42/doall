"use client";

import { useEffect, useRef } from "react";

import { Container } from "@/components/ui";

/**
 * ตัวเลขของบริษัทบนหน้าแรก พร้อมการนับขึ้น
 *
 * ⚠️ ตัวเลขเต็มถูกเขียนลง HTML ตั้งแต่แรกเสมอ (ดู <span className="sr-only"> ด้านล่าง)
 *    แล้วค่อยให้ส่วนที่นับขึ้นเป็นภาพประกอบซ้อนทับ — ถ้าทำกลับกัน เสิร์ชเอนจินและ
 *    โปรแกรมอ่านหน้าจอจะเห็นเลข 0 เพราะไม่ได้รันแอนิเมชัน
 * ⚠️ เริ่มนับเมื่อเลื่อนมาถึงเท่านั้น ไม่ใช่นับตั้งแต่โหลดหน้า ไม่งั้นคนที่เลื่อนลงมาทีหลัง
 *    จะเห็นแค่เลขนิ่งๆ แล้วไม่รู้ว่ามีแอนิเมชัน
 */
export default function Stats({ stats }: { stats: { value: number; suffix: string; label: string; note: string }[] }) {
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <Container className="py-12 sm:py-14">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            // ⚠️ <dl> ต้องเรียง <dt> ก่อน <dd> และห้ามมี <p> ปน (Lighthouse Accessibility ตัดคะแนน)
            //    ลำดับที่ตาเห็น (ตัวเลขก่อน) จัดด้วย CSS order แทนการสลับลำดับใน HTML
            <div key={s.label} data-reveal className="flex flex-col" style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}>
              <dt className="order-2 mt-2 text-sm font-semibold text-slate-900">{s.label}</dt>
              <dd className="order-1 text-3xl font-bold text-slate-900 tabular-nums sm:text-4xl">
                <CountUp to={s.value} />
                <span className="text-red-600">{s.suffix}</span>
              </dd>
              {s.note && <dd className="order-3 mt-1 text-xs leading-relaxed text-slate-500">{s.note}</dd>}
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/**
 * ⚠️ เขียนตัวเลขลง DOM ผ่าน ref ตรงๆ ไม่ใช้ state — แอนิเมชันเป็น "ระบบภายนอก" ของ React
 *    ถ้าใช้ setState จะ re-render คอมโพเนนต์ทุกเฟรม (~60 ครั้งต่อวินาทีต่อตัวเลข 4 ตัว)
 *    ทั้งที่สิ่งที่เปลี่ยนมีแค่ข้อความในแท็กเดียว
 * ⚠️ HTML ที่ server ส่งมาเป็นเลขเต็มเสมอ — ตั้งเป็น 0 ก็ต่อเมื่อเลื่อนมาเห็นแล้วและจะนับจริงเท่านั้น
 *    JS พัง/ปิด JS/ตั้งค่าลดการเคลื่อนไหว = เห็นเลขเต็มตลอด ไม่มีทางค้างที่ 0
 */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // คนที่ตั้งค่า "ลดการเคลื่อนไหว" ไว้ ต้องเห็นเลขเต็มทันที ไม่ต้องนับ
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    if (typeof IntersectionObserver === "undefined") return undefined;

    const format = (n: number) => n.toLocaleString("th-TH");
    let frame = 0;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();

        const DURATION = 1100;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / DURATION);
          const eased = 1 - Math.pow(1 - p, 3); // ชะลอตอนปลาย ให้จบนุ่มแทนการหยุดกึก
          el.textContent = format(Math.round(to * eased));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = format(to); // ออกจากหน้ากลางคัน — คืนเลขเต็มไว้เสมอ
    };
  }, [to]);

  return (
    <>
      {/* เลขจริงสำหรับโปรแกรมอ่านหน้าจอ — ไม่เปลี่ยนตามแอนิเมชัน จึงไม่ถูกอ่านซ้ำทุกเฟรม */}
      <span className="sr-only">{to}</span>
      <span ref={ref} aria-hidden="true">{to.toLocaleString("th-TH")}</span>
    </>
  );
}
