import { COMPANY } from "@/data/company";
import { Brands, CtaBand } from "@/sections/BrandsAndCta";
import FeaturedProjects from "@/sections/FeaturedProjects";
import Hero from "@/sections/Hero";
import ServicesGrid from "@/sections/ServicesGrid";
import Stats from "@/sections/Stats";
import WhyUs from "@/sections/WhyUs";
import { pageMetadata } from "@/lib/seo";

/**
 * ⚠️ title ของหน้าแรกคือข้อความที่มีน้ำหนักที่สุดของทั้งเว็บใน Google
 *    จึงต้องมีทั้ง "ชื่อบริการที่คนค้นหา" และ "ชื่อบริษัท" อยู่ในนั้น ไม่ใช่แค่ชื่อบริษัท
 *    (ไม่มีใครรู้จักชื่อบริษัทเราก่อนจะเจอเรา — เขาค้นจากชื่อบริการ)
 * ⚠️ ความยาวราว 50–60 ตัวอักษรละติน / ภาษาไทยให้สั้นกว่านั้นหน่อยเพราะแต่ละตัวกว้างกว่า
 *    ยาวเกินจะถูก Google ตัดท้ายเป็น "..." ส่วนที่ถูกตัดคือชื่อบริษัทพอดี
 */
export const metadata = pageMetadata({
  title: "ติดตั้งระบบ Fire Alarm, CCTV, Access Control, Network | DO ALL ARCHITECT AND ENGINEERING",
  description: COMPANY.descriptionTh,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <ServicesGrid />
      <WhyUs />
      <FeaturedProjects />
      <Brands />
      <CtaBand />
    </>
  );
}
