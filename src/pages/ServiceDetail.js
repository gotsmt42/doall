import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { services } from "../data/services";

const ServiceDetail = () => {
  const { id } = useParams();
  const service = services.find((s) => s.id === id);
  

  if (!service) {
    return <div className="text-center mt-20">ไม่พบข้อมูลบริการนี้</div>;
  }

  return (
    <>
      <Helmet>
        <title>{service.title}</title>
        <meta name="description" content={service.description} />
      </Helmet>

      {/* 🔥 Banner Section */}
      <section className="relative w-full aspect-[21/9] mb-6">
        <img
          src={service.image}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <h1 className="text-white text-3xl sm:text-4xl font-bold text-center">
            {service.title}
          </h1>
        </div>
      </section>

      {/* 📝 Main Content Section */}
      <section className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {service.sections?.map((section, idx) => (
          <div key={idx}>
            <h2 className="text-xl font-semibold mb-3 text-red-600 dark:text-red-300">
              {section.heading}
            </h2>

            {/* ถ้ามีเนื้อหาแบบข้อความ */}
            {section.content && (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {section.content}
              </p>
            )}

            {/* ถ้ามีรายการแบบ list */}
            {section.list && Array.isArray(section.list) && (
              <ul className="list-disc ml-5 space-y-2 text-gray-700 dark:text-gray-300 mt-2">
                {section.list.map((item, i) =>
                  typeof item === "string" ? (
                    <li key={i}>{item}</li>
                  ) : (
                    <li key={i}>
                      <strong className="text-red-700 dark:text-red-300 block mb-1">
                        {item.type}
                      </strong>
                      <span>{item.description}</span>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        ))}

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href="/contact"
            className="inline-block px-6 py-2 bg-red-600 dark:bg-red-400 text-white dark:text-gray-900 rounded shadow hover:bg-red-700 dark:hover:bg-red-300 transition"
          >
            ติดต่อเพื่อขอรายละเอียดเพิ่มเติม
          </a>
        </div>
      </section>
    </>
  );
};

export default ServiceDetail;
