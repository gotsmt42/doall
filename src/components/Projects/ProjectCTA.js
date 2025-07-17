import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-16 text-center">
      <p className="text-lg text-gray-700 dark:text-gray-300">
        สนใจร่วมงานหรือสอบถามข้อมูลโครงการเพิ่มเติม
      </p>
      <button
        onClick={() => navigate("/contact")}
        className="inline-block mt-4 px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        📩 ติดต่อเรา
      </button>
    </div>
  );
};

export default ProjectCTA;
