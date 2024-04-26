"use client";

import { AxiosResponse } from "axios";
import React from "react";

import { OutingAndMealData, OutingGetResponse, defaultOutingData } from "@/app/api/outing/utils";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

import OutingOption from "./outingOption";

const Outing = () => {
  const [loading, setLoading] = React.useState(false);
  const [sat, setSat] = React.useState<OutingAndMealData>(defaultOutingData);
  const [sun, setSun] = React.useState<OutingAndMealData>(defaultOutingData);

  React.useEffect(() => {
    getOutingData();
  }, []);

  const getOutingData = async () => {
    setLoading(true);
    try{
      const res: AxiosResponse<OutingGetResponse> = await instance.get("/api/outing");
      setSat(res.data.data.sat);
      setSun(res.data.data.sun);
    }
    catch(e: any){
      alert.error(e.response.data.message);
    }
    setLoading(false);
  };

  const putOutingData = async () => {
    setLoading(true);
    const loading = alert.loading("외출 및 급식 변경 신청 중 입니다.");
    try{
      const res = await instance.put("/api/outing", {
        sat, sun,
      });
      await getOutingData();
      alert.update(loading, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
  };

  return (
    <>
      <section className="flex flex-col gap-5">
        <h1 className="text-xl font-semibold">외출 및 급식 변경 신청하기</h1>
        <OutingOption 
          title="토요일"
          data={sat}
          setData={setSat}
          loading={loading}
        />
        <OutingOption 
          title="일요일"
          data={sun}
          setData={setSun}
          loading={loading}
        />
      </section>
      <button 
        className="bg-primary text-white w-full text-base font-semibold rounded h-10"
        onClick={putOutingData}
      >
        신청하기
      </button>
    </>
  );
};


export default Outing;