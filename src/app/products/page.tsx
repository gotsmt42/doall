import ProductCatalog from "@/components/ProductCatalog";
import { Container, Section } from "@/components/ui";
import { BRANDS_DISCLAIMER } from "@/data/brands";
import { PRODUCTS } from "@/data/products";
import Breadcrumb, { PageHeader } from "@/layouts/Breadcrumb";
import { pageMetadata } from "@/lib/seo";
import { CtaBand } from "@/sections/BrandsAndCta";

export const metadata = pageMetadata({
  title: "สินค้าและอุปกรณ์ — Fire Alarm, CCTV, Access Control, Network",
  description:
    "จำหน่ายและติดตั้งอุปกรณ์ระบบแจ้งเหตุเพลิงไหม้ Edwards, Hochiki, Nohmi, Asenware กล้องวงจรปิด " +
    "ระบบควบคุมการเข้าออก และอุปกรณ์เครือข่าย พร้อมให้คำปรึกษาเลือกอุปกรณ์ให้เหมาะกับหน้างาน",
  path: "/products",
  keywords: ["จำหน่ายอุปกรณ์ fire alarm", "Edwards fire alarm", "Hochiki", "Nohmi", "Asenware", "จำหน่ายกล้องวงจรปิด", "อุปกรณ์ access control"],
});

export default function ProductsPage() {
  return (
    <>
      <Breadcrumb items={[{ name: "สินค้า", href: "/products" }]} />
      <PageHeader
        eyebrow="สินค้าและอุปกรณ์"
        title="อุปกรณ์งานระบบที่เราจัดหาและติดตั้ง"
        description="เราเลือกอุปกรณ์ให้เหมาะกับหน้างานจริงและงบประมาณ ไม่ใช่รุ่นแพงที่สุดเสมอไป ต้องการรุ่นที่ไม่มีในรายการ แจ้งทีมงานได้"
      />
      <Section>
        <Container>
          <ProductCatalog products={PRODUCTS} />
          <p className="mt-10 text-xs leading-relaxed text-slate-500">{BRANDS_DISCLAIMER}</p>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
