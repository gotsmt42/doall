import { cache } from "react";

import { ARTICLES, type Article, type ArticleBlock } from "@/data/articles";
import { BRANDS, logoFor, type Brand } from "@/data/brands";
import { COMPANY, type ContactInfo } from "@/data/company";
import { PRODUCTS, type Product, type ProductCategory } from "@/data/products";
import { PROJECTS, type Project } from "@/data/projects";

/**
 * แหล่งเนื้อหาของเว็บ — ดึงจากระบบหลังบ้าน (da-app-server: GET /api/web/content)
 *
 * ✅ ผู้ดูแลแก้สินค้า/ผลงาน/บทความ/การแสดงผลในแอป da-app → server สั่งเว็บดึงใหม่ทันที
 *    (POST /api/revalidate) → หน้าเว็บเปลี่ยนภายในไม่กี่วินาทีโดยไม่ต้อง deploy ใหม่
 * ⚠️ ระบบหลังบ้านล่ม/ช้า = ใช้เนื้อหาตั้งต้นที่ติดมากับโค้ด (src/data/*) แทน — เว็บต้องไม่มีวันขึ้นหน้าว่าง
 *    หรือ build ไม่ผ่านเพราะ API ล่ม (ผลงานไม่มีเนื้อหาตั้งต้น — ดูเหตุผลที่ data/projects.ts)
 * ⚠️ ดึงก้อนเดียวต่อรอบ และ React cache() ทำให้ทุก component ในหน้าเดียวกันใช้ผลเดียวกัน
 *    (layout + page + footer เรียกซ้ำกี่ครั้งก็ยิง API ครั้งเดียว)
 */

export const CONTENT_TAG = "web-content";

/** อัปเดตเองทุก 5 นาทีแม้ไม่มีคนสั่ง — กันกรณีคำสั่งดึงใหม่จาก server ตกหล่น */
// ✅ ลดจาก 5 นาทีเหลือ 1 นาที (25 ก.ย. 2569) — ผู้ใช้เห็นข้อมูลเก่าค้างหลัง deploy server ใหม่
//    (บันทึกจากหลังบ้านยังสั่งอัปเดตทันทีเหมือนเดิม ตัวนี้คือตาข่ายรองรับกรณีสั่งไม่ถึง)
const REVALIDATE_SECONDS = 60;

export type SiteSettings = {
  stats: { value: number; suffix: string; label: string; note: string }[];
  showStats: boolean;
  showProjects: boolean;
  showBrands: boolean;
  showArticles: boolean;
  businessHoursWeekdays: string;
  businessHoursSaturday: string;
  businessHoursClosed: string;
  emergencyNote: string;
  serviceAreas: string[];
  announcement: string;
  /** รูปของแต่ละบริการที่อัปจากหลังบ้าน — ไม่มี = ใช้ภาพประกอบที่ติดมากับเว็บ (ดู lib/service-image.ts) */
  serviceImages: { slug: string; src: string; width: number; height: number; alt: string }[];
};

export type SiteContact = ContactInfo;

export type SiteContent = {
  /** "cms" = ข้อมูลจากหลังบ้าน · "fallback" = เนื้อหาตั้งต้นในโค้ด (หลังบ้านไม่ตอบ) */
  source: "cms" | "fallback";
  products: Product[];
  projects: Project[];
  articles: Article[];
  brands: Brand[];
  settings: SiteSettings;
  contact: SiteContact;
};

const FALLBACK_SETTINGS: SiteSettings = {
  stats: COMPANY.stats.map((s) => ({ ...s })),
  showStats: true,
  showProjects: true,
  showBrands: true,
  showArticles: true,
  businessHoursWeekdays: COMPANY.businessHours.weekdays,
  businessHoursSaturday: COMPANY.businessHours.saturday,
  businessHoursClosed: COMPANY.businessHours.closed,
  emergencyNote: COMPANY.businessHours.emergencyNote,
  serviceAreas: [...COMPANY.serviceAreas],
  announcement: "",
  serviceImages: [],
};

const FALLBACK_CONTACT: SiteContact = {
  tel: COMPANY.tel,
  telRaw: COMPANY.telRaw,
  hotline: COMPANY.hotline,
  hotlineRaw: COMPANY.hotline.replace(/[^\d+]/g, ""),
  email: COMPANY.email,
  lineUrl: COMPANY.lineUrl,
  facebookUrl: COMPANY.facebookUrl,
};

const fallback = (): SiteContent => ({
  source: "fallback",
  products: [...PRODUCTS],
  projects: [...PROJECTS],
  articles: [...ARTICLES],
  brands: [...BRANDS],
  settings: FALLBACK_SETTINGS,
  contact: FALLBACK_CONTACT,
});

/* ── แปลงรูปข้อมูลจาก API ให้ตรงกับชนิดที่หน้าเว็บใช้ ───────────────────── */

type ApiImage = { url: string; width?: number; height?: number; alt?: string } | undefined;
const toImage = (i: ApiImage, fallbackAlt: string) =>
  i?.url ? { src: i.url, alt: i.alt || fallbackAlt, width: i.width || 0, height: i.height || 0 } : null;

const isoDate = (v: unknown) => (v ? new Date(String(v)).toISOString().slice(0, 10) : "");
const str = (v: unknown) => (typeof v === "string" ? v : "");

/** เบอร์ที่กดโทรได้ — ตัดทุกอย่างที่ไม่ใช่ตัวเลข/+ ออก */
const telOnly = (v: string) => v.replace(/[^\d+]/g, "");

/* eslint-disable @typescript-eslint/no-explicit-any -- ข้อมูลจาก API ภายนอก ตรวจทีละช่องด้านล่างอยู่แล้ว */
function normalize(data: any): SiteContent {
  const products: Product[] = (data.products || []).map((p: any) => ({
    id: str(p.id),
    category: p.category as ProductCategory,
    type: str(p.type),
    name: str(p.name),
    brand: str(p.brand),
    model: str(p.model),
    description: str(p.description),
    specs: Array.isArray(p.specs) ? p.specs.map((s: any) => ({ label: str(s.label), value: str(s.value) })) : [],
    datasheet: str(p.datasheet),
    images: (p.images || []).map((i: ApiImage) => toImage(i, str(p.name))).filter(Boolean),
  }));

  const projects: Project[] = (data.projects || []).map((p: any) => {
    const completedAt = isoDate(p.completedAt);
    return {
      slug: str(p.slug),
      title: str(p.title),
      customer: str(p.customer),
      location: str(p.location),
      systems: Array.isArray(p.systems) ? p.systems.map(String) : [],
      year: completedAt ? Number(completedAt.slice(0, 4)) + 543 : 0,
      completedAt,
      summary: str(p.summary),
      scope: Array.isArray(p.scope) ? p.scope.map(String) : [],
      challenge: str(p.challenge),
      solution: str(p.solution),
      result: str(p.result),
      images: (p.images || []).map((i: ApiImage) => toImage(i, str(p.title))).filter(Boolean),
    };
  });

  const articles: Article[] = (data.articles || []).map((a: any) => ({
    slug: str(a.slug),
    title: str(a.title),
    description: str(a.description),
    category: str(a.category),
    relatedService: str(a.relatedService),
    keywords: Array.isArray(a.keywords) ? a.keywords.map(String) : [],
    publishedAt: isoDate(a.publishedAt),
    updatedAt: isoDate(a.updatedAt) || undefined,
    cover: toImage(a.cover, str(a.title)) ?? undefined,
    /**
     * ⚠️ บล็อกรูปต้องแปลง url → src ให้เหมือนรูปอื่นทั้งเว็บก่อน (API ส่ง url มาตรงจากฐานข้อมูล)
     * บล็อกรูปที่ยังไม่ได้อัปรูป (image ว่าง) ถูกตัดทิ้ง — ไม่งั้นหน้าเว็บจะมีกรอบรูปเปล่าค้างอยู่
     */
    body: (a.body || []).flatMap((b: any) => {
      if (b?.type !== "image") return [b as ArticleBlock];
      const image = toImage(b.image, str(a.title));
      return image ? [{ type: "image", image, caption: str(b.caption) } as ArticleBlock] : [];
    }),
  }));

  const s = data.settings || {};
  const c = data.contact || {};
  /**
   * ⚠️ ช่องทางติดต่อ: ค่าจากหลังบ้าน (ตั้งค่าองค์กร) ชนะ ถ้าว่างใช้ค่าในโค้ด
   * 🐛 ตรวจรูปแบบทุกช่องก่อนใช้ — เคยเจอลิงก์เว็บไซต์ถูกกรอกลงช่องอีเมล (https://doall.vercel.app)
   *    เว็บเลยได้ปุ่ม mailto:https://... ที่กดแล้วส่งอีเมลไม่ได้ ค่าที่ผิดรูปแบบถือว่า "ไม่มี" ดีกว่าปุ่มพัง
   */
  const validEmail = (v: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? v : "");
  const validUrl = (v: string) => (/^https?:\/\/\S+$/i.test(v) ? v : "");
  const validTel = (v: string) => (telOnly(v).replace(/\D/g, "").length >= 9 ? v : "");
  const tel = validTel(str(c.tel)) || FALLBACK_CONTACT.tel;
  return {
    source: "cms",
    products,
    projects,
    articles,
    /** โลโก้: ที่อัปจากหลังบ้านชนะ ไม่มีก็ใช้ไฟล์ตั้งต้นในโค้ดตามชื่อ ไม่มีทั้งคู่ = แสดงเป็นชื่อตัวอักษร */
    brands: (data.brands || []).map((b: any) => ({
      name: str(b.name),
      category: str(b.category),
      featured: Boolean(b.featured),
      logo: validUrl(str(b.logo?.url)) && b.logo.width && b.logo.height
        ? { src: b.logo.url, width: Number(b.logo.width), height: Number(b.logo.height) }
        : logoFor(str(b.name)),
    })),
    settings: {
      ...FALLBACK_SETTINGS,
      ...Object.fromEntries(Object.entries(s).filter(([, v]) => v !== undefined && v !== null)),
      serviceImages: (Array.isArray(s.serviceImages) ? s.serviceImages : [])
        .filter((x: any) => x && validUrl(str(x.url)) && Number(x.width) > 0 && Number(x.height) > 0)
        .map((x: any) => ({ slug: str(x.slug), src: x.url, width: Number(x.width), height: Number(x.height), alt: str(x.alt) })),
    } as SiteSettings,
    contact: {
      tel,
      telRaw: tel ? telOnly(tel) : FALLBACK_CONTACT.telRaw,
      // ⚠️ สายด่วนอาจเป็นเลขสั้น 4 หลัก (เช่น 1xxx) — จึงตรวจแค่ว่ามีตัวเลขอย่างน้อย 4 ตัว
      hotline: telOnly(str(c.hotline)).replace(/\D/g, "").length >= 4 ? str(c.hotline) : FALLBACK_CONTACT.hotline,
      hotlineRaw: telOnly(str(c.hotline)).replace(/\D/g, "").length >= 4 ? telOnly(str(c.hotline)) : FALLBACK_CONTACT.hotlineRaw,
      email: validEmail(str(c.email)) || FALLBACK_CONTACT.email,
      lineUrl: validUrl(str(c.lineUrl)) || FALLBACK_CONTACT.lineUrl,
      facebookUrl: validUrl(str(c.facebookUrl)) || FALLBACK_CONTACT.facebookUrl,
    },
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * เนื้อหาทั้งหมดของเว็บ
 * ⚠️ CMS_API_URL ต้องเป็น URL เต็มของ /api/web/content — ไม่ตั้ง = ใช้เนื้อหาตั้งต้นในโค้ดตลอด
 */
export const getContent = cache(async (): Promise<SiteContent> => {
  const url = process.env.CMS_API_URL;
  if (!url) return fallback();
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [CONTENT_TAG] },
      // ⚠️ build ต้องไม่ค้างเพราะ API ช้า — เกินเวลาก็ใช้เนื้อหาตั้งต้นไปก่อน
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return normalize(await res.json());
  } catch (err) {
    console.error("[cms] ดึงเนื้อหาจากหลังบ้านไม่สำเร็จ ใช้เนื้อหาตั้งต้นแทน:", (err as Error).message);
    return fallback();
  }
});
