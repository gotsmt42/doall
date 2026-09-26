import { SERVICES } from "@/data/services";
import type { SiteContent } from "@/lib/cms";

/**
 * ค้นหาทั้งเว็บจากข้อมูลที่หน้าเว็บมีอยู่แล้ว (บริการ · สินค้า · ผลงาน · บทความ)
 *
 * ✅ ทำไมค้นในหน่วยความจำ ไม่ยิงไปหลังบ้าน: ทั้งเว็บดึงเนื้อหาก้อนเดียวจาก getContent() อยู่แล้ว
 *    (แคช 60 วินาที) การค้นจึงเป็นแค่การกรองก้อนนั้น — ไม่ต้องมี endpoint ใหม่ ไม่ต้องมี index
 *    และผลลัพธ์ตรงกับสิ่งที่เผยแพร่อยู่จริงเสมอ เนื้อหาทั้งเว็บหลักร้อยรายการ กรองเร็วกว่ามิลลิวินาที
 *
 * ⚠️ ภาษาไทยไม่มีช่องว่างระหว่างคำ — จะตัดคำแล้วเทียบทีละคำไม่ได้ ต้องใช้ "ค้นด้วยสตริงย่อย"
 *    (เช่น พิมพ์ "ปั๊ม" ต้องเจอ "ปั๊มดับเพลิง") วิธีนี้ครอบคลุมทั้งไทยและอังกฤษโดยไม่ต้องมีพจนานุกรม
 * ⚠️ หลายคำที่คั่นด้วยช่องว่าง = ต้องเจอ "ครบทุกคำ" (AND) — คนพิมพ์ "cctv โรงงาน" คาดหวังผลที่มีทั้งสองอย่าง
 */

export type SearchKind = "service" | "product" | "project" | "article";

export type SearchHit = {
  kind: SearchKind;
  href: string;
  title: string;
  /** บรรทัดรอง — ยี่ห้อ/รุ่น, ลูกค้า/สถานที่, หมวดหมู่ */
  subtitle: string;
  /** ข้อความอธิบายสั้นๆ ที่ตัดมาแสดงใต้ชื่อ */
  snippet: string;
  score: number;
};

export const KIND_LABEL: Record<SearchKind, string> = {
  service: "บริการ",
  product: "สินค้า",
  project: "ผลงาน",
  article: "บทความ",
};

/** ลำดับกลุ่มในหน้าผลลัพธ์ — เรียงตามสิ่งที่ลูกค้ามักตามหาก่อน */
export const KIND_ORDER: readonly SearchKind[] = ["service", "product", "project", "article"];

/** ตัดช่องว่างซ้ำ + ตัวพิมพ์เล็ก — ใช้ทั้งฝั่งคำค้นและฝั่งเนื้อหา ให้เทียบกันได้ตรงๆ */
const norm = (v: unknown) => String(v ?? "").toLowerCase().replace(/\s+/g, " ").trim();

/** ตัดคำค้นเป็นคำย่อย (คั่นด้วยช่องว่าง) — ตัดคำที่สั้นเกินจนไม่ช่วยกรองอะไร */
export const parseTerms = (q: string) => norm(q).split(" ").filter((t) => t.length >= 2);

/**
 * ให้คะแนนรายการหนึ่ง
 * @param fields ช่องข้อมูลเรียงตาม "ความสำคัญ" — ช่องแรกคือชื่อ (ตรงที่ชื่อสำคัญกว่าตรงในเนื้อหา)
 * @returns คะแนนรวม หรือ 0 ถ้าไม่ครบทุกคำ (ต้องเจอทุกคำถึงจะนับว่าตรง)
 */
const scoreOf = (terms: readonly string[], fields: readonly (readonly [string, number])[]) => {
  let total = 0;
  for (const term of terms) {
    let best = 0;
    for (const [rawText, weight] of fields) {
      const text = norm(rawText);
      if (!text) continue;
      // ตรงทั้งช่อง > ขึ้นต้นด้วยคำค้น > มีคำค้นอยู่ข้างใน
      if (text === term) best = Math.max(best, weight * 3);
      else if (text.startsWith(term)) best = Math.max(best, weight * 2);
      else if (text.includes(term)) best = Math.max(best, weight);
    }
    if (!best) return 0; // ขาดไปคำเดียวก็ถือว่าไม่ตรง
    total += best;
  }
  return total;
};

/** ตัดข้อความยาวให้พอดีการ์ดผลลัพธ์ */
const clip = (text: string, max = 150) => {
  const t = String(text || "").trim();
  return t.length <= max ? t : `${t.slice(0, max).trimEnd()}…`;
};

export function searchSite(query: string, content: SiteContent): SearchHit[] {
  const terms = parseTerms(query);
  if (!terms.length) return [];

  const hits: SearchHit[] = [];

  // ── บริการ (เนื้อหาคงที่ในโค้ด — เป็นแกนของเว็บ จึงให้น้ำหนักสูงสุด) ──
  for (const s of SERVICES) {
    const score = scoreOf(terms, [
      [s.name, 10], [s.title, 9], [s.summary, 5],
      [s.keywords.join(" "), 6], [s.scope.join(" "), 3], [s.intro.join(" "), 2],
    ]);
    if (score) hits.push({ kind: "service", href: `/services/${s.slug}`, title: s.title, subtitle: "บริการของเรา", snippet: clip(s.summary), score: score + 4 });
  }

  // ── สินค้า ──
  for (const p of content.products) {
    const score = scoreOf(terms, [
      [p.name, 10], [p.model, 9], [p.brand, 7], [p.type, 6], [p.category, 5],
      [p.description, 3], [p.specs.map((x) => `${x.label} ${x.value}`).join(" "), 2],
    ]);
    if (score) {
      hits.push({
        kind: "product",
        // ⚠️ สินค้าไม่มีหน้าของตัวเอง — ส่งไปหน้าแค็ตตาล็อกพร้อมคำค้น ให้ตัวกรองในหน้านั้นทำงานต่อ
        href: `/products?q=${encodeURIComponent(p.name)}`,
        title: p.name,
        subtitle: [p.brand, p.model].filter(Boolean).join(" · ") || p.category,
        snippet: clip(p.description),
        score,
      });
    }
  }

  // ── ผลงาน ──
  for (const p of content.projects) {
    const score = scoreOf(terms, [
      [p.title, 10], [p.customer, 7], [p.location, 6], [p.systems.join(" "), 5],
      [p.summary, 3], [p.scope.join(" "), 2],
    ]);
    if (score) {
      hits.push({
        kind: "project",
        href: `/projects/${p.slug}`,
        title: p.title,
        subtitle: [p.customer, p.location].filter(Boolean).join(" · "),
        snippet: clip(p.summary),
        score,
      });
    }
  }

  // ── บทความ ──
  for (const a of content.articles) {
    const bodyText = a.body
      .map((b) => {
        if (b.type === "list") return b.items.join(" ");
        if (b.type === "table") return [...b.head, ...b.rows.flat()].join(" ");
        if (b.type === "image") return b.caption || "";
        return b.text;
      })
      .join(" ");
    const score = scoreOf(terms, [
      [a.title, 10], [a.category, 6], [a.keywords.join(" "), 6], [a.description, 4], [bodyText, 2],
    ]);
    if (score) hits.push({ kind: "article", href: `/articles/${a.slug}`, title: a.title, subtitle: a.category, snippet: clip(a.description), score });
  }

  // คะแนนเท่ากันให้เรียงตามชื่อ เพื่อให้ลำดับคงที่ทุกครั้ง (ไม่งั้นผลสลับไปมาระหว่างรีเฟรช)
  return hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "th"));
}

/** จัดกลุ่มผลลัพธ์ตามชนิด ตามลำดับที่กำหนดไว้ */
export const groupHits = (hits: readonly SearchHit[]) =>
  KIND_ORDER.map((kind) => ({ kind, items: hits.filter((h) => h.kind === kind) })).filter((g) => g.items.length);
