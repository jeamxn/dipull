"use client";

import * as jose from "jose";
import moment from "moment";
import React from "react";

import { TokenInfo, defaultUserData } from "@/app/auth/type";
import Insider from "@/provider/insider";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

import Area from "./area";
import BambooBox from "./bamboo";

export type Data = {
  _id: string;
  user: string;
  text: string;
  timestamp: string;
  number: number;
  isgood: boolean;
  isbad: boolean;
  good: number;
  bad: number;
  comment?: number;
};

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
  const [data, setData] = React.useState<Data[]>([]);
  const [top, setTop] = React.useState<Data[]>([]);
  const [topType, setTopType] = React.useState<"day" | "week">("day");

  const put = async () => {
    setLoading(true);
    const loading_alert = alert.loading("대나무 숲에 글자 새기는 중...");
    try{
      const res = await instance.put("/api/bamboo", {
        textarea, anonymous, grade,
      });
      await get(true);
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

  const [number, setNumber] = React.useState(0);
  const get = async (isSet: boolean = false) => {
    setLoading(true);
    try{
      const [res] = await Promise.all([
        instance.post("/api/bamboo", {
          start: isSet ? 0 : number,
        }),
        getTop(),
      ]);
      if(number) setData([...data, ...res.data.data]);
      else setData(res.data.data);
      if(isSet) setNumber(0);
      else setNumber(p => p + 20);
    }
    catch(e: any){
      alert.warn(e.response.data.message);
    }
    setLoading(false);
  };

  const getTop = async () => {
    setLoading(true);
    try{
      const [top_res] = await Promise.all([
        instance.get(`/api/bamboo/top/${topType}`),
      ]);
      setTop(top_res.data.data);
    }
    catch(e: any){
      alert.warn(e.response.data.message);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getTop();
  }, [topType]);

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
      setTop(top.map((item) => {
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
        <Area
          loading={loading}
          textarea={textarea}
          setTextarea={setTextarea}
          anonymous={anonymous}
          setAnonymous={setAnonymous}
          grade={grade}
          setGrade={setGrade}
          put={put}
          userInfo={userInfo}
        />
      </section>
      <section className="flex flex-col gap-3">
        <section className="flex flex-row gap-2">
          <h1 className="text-xl font-semibold">최고의 대나무</h1>
          <h1 className="text-xl font-semibold">::</h1>
          <div className="flex flex-row gap-1">
            <h1 
              className={[
                "text-xl font-semibold cursor-pointer",
                topType === "day" ? "text-text" : "text-text/30",
              ].join(" ")}
              onClick={() => setTopType("day")}
            >하루</h1>
            <h1 className="text-xl font-semibold text-text/30">·</h1>
            <h1 
              className={[
                "text-xl font-semibold cursor-pointer",
                topType === "week" ? "text-text" : "text-text/30",
              ].join(" ")}
              onClick={() => setTopType("week")}
            >일주일</h1>
          </div>
        </section>
        {
          top.length ? (
            <>
              {
                top.map((item, index) => (
                  <BambooBox
                    key={index}
                    item={item}
                    loading={loading}
                    put_reaction={put_reaction}
                  />
                ))
              }
            </>
          ) : (
            <article className={[
              "flex flex-col gap-1 bg-white rounded border border-text/10 p-5 justify-start items-center overflow-auto",
              loading ? "loading_background" : "",
            ].join(" ")}>
              <p className="text-text/40">
                {topType === "day" ? "오늘" : "이번 주"} 최고의 대나무가 없습니다.
              </p>
            </article>
          )
        }
      </section>
      <section className="flex flex-col gap-3">
        <section className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">제보 목록</h1>
        </section>
        {
          data.length ? (
            <>
              {
                data.map((item, index) => (
                  <BambooBox
                    key={index}
                    item={item}
                    loading={loading}
                    put_reaction={put_reaction}
                  />
                ))
              }
              {
                data[data.length - 1].number === 1 ? null : (
                  <button 
                    className={[
                      "border w-full max-w-32 text-base font-medium rounded h-10",
                      loading ? "cursor-not-allowed border-text/30 text-text/30" : "cursor-pointer bg-primary text-white",
                    ].join(" ")}
                    onClick={() => get()}
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