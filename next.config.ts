import type { NextConfig } from "next";

/**
 * ⚠️ ห้ามใส่ค่าลับ (API key / SMTP / token) ลงไฟล์นี้หรือที่ไหนในฝั่งเบราว์เซอร์
 *    ค่าที่ขึ้นต้นด้วย NEXT_PUBLIC_ จะถูกฝังลงบันเดิลและผู้ใช้ทุกคนอ่านได้ — ใช้เฉพาะค่าที่เปิดเผยได้จริง
 *    ค่าลับทั้งหมดอ่านใน Route Handler (ฝั่ง server) เท่านั้น ดู src/app/api/lead/route.ts
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * ✅ เปิดเว็บตอนพัฒนาจากมือถือในวง Wi-Fi เดียวกันได้ (เช่น http://10.120.154.229:3200)
   * 🐛 ไม่ตั้งค่านี้ Next.js 16 จะปฏิเสธไฟล์พัฒนาจากโฮสต์ที่ไม่ใช่ localhost — หน้าขึ้นแค่ HTML
   *    React ไม่ทำงาน เมนูมือถือกดไม่ได้ (ตรวจเจอจริง)
   * ⚠️ ใส่เป็นช่วงไอพีวงแลนส่วนตัวทั้งหมด ไม่ผูกไอพีตัวใดตัวหนึ่ง — ไอพี Wi-Fi เปลี่ยนได้ทุกครั้งที่ต่อใหม่
   * ⚠️ มีผลเฉพาะ `next dev` เท่านั้น production ไม่ได้อ่านค่านี้
   */
  allowedDevOrigins: ["10.*.*.*", "192.168.*.*", "172.*.*.*", "*.local"],
  poweredByHeader: false,
  // ✅ ลิงก์ที่ลงท้ายด้วย / กับไม่ลงท้าย ต้องเป็น URL เดียวกันเสมอในสายตา Google
  //    ไม่งั้นจะกลายเป็นเนื้อหาซ้ำสองหน้า (duplicate content) แล้วแย่งอันดับกันเอง
  trailingSlash: false,

  images: {
    // ✅ AVIF ก่อน WebP — ไฟล์เล็กกว่าราว 20-30% เบราว์เซอร์ที่ไม่รองรับจะตกไป WebP เอง
    formats: ["image/avif", "image/webp"],
    // ✅ รูปสินค้า/ผลงาน/บทความที่อัปโหลดจากระบบหลังบ้านเก็บบน Cloudinary
    // 🔒 จำกัดเฉพาะโฟลเดอร์ website/ — ไฟล์แนบของลูกค้า (website-leads) และไฟล์งานภายในต้องผ่าน
    //    ตัวย่อรูปของเว็บสาธารณะไม่ได้ ไม่งั้นใครก็ใช้เว็บเราเป็นทางลัดเปิดไฟล์ภายในได้
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com", pathname: "/*/image/upload/**/website/**" }],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // ✅ ชุดหัวข้อความปลอดภัยขั้นต่ำของเว็บสาธารณะ (มีผลกับคะแนน Best Practices ด้วย)
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // ปิดสิทธิ์อุปกรณ์ที่เว็บนี้ไม่ได้ใช้เลย — ลดพื้นที่ให้สคริปต์แปลกปลอมทำอะไรได้
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
