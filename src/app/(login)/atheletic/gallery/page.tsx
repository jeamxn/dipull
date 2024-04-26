"use client";
import moment from "moment";
import Image from "next/image";
import React from "react";

import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

const Gallary = () => {
  const [loading, setLoading] = React.useState(false);
  const [gallery, setGallery] = React.useState<{
    _id: string;
    id: string;
    thumbnail: string;
    time: string;
    like: number;
    comment: number;
    text: string;
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
  const get = async () => {
    setLoading(true);
    const alert__ = alert.loading("인스타그램에서 게시물을 불러오는 중입니다.");
    try {
      await instance.get("/api/atheletic/instragram");
      await getGallery();
      alert.update(alert__, "게시물을 불러왔습니다.", "success");
    } catch (e: any) {
      // alert.error(e.response.data.message);
      alert.update(alert__, e.response.data.message || "게시물을 불러오는데 실패했습니다.", "error");
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getGallery();
  }, []);

  return (
    <>
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">갤러리</h1>
          <div className="flex flex-row gap-2">
            <h6 
              className="w-full bg-primary text-white font-semibold px-4 py-2 rounded-md text-base"
            >인스타그램에 [ #{process.env.NEXT_PUBLIC_INSTA_TAG} ]을/를 적은 게시물을 공유해보세요!</h6>
            <button
              className="bg-primary text-white font-semibold px-6 py-2 rounded-md text-base"
              onClick={get}
            >불러오기</button>
          </div>
        </div>
        <section className="flex flex-wrap gap-4 flex-row items-center justify-center">
          {
            loading && gallery.length === 0 ? <p>로딩 중...</p> : gallery.map((v, i) => (
              <a key={i} href={`https://www.instagram.com/p/${v.id}`} target="_blank" rel="noreferrer">
                <section className="rounded-md max-w-80 w-full flex flex-col pt-10 pb-8 pr-5 pl-5 gap-3 bg-white border border-text/10">
                  <Image
                    src={v.thumbnail}
                    alt="gallery"
                    width={300}
                    height={400}
                    className="w-full rounded-md object-cover aspect-34 border border-text/10"
                  />
                  <p className="font-normal truncate">{v.text}</p>
                  <div className="flex flex-row justify-between gap-8">
                    <div className="flex flex-row gap-3 justify-center items-center">
                      <div className="flex flex-row gap-1 items-center justify-center">
                        <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.1808 18.2844C9.94745 18.2844 9.70995 18.2427 9.46829 18.1594C9.22662 18.076 9.01412 17.9427 8.83079 17.7594L7.10579 16.1844C5.33912 14.5677 3.74329 12.9635 2.31829 11.3719C0.893286 9.78021 0.180786 8.02604 0.180786 6.10938C0.180786 4.54271 0.705786 3.23438 1.75579 2.18438C2.80579 1.13438 4.11412 0.609375 5.68079 0.609375C6.56412 0.609375 7.39745 0.796875 8.18079 1.17188C8.96412 1.54688 9.63079 2.05938 10.1808 2.70938C10.7308 2.05938 11.3975 1.54688 12.1808 1.17188C12.9641 0.796875 13.7975 0.609375 14.6808 0.609375C16.2475 0.609375 17.5558 1.13438 18.6058 2.18438C19.6558 3.23438 20.1808 4.54271 20.1808 6.10938C20.1808 8.02604 19.4725 9.78438 18.0558 11.3844C16.6391 12.9844 15.0308 14.5927 13.2308 16.2094L11.5308 17.7594C11.3475 17.9427 11.135 18.076 10.8933 18.1594C10.6516 18.2427 10.4141 18.2844 10.1808 18.2844ZM9.23079 4.70938C8.74745 4.02604 8.23079 3.50521 7.68079 3.14688C7.13079 2.78854 6.46412 2.60938 5.68079 2.60938C4.68079 2.60938 3.84745 2.94271 3.18079 3.60938C2.51412 4.27604 2.18079 5.10938 2.18079 6.10938C2.18079 6.97604 2.48912 7.89688 3.10579 8.87188C3.72245 9.84688 4.45995 10.7927 5.31829 11.7094C6.17662 12.626 7.05995 13.4844 7.96829 14.2844C8.87662 15.0844 9.61412 15.7427 10.1808 16.2594C10.7475 15.7427 11.485 15.0844 12.3933 14.2844C13.3016 13.4844 14.185 12.626 15.0433 11.7094C15.9016 10.7927 16.6391 9.84688 17.2558 8.87188C17.8725 7.89688 18.1808 6.97604 18.1808 6.10938C18.1808 5.10938 17.8475 4.27604 17.1808 3.60938C16.5141 2.94271 15.6808 2.60938 14.6808 2.60938C13.8975 2.60938 13.2308 2.78854 12.6808 3.14688C12.1308 3.50521 11.6141 4.02604 11.1308 4.70938C11.0141 4.87604 10.8725 5.00104 10.7058 5.08438C10.5391 5.16771 10.3641 5.20938 10.1808 5.20938C9.99745 5.20938 9.82245 5.16771 9.65579 5.08438C9.48912 5.00104 9.34745 4.87604 9.23079 4.70938Z" fill="rgb(var(--color-text) / 1)"/>
                        </svg>
                        <p className="">{v.like}</p>
                      </div>
                      <div className="flex flex-row gap-1 items-center justify-center">
                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.70862 17.177H9.45862C7.09195 17.177 5.08362 16.352 3.43362 14.702C1.78362 13.052 0.958618 11.0437 0.958618 8.677C0.958618 6.31034 1.78362 4.302 3.43362 2.652C5.08362 1.002 7.09195 0.177002 9.45862 0.177002C10.642 0.177002 11.7461 0.397835 12.7711 0.839502C13.7961 1.28117 14.6961 1.8895 15.4711 2.6645C16.2461 3.4395 16.8545 4.3395 17.2961 5.3645C17.7378 6.3895 17.9586 7.49367 17.9586 8.677C17.9586 10.9103 17.3295 12.9853 16.0711 14.902C14.8128 16.8187 13.2253 18.3187 11.3086 19.402C11.142 19.4853 10.9753 19.5312 10.8086 19.5395C10.642 19.5478 10.492 19.5103 10.3586 19.427C10.2253 19.3437 10.1086 19.2353 10.0086 19.102C9.90862 18.9687 9.85028 18.8103 9.83362 18.627L9.70862 17.177ZM11.9586 16.527C13.142 15.527 14.1045 14.3562 14.8461 13.0145C15.5878 11.6728 15.9586 10.227 15.9586 8.677C15.9586 6.86034 15.3295 5.32284 14.0711 4.0645C12.8128 2.80617 11.2753 2.177 9.45862 2.177C7.64195 2.177 6.10445 2.80617 4.84612 4.0645C3.58778 5.32284 2.95862 6.86034 2.95862 8.677C2.95862 10.4937 3.58778 12.0312 4.84612 13.2895C6.10445 14.5478 7.64195 15.177 9.45862 15.177H11.9586V16.527Z" fill="rgb(var(--color-text) / 1)"/>
                        </svg>
                        <p className="">{v.comment}</p>
                      </div>
                    </div> 
                    <p className="">{ moment(v.time).format("YYYY-MM-DD HH:mm") }</p>
                  </div>
                </section>
              </a>
            ))
          }
        </section>
      </section>
    </>
  );
};


export default Gallary;