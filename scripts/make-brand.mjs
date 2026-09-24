/**
 * สร้างไฟล์โลโก้/ไอคอนทั้งหมดของเว็บบริษัท จากโลโก้จริงของบริษัท
 *
 *   node scripts/make-brand.mjs
 *
 * ⚠️ **ห้ามดัดแปลงตัวโลโก้** — สคริปต์นี้ทำได้แค่ (1) ตัดขอบว่างรอบนอก (2) ตัดเอาเฉพาะ
 *    ส่วนเครื่องหมายเฟืองมาทำไอคอน (3) วางบนพื้นหลังและย่อขนาด — พิกเซลของตัวโลโก้ไม่ถูกแก้
 *    ไม่เปลี่ยนสี ไม่เปลี่ยนฟอนต์ ไม่วาดใหม่
 * ⚠️ เว็บนี้เป็นของบริษัท ไม่เกี่ยวกับแอป WiRix (เดิม Flowix) — ห้ามใช้ไอคอน/สี/ชื่อของ Flowix ที่นี่
 * ⚠️ ต้นฉบับอยู่ที่ da-app/public (โลโก้ชุดเดียวกับที่พิมพ์บนหัวกระดาษเอกสาร)
 *    ถ้าบริษัทเปลี่ยนโลโก้ ให้เปลี่ยนต้นฉบับแล้วรันสคริปต์นี้ใหม่ อย่าแก้ไฟล์ปลายทางทีละไฟล์
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = "D:/WEB-APP/da-app/public";
const SRC_LIGHT = path.join(SRC_DIR, "logo-letterhead.png"); // ตัวหนังสือดำ — ใช้บนพื้นสว่าง
const SRC_DARK = path.join(SRC_DIR, "logo-dark-2.png"); // ตัวหนังสือขาว — ใช้บนพื้นเข้ม
const OUT = path.resolve("public");
const BRAND = path.join(OUT, "brand");

/**
 * ตำแหน่งของเครื่องหมายเฟือง ในโลโก้ที่ตัดขอบว่างแล้ว (954x412)
 * ⚠️ วัดจากช่องว่างแนวตั้งระหว่างเฟืองกับคำว่า ARCHITECT (x 301-336) และอยู่เหนือเส้นขีดใต้ (y < 342)
 *    ถ้าเปลี่ยนไฟล์ต้นฉบับ ต้องวัดใหม่ — ค่าผิดจะได้ไอคอนที่ติดตัวหนังสือมาครึ่งตัว
 */
const MARK = { left: 25, top: 0, width: 276, height: 335 };

fs.mkdirSync(BRAND, { recursive: true });
fs.mkdirSync(path.join(OUT, "og"), { recursive: true });

const trimmed = (src) => sharp(src).trim({ threshold: 10 }).png().toBuffer();

/** เครื่องหมายเฟืองวางกลางกรอบสี่เหลี่ยม บนพื้นที่กำหนด (null = โปร่งใส) */
async function markOn(size, background, padRatio) {
  const light = await trimmed(SRC_LIGHT);
  const mark = await sharp(light).extract(MARK).png().toBuffer();
  const inner = Math.round(size * (1 - padRatio * 2));
  const resized = await sharp(mark).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background: background ?? { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: resized, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** รวม PNG หลายขนาดเป็นไฟล์ .ico ไฟล์เดียว (รูปแบบ ICO ที่ฝัง PNG ข้างใน) */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const dir = Buffer.alloc(16 * images.length);
  let offset = 6 + dir.length;
  images.forEach(({ size, buf }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o);
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(buf.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += buf.length;
  });
  return Buffer.concat([header, dir, ...images.map((x) => x.buf)]);
}

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

// 1) โลโก้เต็ม — แถบบน (พื้นขาว) และฟุตเตอร์ (พื้นเข้ม)
const light = await trimmed(SRC_LIGHT);
const dark = await trimmed(SRC_DARK);
await sharp(light).png({ compressionLevel: 9 }).toFile(path.join(BRAND, "logo.png"));
await sharp(dark).png({ compressionLevel: 9 }).toFile(path.join(BRAND, "logo-on-dark.png"));
// โลโก้สำหรับข้อมูลโครงสร้าง (Organization.logo) — Google ต้องการพื้นทึบ ไม่โปร่งใส
await sharp(light).flatten({ background: WHITE }).png({ compressionLevel: 9 }).toFile(path.join(OUT, "logo.png"));

// 2) ไอคอน — ใช้เฉพาะเครื่องหมายเฟือง (ตัวหนังสือยาวอ่านไม่ออกที่ขนาดเล็ก)
const ico = await Promise.all([16, 32, 48].map(async (size) => ({ size, buf: await markOn(size, null, 0.04) })));
fs.writeFileSync(path.join(OUT, "favicon.ico"), buildIco(ico));
// ⚠️ iOS วางไอคอนบนพื้นดำถ้าไฟล์โปร่งใส — ต้องใส่พื้นขาวเอง
fs.writeFileSync(path.join(OUT, "apple-touch-icon.png"), await markOn(180, WHITE, 0.14));
fs.writeFileSync(path.join(OUT, "icon-192.png"), await markOn(192, WHITE, 0.14));
fs.writeFileSync(path.join(OUT, "icon-512.png"), await markOn(512, WHITE, 0.14));

// 3) รูปตอนแชร์ลิงก์ (Open Graph) 1200x630 — โลโก้กลางพื้นขาว เส้นแดงบางๆ ด้านล่าง
const ogLogo = await sharp(light).resize({ width: 760 }).png().toBuffer();
const bar = await sharp({ create: { width: 1200, height: 10, channels: 4, background: { r: 220, g: 38, b: 38, alpha: 1 } } }).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: WHITE } })
  .composite([
    { input: ogLogo, gravity: "center" },
    { input: bar, top: 620, left: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(path.join(OUT, "og", "default.png"));

for (const f of ["brand/logo.png", "brand/logo-on-dark.png", "logo.png", "favicon.ico", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "og/default.png"]) {
  const p = path.join(OUT, f);
  const meta = f.endsWith(".ico") ? null : await sharp(p).metadata();
  console.log(`  * ${f.padEnd(24)} ${meta ? `${meta.width}x${meta.height}`.padEnd(10) : "16/32/48".padEnd(10)} ${(fs.statSync(p).size / 1024).toFixed(1)} KB`);
}
