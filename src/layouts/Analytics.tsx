"use client";

import Link from "next/link";
import Script from "next/script";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui";

/**
 * เครื่องมือวัดผล + แถบขอความยินยอมคุกกี้
 *
 * 🐛 เดิมโหลด Google Analytics / Meta Pixel ทันทีที่เปิดหน้า — ตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล
 *    คุกกี้ที่ไม่จำเป็นต่อการทำงานของเว็บ (วัดผล/การตลาด) ต้องได้รับความยินยอมก่อน
 *    ✅ ตอนนี้โหลดเฉพาะหลังผู้ใช้กด "ยอมรับ" เท่านั้น
 * ⚠️ ไม่ได้ตั้งรหัสวัดผลใน env = ไม่มีทั้งสคริปต์และแถบขอความยินยอม (ไม่มีอะไรให้ขอ)
 *    เว็บนี้ไม่มีคุกกี้ที่จำเป็นอื่นเลย จึงไม่ต้องขอความยินยอมในกรณีนั้น
 * ⚠️ ตัวเลือกเก็บใน localStorage ของเครื่องผู้ใช้ — ห่อด้วย try/catch เสมอ เพราะโหมดส่วนตัว
 *    ของบางเบราว์เซอร์โยน error ตอนเขียน localStorage
 */

const KEY = "cookie-consent";
type Consent = "granted" | "denied" | null;

const listeners = new Set<() => void>();
const read = (): Consent => {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
};
const write = (v: Exclude<Consent, null>) => {
  try { localStorage.setItem(KEY, v); } catch { /* โหมดส่วนตัว — ใช้ค่าในหน่วยความจำพอ */ }
  memory = v;
  listeners.forEach((l) => l());
};
let memory: Consent = null;
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
const getSnapshot = () => read() ?? memory;
/** ⚠️ ฝั่ง server ถือว่า "ยังไม่รู้" เสมอ และไม่แสดงแถบ — กันแถบกะพริบโผล่แล้วหายตอน hydrate */
const getServerSnapshot = (): Consent | "unknown" => "unknown";

export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!gaId && !pixelId) return null;

  if (consent === "granted") {
    return (
      <>
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
        {pixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${pixelId}');fbq('track','PageView');`}
          </Script>
        )}
      </>
    );
  }

  if (consent !== null) return null; // "denied" หรือ "unknown" (ตอน server เรนเดอร์)

  return (
    <div
      role="region"
      aria-label="การใช้คุกกี้"
      data-no-print
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/98 shadow-[0_-8px_24px_rgb(15_23_42/0.08)] backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm leading-relaxed text-slate-700">
          เราใช้คุกกี้เพื่อวัดผลการใช้งานและปรับปรุงเว็บไซต์ เฉพาะเมื่อท่านยินยอม{" "}
          <Link href="/cookies" className="font-semibold text-red-700 underline underline-offset-2">อ่านนโยบายคุกกี้</Link>
        </p>
        <div className="flex shrink-0 gap-2">
          {/* ⚠️ ปุ่มปฏิเสธต้องเห็นชัดเท่าปุ่มยอมรับ — การทำให้ปฏิเสธยากกว่า ขัดหลักความยินยอมโดยสมัครใจ */}
          <Button variant="secondary" onClick={() => write("denied")}>ปฏิเสธ</Button>
          <Button onClick={() => write("granted")}>ยอมรับ</Button>
        </div>
      </div>
    </div>
  );
}
