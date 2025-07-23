import React from "react";
import { useParams } from "react-router-dom";
import { projects } from "../data/projects";
import { Helmet } from "react-helmet-async";

const ProjectDetail = () => {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="text-center mt-20 text-gray-500">
        ไม่พบข้อมูลโปรเจกต์นี้
      </div>
    );
  }

  return (
    <section className="py-20 px-6 max-w-3xl mx-auto text-gray-800 dark:text-gray-100">
      <Helmet>
        <title>{project.title} - รายละเอียดโปรเจกต์</title>
      </Helmet>

      <div className="mb-6">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-80 object-cover rounded shadow"
        />
      </div>

      <h1 className="text-3xl font-bold text-red-700 dark:text-red-300 mb-4">
        {project.title}
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
        {project.description}
      </p>

      <ul className="list-disc ml-6 mt-4 text-gray-700 dark:text-gray-300 space-y-2">
  <li>มีระบบควบคุมผ่านแอปพลิเคชันมือถือ</li>
  <li>ตรวจสอบสถานะอุปกรณ์แบบ real-time</li>
  <li>รองรับการเชื่อมต่อ IoT ในภาคอุตสาหกรรม</li>
</ul>

      {/* เพิ่มข้อมูลเพิ่มเติมได้ที่นี่ เช่น bullet list, video, gallery, etc. */}
    </section>
  );
};

export default ProjectDetail;
