import ProductCatalog from "@/components/ProductCatalog";
import { ButtonLink, Container, EmptyState, Section } from "@/components/ui";
import { getContent } from "@/lib/cms";
import Breadcrumb, { PageHeader } from "@/layouts/Breadcrumb";
import { pageMetadata } from "@/lib/seo";
import { CtaBand } from "@/sections/BrandsAndCta";

export const metadata = pageMetadata({
  title: "สินค้าและอุปกรณ์ — Fire Alarm, CCTV และ Access Control",
  description:
    "จำหน่ายและติดตั้งอุปกรณ์ระบบแจ้งเหตุเพลิงไหม้ Notifier, Edwards, Hochiki, Asenware, GST กล้องวงจรปิด " +
    "และระบบควบคุมการเข้าออก พร้อมให้คำปรึกษาเลือกอุปกรณ์ให้เหมาะกับหน้างาน",
  path: "/products",
  keywords: ["จำหน่ายอุปกรณ์ fire alarm", "Notifier fire alarm", "Edwards fire alarm", "Hochiki", "Asenware", "GST", "จำหน่ายกล้องวงจรปิด", "อุปกรณ์ access control"],
});

/**
 * ⚠️ หน้านี้เป็น server-rendered ตามคำขอ (ไม่ใช่ static) เพราะรับ ?q= จากหน้าผลการค้นหา
 *    แลกมาด้วยการไม่ถูกแคชเป็นไฟล์นิ่ง แต่ HTML ยังมีสินค้าครบทุกชิ้นเหมือนเดิม (เสิร์ชเอนจินเห็นครบ)
 *    — ทางเลือกอื่นคืออ่าน URL ฝั่งเบราว์เซอร์ ซึ่งต้องครอบ Suspense แล้วแค็ตตาล็อกจะหายจาก HTML
 */
type Props = { searchParams: Promise<{ q?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const { products } = await getContent();
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
          {/* ⚠️ ยังไม่มีสินค้าที่เผยแพร่ ≠ "ค้นหาไม่พบ" — ข้อความ "ลองใช้คำค้นอื่น" ผิดความจริงถ้าไม่มีใครค้นหา */}
          {products.length === 0 ? (
            <EmptyState
              title="กำลังจัดทำรายการสินค้า"
              description="เราจัดหาอุปกรณ์ระบบแจ้งเหตุเพลิงไหม้ Notifier, Edwards, Hochiki, Asenware, GST รวมถึงกล้องวงจรปิดและระบบควบคุมการเข้าออก แจ้งรุ่นหรือประเภทที่ต้องการ ทีมงานจะเสนอราคาให้"
              action={<ButtonLink href="/quotation">สอบถามอุปกรณ์ที่ต้องการ</ButtonLink>}
            />
          ) : (
            <ProductCatalog products={products} initialQuery={q.trim()} />
          )}
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
