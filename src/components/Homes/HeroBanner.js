import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";

const HeroBanner = ({ bannerImages, handleScroll, collapsed }) => {
  return (
<div className={`relative hidden md:block`}>
      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={{ delay: 4000 }}
        loop={true}
        navigation={true}
        className="w-full overflow-hidden z-0"
      >
        {bannerImages.map((item) => (
          <SwiperSlide key={item.id}>
            <section className="relative w-full aspect-[18/8]">
              <img
                src={item.src}
                alt={item.alt}
                className="absolute inset-0 w-full h-full object-fill"
                loading="lazy"
              />
            </section>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 🔽 ลูกศร */}
      <button
        onClick={handleScroll}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 animate-bounce"
        aria-label="Scroll down"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-16 text-white hover:text-red-300 transition"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
};

export default HeroBanner;
