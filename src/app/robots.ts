import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

/**
 * robots.txt
 * ⚠️ ปิด /api/ ไว้เสมอ — ไม่มีอะไรให้เสิร์ชเอนจินเก็บ และกันบอทที่เคารพ robots.txt ยิงฟอร์ม
 * ⚠️ เว็บที่ยังไม่ได้ตั้ง NEXT_PUBLIC_SITE_URL (เช่น staging) จะบอกเสิร์ชเอนจินว่า "ห้ามเก็บทั้งเว็บ"
 *    กันเว็บทดสอบหลุดขึ้นผลค้นหาแล้วแย่งอันดับเว็บจริง (ปัญหาที่เจอบ่อยมากหลังเปิดเว็บใหม่)
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = Boolean(process.env.NEXT_PUBLIC_SITE_URL);
  if (!isProduction) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
