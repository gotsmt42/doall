import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { products } from "../data/products";

// 🌀 Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const Products = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Helmet>
        <title>
          สินค้าและบริการ - บริษัท ดูออล อาคิเทค แอนด์ เอ็นจิเนียริ่ง จำกัด
        </title>
        <meta
          name="description"
          content="สำรวจผลิตภัณฑ์และบริการด้านนวัตกรรม วิศวกรรม และเทคโนโลยีของบริษัท ดูออล อาคิเทค แอนด์ เอ็นจิเนียริ่ง จำกัด"
        />
      </Helmet>

      <h1 className="text-4xl font-bold text-center text-red-800 dark:text-red-200 mb-16">
        {t("products.heading")}
      </h1>

      {/* 🔖 Product Categories */}
      {products.map((group, catIndex) => (
        <section key={catIndex} className="mb-20">
          <h2 className="text-2xl font-semibold text-red-700 dark:text-red-300 mb-6 border-l-4 pl-4 border-red-600 dark:border-red-400">
            {group.category}
          </h2>

          <div className="relative">
            <Swiper
              modules={[Navigation]}
              navigation={
                group.items.length > 4
                  ? {
                      nextEl: `.next-btn-${catIndex}`,
                      prevEl: `.prev-btn-${catIndex}`,
                    }
                  : false
              }
              spaceBetween={12}
              slidesPerView={1.1}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="pb-8"
            >
              {group.items.map((item, idx) => (
                <SwiperSlide key={idx}>
                  <div className="p-4 sm:p-6 rounded-lg border bg-white dark:bg-gray-800 shadow hover:shadow-lg transition flex flex-col justify-between min-h-[480px] h-full">
                    <div>
                      <div className="aspect-[16/9] w-full rounded overflow-hidden mb-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-3xl sm:text-4xl mb-2">
                        {item.icon}
                      </div>
                      <h3 className="mt-5 text-lg sm:text-xl font-semibold text-red-700 dark:text-red-300 leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-5 pt-5 pb-5 text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-col sm:flex-row gap-3">
                      <Link
                        to={`/services/${item.id}`}
                        className="text-sm bg-blue-600 dark:bg-red-400 text-white dark:text-gray-900 px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-red-300 transition text-center"
                      >
                        ดูรายละเอียดเพิ่มเติม
                      </Link>
                      <a
                        href="/contact"
                        className="text-sm bg-primary text-white px-4 py-2 rounded hover:bg-red-700 transition text-center"
                      >
                        ติดต่อเรา
                      </a>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* ⬅️ ลูกศรเลื่อนเฉพาะเมื่อมีมากกว่า 4 */}
            {group.items.length > 4 && (
              <>
                <button
                  className={`prev-btn-${catIndex} hidden sm:block absolute -left-10 top-1/2 -translate-y-1/2 z-20 text-4xl font-bold text-red-600/40 hover:text-red-600 dark:text-red-300/40 dark:hover:text-red-300 transition-colors duration-300`}
                  aria-label="เลื่อนไปก่อนหน้า"
                >
                  {"<"}
                </button>
                <button
                  className={`next-btn-${catIndex} hidden sm:block absolute -right-10 top-1/2 -translate-y-1/2 z-20 text-4xl font-bold text-red-600/40 hover:text-red-600 dark:text-red-300/40 dark:hover:text-red-300 transition-colors duration-300`}
                  aria-label="เลื่อนไปถัดไป"
                >
                  {">"}
                </button>
              </>
            )}
          </div>
        </section>
      ))}

      {/* 📩 CTA */}
      <div className="mt-20 text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t("products.des")}
        </p>
        <a
          href="/contact"
          className="inline-block mt-4 px-6 py-3 bg-primary text-white rounded hover:bg-red-700 transition"
        >
          📩 {t("products.contact")}
        </a>
      </div>
    </section>
  );
};

export default Products;
