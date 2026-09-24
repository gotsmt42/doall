import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Info } from "lucide-react";

import ServiceIcon from "@/components/ServiceIcon";
import { Badge, ButtonLink, Card, Container, JsonLd } from "@/components/ui";
import { ARTICLES, type ArticleBlock, articleBySlug, readingMinutes, thaiShortDate } from "@/data/articles";
import { COMPANY } from "@/data/company";
import { serviceBySlug } from "@/data/services";
import Breadcrumb from "@/layouts/Breadcrumb";
import { articleJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { CtaBand } from "@/sections/BrandsAndCta";

/** ⚠️ slug ที่ไม่มีจริง = 404 จริง */
export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.description,
    path: `/articles/${article.slug}`,
    keywords: article.keywords,
    article: {
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authorName: COMPANY.nameTh,
      tags: [article.category],
    },
  });
}

/**
 * แปลงบล็อกเนื้อหาเป็น HTML
 * ⚠️ ตั้งใจเก็บบทความเป็นโครงสร้างข้อมูล ไม่ใช่ HTML/Markdown ดิบ — ไม่ต้องใช้
 *    dangerouslySetInnerHTML (ไม่มีช่องให้ XSS) และย้ายไป CMS ภายหลังได้โดยเปลี่ยนแค่ตัวอ่านข้อมูล
 */
function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="mt-12 text-xl font-bold sm:text-2xl">{block.text}</h2>;
    case "p":
      return <p className="mt-5 text-[17px] leading-[1.95] text-slate-700">{block.text}</p>;
    case "list":
      return (
        <ul className="mt-5 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-[17px] leading-[1.85] text-slate-700">
              <span aria-hidden="true" className="mt-[0.75em] size-1.5 shrink-0 rounded-full bg-red-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        // ⚠️ ตารางกว้างกว่าจอมือถือได้ — ให้เลื่อนในกรอบตัวเอง ไม่ใช่ดันทั้งหน้าให้เลื่อนออกด้านข้าง
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[32rem] text-left text-[15px]">
            <thead className="bg-slate-50">
              <tr>
                {block.head.map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-semibold text-slate-900">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {block.rows.map((row) => (
                <tr key={row.join("|")}>
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="px-4 py-3 font-semibold text-slate-800">{cell}</th>
                    ) : (
                      <td key={i} className="px-4 py-3 text-slate-700">{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "note":
      return (
        <aside className="mt-6 flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <Info aria-hidden="true" className="mt-1 size-5 shrink-0 text-red-600" />
          <p className="text-[15px] leading-relaxed text-slate-700">{block.text}</p>
        </aside>
      );
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();

  const service = serviceBySlug(article.relatedService);
  const more = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description: article.description,
          href: `/articles/${article.slug}`,
          publishedAt: article.publishedAt,
          updatedAt: article.updatedAt,
        })}
      />
      <Breadcrumb
        items={[
          { name: "บทความ", href: "/articles" },
          { name: article.title, href: `/articles/${article.slug}` },
        ]}
      />

      <Container className="py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* 🐛 min-w-0 จำเป็น: ตารางในบทความกำหนด min-width ไว้ให้เลื่อนในกรอบตัวเอง แต่คอลัมน์ของ grid
              มี min-width:auto เป็นค่าเริ่มต้น จึงถูกตารางดันให้กว้างกว่าจอ ทั้งหน้าเลื่อนออกด้านข้าง
              (วัดได้ 214px ที่จอ 320px) — min-w-0 ทำให้ตารางเลื่อนในกรอบของมันเองตามที่ตั้งใจ */}
          <article className="min-w-0 lg:col-span-8">
            <header>
              <Badge tone="brand">{article.category}</Badge>
              <h1 className="mt-4 text-3xl leading-[1.3] font-bold sm:text-4xl">{article.title}</h1>
              <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span>โดย ทีมวิศวกร {COMPANY.shortName}</span>
                <time dateTime={article.publishedAt}>เผยแพร่ {thaiShortDate(article.publishedAt)}</time>
                <span className="inline-flex items-center gap-1">
                  <Clock aria-hidden="true" className="size-3.5" />
                  อ่าน {readingMinutes(article)} นาที
                </span>
              </p>
            </header>

            {/* ⚠️ max-w ~68 ตัวอักษรต่อบรรทัด — บรรทัดยาวกว่านี้ตาต้องกวาดไกล อ่านบทความยาวแล้วล้า */}
            <div className="mt-8 max-w-[68ch] border-t border-slate-200 pt-2">
              {article.body.map((b, i) => <Block key={i} block={b} />)}
            </div>
          </article>

          <aside className="min-w-0 lg:col-span-4">
            <div className="space-y-5 lg:sticky lg:top-24">
              {service && (
                <Card className="p-6">
                  <ServiceIcon name={service.icon} />
                  <p className="mt-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">บริการที่เกี่ยวข้อง</p>
                  <p className="mt-1 font-bold text-slate-900">{service.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.summary}</p>
                  <ButtonLink href={`/services/${service.slug}`} variant="secondary" className="mt-5 w-full">
                    ดูรายละเอียดบริการ
                  </ButtonLink>
                </Card>
              )}
              <Card className="bg-slate-900 p-6">
                <p className="font-bold text-white">ต้องการคำแนะนำสำหรับอาคารของคุณ?</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">ทีมวิศวกรพร้อมสำรวจหน้างานและให้คำปรึกษาเบื้องต้นโดยไม่มีค่าใช้จ่าย</p>
                <ButtonLink href="/quotation" className="mt-5 w-full">ขอใบเสนอราคา</ButtonLink>
              </Card>
            </div>
          </aside>
        </div>

        {more.length > 0 && (
          <nav aria-labelledby="more-articles" className="mt-16 border-t border-slate-200 pt-10">
            <h2 id="more-articles" className="text-lg font-bold">บทความอื่นที่น่าสนใจ</h2>
            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {more.map((a) => (
                <li key={a.slug}>
                  <Link href={`/articles/${a.slug}`} className="group flex h-full items-start justify-between gap-4 rounded-xl border border-slate-200 p-5 transition-colors hover:border-slate-300">
                    <span>
                      <span className="text-xs font-semibold text-red-700">{a.category}</span>
                      <span className="mt-1 block font-bold leading-snug text-slate-900">{a.title}</span>
                    </span>
                    <ArrowRight aria-hidden="true" className="mt-6 size-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </Container>

      <CtaBand />
    </>
  );
}
