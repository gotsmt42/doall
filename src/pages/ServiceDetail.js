import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { services } from "../data/services";

const ServiceDetail = () => {
  const { id } = useParams();
  const service = services.find((s) => s.id === id);
  const [activeTab, setActiveTab] = useState("service"); // 👈 toggle state

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!service) {
    return <div className="text-center mt-20">ไม่พบข้อมูลบริการนี้</div>;
  }

  const renderServiceSection = () =>
    service.sections?.length > 0 ? (
      service.sections.map((section, idx) => (
        <div key={idx}>
          <h2 className="text-xl mb-2 font-bold text-red-600 dark:text-red-300 mb-3">
            {section.heading}
          </h2>

          {/* {section.content && (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {section.content}
            </p>
          )} */}

          {section.list && (
            <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 space-y-2 mt-2">
              {section.list.map((item, i) =>
                typeof item === "string" ? (
                  <li key={`${idx}-${i}`}>{item}</li>
                ) : (
                  <li key={`${idx}-${i}`}>
                    <strong className="text-red-700 dark:text-red-300 block mb-1">
                      {item.type}
                    </strong>
                    {typeof item.description === "string" ? (
                      <span>{item.description}</span>
                    ) : Array.isArray(item.description) ? (
                      <ul className="list-disc ml-4 mt-2 space-y-1">
                        {item.description.map((desc, index) => (
                          <li key={index}>{desc}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      ))
    ) : (
      <p className="text-center text-gray-500">ไม่มีข้อมูลบริการ</p>
    );

  const renderSystemInfo = () =>
    service.systemInfo?.map((systemInfo, idx) => (
      <div key={idx}>
        <h2 className="text-xl font-bold text-red-600 dark:text-red-300 mb-3">
          {systemInfo.heading}
        </h2>

        {systemInfo.content && (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {systemInfo.content}
          </p>
        )}

        {systemInfo.list && (
          <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300 space-y-2 mt-2">
            {systemInfo.list.map((item, i) =>
              typeof item === "string" ? (
                <li key={`${idx}-${i}`}>{item}</li>
              ) : (
                <li key={`${idx}-${i}`}>
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
    ));

  return (
    <>
      <Helmet>
        <title>{service.title}</title>
        <meta name="description" content={service.description} />
      </Helmet>

      <section className="relative w-full aspect-[29/9] mb-6">
        <img
          src={service.image}
          alt={service.title}
          className="absolute w-full h-full object-cover inset-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <h1 className="text-white text-4xl font-bold text-center">
            {service.title}
          </h1>
        </div>
      </section>

      <div className="text-center mb-8">
        <button
          onClick={() => setActiveTab("service")}
          className={`mx-2 px-4 py-2 rounded ${
            activeTab === "service"
              ? "bg-red-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          }`}
        >
          บริการของเรา
        </button>
        <button
          onClick={() => setActiveTab("system")}
          className={`mx-2 px-4 py-2 rounded ${
            activeTab === "system"
              ? "bg-red-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          }`}
        >
          ข้อมูลระบบ
        </button>
      </div>

      {/* 📄 Content Section */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        {activeTab === "service" ? renderServiceSection() : renderSystemInfo()}
      </section>
    </>
  );
};

export default ServiceDetail;
