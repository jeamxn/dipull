"use client";

import React from "react";
import Swal from "sweetalert2";

import Insider from "@/provider/insider";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

import Menu from "../menu";


const team_korean_to_english: {
  [key: string]: "blue" | "white";
} = {
  "청팀": "blue",
  "백팀": "white",
};

const type_korean_to_english: {
  [key: string]: "score" | "set";
} = {
  "세트": "set",
  "경기": "score",
};

const Homecoming = () => {
  const [loading, setLoading] = React.useState(false);
  const [current, setCurrent] = React.useState("");


  const putScoreDataSwal = async () => {
    Swal.fire({
      title: "경기 종목 설정",
      text: "설정 시 경기 점수가 초기화됩니다. 설정 후 복구가 불가능합니다.",
      showCancelButton: true,
      confirmButtonText: "설정하기",
      confirmButtonColor: "#e11d48",
      cancelButtonText: "취소",
    }).then((res) => {
      if(res.isConfirmed){
        putScoreData();
      }
    });
  };

  const putScoreData = async () => {
    setLoading(true);
    const loading_alert = alert.loading("경기 종목 설정 중");
    try{
      const res = await instance.put("/api/atheletic/current", {
        current,
      });
      getCurrent();
      alert.update(loading_alert, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading_alert, e.response.data.message, "error");
    }
    setLoading(false);
  };

  const getCurrent = async () => {
    setLoading(true);
    try{
      const { data } = await instance.get("/api/atheletic/current");
      setCurrent(data.data);
    }
    catch(e){
      console.error(e);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getCurrent();
  }, []);

  return (
    <>
      <Menu />
      <Insider>
        <section className="flex flex-col gap-3">
          <section className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold">종목 변경</h1>
            <h1 className="text-base text-[#e11d48]">종목명을 변경하면 점수가 초기화됩니다. 주의하세요.</h1>
          </section>
          <section className="flex flex-col gap-1">
            {/* <h1 className="text-xl font-semibold w-max whitespace-nowrap">종목 변경</h1> */}
            <section className={[
              "bg-white p-5 border border-text/10 rounded",
              loading ? "loading_background" : "",
            ].join(" ")}>
              <input 
                type="text" 
                placeholder="변경할 종목명을 입력하세요." 
                className="w-full h-10 border border-text/10 rounded px-3 bg-transparent"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
            </section>
          </section>

          <button 
            className="bg-primary text-white w-full text-base font-semibold rounded h-10"
            onClick={putScoreDataSwal}
          >
            경기 종목 변경하기
          </button>

        </section>
      </Insider>
    </>
  );
};


export default Homecoming;