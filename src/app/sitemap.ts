import type { MetadataRoute } from "next";

import { ARTICLES } from "@/data/articles";
import { PROJECTS } from "@/data/projects";
import { SERVICES } from "@/data/services";
import { SITE_URL } from "@/lib/seo";

/**
 * sitemap.xml — สร้างจากไฟล์ข้อมูลชุดเดียวกับหน้าเว็บ
 *
 * ⚠️ เพิ่มบริการ/ผลงาน/บทความในไฟล์ data แล้ว sitemap อัปเดตเองตอน build ไม่ต้องแก้ที่นี่
 *    sitemap ที่ลืมใส่หน้าใหม่ คือหน้าที่ Google อาจใช้เวลาหลายสัปดาห์กว่าจะเจอ
 * ⚠️ ไม่ใส่ /api/* และหน้า 404 — sitemap ต้องมีเฉพาะหน้าที่อยากให้ติดผลค้นหาจริง
 * ⚠️ lastModified ของหน้าคงที่ใช้วันที่ build — ถ้าใช้ new Date() ทุกครั้งที่ขอ Google จะเห็นว่า
 *    ทุกหน้า "เพิ่งแก้" ตลอดเวลาแล้วเลิกเชื่อค่านี้ไปทั้งไฟล์
 */
const BUILT_AT = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly", lastModified: Date = BUILT_AT) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    page("", 1, "weekly"),
    page("/services", 0.9, "monthly"),
    ...SERVICES.map((s) => page(`/services/${s.slug}`, 0.9, "monthly")),
    page("/about", 0.7, "yearly"),
    page("/products", 0.7, "monthly"),
    page("/projects", 0.7, "monthly"),
    ...PROJECTS.map((p) => page(`/projects/${p.slug}`, 0.6, "yearly", new Date(p.completedAt))),
    page("/articles", 0.6, "weekly"),
    ...ARTICLES.map((a) => page(`/articles/${a.slug}`, 0.6, "yearly", new Date(a.updatedAt || a.publishedAt))),
    page("/contact", 0.8, "yearly"),
    page("/quotation", 0.8, "yearly"),
    page("/privacy", 0.2, "yearly"),
    page("/terms", 0.2, "yearly"),
    page("/cookies", 0.2, "yearly"),
  ];
}
