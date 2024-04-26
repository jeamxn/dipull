"use client";

import { AxiosResponse } from "axios";
import * as jose from "jose";
import React from "react";

import { ByGradeClassObj, BySeatsObj, StayGetResponse } from "@/app/api/stay/utils";
import { TokenInfo, defaultUserData } from "@/app/auth/type";
import { alert } from "@/utils/alert";
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
      alert.error(e.response.data.message);
    }
    setSelectedSeat("@0");
    setLoading(false);
  };
  const putStayData = async () => {
    setLoading(true);
    const loading = alert.loading("신청 중 입니다.");
    try{
      const res = await instance.put("/api/stay", {
        seat: selectedSeat
      });
      await getStayData();
      alert.update(loading, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
  };
  const deleteStayData = async () => {
    setLoading(true);
    const loading = alert.loading("신청 취소 중 입니다.");
    try{
      const res = await instance.delete("/api/stay");
      await getStayData();
      alert.update(loading, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
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
    <>
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

      {/* <div className="w-full border-b border-text/10" /> */}

      <article className="flex flex-col gap-3">
        <div className="flex flex-row items-center">
          <h1 className="text-xl font-semibold">잔류 신청 현황</h1>
          <div className={[
            "hover:font-semibold cursor-pointer transition-all h-7 w-7 flex items-center justify-center",
            loading ? "rotation" : "",
          ].join(" ")} onClick={getStayData}>
            <svg width="14" height="14" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.69922 16.8835C6.46589 16.8835 4.57422 16.1085 3.02422 14.5585C1.47422 13.0085 0.699219 11.1169 0.699219 8.88354C0.699219 6.65021 1.47422 4.75855 3.02422 3.20854C4.57422 1.65854 6.46589 0.883545 8.69922 0.883545C9.84922 0.883545 10.9492 1.12104 11.9992 1.59604C13.0492 2.07104 13.9492 2.75021 14.6992 3.63354V1.88354C14.6992 1.60021 14.7951 1.36271 14.9867 1.17104C15.1784 0.979378 15.4159 0.883545 15.6992 0.883545C15.9826 0.883545 16.2201 0.979378 16.4117 1.17104C16.6034 1.36271 16.6992 1.60021 16.6992 1.88354V6.88354C16.6992 7.16688 16.6034 7.40438 16.4117 7.59605C16.2201 7.78771 15.9826 7.88354 15.6992 7.88354H10.6992C10.4159 7.88354 10.1784 7.78771 9.98672 7.59605C9.79505 7.40438 9.69922 7.16688 9.69922 6.88354C9.69922 6.60021 9.79505 6.36271 9.98672 6.17104C10.1784 5.97938 10.4159 5.88354 10.6992 5.88354H13.8992C13.3659 4.95021 12.6367 4.21688 11.7117 3.68354C10.7867 3.15021 9.78255 2.88354 8.69922 2.88354C7.03255 2.88354 5.61589 3.46688 4.44922 4.63354C3.28255 5.80021 2.69922 7.21688 2.69922 8.88354C2.69922 10.5502 3.28255 11.9669 4.44922 13.1335C5.61589 14.3002 7.03255 14.8835 8.69922 14.8835C9.83255 14.8835 10.8701 14.596 11.8117 14.021C12.7534 13.446 13.4826 12.6752 13.9992 11.7085C14.1326 11.4752 14.3201 11.3127 14.5617 11.221C14.8034 11.1294 15.0492 11.1252 15.2992 11.2085C15.5659 11.2919 15.7576 11.4669 15.8742 11.7335C15.9909 12.0002 15.9826 12.2502 15.8492 12.4835C15.1659 13.8169 14.1909 14.8835 12.9242 15.6835C11.6576 16.4835 10.2492 16.8835 8.69922 16.8835Z" fill="rgb(var(--color-primary) / 1)"/>
            </svg>
          </div>
        </div>
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
    </>
  );
};


export default Stay;