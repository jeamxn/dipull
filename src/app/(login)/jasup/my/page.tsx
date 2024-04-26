"use client";

import React from "react";

import { JasupData, JasupWhere, WeekDayTime, getCurrentTime, koreanWhereTypeToEnglish } from "@/app/api/jasup/utils";
import { Outing } from "@/app/api/outing/utils";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

import Select from "./select";

const Jasup = () => {
  const [loading, setLoading] = React.useState(false);
  const [where, setWhere] = React.useState<JasupWhere>("none");
  const [etc, setEtc] = React.useState<JasupData["etc"]>("");
  const [tmpOuting, setTmpOuting] = React.useState<Outing>({
    start: WeekDayTime[getCurrentTime()].start,
    end: WeekDayTime[getCurrentTime()].end,
    description: "",
  });

  React.useEffect(() => {
    getJasupData();
  }, []);

  const getJasupData = async () => {
    setLoading(true);
    try{
      const { data } = await instance.post("/api/jasup/my", {});
      const type = data.data.type;
      const etc = data.data.etc;
      setWhere(type);
      setEtc(etc);
      if(type === "outing") setTmpOuting({
        start: etc.split("(")[1].split(")")[0].split("~")[0],
        end: etc.split("(")[1].split(")")[0].split("~")[1],
        description: etc.split("(")[0],
      });
    }
    catch(e: any){
      alert.error(e.response.data.message);
    }
    setLoading(false);
  };

  const putJasupData = async () => {
    setLoading(true);
    const loading = alert.loading("자습 위치 변경 중 입니다.");
    try{
      const res = await instance.put("/api/jasup/my", {
        type: where,
        etc: etc,
      });
      await getJasupData();
      alert.update(loading, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
  };

  return (
    <Select 
      loading={loading}
      etc={etc}
      setEtc={setEtc}
      where={where}
      setWhere={setWhere}
      tmpOuting={tmpOuting}
      setTmpOuting={setTmpOuting}
      onButtonClick={putJasupData}
    />
  );
};


export default Jasup;