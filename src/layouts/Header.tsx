"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";

import { ButtonLink, Container, cx } from "@/components/ui";
import { COMPANY } from "@/data/company";
import { MAIN_NAV } from "@/data/nav";

/**
 * แถบบนของทุกหน้า
 *
 * ⚠️ เป็น Client Component เพราะต้องรู้ตำแหน่งการเลื่อนและสถานะเปิด/ปิดเมนู
 *    แต่ตั้งใจให้เป็น "ไฟล์เดียวในหน้าที่ต้องส่ง JS ลงเบราว์เซอร์" — เนื้อหาทุกหน้าที่เหลือ
 *    เป็น Server Component ทั้งหมด เพื่อให้บันเดิลเล็กที่สุดเท่าที่ทำได้
 * ⚠️ ปุ่ม "ขอใบเสนอราคา" ต้องอยู่บนแถบบนทุกหน้า — เป็นสิ่งเดียวที่เราอยากให้ลูกค้าทำ
 *    และต้องอยู่ที่เดิมเสมอไม่ว่าอยู่หน้าไหน (การโต้ตอบที่คาดเดาได้)
 */
/**
 * ⚠️ รับเบอร์โทรและตัวเลือกเมนูเป็น props จาก layout (Server Component ที่ดึงข้อมูลจากหลังบ้าน)
 *    ไฟล์นี้เป็น Client Component จึงดึงข้อมูลจาก API เองไม่ได้โดยไม่เพิ่ม request ฝั่งเบราว์เซอร์
 */
export default function Header({ tel, telRaw, showArticles }: { tel: string; telRaw: string; showArticles: boolean }) {
  // ⚠️ ปิด "บทความ" จากหลังบ้านได้ — ตอนยังไม่มีบทความ เมนูที่พาไปหน้าว่างทำให้เว็บดูไม่เสร็จ
  const nav = MAIN_NAV.filter((i) => showArticles || i.href !== "/articles");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const services = nav.find((i) => i.children)?.children ?? [];

  // เปลี่ยนหน้าแล้วต้องปิดเมนูเสมอ ไม่งั้นเมนูค้างทับหน้าใหม่
  // ⚠️ ทำระหว่าง render (เทียบกับ path ก่อนหน้า) ไม่ใช่ใน useEffect — setState ใน effect ทำให้
  //    render ซ้อนสองรอบ และจะเห็นเมนูค้างอยู่หนึ่งเฟรมบนหน้าใหม่ก่อนหุบ
  //    (รูปแบบ "adjusting state when a prop changes" ตามเอกสาร React)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
    setServicesOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    // ⚠️ passive: true บอกเบราว์เซอร์ว่าตัวรับนี้ไม่ขัดการเลื่อน จึงไม่ต้องรอเราก่อนเลื่อนจอ
    //    ถ้าไม่ใส่ การเลื่อนบนมือถือจะกระตุกอย่างเห็นได้ชัด
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // เปิดเมนูมือถืออยู่ = ล็อกไม่ให้หน้าด้านหลังเลื่อนตาม
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // กด Esc ปิดทุกอย่าง — คนที่ใช้แป้นพิมพ์คาดหวังแบบนี้เสมอ
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMobileOpen(false);
      setServicesOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // คลิกนอกกรอบเมนูย่อย = ปิด
  useEffect(() => {
    if (!servicesOpen) return undefined;
    const onClick = (e: MouseEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [servicesOpen]);

  /**
   * ⚠️ "หน้านี้อยู่ตรงไหน" ต้องเทียบให้ถูก: หน้าแรกเทียบเท่ากันเป๊ะ ส่วนหน้าอื่นเทียบ
   *    เป็นคำนำหน้า เพื่อให้ /services/cctv ทำให้เมนู "บริการ" ติดสว่างด้วย
   *    ถ้าใช้ startsWith กับ "/" หน้าแรกจะติดสว่างตลอดเวลาทุกหน้า
   */
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // ชี้เมาส์เข้าเมนูย่อย: เปิดทันที · ออก: หน่วงนิดหนึ่งกันเมนูหุบตอนลากเมาส์ข้ามช่องว่าง
  const openServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const scheduleCloseServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 140);
  };

  return (
    <header
      data-no-print
      className={cx(
        "sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-[border-color,box-shadow] duration-200",
        scrolled ? "border-slate-200 shadow-sm" : "border-transparent",
      )}
    >
      {/* ✅ ลิงก์ข้ามไปเนื้อหา: มองไม่เห็นจนกว่าจะกด Tab — คนที่ใช้แป้นพิมพ์จะได้ไม่ต้อง
          กดผ่านเมนูทั้งแถบทุกครั้งที่เปลี่ยนหน้า */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-red-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        ข้ามไปยังเนื้อหาหลัก
      </a>

      <Container>
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          {/* ⚠️ โลโก้จริงของบริษัท (สร้างจาก scripts/make-brand.mjs) — ห้ามแทนด้วยไอคอนของแอป Flowix
              เว็บนี้เป็นของบริษัท ไม่เกี่ยวกับแอป
              ⚠️ priority = โหลดทันทีไม่รอ lazy เพราะอยู่บนสุดของทุกหน้า
              ⚠️ ใส่ width/height ตามสัดส่วนจริง (954x412) เสมอ ไม่งั้นหน้าจะกระตุกตอนรูปโหลดเสร็จ (CLS) */}
          <Link href="/" className="flex shrink-0 items-center" aria-label={`${COMPANY.nameTh} — หน้าแรก`}>
            <Image
              src="/brand/logo.png"
              alt={COMPANY.shortName}
              width={954}
              height={412}
              priority
              sizes="(min-width: 1024px) 104px, 88px"
              className="h-9 w-auto lg:h-11"
            />
          </Link>

          {/* ── เมนูจอใหญ่ ── */}
          <nav aria-label="เมนูหลัก" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) =>
              item.children ? (
                <div key={item.href} ref={servicesRef} className="relative" onMouseEnter={openServices} onMouseLeave={scheduleCloseServices}>
                  <button
                    type="button"
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    onClick={() => setServicesOpen((v) => !v)}
                    className={cx(
                      "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-medium transition-colors",
                      isActive(item.href) ? "text-red-600" : "text-slate-700 hover:text-slate-900",
                    )}
                  >
                    {item.label}
                    <ChevronDown aria-hidden="true" className={cx("size-4 transition-transform duration-200", servicesOpen && "rotate-180")} />
                  </button>

                  {servicesOpen && (
                    <div className="absolute top-full left-0 w-[30rem] pt-2">
                      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                        <Link
                          href={item.href}
                          className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                        >
                          ดูบริการทั้งหมด
                        </Link>
                        <div className="my-1 border-t border-slate-100" />
                        {services.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50"
                          >
                            <span className="block text-sm font-semibold text-slate-900">{child.label}</span>
                            <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{child.description}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cx(
                    "rounded-lg px-3 py-2 text-[15px] font-medium transition-colors",
                    isActive(item.href) ? "text-red-600" : "text-slate-700 hover:text-slate-900",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            {/* เบอร์โทรบนแถบบน — ลูกค้า B2B จำนวนมากโทรมากกว่ากรอกฟอร์ม
                ⚠️ ขึ้นเฉพาะเมื่อมีเบอร์จริง (ดู company.ts) */}
            {telRaw && (
              <a
                href={`tel:${telRaw}`}
                className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-red-600 xl:inline-flex"
              >
                <Phone aria-hidden="true" className="size-4" />
                {tel || telRaw}
              </a>
            )}
            <ButtonLink href="/quotation" className="hidden sm:inline-flex">
              ขอใบเสนอราคา
            </ButtonLink>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "ปิดเมนู" : "เปิดเมนู"}
              className="inline-flex size-11 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
            >
              {mobileOpen ? <X aria-hidden="true" className="size-6" /> : <Menu aria-hidden="true" className="size-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* ── เมนูมือถือ ── */}
      {mobileOpen && (
        <div id="mobile-menu" className="border-t border-slate-200 bg-white lg:hidden">
          {/* ⚠️ จำกัดความสูงแล้วให้เลื่อนภายใน — จอ 320px สูงไม่พอใส่ 6 เมนู + 6 บริการ + ปุ่ม
              ถ้าไม่จำกัด ปุ่มล่างสุดจะตกจอจนกดไม่ได้เลย */}
          <nav aria-label="เมนูหลัก (มือถือ)" className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain">
            <Container className="py-3">
              {nav.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cx(
                      "flex min-h-12 items-center rounded-lg px-3 text-[15px] font-semibold",
                      isActive(item.href) ? "text-red-600" : "text-slate-800",
                    )}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="mb-1 ml-3 border-l border-slate-200 pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex min-h-11 items-center rounded-lg px-3 text-sm text-slate-600"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-3 grid gap-2 border-t border-slate-200 pt-4 pb-2">
                <ButtonLink href="/quotation" size="lg">ขอใบเสนอราคา</ButtonLink>
                <ButtonLink href="/contact" variant="secondary" size="lg">ติดต่อเรา</ButtonLink>
              </div>
            </Container>
          </nav>
        </div>
      )}
    </header>
  );
}
