"use client";

import React from "react";

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

const Homecoming = () => {
  const [loading, setLoading] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [team, setTeam] = React.useState<"blue" | "white">("blue");
  const [isPlus, setIsPlus] = React.useState(true);
  const [score, setScore] = React.useState(0);

  const data = {
    team,
    score: isPlus ? score : -score,
    description,
  };

  const putScoreData = async () => {
    setLoading(true);
    const loading_alert = alert.loading("점수 증감 중...");
    try{
      const res = await instance.put("/api/atheletic/score", data);
      setDescription("");
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
            <h1 className="text-xl font-semibold">체육대회 학생회 페이지</h1>
            <h1 className="text-base text-[#e11d48]">학생회 친구들아 잘 보고 수정하렴.</h1>
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
          <section className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold w-max whitespace-nowrap">사유 입력</h1>
            <section className={[
              "bg-white p-5 border border-text/10 rounded",
              loading ? "loading_background" : "",
            ].join(" ")}>
              <input 
                type="text" 
                placeholder="점수 가감 사유를 입력해주세요." 
                className="w-full h-10 border border-text/10 rounded px-3 bg-transparent"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </section>
          </section>

          <button 
            className="bg-primary text-white w-full text-base font-semibold rounded h-10"
            onClick={putScoreData}
          >
            점수 가감하기
          </button>

        </section>
      </Insider>
    </>
  );
};


export default Homecoming;