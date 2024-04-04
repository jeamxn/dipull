"use client";
import moment from "moment";
import Image from "next/image";
import React from "react";
import SwiperCore from "swiper";
import { Navigation, Scrollbar, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Insider from "@/provider/insider";
import instance from "@/utils/instance";

import Menu from "../menu";


const Gallary = () => {
  const [loading, setLoading] = React.useState(false);
  const [gallery, setGallery] = React.useState<{
    _id: string;
    name: string;
    username: string;
    content: string;
    profile: string;
    image: string[];
    time: string;
  }[]>([]);
  const getGallery = async () => {
    setLoading(true);
    try {
      const { data } = await instance.get("/api/atheletic/gallery");
      setGallery(data.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getGallery();
  }, []);

  SwiperCore.use([Navigation, Scrollbar, Autoplay]);
  
  return (
    <>
      <Menu />
      <Insider>
        <section className="flex flex-col gap-3">
          <h1 className="text-xl font-semibold">갤러리</h1>
          <h6 
            className={[
              "w-full bg-primary text-white font-semibold px-4 py-2 rounded-md text-base",
            ].join(" ")}
          >인스타그램에 [ #{process.env.NEXT_PUBLIC_INSTA_TAG} ]을/를 적은 게시물을 공유해보세요!</h6>
          <section className="flex flex-wrap gap-6 flex-row items-center justify-center">
            {
              loading ? <p>로딩 중...</p> : gallery.map((v, i) => (
                <a key={i} href={`https://www.instagram.com/${v.username}`} target="_blank" rel="noreferrer">
                  <section className=" max-w-96 flex flex-col pt-10 pb-8 pr-5 pl-5 gap-3 bg-[#fff] bg-opacity-90 border border-text/10">
                    <Image
                      src={v.image[0]}
                      alt="gallery"
                      width={2048}
                      height={2048}
                      className="w-full rounded-md object-cover aspect-34"
                    />
                    <div className="flex flex-row justify-between">
                      <p className="text-[#000]">{v.name} / @{v.username}</p> 
                      <p className="text-[#000]">{ moment(v.time).format("YYYY-MM-DD HH:mm") }</p>
                    </div>
                  </section>
                </a>
              ))
            }
          </section>
        </section>
      </Insider>
    </>
  );
};


export default Gallary;