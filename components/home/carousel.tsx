"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

const images = ["/carousel/1.jpg", "/carousel/2.jpg", "/carousel/3.jpg"];

export default function Carousel() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={10}
      slidesPerView={1}
      loop={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      className="w-full h-130"
    >
      {images.map((src) => (
        <SwiperSlide key={src} className="relative">
          <Image
            src={src}
            alt="Carousel image"
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "50% 15%" }}
            unoptimized
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
