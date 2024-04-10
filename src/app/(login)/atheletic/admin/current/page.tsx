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
  const [teams, setTeams] = React.useState<{
    left: string;
    right: string;
  }>({
    left: "",
    right: "",
  });

  const resetScoreSwal = async () => {
    Swal.fire({
      title: "세트 점수 초기화",
      text: "세트 점수를 초기화합니다. 주의하세요.",
      showCancelButton: true,
      confirmButtonText: "설정하기",
      confirmButtonColor: "#e11d48",
      cancelButtonText: "취소",
    }).then(async (res) => {
      if(res.isConfirmed){
        resetScore("score");
      }
    });
  };
  const resetSetsScoreSwal = async () => {
    Swal.fire({
      title: "세트 점수 초기화",
      text: "세트 점수를 초기화합니다. 주의하세요.",
      showCancelButton: true,
      confirmButtonText: "설정하기",
      confirmButtonColor: "#e11d48",
      cancelButtonText: "취소",
    }).then(async (res) => {
      if(res.isConfirmed){
        resetScore("set");
      }
    });
  };
  const resetScore = async (type: "set" | "score") => {
    setLoading(true);
    const loading_alert = alert.loading("세트 점수화 초기화 중");
    try{
      const res = await instance.put("/api/atheletic/reset", {
        type,
      });
      alert.update(loading_alert, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading_alert, e.response.data.message, "error");
    }
    setLoading(false);
  };

  const putNameSwal = async () => {
    Swal.fire({
      title: "팀 이름 설정",
      text: "팀 이름을 변경합니다. 주의하세요.",
      showCancelButton: true,
      confirmButtonText: "설정하기",
      confirmButtonColor: "#e11d48",
      cancelButtonText: "취소",
    }).then((res) => {
      if(res.isConfirmed){
        putName();
      }
    });
  };

  const getTeams = async () => {
    setLoading(true);
    try{
      const { data } = await instance.get("/api/atheletic/teams");
      setTeams(data.data);
    }
    catch(e){
      console.error(e);
    }
    setLoading(false);
  };

  const putName = async () => {
    setLoading(true);
    const loading_alert = alert.loading("팀 이름 설정 중");
    try{
      const res = await instance.put("/api/atheletic/teams", teams);
      await getTeams();
      alert.update(loading_alert, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading_alert, e.response.data.message, "error");
    }
    setLoading(false);
  };

  const putScoreDataSwal = async () => {
    Swal.fire({
      title: "경기 종목 설정",
      text: "경기 종목명을 변경합니다. 주의하세요.",
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
    getTeams();
    getCurrent();
  }, []);

  return (
    <>
      <Menu />
      <Insider>
        <section className="flex flex-col gap-3">
          <section className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold">종목 변경</h1>
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
        <section className="flex flex-col gap-3">
          <section className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold">팀 이름 설정</h1>
          </section>
          <section className="flex flex-col gap-1">
            {/* <h1 className="text-xl font-semibold w-max whitespace-nowrap">종목 변경</h1> */}
            <section className={[
              "bg-white p-5 border border-text/10 rounded flex flex-col items-center justify-center gap-2",
              loading ? "loading_background" : "",
            ].join(" ")}>
              <div className="flex flex-row items-center justify-center gap-3 w-full h-full">
                <p className="font-semibold">왼쪽</p>
                <input 
                  type="text" 
                  placeholder="왼쪽 팀 이름을 입력해주세요." 
                  className="w-full h-10 border border-text/10 rounded px-3 bg-transparent"
                  value={teams.left}
                  onChange={(e) => setTeams({ ...teams, left: e.target.value })}
                />
              </div>
              <div className="flex flex-row items-center justify-center gap-3 w-full h-full">
                <p className="font-semibold">오른쪽</p>
                <input 
                  type="text" 
                  placeholder="오른쪽 팀 이름을 입력해주세요." 
                  className="w-full h-10 border border-text/10 rounded px-3 bg-transparent"
                  value={teams.right}
                  onChange={(e) => setTeams({ ...teams, right: e.target.value })}
                />
              </div>
            </section>
          </section>

          <button 
            className="bg-primary text-white w-full text-base font-semibold rounded h-10"
            onClick={putNameSwal}
          >
            팀 이름 변경하기
          </button>

        </section>
        <section className="flex flex-col gap-3">
          <section className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold">점수 초기화</h1>
          </section>
          <section className="flex flex-row gap-1">
            <section className={[
              "w-full bg-white p-5 border border-text/10 rounded flex flex-row items-center justify-center gap-2",
              loading ? "loading_background" : "",
            ].join(" ")}>
              <button 
                className="text-[#EF4444] border-[#EF4444] border w-full text-base font-semibold rounded h-10"
                onClick={resetScoreSwal}
              >
                점수 초기화
              </button>
              <button 
                className="bg-[#EF4444] text-white border-[#EF4444] border w-full text-base font-semibold rounded h-10"
                onClick={resetSetsScoreSwal}
              >
                세트 초기화
              </button>
            </section>
          </section>
        </section>
      </Insider>
    </>
  );
};


export default Homecoming;