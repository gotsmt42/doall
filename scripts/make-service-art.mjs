/**
 * สร้างภาพประกอบของแต่ละบริการ → public/services/<slug>.svg
 *
 *   node scripts/make-service-art.mjs
 *
 * ✅ บริษัทสั่ง "พวกระบบ อยากให้มีรูปภาพด้วย" (25 ก.ย. 2569)
 * ⚠️ เป็นภาพประกอบ (illustration) ที่วาดขึ้นเอง ไม่ใช่ภาพถ่ายผลงาน — จึงไม่มีปัญหาลิขสิทธิ์และไม่ทำให้
 *    ลูกค้าเข้าใจผิดว่าเป็นงานจริงของบริษัท · ภาพถ่ายจริงอัปทับได้จากหลังบ้าน (ตั้งค่า → รูปของแต่ละบริการ)
 * ⚠️ ทุกภาพใช้โครงเดียวกัน (พื้นไล่เฉดอ่อน + วงกลมจาง + ฉากกลางภาพ) และสีชุดเดียวกับเว็บ
 *    — หน้าบริการเรียงหลายการ์ดติดกัน ถ้าแต่ละภาพคนละสไตล์จะดูไม่เป็นมืออาชีพทันที
 * ⚠️ แก้ภาพที่ไฟล์นี้แล้วรันใหม่ อย่าแก้ไฟล์ .svg ใน public ด้วยมือ
 */
import { writeFileSync } from "node:fs";

const C = {
  navy: "#0f172a", slate: "#334155", mid: "#64748b", line: "#cbd5e1", pale: "#e2e8f0", white: "#ffffff",
  red: "#dc2626", redD: "#991b1b", redL: "#fecaca", redP: "#fef2f2", water: "#38bdf8", waterL: "#bae6fd",
};

const frame = (title, body, tint = C.redP) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${tint}"/><stop offset="1" stop-color="#ffffff"/>
    </linearGradient>
    <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.4" fill="${C.line}" opacity=".55"/>
    </pattern>
  </defs>
  <rect width="640" height="400" fill="url(#bg)"/>
  <rect x="380" y="0" width="260" height="190" fill="url(#dots)"/>
  <circle cx="560" cy="330" r="150" fill="${C.redL}" opacity=".35"/>
  <circle cx="70" cy="60" r="90" fill="${C.pale}" opacity=".6"/>
  ${body}
</svg>
`;

/* ── ชิ้นส่วนที่ใช้ซ้ำ ── */
const ceiling = (y = 70) => `<rect x="0" y="${y - 14}" width="640" height="14" fill="${C.pale}"/><rect x="0" y="${y}" width="640" height="4" fill="${C.line}"/>`;
const floor = (y = 340) => `<rect x="0" y="${y}" width="640" height="60" fill="${C.pale}" opacity=".7"/><rect x="0" y="${y}" width="640" height="3" fill="${C.line}"/>`;
const waves = (cx, cy, s = 1, color = C.red) => [1, 2, 3].map((i) =>
  `<path d="M${cx - 14 * i * s} ${cy + 10 * i * s} Q${cx} ${cy + 22 * i * s} ${cx + 14 * i * s} ${cy + 10 * i * s}" fill="none" stroke="${color}" stroke-width="${3.2 - i * 0.6}" stroke-linecap="round" opacity="${1 - i * 0.22}"/>`).join("");

const ART = {
  /* Fire Alarm: อุปกรณ์ตรวจจับควันบนฝ้า + ตู้ควบคุม + จุดแจ้งเหตุ + กระดิ่ง */
  "fire-alarm": frame("ระบบแจ้งเหตุเพลิงไหม้", `
    ${ceiling()}${floor()}
    <g transform="translate(150 74)">
      <rect x="-46" y="0" width="92" height="12" rx="4" fill="${C.line}"/>
      <path d="M-40 12 h80 a8 8 0 0 1 -8 18 h-64 a8 8 0 0 1 -8 -18z" fill="${C.white}" stroke="${C.line}" stroke-width="2"/>
      <circle cx="0" cy="22" r="4" fill="${C.red}"/>
      ${waves(0, 32, 1.1)}
    </g>
    ${[[128, 270, 26], [160, 250, 32], [196, 262, 24], [150, 214, 20], [178, 196, 16], [160, 162, 12]].map(([x, y, r], i) =>
      `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.mid}" opacity="${0.16 - i * 0.015}"/>`).join("")}
    <g transform="translate(330 150)">
      <rect width="150" height="170" rx="12" fill="${C.navy}"/>
      <rect x="16" y="18" width="118" height="46" rx="6" fill="#1e293b"/>
      <rect x="26" y="30" width="70" height="7" rx="3" fill="${C.red}"/>
      <rect x="26" y="44" width="52" height="6" rx="3" fill="${C.mid}"/>
      ${[0, 1, 2, 3].map((i) => `<circle cx="${32 + i * 29}" cy="86" r="7" fill="${i === 0 ? C.red : i === 1 ? "#f59e0b" : "#22c55e"}"/>`).join("")}
      ${[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => `<rect x="${20 + c * 29}" y="${106 + r * 18}" width="22" height="11" rx="3" fill="${C.slate}"/>`).join("")).join("")}
    </g>
    <g transform="translate(520 170)">
      <rect width="62" height="70" rx="8" fill="${C.red}"/>
      <rect x="12" y="14" width="38" height="30" rx="4" fill="${C.white}"/>
      <path d="M22 36 l9 -12 9 12" fill="none" stroke="${C.red}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="18" y="52" width="26" height="6" rx="3" fill="${C.redD}"/>
    </g>
    <g transform="translate(551 104)">
      <circle r="24" fill="${C.red}"/><circle r="15" fill="${C.redD}"/><circle r="5" fill="${C.redL}"/>
      <path d="M32 -10 q10 10 0 20 M42 -18 q16 18 0 36" fill="none" stroke="${C.red}" stroke-width="3" stroke-linecap="round"/>
    </g>`),

  /* Fire Protection: หัวสปริงเกอร์ฉีดน้ำ + ถังดับเพลิง + ตู้สายฉีดน้ำ */
  "fire-protection": frame("ระบบป้องกันอัคคีภัย", `
    ${ceiling()}${floor()}
    <rect x="0" y="92" width="360" height="12" rx="6" fill="${C.red}"/>
    <g transform="translate(170 104)">
      <rect x="-6" y="0" width="12" height="18" fill="${C.slate}"/>
      <path d="M-22 18 h44 l-10 12 h-24z" fill="${C.slate}"/>
      <rect x="-26" y="30" width="52" height="5" rx="2.5" fill="${C.mid}"/>
      ${[-60, -40, -20, 0, 20, 40, 60].map((a) => { const r = (a * Math.PI) / 180; const x = Math.sin(r) * 150, y = Math.cos(r) * 150;
        return `<line x1="${(Math.sin(r) * 30).toFixed(1)}" y1="${(38 + Math.cos(r) * 8).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(38 + y).toFixed(1)}" stroke="${C.water}" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 12" opacity=".85"/>`; }).join("")}
      ${[[-70, 120], [-35, 150], [10, 165], [55, 140], [85, 110], [-95, 90]].map(([x, y]) => `<path d="M${x} ${y} q5 8 0 12 q-5 -4 0 -12z" fill="${C.water}" opacity=".7"/>`).join("")}
    </g>
    <g transform="translate(420 150)">
      <rect width="150" height="190" rx="10" fill="${C.red}"/>
      <rect x="12" y="12" width="126" height="166" rx="6" fill="${C.redD}"/>
      <circle cx="75" cy="80" r="46" fill="none" stroke="${C.redL}" stroke-width="12"/>
      <circle cx="75" cy="80" r="26" fill="none" stroke="${C.redL}" stroke-width="10"/>
      <circle cx="75" cy="80" r="9" fill="${C.redL}"/>
      <rect x="30" y="146" width="90" height="16" rx="4" fill="${C.white}" opacity=".9"/>
      <text x="75" y="158" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="${C.red}">FIRE HOSE</text>
    </g>
    <g transform="translate(330 222)">
      <rect x="10" y="26" width="46" height="92" rx="16" fill="${C.red}"/>
      <rect x="10" y="60" width="46" height="24" fill="${C.white}" opacity=".9"/>
      <rect x="22" y="8" width="22" height="20" rx="4" fill="${C.navy}"/>
      <path d="M34 12 h22 l6 -8" fill="none" stroke="${C.navy}" stroke-width="5" stroke-linecap="round"/>
      <path d="M22 16 q-22 10 -18 48" fill="none" stroke="${C.navy}" stroke-width="5" stroke-linecap="round"/>
    </g>`),

  /* Fire Pump: ปั๊ม + มอเตอร์ + ท่อ + เกจวัดแรงดัน */
  "fire-pump": frame("ระบบเครื่องสูบน้ำดับเพลิง", `
    ${floor(330)}
    <rect x="60" y="150" width="520" height="22" rx="11" fill="${C.red}"/>
    <rect x="100" y="120" width="22" height="210" fill="${C.red}"/>
    <rect x="500" y="120" width="22" height="210" fill="${C.red}"/>
    <rect x="92" y="186" width="38" height="16" rx="3" fill="${C.redD}"/>
    <rect x="492" y="186" width="38" height="16" rx="3" fill="${C.redD}"/>
    <g transform="translate(180 230)">
      <rect x="0" y="80" width="300" height="20" rx="4" fill="${C.slate}"/>
      <rect x="10" y="10" width="140" height="70" rx="10" fill="${C.navy}"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${24 + i * 20}" y="18" width="8" height="54" rx="4" fill="#1e293b"/>`).join("")}
      <rect x="150" y="36" width="30" height="18" fill="${C.mid}"/>
      <circle cx="222" cy="44" r="40" fill="${C.red}"/>
      <circle cx="222" cy="44" r="22" fill="${C.redD}"/>
      <rect x="212" y="-40" width="20" height="46" fill="${C.red}"/>
    </g>
    <g transform="translate(560 90)">
      <circle r="34" fill="${C.white}" stroke="${C.navy}" stroke-width="6"/>
      <path d="M-22 12 A26 26 0 1 1 22 12" fill="none" stroke="${C.pale}" stroke-width="6"/>
      <path d="M-22 12 A26 26 0 0 1 10 -24" fill="none" stroke="${C.red}" stroke-width="6" stroke-linecap="round"/>
      <line x1="0" y1="0" x2="14" y2="-18" stroke="${C.navy}" stroke-width="4" stroke-linecap="round"/>
      <circle r="5" fill="${C.navy}"/>
      <rect x="-6" y="34" width="12" height="26" fill="${C.navy}"/>
    </g>
    ${[[70, 110], [96, 96], [120, 118]].map(([x, y]) => `<path d="M${x} ${y} q7 11 0 17 q-7 -6 0 -17z" fill="${C.water}"/>`).join("")}`),

  /* CCTV: กล้องติดผนังพร้อมกรวยมุมมอง + จอแสดงภาพ */
  cctv: frame("ระบบกล้องวงจรปิด", `
    ${floor()}
    <rect x="0" y="40" width="26" height="300" fill="${C.pale}"/>
    <g transform="translate(26 100)">
      <rect x="0" y="-10" width="24" height="44" rx="4" fill="${C.slate}"/>
      <rect x="20" y="4" width="34" height="12" fill="${C.slate}"/>
      <g transform="translate(54 -6) rotate(14)">
        <rect x="0" y="0" width="130" height="48" rx="12" fill="${C.white}" stroke="${C.line}" stroke-width="2"/>
        <rect x="108" y="4" width="30" height="40" rx="8" fill="${C.navy}"/>
        <circle cx="126" cy="24" r="11" fill="#1e293b"/><circle cx="126" cy="24" r="5" fill="${C.red}"/>
        <rect x="10" y="-8" width="96" height="10" rx="5" fill="${C.pale}"/>
      </g>
    </g>
    <path d="M200 150 L420 110 L470 330 L230 330 Z" fill="${C.red}" opacity=".08"/>
    <path d="M200 150 L420 110 M200 150 L470 330" stroke="${C.red}" stroke-width="2" stroke-dasharray="6 8" opacity=".5"/>
    <g transform="translate(330 250)">
      <circle cx="0" cy="-58" r="16" fill="${C.slate}"/>
      <path d="M-24 0 q0 -38 24 -38 q24 0 24 38 z" fill="${C.slate}"/>
      <rect x="-32" y="-84" width="64" height="100" fill="none" stroke="${C.red}" stroke-width="3" rx="6"/>
      <rect x="-32" y="-100" width="44" height="14" rx="3" fill="${C.red}"/>
      <text x="-10" y="-89.5" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="${C.white}">PERSON</text>
    </g>
    <g transform="translate(470 60)">
      <rect width="140" height="96" rx="8" fill="${C.navy}"/>
      ${[0, 1].map((r) => [0, 1].map((c) => `<rect x="${10 + c * 62}" y="${10 + r * 40}" width="58" height="36" rx="3" fill="${(r + c) % 2 ? "#1e293b" : C.slate}"/>`).join("")).join("")}
      <circle cx="20" cy="20" r="3.5" fill="${C.red}"/>
      <rect x="60" y="96" width="20" height="14" fill="${C.slate}"/>
    </g>`),

  /* Access Control: ประตู + เครื่องอ่านบัตร/สแกนนิ้ว + บัตร */
  "access-control": frame("ระบบควบคุมการเข้าออก", `
    ${floor()}
    <g transform="translate(200 70)">
      <rect x="-14" y="-10" width="208" height="280" rx="6" fill="${C.slate}"/>
      <rect x="0" y="0" width="180" height="270" rx="4" fill="${C.white}" stroke="${C.line}" stroke-width="2"/>
      <rect x="20" y="20" width="140" height="100" rx="4" fill="${C.pale}"/>
      <rect x="20" y="140" width="140" height="110" rx="4" fill="${C.pale}"/>
      <rect x="140" y="130" width="10" height="40" rx="5" fill="${C.navy}"/>
      <rect x="60" y="-6" width="60" height="12" rx="3" fill="${C.navy}"/>
    </g>
    <g transform="translate(430 130)">
      <rect width="84" height="130" rx="14" fill="${C.navy}"/>
      <rect x="12" y="14" width="60" height="34" rx="5" fill="#1e293b"/>
      <path d="M26 31 l8 8 14 -16" fill="none" stroke="#22c55e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <g transform="translate(42 86)" fill="none" stroke="${C.red}" stroke-width="2.6" stroke-linecap="round">
        <path d="M-14 6 a14 14 0 0 1 28 0"/><path d="M-9 10 a9 9 0 0 1 18 0 v4"/><path d="M-4 14 a4 4 0 0 1 8 0 v6"/><path d="M-19 2 a19 19 0 0 1 38 0 v10"/>
      </g>
    </g>
    <g transform="translate(520 250) rotate(-16)">
      <rect width="92" height="58" rx="8" fill="${C.red}"/>
      <rect x="10" y="12" width="24" height="18" rx="3" fill="#fde68a"/>
      <rect x="10" y="38" width="60" height="6" rx="3" fill="${C.redL}"/>
      <path d="M70 12 q8 8 0 16 M76 6 q14 14 0 28" fill="none" stroke="${C.white}" stroke-width="2.5" stroke-linecap="round"/>
    </g>`),

  /* Network: ตู้แร็ค + สวิตช์ + สายแลน */
  network: frame("ระบบเครือข่าย", `
    ${floor()}
    <g transform="translate(90 60)">
      <rect width="200" height="280" rx="10" fill="${C.navy}"/>
      ${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(16 ${22 + i * 50})">
        <rect width="168" height="36" rx="4" fill="#1e293b"/>
        ${[0, 1, 2, 3, 4, 5, 6, 7].map((p) => `<rect x="${10 + p * 16}" y="10" width="11" height="10" rx="2" fill="${C.slate}"/>`).join("")}
        <circle cx="150" cy="18" r="4" fill="${i === 2 ? C.red : "#22c55e"}"/>
      </g>`).join("")}
    </g>
    ${[0, 1, 2, 3].map((i) => `<path d="M${130 + i * 32} ${92 + (i % 2) * 50} C ${300} ${92 + (i % 2) * 50}, ${360} ${150 + i * 50}, 440 ${150 + i * 50}" fill="none" stroke="${[C.red, C.water, "#f59e0b", "#22c55e"][i]}" stroke-width="5" stroke-linecap="round"/>`).join("")}
    ${[0, 1, 2, 3].map((i) => `<g transform="translate(440 ${150 + i * 50})"><rect x="-4" y="-7" width="26" height="14" rx="3" fill="${C.slate}"/><rect x="22" y="-4" width="8" height="8" fill="${C.mid}"/></g>`).join("")}
    <g transform="translate(470 80)">
      <circle r="44" fill="${C.white}" stroke="${C.line}" stroke-width="2"/>
      <circle r="30" fill="none" stroke="${C.red}" stroke-width="3"/>
      <ellipse rx="13" ry="30" fill="none" stroke="${C.red}" stroke-width="3"/>
      <line x1="-30" y1="0" x2="30" y2="0" stroke="${C.red}" stroke-width="3"/>
    </g>`),

  /* Maintenance: คลิปบอร์ดเช็กลิสต์ + ประแจ + ปฏิทิน */
  maintenance: frame("บริการบำรุงรักษา", `
    ${floor()}
    <g transform="translate(190 50)">
      <rect width="210" height="280" rx="14" fill="${C.white}" stroke="${C.line}" stroke-width="2"/>
      <rect x="70" y="-12" width="70" height="28" rx="8" fill="${C.navy}"/>
      ${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(26 ${46 + i * 44})">
        <rect width="24" height="24" rx="6" fill="${i < 4 ? C.red : C.pale}"/>
        ${i < 4 ? `<path d="M6 12 l5 5 8 -10" fill="none" stroke="${C.white}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` : ""}
        <rect x="38" y="4" width="${[120, 96, 110, 84, 100][i]}" height="7" rx="3.5" fill="${C.pale}"/>
        <rect x="38" y="15" width="${[70, 60, 80, 50, 64][i]}" height="5" rx="2.5" fill="${C.pale}" opacity=".7"/>
      </g>`).join("")}
    </g>
    <g transform="translate(470 130) rotate(40)">
      <rect x="-9" y="0" width="18" height="150" rx="9" fill="${C.slate}"/>
      <path d="M-26 -30 a28 28 0 1 0 52 0 l-12 0 l0 14 l-28 0 l0 -14 z" fill="${C.slate}"/>
    </g>
    <g transform="translate(60 150)">
      <rect width="100" height="96" rx="10" fill="${C.white}" stroke="${C.line}" stroke-width="2"/>
      <rect width="100" height="26" rx="10" fill="${C.red}"/><rect y="16" width="100" height="10" fill="${C.red}"/>
      ${[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => `<rect x="${12 + c * 21}" y="${36 + r * 18}" width="14" height="11" rx="2" fill="${r === 1 && c === 2 ? C.red : C.pale}"/>`).join("")).join("")}
    </g>`),
};

for (const [slug, svg] of Object.entries(ART)) {
  writeFileSync(new URL(`../public/services/${slug}.svg`, import.meta.url), svg, "utf8");
  console.log("  *", `public/services/${slug}.svg`, `${(svg.length / 1024).toFixed(1)} KB`);
}
