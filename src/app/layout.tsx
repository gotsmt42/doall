import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";

import { JsonLd } from "@/components/ui";
import { COMPANY } from "@/data/company";
import Analytics from "@/layouts/Analytics";
import FloatingContact from "@/layouts/FloatingContact";
import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import Reveal from "@/layouts/Reveal";
import { localBusinessJsonLd, organizationJsonLd, webSiteJsonLd } from "@/lib/jsonld";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import "@/styles/globals.css";

/**
 * ⚠️ ฟอนต์ต้องโหลดผ่าน next/font เท่านั้น ห้าม @import จาก Google Fonts ใน CSS
 *    next/font จะดาวน์โหลดไฟล์ฟอนต์มาเสิร์ฟจากโดเมนเราเอง ทำให้ไม่มี request ไปโดเมนอื่น
 *    ที่บล็อกการเรนเดอร์ (มีผลกับ LCP โดยตรง) และไม่มีการส่งข้อมูลผู้ใช้ไป Google ด้วย
 * ⚠️ IBM Plex Sans Thai รองรับทั้งไทยและละตินในครอบครัวเดียว — ไม่ต้องโหลดฟอนต์อังกฤษ
 *    อีกชุด และตัวเลขไทย/อารบิกอยู่ในความกว้างเดียวกัน ตารางตัวเลขจึงไม่เต้น
 * ⚠️ display:"swap" = แสดงฟอนต์สำรองไปก่อนระหว่างรอ ไม่ปล่อยให้ข้อความหายไปเฉยๆ
 */
const plexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plex-thai",
  preload: true,
});

export const metadata: Metadata = {
  // ⚠️ metadataBase ทำให้ทุก URL ใน OG/canonical กลายเป็น URL เต็มอัตโนมัติ
  //    ไม่มีตัวนี้ Facebook/LINE จะดึงรูปตอนแชร์ไม่ได้เพราะได้ path เปล่า
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${COMPANY.tagline}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: COMPANY.descriptionTh,
  applicationName: SITE_NAME,
  authors: [{ name: COMPANY.nameEn }],
  creator: COMPANY.nameEn,
  publisher: COMPANY.nameEn,
  formatDetection: { telephone: true, address: false, email: false },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  // ⚠️ ค่านี้มาจาก Google Search Console — ไม่ตั้ง env ก็ไม่ต้องใส่ meta tag
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // ⚠️ ห้ามตั้ง maximumScale หรือ userScalable:false — เป็นการห้ามคนสายตาไม่ดีซูมอ่าน
  //    และทำให้ตกเกณฑ์ Accessibility ทันที
  themeColor: "#dc2626",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // ⚠️ data-scroll-behavior="smooth" จำเป็นใน Next.js 16 — globals.css ตั้ง scroll-behavior:smooth
    //    ไว้ให้ลิงก์ #anchor ในหน้าเดียวกันเลื่อนนุ่ม แต่ตั้งแต่ v16 Next จะ "ไม่" ปิดมันให้ตอน
    //    เปลี่ยนหน้าแล้ว ถ้าไม่มี attribute นี้ ทุกครั้งที่กดเมนูจอจะค่อยๆ ไหลขึ้นบนแทนที่จะไปทันที
    //    ซึ่งรู้สึกเหมือนเว็บหน่วง (ดู node_modules/next/dist/docs/.../upgrading/version-16.md)
    <html lang="th" className={plexThai.variable} data-scroll-behavior="smooth">
      <body className="flex min-h-dvh flex-col">
        {/* ⚠️ ข้อมูลโครงสร้างระดับเว็บใส่ครั้งเดียวที่นี่ ทุกหน้าจึงได้ไปด้วย
            หน้าย่อยเพิ่มเฉพาะของตัวเอง (Service / Article / Breadcrumb) */}
        <JsonLd data={[organizationJsonLd(), localBusinessJsonLd(), webSiteJsonLd()]} />

        <Header />
        {/* ⚠️ id="main" คือปลายทางของลิงก์ "ข้ามไปยังเนื้อหาหลัก" บนแถบบน */}
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />

        <FloatingContact />
        <Reveal />
        <Analytics />
      </body>
    </html>
  );
}
