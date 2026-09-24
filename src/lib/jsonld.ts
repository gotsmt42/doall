import { COMPANY, contactChannels } from "@/data/company";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

/**
 * ข้อมูลโครงสร้าง (Schema.org / JSON-LD)
 *
 * ⚠️ นี่คือส่วนที่ทำให้ผลค้นหาแสดง "ชื่อบริษัท ที่อยู่ เบอร์โทร ดาว เมนูย่อย" แทนที่จะเป็น
 *    ลิงก์สีน้ำเงินเปล่าๆ — เป็นงาน SEO ที่ให้ผลจริงที่สุดต่อแรงที่ลงไป
 * ⚠️ ห้ามประกาศข้อมูลที่ไม่จริงลงในนี้เด็ดขาด (เช่น aggregateRating ปลอม หรือ award ที่ไม่มี)
 *    Google มีบทลงโทษเฉพาะสำหรับ structured data ที่ไม่ตรงกับเนื้อหาบนหน้า และโทษคือ
 *    ตัดผลลัพธ์พิเศษของทั้งเว็บทิ้ง ไม่ใช่แค่หน้านั้น
 * ⚠️ ทุกอย่างในนี้ต้อง "มีอยู่จริงบนหน้าเว็บด้วย" — structured data คือคำอธิบายของสิ่งที่
 *    ผู้ใช้เห็น ไม่ใช่ข้อมูลลับที่ส่งให้เสิร์ชเอนจินอย่างเดียว
 */

type Json = Record<string, unknown>;

const absolute = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

/** ตัวบริษัทเอง — ใส่ครั้งเดียวที่ layout หลัก ทุกหน้าจึงได้ไปด้วย */
export function organizationJsonLd(): Json {
  const channels = contactChannels();
  const sameAs = channels.filter((c) => c.external).map((c) => c.href);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: COMPANY.nameTh,
    alternateName: COMPANY.nameEn,
    url: SITE_URL,
    logo: absolute("/logo.png"),
    description: COMPANY.descriptionTh,
    taxID: COMPANY.taxId,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${COMPANY.address.street} ${COMPANY.address.subDistrict}`,
      addressLocality: COMPANY.address.district,
      addressRegion: COMPANY.address.province,
      postalCode: COMPANY.address.postalCode,
      addressCountry: COMPANY.address.country,
    },
    // ⚠️ ใส่เฉพาะช่องทางที่มีข้อมูลจริง — contactPoint ที่ไม่มีเบอร์คือ markup ที่ไม่ถูกต้อง
    ...(COMPANY.telRaw
      ? {
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: COMPANY.telRaw,
              contactType: "sales",
              areaServed: "TH",
              availableLanguage: ["th", "en"],
            },
          ],
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/**
 * ธุรกิจที่มีหน้าร้าน/สำนักงานจริง — ตัวที่ทำให้ขึ้นแผนที่และผลค้นหาแบบท้องถิ่น
 * ⚠️ แยกจาก Organization โดยตั้งใจ: Organization คือ "นิติบุคคล" ส่วนตัวนี้คือ "สถานที่ให้บริการ"
 *    ถ้ายุบรวมกัน ข้อมูลเวลาทำการกับพิกัดจะไปผูกกับนิติบุคคลซึ่งผิดความหมาย
 */
export function localBusinessJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#localbusiness`,
    name: COMPANY.nameTh,
    image: absolute("/og/default.png"),
    url: SITE_URL,
    ...(COMPANY.telRaw ? { telephone: COMPANY.telRaw } : {}),
    ...(COMPANY.email ? { email: COMPANY.email } : {}),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${COMPANY.address.street} ${COMPANY.address.subDistrict}`,
      addressLocality: COMPANY.address.district,
      addressRegion: COMPANY.address.province,
      postalCode: COMPANY.address.postalCode,
      addressCountry: COMPANY.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: COMPANY.address.lat, longitude: COMPANY.address.lng },
    areaServed: COMPANY.serviceAreas.map((a) => ({ "@type": "AdministrativeArea", name: a })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:30",
        closes: "17:30",
      },
    ],
  };
}

/** เว็บไซต์ + ช่องค้นหา (ทำให้ Google แสดงช่องค้นหาใต้ผลลัพธ์ของเว็บเราได้) */
export function webSiteJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "th-TH",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** เส้นทางนำทาง — ทำให้ผลค้นหาแสดง "หน้าแรก › บริการ › CCTV" แทน URL ยาวๆ */
export function breadcrumbJsonLd(items: { name: string; href: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absolute(item.href),
    })),
  };
}

/** หน้าบริการหนึ่งหน้า */
export function serviceJsonLd(input: {
  name: string;
  description: string;
  href: string;
  serviceTypes: readonly string[];
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absolute(input.href),
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: COMPANY.serviceAreas.map((a) => ({ "@type": "AdministrativeArea", name: a })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: input.name,
      itemListElement: input.serviceTypes.map((t) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: t },
      })),
    },
  };
}

/** บทความหนึ่งบทความ */
export function articleJsonLd(input: {
  title: string;
  description: string;
  href: string;
  publishedAt: string;
  updatedAt?: string;
  image?: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    inLanguage: "th-TH",
    datePublished: input.publishedAt,
    dateModified: input.updatedAt || input.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": absolute(input.href) },
    image: [absolute(input.image || "/og/default.png")],
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** คำถามที่พบบ่อย — มีโอกาสขึ้นเป็นรายการพับได้ใต้ผลค้นหา */
export function faqJsonLd(items: readonly { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
