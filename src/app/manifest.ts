import type { MetadataRoute } from "next";

import { COMPANY } from "@/data/company";

/** Web App Manifest — ไอคอนเมื่อผู้ใช้ "เพิ่มไปยังหน้าจอโฮม" (สร้างจากโลโก้บริษัท ดู scripts/make-brand.mjs) */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: COMPANY.nameTh,
    short_name: "DO ALL",
    description: COMPANY.tagline,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#dc2626",
    lang: "th",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
