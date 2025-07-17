import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import HeroBanner from "../components/Homes/HeroBanner";
import ServiceCard from "../components/Services/ServiceCard";
import HighlightList from "../components/Homes/HighlightList";
import { bannerImages } from "../data/bannerImages";

import fireAlarmImg from "../assets/fire-alarm.jpg";
import cctvImg from "../assets/cctv.jpg";
// import firePumpImg from "../assets/fire-pump.jpg";

const Home = () => {
  const { t } = useTranslation();

  const handleScrollDown = () => {
    const target = document.getElementById("content");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("home.title")}</title>
        <meta name="description" content={t("home.description")} />
      </Helmet>

      <HeroBanner bannerImages={bannerImages} handleScroll={handleScrollDown} />

      {/* 🛠 Services */}
      <section id="content" className="py-16 max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-10 text-red-700 dark:text-red-200">
          {t("home.services_title")}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <ServiceCard
            img={fireAlarmImg}
            title="ระบบแจ้งเหตุเพลิงไหม้ (Fire Alarm System)"
            desc="ระบบแจ้งเตือนอัตโนมัติเมื่อตรวจพบควันหรือความร้อน พร้อมระบบเซ็นเซอร์และแผงควบคุมกลางที่เชื่อมต่อทั่วอาคาร"
            link="/services/fire-alarm"
          />
          <ServiceCard
            img={cctvImg}
            title="ระบบกล้องโทรทัศน์วงจรปิด (CCTV)"
            desc="ระบบเฝ้าระวังด้วยกล้องความละเอียดสูง บันทึกวิดีโอได้ต่อเนื่อง ตรวจสอบย้อนหลังผ่าน cloud หรือ local storage ได้ทันที"
            link="/services/cctv"
          />
          {/* ถ้าต้องการเปิด fire pump system: เพิ่ม ServiceCard ตรงนี้ */}
        </div>
      </section>

      <HighlightList />
    </>
  );
};

export default Home;
