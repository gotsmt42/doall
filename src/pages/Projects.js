import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const Projects = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-20 px-6 max-w-6xl mx-auto text-gray-800 dark:text-gray-100">
      <Helmet>
        <title>
          ผลงานของเรา - บริษัท ดูออล อาคิเทค แอนด์ เอ็นจิเนียริ่ง จำกัด
        </title>
        <meta
          name="description"
          content="สำรวจผลงานโครงการต่าง ๆ ของเรา ตั้งแต่โครงการอัจฉริยะไปจนถึงเทคโนโลยีเพื่อสิ่งแวดล้อม"
        />
      </Helmet>

      <h1 className="text-4xl font-bold text-center text-red-800 dark:text-red-200 mb-12">
        {t("projects.heading")}
      </h1>

      {/* 🔧 Project Highlights */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white dark:bg-gray-800 p-6 shadow hover:shadow-xl rounded transition">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
            🔌 โครงการระบบอัจฉริยะ A
          </h2>
          <p>
            ระบบควบคุมอัตโนมัติแบบเรียลไทม์ที่ช่วยเพิ่มประสิทธิภาพในภาคอุตสาหกรรม
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 shadow hover:shadow-xl rounded transition">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
            🌱 โครงการสีเขียว B
          </h2>
          <p>
            การใช้พลังงานแสงอาทิตย์ในอาคารสำนักงาน ลดการปล่อยคาร์บอน 40% ภายใน 2
            ปี
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 shadow hover:shadow-xl rounded transition">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
            🏗️ โครงสร้างพื้นฐาน C
          </h2>
          <p>งานออกแบบและควบคุมโครงการขนาดใหญ่ระดับ Smart City สำหรับภาครัฐ</p>
        </div>
      </div>

      {/* 🎥 Media Showcase */}
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <iframe
            className="w-full aspect-video rounded shadow"
            src="https://www.youtube.com/embed/your_video_id"
            title="Company Presentation"
            allowFullScreen
          ></iframe>
          <p className="mt-2 text-sm text-center text-gray-500">
            🎬 วิดีโอแนะนำโครงการ & การนำเสนอบริษัท
          </p>
        </div>

        <div>
          <img
            src="/images/project_A.jpg"
            alt="ภาพโครงการเด่น"
            className="w-full rounded shadow"
          />
          <p className="mt-2 text-sm text-center text-gray-500">
            📸 ตัวอย่างผลงานจากไซต์งานจริง
          </p>
        </div>
      </div>
    </section>
  );
};

export default Projects;
