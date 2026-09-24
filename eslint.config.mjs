import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * ⚠️ Next.js 16 ถอด `next lint` ออกแล้ว และบังคับใช้ ESLint แบบ flat config
 *    (ดู node_modules/next/dist/docs/01-app/03-api-reference/05-config/03-eslint.md)
 * ⚠️ ใช้ core-web-vitals ไม่ใช่ชุดพื้นฐาน — ชุดนี้ยกระดับกฎที่กระทบคะแนน Lighthouse
 *    (เช่นใช้ <img> แทน next/image) จาก "เตือน" เป็น "ผิด" ทำให้ build ไม่ผ่านถ้าพลาด
 */
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
