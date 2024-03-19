"use client";

import { AxiosResponse } from "axios";
import React from "react";

import Insider from "@/provider/insider";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

import Menu from "../menu";

const Homecoming = () => {
  const [loading, setLoading] = React.useState(false);
  const [myApply, setMyApply] = React.useState("");
  const [input, setInput] = React.useState("");

  const getHomecomingData = async () => {
    setLoading(true);
    try{
      const res: AxiosResponse = await instance.get("/api/homecoming");
      setMyApply(res.data.data.reason);
      setInput(res.data.data.reason);
    }
    catch(e: any){
      alert.error(e.response.data.message);
    }
    setLoading(false);
  };
  const putHomecomingData = async () => {
    setLoading(true);
    try{
      await instance.put("/api/homecoming", { reason: input });
      await getHomecomingData();
      alert.success("금요귀가 신청이 완료되었습니다.");
    }
    catch(e: any){
      alert.error(e.response.data.message);
    }
    setLoading(false);
  };
  const deleteHomecomingData = async () => {
    setLoading(true);
    try{
      await instance.delete("/api/homecoming");
      await getHomecomingData();
      alert.success("금요귀가 신청이 취소되었습니다.");
    }
    catch(e: any){
      alert.error(e.response.data.message);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getHomecomingData();
  }, []);

  return (
    <>
      <Menu />
      <Insider>
        <section className="flex flex-col gap-3">
          <section className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold">금요귀가 신청하기</h1>
            <h1 className="text-base text-[#e11d48]">학년부 또는 생활관 사정에 따라 금요귀가 신청이 반려될 수 있습니다.</h1>
          </section>
          <section className={[
            "bg-white p-5 border border-text/10 rounded",
            loading ? "loading_background" : "",
          ].join(" ")}>
            <input 
              type="text" 
              placeholder="금요귀가 사유를 입력해주세요." 
              className="w-full h-10 border border-text/10 rounded px-3 bg-transparent"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading || !!myApply}
            />
          </section>
          {
            myApply ? (
              <button 
                className="w-full py-2 rounded font-semibold text-[#EF4444] border border-[#EF4444]"
                onClick={deleteHomecomingData}
              >
              금요귀가 신청 취소하기
              </button>
            ) : (
              <button 
                className="bg-primary text-white w-full text-base font-semibold rounded h-10"
                onClick={putHomecomingData}
              >
              금요귀가 신청하기
              </button>
            )
          }
        </section>
      </Insider>
    </>
  );
};


export default Homecoming;