"use client";

import * as jose from "jose";
import moment from "moment";
import React from "react";

import { TokenInfo, defaultUserData } from "@/app/auth/type";
import Insider from "@/provider/insider";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

const Bamboo = () => {
  const [userInfo, setUserInfo] = React.useState(defaultUserData);

  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")!;
    const decrypt = jose.decodeJwt(accessToken) as TokenInfo;
    setUserInfo(decrypt.data);
  }, []);
  const [loading, setLoading] = React.useState(false);
  const [textarea, setTextarea] = React.useState("");
  const [anonymous, setAnonymous] = React.useState(true);
  const [grade, setGrade] = React.useState(true);
  const [data, setData] = React.useState<{
    _id: string;
    user: string;
    text: string;
    timestamp: string;
    number: number;
    isgood: boolean;
    isbad: boolean;
    good: number;
    bad: number;
  }[]>([]);

  const put = async () => {
    setLoading(true);
    const loading_alert = alert.loading("대나무 숲에 글자 새기는 중...");
    try{
      const res = await instance.put("/api/bamboo", {
        textarea, anonymous, grade,
      });
      await get();
      alert.update(loading_alert, res.data.message, "success");
      setTextarea("");
      setAnonymous(true);
      setGrade(true);
    }
    catch(e: any){
      alert.update(loading_alert, e.response.data.message, "error");
    }
    setLoading(false);
  };

  const get = async (start: number = 0, end: number = 0) => {
    setLoading(true);
    try{
      const res = await instance.post("/api/bamboo", {
        start, end,
      });
      if(start && !end) setData([...data, ...res.data.data]);
      else setData(res.data.data);
    }
    catch(e: any){
      alert.warn(e.response.data.message);
    }
    setLoading(false);
  };

  const put_reaction = async (_id: string, type: "good" | "bad") => {
    setLoading(true);
    const loading_alert = alert.loading("대나무 숲에 반응 등록 중...");
    try{
      const res = await instance.put("/api/bamboo/emotion", {
        _id, type,
      });
      // await get();
      setData(data.map((item) => {
        if(item._id === _id) {
          if(type === "good") {
            if(item.isgood) item.good--;
            else item.good++;
            item.isgood = !item.isgood;
            if(item.isbad) {
              item.bad--;
              item.isbad = !item.isbad;
            }
          }
          else {
            if(item.isbad) item.bad--;
            else item.bad++;
            item.isbad = !item.isbad;
            if(item.isgood) {
              item.good--;
              item.isgood = !item.isgood;
            }
          }
        }
        return item;
      }));
      alert.update(loading_alert, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading_alert, e.response.data.message, "error");
    }
    setLoading(false);
  };

  React.useEffect(() => {
    get();
  }, []);

  return (
    <Insider>
      <section className="flex flex-col gap-3">
        <section className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">디미고 대나무 숲</h1>
          <h1 className="text-base text-[#e11d48]">문제가 될 수 있는 대나무는 검토 후 삭제됩니다.</h1>
        </section>
        <article className={[
          "flex flex-col gap-1 bg-white rounded border border-text/10 p-5 justify-start items-start overflow-auto",
          loading ? "loading_background" : "",
        ].join(" ")}>
          <div className="w-full h-full relative">
            <textarea 
              className="w-full min-h-40 h-full border border-text/10 rounded p-3 bg-transparent"
              placeholder="제보할 내용을 입력해주세요."
              value={textarea}
              onChange={(e) => setTextarea(e.target.value)}
              maxLength={380}
            />
            <span className="text-text/50 text-right font-light text-sm absolute right-0 bottom-0 my-4 mx-2 px-2 rounded-sm py-1 cursor-text backdrop-blur-xl">{textarea.length}/380자</span>
            <span className="text-text/50 text-left font-light text-sm absolute left-0 bottom-0 my-4 mx-2 px-2 rounded-sm py-1 cursor-text backdrop-blur-xl">
              {
                grade ? Math.floor(userInfo.number / 1000) + "학년" : ""
              }
              &nbsp;
              {
                anonymous ? "익명" : userInfo.name
              }</span>
          </div>
          <div className="flex flex-row items-center justify-end gap-2 w-full">
            <button 
              className={[
                "border w-full max-w-32 text-base font-medium rounded h-10 cursor-pointer",
                !grade ? "border-text/30 text-text/30" : "border-primary text-primary",
              ].join(" ")}
              onClick={() => setGrade(p => !p)}
            >
              학년 {grade ? "O" : "X"}
            </button>
            <button 
              className={[
                "border w-full max-w-32 text-base font-medium rounded h-10 cursor-pointer",
                !anonymous ? "border-text/30 text-text/30" : "border-primary text-primary",
              ].join(" ")}
              onClick={() => setAnonymous(p => !p)}
            >
              익명 {anonymous ? "O" : "X"}
            </button>
            <button 
              className={[
                "border w-full max-w-32 text-base font-medium rounded h-10",
                loading || !textarea ? "cursor-not-allowed border-text/30 text-text/30" : "cursor-pointer bg-primary text-white",
              ].join(" ")}
              onClick={put}
            >
              제보하기
            </button>
          </div>
        </article>
      </section>
      <section className="flex flex-col gap-3">
        <section className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">제보 목록</h1>
        </section>
        {
          data.length ? (
            <>
              {
                data.map((item, index) => {
                  const diff = moment().diff(moment(item.timestamp, "YYYY-MM-DD HH:mm:ss"), "minutes");
                  return (
                    <article 
                      key={index}
                      className={[
                        "flex flex-col gap-2 bg-white rounded border border-text/10 p-5 justify-start items-start overflow-auto",
                        loading ? "loading_background" : "",
                      ].join(" ")}
                      id={`${index}`}
                    >
                      <div className="flex flex-row items-center justify-between w-full">
                        <div className="flex flex-row">
                          <b className="font-medium">{item.user}</b>의 대나무&nbsp;
                        </div>
                        <p className="text-text/30">
                          {
                            diff < 1 ? "방금 전" :
                              diff < 60 ? `${diff}분 전` :
                                diff < 1440 ? `${Math.floor(diff / 60)}시간 전` :
                                  diff < 10080 ? `${Math.floor(diff / 1440)}일 전` :
                                    diff < 40320 ? `${Math.floor(diff / 10080)}주 전` :
                                      diff < 525600 ? `${Math.floor(diff / 40320)}달 전` :
                                        `${Math.floor(diff / 525600)}년 전`
                          }
                          &nbsp;(#{item.number || 0})
                        </p>
                      </div>
                      <div className="flex flex-col justify-start items-start">
                        {
                          item.text.split("\n").map((line, i) => (
                            <p key={i}>{line}</p>
                          ))
                        }
                      </div>
                      <div className="flex flex-row gap-1">
                        <button
                          className={[
                            "text-sm hover:text-primary transition-colors",
                            item.isgood ? "text-primary" : "text-text/40",
                          ].join(" ")}
                          onClick={() => put_reaction(item._id, "good")}
                        >추천 {item.good || 0}</button>
                        <p className="text-sm text-text/40 transition-colors">·</p>
                        <button
                          className={[
                            "text-sm hover:text-primary transition-colors",
                            item.isbad ? "text-primary" : "text-text/40",
                          ].join(" ")}
                          onClick={() => put_reaction(item._id, "bad")}
                        >비추 {item.bad || 0}</button>
                      </div>
                    </article>
                  );
                })
              }
              {
                data[data.length - 1].number === 1 ? null : (
                  <button 
                    className={[
                      "border w-full max-w-32 text-base font-medium rounded h-10",
                      loading ? "cursor-not-allowed border-text/30 text-text/30" : "cursor-pointer bg-primary text-white",
                    ].join(" ")}
                    onClick={() => get(data.length)}
                  >
                    더보기
                  </button>
                )
              }
            </>
          ) : (
            <article className={[
              "flex flex-col gap-1 bg-white rounded border border-text/10 p-5 justify-start items-center overflow-auto",
              loading ? "loading_background" : "",
            ].join(" ")}>
              <p className="text-text/40">제보된 대나무가 없습니다.</p>
            </article>
          )
        }
      </section>
    </Insider>
  );
};


export default Bamboo;