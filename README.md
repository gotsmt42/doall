# DO ALL ARCHITECT AND ENGINEERING — เว็บไซต์บริษัท

เว็บไซต์สาธารณะของ บริษัท ดู ออล อาคิเทค แอนด์ เอ็นจิเนียริ่ง จำกัด
Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript

เนื้อหา (สินค้า ผลงาน บทความ ยี่ห้อ การแสดงผล) แก้ได้จาก **ระบบหลังบ้านในแอป da-app**
เมนู "เว็บไซต์บริษัท" — บันทึกแล้วเว็บอัปเดตเองภายในไม่กี่วินาที ไม่ต้อง deploy ใหม่

## ภาพรวมการทำงาน

```
แอป da-app (หลังบ้าน)  ──บันทึก──▶  da-app-server  ──POST /api/revalidate──▶  เว็บนี้ (ดึงเนื้อหาใหม่)
                                          ▲
เว็บนี้ ── GET /api/web/content ──────────┘   (เนื้อหาที่เผยแพร่แล้วทั้งหมด ก้อนเดียว)
เว็บนี้ ── ฟอร์มลูกค้า → /api/lead ──▶ da-app-server /api/web/leads ──▶ เข้าแอป + แจ้งเตือน + อีเมล
```

- **หลังบ้านล่ม** → เว็บใช้เนื้อหาตั้งต้นในโค้ด (`src/data/*`) แทน ไม่มีหน้าว่าง ไม่มี build พัง
- **ข้อมูลติดต่อ** (เบอร์ อีเมล LINE Facebook) มาจาก "ตั้งค่าองค์กร" ในแอป — แก้ที่นั่นที่เดียว
- **หน้าบริการ** (6 หน้า) แก้ในโค้ดที่ `src/data/services.ts` — มีโครงสร้าง SEO มากที่สุดของเว็บ

## เริ่มใช้งานบนเครื่อง

```bash
npm install
cp .env.example .env.local   # แล้วกรอกค่า (ดูหัวข้อถัดไป)
npm run dev                  # http://localhost:3200
```

ต้องเปิด `da-app-server` ไว้ด้วย (พอร์ต 5000) ไม่เปิดก็ได้ — เว็บจะใช้เนื้อหาตั้งต้น

## ตัวแปร env

| ตัวแปร | จำเป็น | หน้าที่ |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **production** | โดเมนจริง (ไม่มี `/` ท้าย) — ใช้ทำ canonical, sitemap, Open Graph · **ไม่ตั้ง = robots.txt สั่งห้ามเก็บทั้งเว็บ** (กันเว็บทดสอบหลุดขึ้น Google) |
| `CMS_API_URL` | แนะนำ | `https://<server>/api/web/content` |
| `REVALIDATE_SECRET` | แนะนำ | ต้องตรงกับ `WEB_REVALIDATE_SECRET` ของ server |
| `LEAD_API_URL` | ถ้าจะรับฟอร์ม | `https://<server>/api/web/leads` |
| `LEAD_API_KEY` | ถ้าจะรับฟอร์ม | ต้องตรงกับ `LEAD_API_KEY` ของ server — **ไม่ตั้ง = ฟอร์มแจ้งลูกค้าว่าส่งไม่ได้ (ไม่แกล้งตอบว่าสำเร็จ)** |
| `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_META_PIXEL_ID` | ไม่บังคับ | โหลดเฉพาะหลังผู้ใช้กดยอมรับคุกกี้ (PDPA) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | ไม่บังคับ | รหัสยืนยัน Google Search Console |

ฝั่ง `da-app-server` ต้องตั้ง `WEB_REVALIDATE_URL=https://<โดเมนเว็บ>/api/revalidate` คู่กัน

## ตรวจก่อน deploy

```bash
npm run typecheck && npm run lint && npm run build
```

## ข้อจำกัดที่ต้องรู้

- **ไฟล์แนบในฟอร์มรวมไม่เกิน 4 MB** — Vercel ปฏิเสธ request ที่ใหญ่กว่า 4.5 MB ก่อนถึงโค้ด
  (ไฟล์ใหญ่ให้ทีมขอรับทาง LINE/อีเมลหลังติดต่อกลับ)
- **เปลี่ยน slug ของหน้าที่เผยแพร่แล้ว = ลิงก์เดิมเป็น 404** — ถ้าจำเป็นต้องทำ redirect 301 ใน `next.config.ts`
- โลโก้/ไอคอนสร้างจากโลโก้จริงของบริษัทด้วย `node scripts/make-brand.mjs` (ตัดขอบเท่านั้น ไม่แก้ตัวโลโก้)
- เว็บนี้ **ไม่เกี่ยวกับแบรนด์แอป WiRix (เดิมชื่อ Flowix)** — ห้ามใช้ไอคอน/ชื่อของแอปที่นี่
