"use client";

import { useEffect } from "react";

/**
 * ทำให้ส่วนที่ติด data-reveal ค่อยๆ โผล่ขึ้นมาตอนเลื่อนถึง
 *
 * ⚠️ ตั้งใจไม่ใช้ไลบรารีแอนิเมชัน — งานนี้ต้องการแค่ "โผล่ตอนเลื่อนถึง" อย่างเดียว
 *    ซึ่ง IntersectionObserver + CSS transition ทำได้ครบ โดยไม่เพิ่มบันเดิลเลย
 *    (framer-motion กินราว 40 kB ซึ่งมีผลกับคะแนน Performance จริง)
 * ⚠️ เนื้อหาทั้งหมดอยู่ใน HTML ตั้งแต่แรกอยู่แล้ว ตัวนี้แค่เปลี่ยน opacity —
 *    เสิร์ชเอนจินอ่านครบเสมอ และคนที่ตั้งค่าลดการเคลื่อนไหวจะเห็นทันที (ดู globals.css)
 *
 * 🐛 กันเนื้อหาค้างโปร่งใส: IntersectionObserver แจ้งเฉพาะตอน "ข้ามเส้น" เท่านั้น
 *    ถ้าผู้ใช้ปัดจอเร็วจนชิ้นหนึ่งผ่านจอไปทั้งชิ้นระหว่างสองเฟรม (ปัดแรงบนมือถือ, กด End,
 *    เบราว์เซอร์คืนตำแหน่งเลื่อนเดิมตอนรีเฟรช) จะไม่มีการแจ้งเลย แล้วชิ้นนั้นค้างโปร่งใสตลอด
 *    — ตรวจเจอจริงตอนทดสอบ: เลื่อนเร็วจนสุดหน้า ค้างอยู่ 17 จาก 24 ชิ้น
 *    ✅ ตาข่ายรองรับ: ตอนเลื่อน (จำกัดเฟรมละครั้ง) อะไรที่อยู่ในจอหรือเลยขึ้นไปแล้ว ต้องโผล่ทั้งหมด
 */
export default function Reveal() {
  useEffect(() => {
    const pending = new Set<Element>();
    const show = (el: Element) => {
      el.classList.add("is-visible");
      pending.delete(el);
      io?.unobserve(el);
    };

    const io =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) show(e.target); }),
            { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
          );

    const scan = () => {
      document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => {
        if (pending.has(el)) return;
        pending.add(el);
        io?.observe(el);
      });
      sweep();
    };

    // ตาข่ายรองรับ — ไม่มี IntersectionObserver (เบราว์เซอร์เก่ามาก) ก็ยังโผล่ครบด้วยตัวนี้
    const sweep = () => {
      const limit = window.innerHeight * 0.95;
      pending.forEach((el) => { if (el.getBoundingClientRect().top < limit) show(el); });
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; sweep(); });
    };

    scan();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // ⚠️ ต้องเฝ้าดูของที่เพิ่มเข้ามาภายหลังด้วย (เช่นการ์ดที่เพิ่งกรองขึ้นมาในหน้าผลงาน/สินค้า)
    //    ไม่งั้นการ์ดชุดใหม่จะค้างโปร่งใสตลอดไป
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io?.disconnect();
      mo.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
