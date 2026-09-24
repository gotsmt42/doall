"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Mail, MessageCircle, Phone, Plus, X } from "lucide-react";

import { cx } from "@/components/ui";
import type { ContactChannel } from "@/data/company";

/**
 * ปุ่มลอยมุมขวาล่าง — ช่องทางติดต่อ + ปุ่มขึ้นบนสุด
 *
 * ⚠️ ถ้ายังไม่มีช่องทางติดต่อจริงสักช่อง จะไม่แสดงเมนูติดต่อเลย (เหลือแค่ปุ่มขึ้นบนสุด)
 *    ปุ่มลอยที่กดแล้วไม่มีอะไรให้ทำ แย่กว่าไม่มีปุ่ม
 * ⚠️ ต้องเผื่อระยะขอบล่างให้พ้นแถบนำทางของ iOS (env safe-area) ไม่งั้นปุ่มจะโดนแถบบัง
 *    บน iPhone ที่ไม่มีปุ่มโฮม
 */
export default function FloatingContact({ channels }: { channels: ContactChannel[] }) {
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const iconOf = (c: ContactChannel) =>
    c.key === "tel" ? Phone : c.key === "email" ? Mail : MessageCircle;

  return (
    <div
      data-no-print
      ref={wrapRef}
      className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="กลับขึ้นด้านบนสุด"
          className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition-colors hover:text-slate-900"
        >
          <ArrowUp aria-hidden="true" className="size-5" />
        </button>
      )}

      {channels.length > 0 && (
        <>
          {open && (
            <ul className="flex flex-col items-end gap-2">
              {channels.map((c) => {
                const Icon = iconOf(c);
                return (
                  <li key={c.key}>
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex min-h-11 items-center gap-2.5 rounded-full border border-slate-200 bg-white pr-4 pl-3 text-sm font-semibold text-slate-800 shadow-lg transition-colors hover:border-slate-300"
                    >
                      <Icon aria-hidden="true" className="size-4 text-red-600" />
                      {c.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "ปิดช่องทางติดต่อ" : "เปิดช่องทางติดต่อ"}
            className={cx(
              "grid size-14 place-items-center rounded-full text-white shadow-xl transition-colors",
              open ? "bg-slate-900 hover:bg-slate-800" : "bg-red-600 hover:bg-red-700",
            )}
          >
            {open ? <X aria-hidden="true" className="size-6" /> : <Plus aria-hidden="true" className="size-6" />}
          </button>
        </>
      )}
    </div>
  );
}
