"use client";

import { AxiosResponse } from "axios";
import * as jose from "jose";
import React from "react";

import { ByGradeClassObj, BySeatsObj, StayGetResponse } from "@/app/api/stay/utils";
import { TokenInfo, defaultUserData } from "@/app/auth/type";
import Insider from "@/provider/insider";
import instance from "@/utils/instance";

import Studyroom from "./studyroom";
import TableInner from "./tableInner";

const Stay = () => {
  const [loading, setLoading] = React.useState(false);
  const [selectedSeat, setSelectedSeat] = React.useState("@0");
  const [mySelect, setMySelect] = React.useState<StayGetResponse["data"]["mySelect"]>("");
  const [bySeatsObj, setBySeatsObj] = React.useState<BySeatsObj>({});
  const [byGradeClassObj, setByGradeClassObj] = React.useState<ByGradeClassObj>({});
  const [studyroom, setStudyroom] = React.useState<StayGetResponse["data"]["studyroom"]>([]);
  const [userInfo, setUserInfo] = React.useState(defaultUserData);

  const getStayData = async () => {
    setLoading(true);
    try{
      const res: AxiosResponse<StayGetResponse> = await instance.get("/api/stay");
      setBySeatsObj(res.data.data.bySeatsObj);
      setByGradeClassObj(res.data.data.byGradeClassObj);
      setMySelect(res.data.data.mySelect);
      setStudyroom(res.data.data.studyroom);
    }
    catch(e: any){
      alert(e.response.data.message);
    }
    setSelectedSeat("@0");
    setLoading(false);
  };
  const putStayData = async () => {
    setLoading(true);
    try{
      const res = await instance.put("/api/stay", {
        seat: selectedSeat
      });
      await getStayData();
      alert(res.data.message);
    }
    catch(e: any){
      alert(e.response.data.message);
    }
    setLoading(false);
  };
  const deleteStayData = async () => {
    setLoading(true);
    try{
      const res = await instance.delete("/api/stay");
      await getStayData();
    }
    catch(e: any){
      alert(e.response.data.message);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")!;
    const decrypt = jose.decodeJwt(accessToken) as TokenInfo;
    setUserInfo(decrypt.data);
    getStayData();
  }, []);

  return (
    <Insider className="flex flex-col gap-5">
      <article className="flex flex-col gap-3">
        <h1 className="text-xl font-semibold">잔류 신청하기</h1>
        <Studyroom
          loading={loading}
          selectedSeat={selectedSeat}
          setSelectedSeat={setSelectedSeat}
          mySelect={mySelect}
          bySeatsObj={bySeatsObj}
          studyroom={studyroom}
          userInfo={userInfo}
        />
        <div className="p-1" />
        <section className="flex flex-col items-center justify-center gap-1">
          {
            mySelect ? (
              <p className="text-center text-sm text-text/50 font-medium">
                {
                  mySelect === "교실" ? "교실 잔류 신청되었습니다." : `열람실 좌석 ${mySelect}에 잔류 신청되었습니다.`
                }
              </p>
            ) : (
              <p className="text-center text-sm text-text/50 font-medium">좌석을 선택하지 않으면 교실로 선택됩니다!</p>
            )
          }
        </section>
        {
          mySelect ? (
            <button 
              className="w-full py-2 rounded font-semibold text-[#EF4444] border border-[#EF4444]"
              onClick={deleteStayData}
            >
              잔류 신청 취소하기
            </button>
          ) : (
            <button 
              className="bg-primary text-white w-full text-base font-semibold rounded h-10"
              onClick={putStayData}
            >
              잔류 신청하기
            </button>
          )
        }
      </article>

      <div className="w-full border-b border-text/10" />

      <article className="flex flex-col gap-3">
        <h1 className="text-xl font-semibold">잔류 신청 현황</h1>
        <table className={[
          "w-full border-text/10",
          loading ? "loading_background rounded overflow-hidden border" : "bg-transparent border-y"
        ].join(" ")}>
          <tbody>
            {
              new Array(3).fill(0).map((_, i) => (
                <React.Fragment key={i}>
                  {
                    new Array(6).fill(0).map((_, j) => (
                      <React.Fragment key={j}>
                        <TableInner 
                          gradeClass={`${i + 1}-${j + 1}`}
                          number={byGradeClassObj[i + 1]?.[j + 1]?.length.toString() || "0"}
                          gender="남"
                          names={
                            byGradeClassObj[i + 1]?.[j + 1] 
                              && byGradeClassObj[i + 1][j + 1]
                                .filter(e => e.gender === "male")
                                .sort((a, b) => a.number - b.number)
                                .map(e => e.name).join(" ")
                          }
                        />
                        <TableInner 
                          gender="여"
                          names={
                            byGradeClassObj[i + 1]?.[j + 1] 
                              && byGradeClassObj[i + 1][j + 1]
                                .filter(e => e.gender === "female")
                                .sort((a, b) => a.number - b.number)
                                .map(e => e.name).join(" ")
                          }
                        />
                      </React.Fragment>
                    ))
                  }
                  <TableInner 
                    gradeClass={`${i + 1}학년`}
                    number={
                      Object.keys(byGradeClassObj[i + 1] || {}).reduce((acc, cur) => {
                        const arr = byGradeClassObj[i + 1][cur].filter(e => e.gender === "male");
                        return acc + arr.length;
                      }, 0).toString()
                    }
                    gender="남"
                  />
                  <TableInner 
                    number={
                      Object.keys(byGradeClassObj[i + 1] || {}).reduce((acc, cur) => {
                        const arr = byGradeClassObj[i + 1][cur].filter(e => e.gender === "female");
                        return acc + arr.length;
                      }, 0).toString()
                    }
                    gender="여"
                  />
                  <TableInner 
                    number={
                      Object.keys(byGradeClassObj[i + 1] || {}).reduce((acc, cur) => {
                        const arr = byGradeClassObj[i + 1][cur];
                        return acc + arr.length;
                      }, 0).toString()
                    }
                    gender="총계"
                  />
                </React.Fragment>
              ))
            }
            <TableInner 
              gradeClass="전체"
              number={
                Object.keys(byGradeClassObj).reduce((acc1, cur1) => {
                  return acc1 + Object.keys(byGradeClassObj[cur1] || {}).reduce((acc2, cur2) => {
                    const arr = byGradeClassObj[cur1][cur2].filter(e => e.gender === "male");
                    return acc2 + arr.length;
                  }, 0);
                }, 0).toString()
              }
              gender="남"
            />
            <TableInner 
              number={
                Object.keys(byGradeClassObj).reduce((acc1, cur1) => {
                  return acc1 + Object.keys(byGradeClassObj[cur1] || {}).reduce((acc2, cur2) => {
                    const arr = byGradeClassObj[cur1][cur2].filter(e => e.gender === "female");
                    return acc2 + arr.length;
                  }, 0);
                }, 0).toString()
              }
              gender="여"
            />
            <TableInner 
              number={
                Object.keys(byGradeClassObj).reduce((acc1, cur1) => {
                  return acc1 + Object.keys(byGradeClassObj[cur1] || {}).reduce((acc2, cur2) => {
                    const arr = byGradeClassObj[cur1][cur2];
                    return acc2 + arr.length;
                  }, 0);
                }, 0).toString()
              }
              gender="총계"
            />
          </tbody>
        </table>
      </article>
    </Insider>
  );
};


export default Stay;