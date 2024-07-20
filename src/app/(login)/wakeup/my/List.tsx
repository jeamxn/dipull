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
      setShowGift(false);
      setSelectedUser(defaultUserData);
      setInput("");
      setGive(0);
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
          <div className="flex flex-row gap-0">
            <h1 className="text-xl font-semibold">상위권 순위표</h1>
            <div 
              className={`hover:font-semibold cursor-pointer transition-all h-7 w-7 flex items-center justify-center ${loading ? "rotation" : ""}`} 
              onClick={putWakeup}
            >
              <svg width="14" height="14" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.69922 16.8835C6.46589 16.8835 4.57422 16.1085 3.02422 14.5585C1.47422 13.0085 0.699219 11.1169 0.699219 8.88354C0.699219 6.65021 1.47422 4.75855 3.02422 3.20854C4.57422 1.65854 6.46589 0.883545 8.69922 0.883545C9.84922 0.883545 10.9492 1.12104 11.9992 1.59604C13.0492 2.07104 13.9492 2.75021 14.6992 3.63354V1.88354C14.6992 1.60021 14.7951 1.36271 14.9867 1.17104C15.1784 0.979378 15.4159 0.883545 15.6992 0.883545C15.9826 0.883545 16.2201 0.979378 16.4117 1.17104C16.6034 1.36271 16.6992 1.60021 16.6992 1.88354V6.88354C16.6992 7.16688 16.6034 7.40438 16.4117 7.59605C16.2201 7.78771 15.9826 7.88354 15.6992 7.88354H10.6992C10.4159 7.88354 10.1784 7.78771 9.98672 7.59605C9.79505 7.40438 9.69922 7.16688 9.69922 6.88354C9.69922 6.60021 9.79505 6.36271 9.98672 6.17104C10.1784 5.97938 10.4159 5.88354 10.6992 5.88354H13.8992C13.3659 4.95021 12.6367 4.21688 11.7117 3.68354C10.7867 3.15021 9.78255 2.88354 8.69922 2.88354C7.03255 2.88354 5.61589 3.46688 4.44922 4.63354C3.28255 5.80021 2.69922 7.21688 2.69922 8.88354C2.69922 10.5502 3.28255 11.9669 4.44922 13.1335C5.61589 14.3002 7.03255 14.8835 8.69922 14.8835C9.83255 14.8835 10.8701 14.596 11.8117 14.021C12.7534 13.446 13.4826 12.6752 13.9992 11.7085C14.1326 11.4752 14.3201 11.3127 14.5617 11.221C14.8034 11.1294 15.0492 11.1252 15.2992 11.2085C15.5659 11.2919 15.7576 11.4669 15.8742 11.7335C15.9909 12.0002 15.9826 12.2502 15.8492 12.4835C15.1659 13.8169 14.1909 14.8835 12.9242 15.6835C11.6576 16.4835 10.2492 16.8835 8.69922 16.8835Z" fill="rgb(var(--color-primary) / 1)"/>
              </svg>
            </div>
          </div>
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