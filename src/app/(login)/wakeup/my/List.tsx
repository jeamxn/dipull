/* eslint-disable @next/next/no-img-element */
"use client";

import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import React from "react";

import { UserInfo, UserInfoResponse } from "@/app/api/teacher/userinfo/utils";
import { defaultWakeupAvail } from "@/app/api/wakeup/apply/utils";
import { Rank } from "@/app/api/wakeup/ranking/utils";
import { defaultUserData } from "@/app/auth/type";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

const List = ({
  avail,
  setAvail,
  ranking: initailRanking,
}: {
    avail: number,
    setAvail: React.Dispatch<React.SetStateAction<number>>,
    ranking: Rank[],
  }) => { 
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [ranking, setRanking] = React.useState<Rank[]>(initailRanking);
  const [showGift, setShowGift] = React.useState(false);
  const [give, setGive] = React.useState(0);
  const [input, setInput] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState<UserInfo>(defaultUserData);
  const [userList, setUserList] = React.useState<UserInfo[]>([]);

  const searchUser = async () => {
    setLoading(true);
    try{
      const res: AxiosResponse<UserInfoResponse> = await instance.post(
        "/api/teacher/userinfo", {
          name: input
        }
      );
      setUserList(res.data.data);
    }
    catch(e: any){
      alert.error(e.response.data.message);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    putWakeup();
  }, [avail]);
  
  const putWakeup = async () => {
    setLoading(true);
    try{
      const res = await instance.get("/api/wakeup/ranking");
      setRanking(res.data);
      router.refresh();
    }
    catch (e: any) {
      alert.error(e.response.data.message);
    }
    setLoading(false);
  };
  const gooola = async () => {
    setLoading(true);
    const loading = alert.loading("꼬라박는 중 입니다...");
    try{
      const res = await instance.get("/api/wakeup/recover");
      setRanking(res.data);
      setAvail(defaultWakeupAvail);
      router.refresh();
      alert.update(loading, res.data.message, "success");
    }
    catch (e: any) {
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
  };

  const sendGive = async () => {
    setLoading(true);
    const loading = alert.loading("신청권 선물 중 입니다.");
    try{
      const res = await instance.post(
        "/api/wakeup/give", {
          amount: give,
          id: selectedUser.id
        }
      );
      setAvail(res.data.avail);
      router.refresh();
      alert.update(loading, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
  };

  React.useEffect(() => {
    setSelectedUser(defaultUserData);
    if(!input.length) return setUserList([]);
    searchUser();
  }, [input]);

  return (
    <article className="flex flex-col gap-3">
      <div className="flex flex-row items-center justify-between">
        <section className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">상위권 순위표</h1>
          <h1 className="text-base text-primary">기본 개수인 {defaultWakeupAvail}개 제외.</h1>
        </section>
        <div className="flex flex-row items-center justify-center gap-1">
          <button
            className="border border-text/10 rounded py-2 px-4 bg-white text-text/50 font-semibold"
            onClick={() => setShowGift(true)}
          >선물하기</button>
          <button
            className="border border-text/10 rounded py-2 px-4 bg-white text-text/50 font-semibold"
            onClick={gooola}
          >복구하기</button>
        </div>
      </div>
      {
        showGift ? (
          <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center bg-text/20 dark:bg-white/70 justify-center z-50 px-4">
            <div className="p-4 border border-text/10 bg-background rounded w-full max-w-96 flex flex-col items-center justify-center gap-3">
              <p className="text-primary font-bold text-lg text-center">신청권 선물하기</p>
              <div className="w-full flex flex-col gap-1">
                <p className="font-semibold">선물할 신청권 개수</p>
                <div className="flex flex-row gap-2 items-center justify-center">
                  <input
                    className="w-full border border-text/10 rounded-md px-4 py-2 bg-white"
                    type="number"
                    value={give ? give : "" }
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value > avail) {
                        alert.error("선물할 수 있는 개수를 초과하였습니다.");
                        return;
                      }
                      setGive(value);
                    }}
                    placeholder={`최대 ${avail}개 가능`}
                  />
                  <p className="font-semibold">개</p>
                </div>
              </div>
              <div className="w-full flex flex-col gap-1">
                <p className="font-semibold">선물할 사람</p>
                <div className="flex flex-col gap-2 items-center justify-center">
                  <input
                    className={[
                      "w-full border border-text/10 rounded-md px-4 py-2 bg-white",
                      loading ? "loading_background" : "",
                    ].join(" ")}
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      setSelectedUser(defaultUserData);
                    }}
                    placeholder="검색할 사람의 이름을 입력해주세요."
                  />
                  {
                    userList.length ? userList.map((e, i) => {
                      return (
                        <div
                          key={i}
                          className={[
                            "w-full px-4 py-2 cursor-pointer select-none hover:bg-text/10 rounded flex flex-row gap-2 items-center justify-between",
                            selectedUser.id === e.id ? "bg-text/10" : "",
                          ].join(" ")}
                          onClick={() => {
                            setSelectedUser(e);
                          }}
                        >
                          <div className="flex flex-row gap-2 items-center">
                            <img src={e.profile_image} alt="profile" className="w-7 h-7 rounded-full border border-text/10"/>
                            <p>{e.number} {e.name} ({e.gender === "male" ? "남" : "여"})</p>
                          </div>
                          {
                            selectedUser.id === e.id ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 fill-primary" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" />
                              </svg>
                            ) : null
                          }
                        </div>
                      );
                    }) : null
                  }
                </div>
              </div>
              <div className="w-full flex flex-row items-center justify-center gap-1">
                <button 
                  className="w-full border border-primary text-primary bg-background font-semibold px-4 py-2 rounded-md text-base"
                  onClick={() => setShowGift(false)}
                >
                  취소하기
                </button>
                <button 
                  className={[
                    "w-full bg-primary text-white font-semibold px-4 py-2 rounded-md text-base",
                    loading || !give || !selectedUser.id ? "opacity-50" : "opacity-100",
                  ].join(" ")}
                  disabled={loading || !give || !selectedUser.id}
                  onClick={sendGive}
                >
                  선물하기
                </button>
              </div>
            </div>
          </div>
        ) : null
      }
      <section className={[
        "flex flex-col gap-4 bg-white rounded border border-text/10 p-5 overflow-auto",
        loading ? "loading_background" : "",
      ].join(" ")}>
        <table className="w-full overflow-auto">
          <tbody className="w-full border-y border-text/10 overflow-auto">
            <tr className="w-full">
              <th className="text-center px-4 whitespace-nowrap py-2 font-semibold w-full" colSpan={4}>상위권 순위표</th>
            </tr>
            {
              initailRanking.length ? initailRanking.map((e, i) => (
                <tr className="w-full border-y border-text/10" key={i}>
                  <td className="text-left py-2 px-4 whitespace-nowrap font-semibold">{i + 1}위</td>
                  <td className="text-left py-2 px-4 border-x border-text/10 whitespace-nowrap">{e.available}개</td>
                  <td className="text-left py-2 px-4 border-x border-text/10 whitespace-nowrap">{ e.gender === "male" ? "남" : "여"}학생</td>
                  <td className="text-left py-2 px-4 whitespace-nowrap">{e.name}</td>
                </tr>
              )) : (
                <tr className="w-full border-y border-text/10">
                  <td className="text-center px-4 whitespace-nowrap py-2 text-text/50" colSpan={4}>아직 배팅한 사람이 없습니다.</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </section>
    </article>
  );
};

export default List;