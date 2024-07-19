"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useRecoilState } from "recoil";

import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

const MyAvailContent = ({
  avail,
  setAvail,
}: {
    avail: number,
    setAvail: React.Dispatch<React.SetStateAction<number>>,
  }) => { 
  const router = useRouter();
  const [number, setNumber] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const putWakeup = async (type: "hol" | "jak") => {
    setLoading(true);
    const loading = alert.loading("기상송 신청 중 입니다.");
    try{
      const res = await instance.post(
        "/api/wakeup/apply", {
          type
        }
      );
      setAvail(res.data.available);
      setNumber(res.data.number);
      router.refresh();
      alert.update(loading, res.data.message, res.data.success ? "success" : "warning");
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
  };

  return (
    <article className="flex flex-col gap-3">
      <section className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">나의 신청 가능 횟수</h1>
        <h1 className="text-base text-primary">홀/짝 맞추면 신청권 2배, 틀리면 0개</h1>
      </section>
      <div className={[
        "flex flex-row items-center justify-between bg-white border border-text/10 py-4",
        loading ? "loading_background" : "",
      ].join(" ")}>
        <button
          className="w-full font-semibold text-xl cursor-pointer border-r border-text/10 py-2"
          onClick={() => putWakeup("hol")}
        >홀수</button>
        <div className="w-full flex flex-col items-center justify-center">
          <div className="flex flex-row items-center justify-center gap-[0.325rem] w-full">
            <p className="font-light text-sm">신청권</p>
            <p className="font-semibold text-xl">{avail}개</p>
          </div>
          <div className="flex flex-row items-center justify-center gap-[0.325rem] w-full">
            <p className="font-light text-sm">나온 숫자</p>
            <p className="font-semibold text-xl">{number}</p>
          </div>
        </div>
        <button
          className="w-full font-semibold text-xl cursor-pointer border-l border-text/10 py-2"
          onClick={() => putWakeup("jak")}
        >짝수</button>
      </div>
    </article>
  );
};

export default MyAvailContent;