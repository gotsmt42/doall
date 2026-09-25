import type { Metadata } from "next";

import { COMPANY } from "@/data/company";

/**
 * ตัวกลางสร้าง metadata ของทุกหน้า
 *
 * ⚠️ ทุกหน้าต้องเรียก pageMetadata() ห้ามเขียน export const metadata เองแบบดิบๆ
 *    เพราะ canonical, Open Graph, Twitter Card และ alternates ต้องมาครบทุกหน้าเสมอ
 *    หน้าที่ลืม canonical เพียงหน้าเดียว ก็ทำให้ Google เก็บ URL ซ้ำ (?utm_source=...)
 *    เป็นคนละหน้าแล้วคะแนนกระจายทันที
 */

/**
 * ⚠️ ต้องเป็น URL เต็มเสมอ — Next.js ใช้ค่านี้เป็นฐานของ canonical/OG ทั้งเว็บ
 *    ถ้าไม่ตั้ง NEXT_PUBLIC_SITE_URL ตอน build ลิงก์ OG จะกลายเป็น path เปล่าๆ
 *    ที่ Facebook/LINE ดึงรูปไม่ได้ (แชร์แล้วไม่ขึ้นรูป) — ค่า fallback ด้านล่างจึงมีไว้กันพัง
 *    ตอน dev เท่านั้น ไม่ใช่ค่าที่ควรได้ขึ้น production
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3200").replace(/\/+$/, "");

export const SITE_NAME = COMPANY.shortName;

/** ภาษาหลักของเว็บ — เปลี่ยนที่เดียวเมื่อเพิ่มภาษาอังกฤษภายหลัง (ดูหมายเหตุ i18n ท้ายไฟล์) */
export const SITE_LOCALE = "th_TH";

/** รูปที่ใช้ตอนแชร์ลิงก์ ถ้าหน้านั้นไม่ได้กำหนดรูปของตัวเอง */
const DEFAULT_OG = "/og/default.png";

type PageMetaInput = {
  title: string;
  description: string;
  /** path ที่ขึ้นต้นด้วย / เช่น "/services/cctv" — ห้ามใส่ URL เต็ม */
  path: string;
  /** คำค้นเฉพาะของหน้านั้น (จะถูกรวมกับคำค้นกลางของเว็บให้เอง) */
  keywords?: readonly string[];
  image?: string;
  /** true = บอกเสิร์ชเอนจินไม่ต้องเก็บหน้านี้ เช่น หน้าขอบคุณหลังส่งฟอร์ม */
  noIndex?: boolean;
  /** สำหรับหน้าบทความ — ทำให้ OG type เป็น article พร้อมวันที่ */
  article?: { publishedTime: string; modifiedTime?: string; authorName?: string; tags?: readonly string[] };
};

/**
 * คำค้นกลางที่ทุกหน้าควรติด — เป็นคำที่ลูกค้าไทยพิมพ์หาจริง
 * ⚠️ ผสมไทย-อังกฤษโดยตั้งใจ เพราะคนไทยค้นทั้งสองแบบ ("ติดตั้ง cctv" กับ "ระบบกล้องวงจรปิด")
 * ⚠️ keywords มีผลกับ Google น้อยมากแล้ว แต่ยังมีผลกับเสิร์ชอื่นและเครื่องมือภายในบางตัว
 *    น้ำหนักจริงอยู่ที่ title / h1 / เนื้อหา ซึ่งเขียนไว้ในไฟล์ data แต่ละชุด
 */
const BASE_KEYWORDS = [
  "ระบบ Fire Alarm",
  "ติดตั้ง Fire Alarm",
  "ระบบแจ้งเหตุเพลิงไหม้",
  "ติดตั้ง CCTV",
  "ระบบกล้องวงจรปิด",
  "Access Control",
  "ระบบควบคุมการเข้าออก",
  "ระบบป้องกันอัคคีภัย",
  "Fire Pump",
  "บำรุงรักษาระบบ",
  "PM CCTV",
  "PM Fire Alarm",
  "ระบบรักษาความปลอดภัย",
  "งานระบบวิศวกรรม",
  "รับเหมางานระบบ",
] as const;

export function pageMetadata(input: PageMetaInput): Metadata {
  const path = input.path === "/" ? "" : input.path.replace(/\/+$/, "");
  const url = `${SITE_URL}${path}`;
  const image = input.image || DEFAULT_OG;
  // ⚠️ ชื่อหน้าแรกไม่ต้องต่อท้ายชื่อเว็บซ้ำ — "DO ALL | DO ALL" อ่านแล้วเหมือนเว็บทำไม่เสร็จ
  const fullTitle = path === "" ? input.title : `${input.title} | ${SITE_NAME}`;

  return {
    /**
     * 🐛 ต้องเป็น absolute — layout หลักมี title.template "%s | ชื่อบริษัท" อยู่แล้ว ถ้าส่ง string ธรรมดา
     *    Next จะต่อท้ายซ้ำอีกรอบ ได้ "หัวข้อ | DO ALL ... | DO ALL ..." ทุกหน้าย่อย
     *    (ตรวจเจอจาก build จริง) — เปลืองพื้นที่ที่มีค่าที่สุดของผลค้นหา และดูเหมือนเว็บพัง
     */
    title: { absolute: fullTitle },
    description: input.description,
    keywords: [...(input.keywords || []), ...BASE_KEYWORDS],
    alternates: {
      canonical: url,
      /**
       * ⚠️ เตรียมช่องไว้สำหรับภาษาอังกฤษในอนาคต — ตอนนี้ชี้กลับมาที่ไทยทั้งคู่โดยตั้งใจ
       *    วันที่เพิ่ม /en ให้แก้ที่นี่ที่เดียว ทุกหน้าจะได้ hreflang ถูกต้องพร้อมกัน
       */
      languages: { "th-TH": url, "x-default": url },
    },
    robots: input.noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: {
      type: input.article ? "article" : "website",
      locale: SITE_LOCALE,
      siteName: SITE_NAME,
      title: fullTitle,
      description: input.description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
      ...(input.article
        ? {
            publishedTime: input.article.publishedTime,
            modifiedTime: input.article.modifiedTime || input.article.publishedTime,
            authors: input.article.authorName ? [input.article.authorName] : undefined,
            tags: input.article.tags ? [...input.article.tags] : undefined,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: input.description,
      images: [image],
    },
  };
}

/*
 * ── หมายเหตุสำหรับตอนเพิ่มภาษาอังกฤษ ───────────────────────────────────────
 * เว็บนี้ "แยกข้อความออกจากหน้าจอแล้วทั้งหมด" (ทุกข้อความอยู่ใน src/data/*.ts)
 * การเพิ่มภาษาอังกฤษจึงไม่ต้องรื้อคอมโพเนนต์เลยสักตัว ขั้นตอนคือ
 *   1. ย้ายทุกหน้าไปอยู่ใต้ src/app/[locale]/ แล้วตั้ง generateStaticParams เป็น ["th","en"]
 *   2. เปลี่ยน data ให้เป็น { th: ..., en: ... } แล้วเลือกตาม locale ที่ได้จาก params
 *   3. แก้ alternates.languages ด้านบนให้ชี้ /th กับ /en จริง
 * ⚠️ ห้ามเพิ่ม /en ก่อนจะมีเนื้อหาอังกฤษ "ครบทุกหน้า" — หน้าอังกฤษที่ยังเป็นภาษาไทยอยู่
 *    จะถูก Google มองว่าเป็นเนื้อหาซ้ำ แล้วฉุดอันดับของหน้าภาษาไทยที่ทำมาดีแล้วลงไปด้วย
 */
