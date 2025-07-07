// src/pages/Home.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";

import systemBannerDark from "../assets/system-banner-4-dark.png";


import fireAlarmImg from "../assets/fire-alarm.jpg";
import cctvImg from "../assets/cctv.jpg";
import firePumpImg from "../assets/fire-pump.jpg";

const Home = () => {
   const { t } = useTranslation();
  // ด้านบนของ Home.jsx
 const bannerImages = [
   
    {
      id: 1,
      src: systemBannerDark,
      alt: "ระบบแจ้งเหตุเพลิงไหม้",
      title: "ระบบแจ้งเหตุเพลิงไหม้",
      buttonText: "ดูรายละเอียด",
      buttonUrl: "/services/fire-alarm",
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t("home.title")}</title>
        <meta name="description" content={t("home.description")} />
      </Helmet>

      {/* 🌟 HERO Banner Slides */}
      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={{ delay: 4000 }}
        loop={true}
        navigation={true}
        className="w-full relative overflow-hidden z-0"
      >
        {bannerImages.map((item) => (
          <SwiperSlide key={item.id}>
            <section className="relative aspect-[19/9]">
              <img
                src={item.src}
                alt={item.alt}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </section>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* 🛠 Services Section */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-10 text-red-700 dark:text-red-200">
          {t("home.services_title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* 🔥 Fire Alarm System */}
          <div className="flex flex-col bg-white dark:bg-gray-800 shadow p-6 rounded text-center min-h-[500px]">
            <img
              src={fireAlarmImg}
              alt="ระบบแจ้งเหตุเพลิงไหม้"
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">
              ระบบแจ้งเหตุเพลิงไหม้ (Fire Alarm System)
            </h3>
            <p className="mt-auto text-gray-600 dark:text-gray-300 mb-4">
              ระบบแจ้งเตือนอัตโนมัติเมื่อตรวจพบควันหรือความร้อน
              พร้อมระบบเซ็นเซอร์และแผงควบคุมกลางที่เชื่อมต่อทั่วอาคาร
            </p>
            <div className="mt-auto">
              <a
                href="/services/fire-alarm"
                className="inline-block text-sm font-medium text-red-600 dark:text-red-300 underline hover:text-red-800 dark:hover:text-red-100 transition"
              >
                ดูรายละเอียดเพิ่มเติม →
              </a>
            </div>
          </div>

          {/* 🎥 CCTV System */}
          <div className="flex flex-col bg-white dark:bg-gray-800 shadow p-6 rounded text-center min-h-[500px]">
            <img
              src={cctvImg}
              alt="ระบบ CCTV"
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">
              ระบบกล้องโทรทัศน์วงจรปิด (CCTV)
            </h3>
            <p className="mt-auto  text-gray-600 dark:text-gray-300 mb-4">
              ระบบเฝ้าระวังด้วยกล้องความละเอียดสูง บันทึกวิดีโอได้ต่อเนื่อง
              ตรวจสอบย้อนหลังผ่าน cloud หรือ local storage ได้ทันที
            </p>
            <div className="mt-auto">
              <a
                href="/services/cctv"
                className="inline-block text-sm font-medium text-red-600 dark:text-red-300 underline hover:text-red-800 dark:hover:text-red-100 transition"
              >
                ดูรายละเอียดเพิ่มเติม →
              </a>
            </div>
          </div>

          {/* 🧯 Fire Pump System */}
          <div className="flex flex-col bg-white dark:bg-gray-800 shadow p-6 rounded text-center min-h-[500px]">
            <img
              src={firePumpImg}
              alt="ระบบดับเครื่องสูบน้ำดับเพลิง"
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">
              ระบบดับเครื่องสูบน้ำดับเพลิง (Fire Pump System)
            </h3>
            <p className="mt-auto  text-gray-600 dark:text-gray-300 mb-4">
              ระบบดับเพลิงแรงดันสูงที่ทำงานทันทีเมื่อตรวจพบการลุกไหม้
              สามารถส่งน้ำไปยังหัวฉีดตามจุดต่าง ๆ ได้รวดเร็วแม่นยำ
            </p>
            <div className="mt-auto">
              <a
                href="/services/fire-pump"
                className="inline-block text-sm font-medium text-red-600 dark:text-red-300 underline hover:text-red-800 dark:hover:text-red-100 transition"
              >
                ดูรายละเอียดเพิ่มเติม →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 Highlights Section */}
      <section className="py-12 bg-red-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-100 mb-6">
            {t("home.why_title")}
          </h2>
          <ul className="space-y-4 text-gray-700 dark:text-gray-300 text-left mx-auto max-w-md">
            <li>✅ {t("home.why1")}</li>
            <li>✅ {t("home.why2")}</li>
            <li>✅ {t("home.why3")}</li>
            <li>✅ {t("home.why4")}</li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Home;
