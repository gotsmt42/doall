import React from "react";
import { projects } from "../../data/projects";
import { useNavigate } from "react-router-dom";

const ProjectGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white dark:bg-gray-800 p-6 shadow hover:shadow-xl rounded transition flex flex-col"
        >
          {/* 🖼️ รูปปก */}
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-60 object-cover rounded mb-4"
          />

          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
            {project.title}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>

          <button
            onClick={() => navigate(`/projects/${project.id}`)}
            className="mt-auto text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            ชมผลงาน →
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProjectGrid;
