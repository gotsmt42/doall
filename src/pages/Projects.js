import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import ProjectGrid from "../components/Projects/ProjectGrid";
import MediaShowcase from "../components/Projects/MediaShowcase";
import ProjectCTA from "../components/Projects/ProjectCTA";

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

      <ProjectGrid />
      <MediaShowcase />
      <ProjectCTA />
    </section>
  );
};

export default Projects;
