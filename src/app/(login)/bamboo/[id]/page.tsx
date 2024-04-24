"use client";

import * as jose from "jose";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { TokenInfo, defaultUserData } from "@/app/auth/type";
import Insider from "@/provider/insider";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

import Area from "../area";
import BambooBox from "../bamboo";
import { Data } from "../page";

const Bamboo = (
  { params }: { params: {
    id: string,
  } }
) => {
  const [userInfo, setUserInfo] = React.useState(defaultUserData);
  const [textarea, setTextarea] = React.useState("");
  const [anonymous, setAnonymous] = React.useState(true);
  const [grade, setGrade] = React.useState(true);
  const [comment_data, setCommentData] = React.useState<Data[]>([]);

  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")!;
    const decrypt = jose.decodeJwt(accessToken) as TokenInfo;
    setUserInfo(decrypt.data);
  }, []);

  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<Data>({
    _id: "",
    user: "로딩 중",
    text: "Loading...",
    timestamp: "",
    number: 0,
    isgood: false,
    isbad: false,
    good: 0,
    bad: 0,
  });

  const get = async () => {
    setLoading(true);
    try{
      const [res] = await Promise.all([
        instance.get(`/api/bamboo/${params.id}`),
      ]);
      setData(res.data.data);
    }
    catch(e: any){
      alert.warn(e.response.data.message);
      router.push("/bamboo");
    }
    setLoading(false);
  };

  const put_comment = async () => {
    setLoading(true);
    const loading_alert = alert.loading("대나무 숲에 글자 새기는 중...");
    try{
      const res = await instance.put(`/api/bamboo/${params.id}/comment`, {
        textarea, anonymous, grade,
      });
      alert.update(loading_alert, res.data.message, "success");
      await get_comment(true);
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
  const get_comment = async (isSet: boolean = false) => {
    setLoading(true);
    try{
      const [res] = await Promise.all([
        instance.post(`/api/bamboo/${params.id}/comment`, {
          start: isSet ? 0 : number,
        }),
      ]);
      if(number) setCommentData([...comment_data, ...res.data.data]);
      else setCommentData(res.data.data);
      if(isSet) setNumber(0);
      else setNumber(p => p + 20);
    }
    catch(e: any){
      alert.warn(e.response.data.message);
    }
    setLoading(false);
  };

  const put_comment_reaction = async (_id: string, type: "good" | "bad") => {
    setLoading(true);
    const loading_alert = alert.loading("대나무 가지에 반응 등록 중...");
    try{
      const res = await instance.put(`/api/bamboo/${params.id}/comment/emotion`, {
        _id, type,
      });
      setCommentData(comment_data.map((item) => {
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

  const put_reaction = async (_id: string, type: "good" | "bad") => {
    setLoading(true);
    const loading_alert = alert.loading("대나무 숲에 반응 등록 중...");
    try{
      const res = await instance.put("/api/bamboo/emotion", {
        _id, type,
      });
      const item = data;
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
      setData(item);
      alert.update(loading_alert, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading_alert, e.response.data.message, "error");
    }
    setLoading(false);
  };

  React.useEffect(() => {
    get();
    get_comment();
  }, []);

  const router = useRouter();

  React.useEffect(() => {
    if(params.id) return;
    alert.warn("잘못된 접근입니다.");
    router.push("/bamboo");
  }, [params.id]);

  return (
    <Insider>
      <section className="flex flex-col gap-3">
        <section className="flex flex-row gap-0 items-center">
          <Link
            href={"/bamboo"}
            className="p-2 cursor-pointer"
          >
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="fill-text" d="M4.0958 9.06719L8.9958 13.9672C9.1958 14.1672 9.29163 14.4005 9.2833 14.6672C9.27497 14.9339 9.1708 15.1672 8.9708 15.3672C8.7708 15.5505 8.53747 15.6464 8.2708 15.6547C8.00413 15.663 7.7708 15.5672 7.5708 15.3672L0.970801 8.76719C0.870801 8.66719 0.799967 8.55885 0.758301 8.44219C0.716634 8.32552 0.695801 8.20052 0.695801 8.06719C0.695801 7.93385 0.716634 7.80885 0.758301 7.69219C0.799967 7.57552 0.870801 7.46719 0.970801 7.36719L7.5708 0.767188C7.75413 0.583854 7.9833 0.492188 8.2583 0.492188C8.5333 0.492188 8.7708 0.583854 8.9708 0.767188C9.1708 0.967188 9.2708 1.20469 9.2708 1.47969C9.2708 1.75469 9.1708 1.99219 8.9708 2.19219L4.0958 7.06719H15.2708C15.5541 7.06719 15.7916 7.16302 15.9833 7.35469C16.175 7.54635 16.2708 7.78385 16.2708 8.06719C16.2708 8.35052 16.175 8.58802 15.9833 8.77969C15.7916 8.97135 15.5541 9.06719 15.2708 9.06719H4.0958Z" />
            </svg>
          </Link>
          <h1 className="text-xl font-semibold">디미고 대나무 숲</h1>
        </section>
        <BambooBox
          item={data}
          loading={loading}
          put_reaction={put_reaction}
          click={false}
        />
      </section>
      <section className="flex flex-col gap-3">
        <section className="flex flex-row gap-0 items-center">
          <h1 className="text-xl font-semibold">댓글</h1>
        </section>
        <Area
          loading={loading}
          textarea={textarea}
          setTextarea={setTextarea}
          anonymous={anonymous}
          setAnonymous={setAnonymous}
          grade={grade}
          setGrade={setGrade}
          put={put_comment}
          userInfo={userInfo}
          placeholder={{
            textarea: "댓글을 입력해주세요.",
            put: "댓글 달기"
          }}
        />
        {
          comment_data.length ? (
            <>
              {
                comment_data.map((item, index) => (
                  <BambooBox
                    key={index}
                    item={item}
                    loading={loading}
                    put_reaction={put_comment_reaction}
                    isComment
                  />
                ))
              }
              {
                comment_data[comment_data.length - 1].number === 1 ? null : (
                  <button 
                    className={[
                      "border w-full max-w-32 text-base font-medium rounded h-10",
                      loading ? "cursor-not-allowed border-text/30 text-text/30" : "cursor-pointer bg-primary text-white",
                    ].join(" ")}
                    onClick={() => get_comment()}
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
              <p className="text-text/40">제보된 대나무 가지가 없습니다.</p>
            </article>
          )
        }
      </section>
    </Insider>
  );
};


export default Bamboo;