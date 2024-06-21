"use client";

import { useRouter } from "next/navigation";
import React from "react";

import Studyroom from "@/app/(login)/stay/apply/studyroom";
import { ByGradeClassObj, BySeatsObj, StayGetResponse, StudyroomData } from "@/app/api/stay/utils";
import { UserData, defaultUserData } from "@/app/auth/type";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

const TeacherStudyroomContent = ({
  userInfo,
  loading,
  setLoading,
  selectedSeats,
  setSelectedSeats,
  mySelect,
  setMySelect,
  bySeatsObj,
  setBySeatsObj,
  byGradeClassObj,
  setByGradeClassObj,
  studyroom,
  setStudyroom,
  classStay,
  setClassStay,
  getStayData,
}: {
    userInfo: UserData;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    selectedSeats: string[];
    setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>;
    mySelect: StayGetResponse["data"]["mySelect"];
    setMySelect: React.Dispatch<React.SetStateAction<StayGetResponse["data"]["mySelect"]>>;
    bySeatsObj: BySeatsObj;
    setBySeatsObj: React.Dispatch<React.SetStateAction<BySeatsObj>>;
    byGradeClassObj: ByGradeClassObj;
    setByGradeClassObj: React.Dispatch<React.SetStateAction<ByGradeClassObj>>;
    studyroom: StayGetResponse["data"]["studyroom"];
    setStudyroom: React.Dispatch<React.SetStateAction<StayGetResponse["data"]["studyroom"]>>;
    classStay: StayGetResponse["data"]["classStay"];
    setClassStay: React.Dispatch<React.SetStateAction<StayGetResponse["data"]["classStay"]>>;
    getStayData: () => Promise<void>;
  }) => {
  const router = useRouter();
  const putStudyroomData = async () => {
    setLoading(true);
    const loading = alert.loading("잔류 좌석을 저장 중 입니다.");
    try{
      const res = await instance.put("/api/teacher/stay/studyroom", studyroom);
      await getStayData();
      setSelectedSeats([]);
      setSelectedStatic(undefined);
      router.refresh();
      alert.update(loading, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
  };

  const [selectedStatic, setSelectedStatic] = React.useState<StudyroomData>();
  const selectedLength = selectedStatic ? Object.values(selectedStatic.seat).flat().length : 0;
  const selectedAll = selectedSeats.length === selectedLength;

  return (
    <>
      <article className="flex flex-col gap-3">
        <h1 className="text-xl font-semibold">잔류 좌석 설정</h1>
        <Studyroom
          loading={loading}
          selectedSeats={selectedSeats}
          setSelectedSeats={setSelectedSeats}
          mySelect={mySelect}
          bySeatsObj={bySeatsObj}
          studyroom={studyroom}
          setStudyroom={setStudyroom}
          userInfo={userInfo}
          allowSelect={true}
          disabled={false}
          classStay={classStay}
          showAllTypes
          verticalStatic
          canSelectStatic
          selectedStatic={selectedStatic}
          setSelectedStatic={setSelectedStatic}
          // showStatics={false}
        >
          <article className={[
            "flex flex-row flex-wrap justify-center gap-4 bg-white rounded border border-text/10 p-5 overflow-auto w-full select-none",
            loading ? "loading_background" : "",
          ].join(" ")}>
            {
              selectedStatic ? 
                selectedStatic.seat ?
                  selectedLength ? (
                    <>
                      <div
                        className={[
                          "text-center w-full h-11 flex flex-row items-center justify-center text-text py-2 px-8 bg-text/10 border border-text/20 rounded hover:border-text/60 cursor-pointer",
                          selectedAll ? "bg-text/60 text-white" : "",
                        ].join(" ")}
                        onClick={() => {
                          if(selectedAll){
                            setSelectedSeats([]);
                          }else{
                            setSelectedSeats(Object.entries(selectedStatic.seat).map(([key, value]) => value.map((seat) => key + seat)).flat());
                          }
                        }}
                      >
                        {
                          selectedAll ? "전체 선택 해제" : "전체 선택"
                        }
                      </div>
                      {
                        Object.entries(selectedStatic.seat).map(([key, value]) => value.map((seat, i) => (
                          <div
                            key={i}
                            className={[
                              "flex flex-row items-center justify-center text-center text-text py-2 px-8 bg-text/10 border border-text/20 w-20 h-11 rounded hover:border-text/60 cursor-pointer",
                              selectedSeats.includes(key + seat) ? "bg-text/60 text-white" : "",
                            ].join(" ")}
                            onClick={() => {
                              if(selectedSeats.includes(key + seat)){
                                setSelectedSeats(prev => prev.filter((s) => s !== key + seat));
                              }else{
                                setSelectedSeats(prev => [...prev, key + seat]);
                              }
                            }}
                          >
                            {key}{seat}
                          </div>
                        )))
                      }
                    </>
                  )
                    : (
                      <p className="text-center text-text/50">해당 구분에 좌석이 없습니다.</p>
                    )
                  : null
                : (
                  <p className="text-center text-text/50">구분을 선택해주세요.</p>
                )
            }
          </article>
        </Studyroom>
        <button 
          className="bg-primary text-white w-full text-base font-semibold rounded h-10"
          onClick={putStudyroomData}
        >
          변경된 좌석 저장하기
        </button>
      </article>
    </>
  );
};

export default TeacherStudyroomContent;