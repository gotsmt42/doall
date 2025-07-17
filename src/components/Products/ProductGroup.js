import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "./ProductCard";

const ProductGroup = ({ group, index }) => (
  <section className="mb-20">
    <h2 className="text-2xl font-semibold text-red-700 dark:text-red-300 mb-6 border-l-4 pl-4 border-red-600 dark:border-red-400">
      {group.category}
    </h2>

    <div className="relative">
      <Swiper
        modules={[Navigation]}
        navigation={
          group.items.length > 4
            ? {
                nextEl: `.next-btn-${index}`,
                prevEl: `.prev-btn-${index}`,
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
            <ProductCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>

      {group.items.length > 4 && (
        <>
          <button
            className={`prev-btn-${index} hidden sm:block absolute -left-10 top-1/2 -translate-y-1/2 z-20 text-4xl font-bold text-red-600/40 hover:text-red-600 dark:text-red-300/40 dark:hover:text-red-300 transition-colors duration-300`}
            aria-label="เลื่อนไปก่อนหน้า"
          >
            {"<"}
          </button>
          <button
            className={`next-btn-${index} hidden sm:block absolute -right-10 top-1/2 -translate-y-1/2 z-20 text-4xl font-bold text-red-600/40 hover:text-red-600 dark:text-red-300/40 dark:hover:text-red-300 transition-colors duration-300`}
            aria-label="เลื่อนไปถัดไป"
          >
            {">"}
          </button>
        </>
      )}
    </div>
  </section>
);

export default ProductGroup;
