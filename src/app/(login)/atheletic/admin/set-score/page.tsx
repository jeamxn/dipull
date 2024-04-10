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
  const [type, setType] = React.useState<"score" | "set">("score");
  const [team, setTeam] = React.useState<"blue" | "white">("blue");
  const [isPlus, setIsPlus] = React.useState(true);
  const [score, setScore] = React.useState(0);

  const data = {
    team,
    score: isPlus ? score : -score,
    type,
  };

  const putScoreDataSwal = async () => {
    Swal.fire({
      title: "현재 경기 승점 변경",
      text: "여기는 현재 경기의 승점을 수정하는 곳입니다. 주의하세요.",
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
    const loading_alert = alert.loading("점수 증감 중...");
    try{
      const res = await instance.put("/api/atheletic/set_score", data);
      setScore(0);
      setIsPlus(true);
      setTeam("blue");
      alert.update(loading_alert, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading_alert, e.response.data.message, "error");
    }
    setLoading(false);
  };

  return (
    <>
      <Menu />
      <Insider>
        <section className="flex flex-col gap-3">
          <section className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold">현재 경기 승점 변경</h1>
            <h1 className="text-base text-[#e11d48]">여기는 현재 경기의 승점을 수정하는 곳입니다. 주의하세요.</h1>
          </section>
          <section className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold w-max whitespace-nowrap">팀 선택</h1>
            <article className={[
              "flex flex-row gap-2 bg-white rounded border border-text/10 p-5 justify-center items-center",
              loading ? "loading_background" : "",
            ].join(" ")}>
              {
                ["청팀", "백팀"].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setTeam(team_korean_to_english[_])}
                    className={[
                      "text-base rounded h-10 border border-text/10 px-4 w-full transition-colors",
                      team === team_korean_to_english[_] ? "bg-text/10" : "",
                    ].join(" ")}
                  >
                    {_}
                  </button>
                ))
              }
            </article>
          </section>
          <section className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold w-max whitespace-nowrap">팀 선택</h1>
            <article className={[
              "flex flex-row gap-2 bg-white rounded border border-text/10 p-5 justify-center items-center",
              loading ? "loading_background" : "",
            ].join(" ")}>
              {
                ["세트", "경기"].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setType(type_korean_to_english[_])}
                    className={[
                      "text-base rounded h-10 border border-text/10 px-4 w-full transition-colors",
                      type === type_korean_to_english[_] ? "bg-text/10" : "",
                    ].join(" ")}
                  >
                    {_}
                  </button>
                ))
              }
            </article>
          </section>
          <section className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold w-max whitespace-nowrap">수정할 점수</h1>
            <article className={[
              "flex flex-col gap-2 bg-white rounded border border-text/10 p-5 justify-center items-center",
              loading ? "loading_background" : "",
            ].join(" ")}>
              <div className="flex flex-row gap-2 w-full">
                {
                  ["증가", "감소"].map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setIsPlus(i === 0)}
                      className={[
                        "text-base rounded h-10 border border-text/10 px-4 w-full transition-colors",
                        isPlus === !i ? "bg-text/10" : "",
                      ].join(" ")}
                      disabled={loading}
                    >
                      {_}
                    </button>
                  ))
                }
              </div>
              <input 
                type="number" 
                placeholder="증감 점수를 자연수로 입력해주세요." 
                className="w-full h-10 border border-text/10 rounded px-3 bg-transparent"
                value={score === 0 ? "" : score}
                onChange={(e) => {
                  if(e.target.value === "") return setScore(0);
                  const input = Number(e.target.value);
                  setScore(input > 0 ? input : -input);
                }}
              />
            </article>
          </section>

          <button 
            className="bg-primary text-white w-full text-base font-semibold rounded h-10"
            onClick={putScoreDataSwal}
          >
            점수 가감하기
          </button>

        </section>
      </Insider>
    </>
  );
};


export default Homecoming;