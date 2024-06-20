"use client";

import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import React from "react";

import { ByGradeClassObj, BySeatsObj, StayGetResponse } from "@/app/api/stay/utils";
import { UserData } from "@/app/auth/type";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

import Classstay from "./classstay";
import GotoClass from "./gotoClass";
import TeacherStudyroomContent from "./TeacherStudyroomContent";



const Common = ({
  initialUserInfo,
  initStayInfo,
  classstayInit,
}: {
  initialUserInfo: UserData;
  initStayInfo: StayGetResponse["data"];
  classstayInit: boolean[];
  }) => { 
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [selectedSeats, setSelectedSeats] = React.useState<string[]>([]);
  const [mySelect, setMySelect] = React.useState<StayGetResponse["data"]["mySelect"]>(initStayInfo.mySelect);
  const [bySeatsObj, setBySeatsObj] = React.useState<BySeatsObj>(initStayInfo.bySeatsObj);
  const [byGradeClassObj, setByGradeClassObj] = React.useState<ByGradeClassObj>(initStayInfo.byGradeClassObj);
  const [studyroom, setStudyroom] = React.useState<StayGetResponse["data"]["studyroom"]>(initStayInfo.studyroom);
  const [classStay, setClassStay] = React.useState<StayGetResponse["data"]["classStay"]>(initStayInfo.classStay);
  
  const getStayData = async () => {
    setLoading(true);
    try{
      const res: AxiosResponse<StayGetResponse> = await instance.get("/api/stay");
      setBySeatsObj(res.data.data.bySeatsObj);
      setByGradeClassObj(res.data.data.byGradeClassObj);
      setMySelect(res.data.data.mySelect);
      setStudyroom(res.data.data.studyroom);
      setClassStay(res.data.data.classStay);
      router.refresh();
    }
    catch(e: any){
      alert.error(e.response.data.message);
    }
    setSelectedSeats([]);
    setLoading(false);
  };
  
  return (
    <>
      <TeacherStudyroomContent
        userInfo={initialUserInfo}
        loading={loading}
        setLoading={setLoading}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        mySelect={mySelect}
        setMySelect={setMySelect}
        bySeatsObj={bySeatsObj}
        setBySeatsObj={setBySeatsObj}
        byGradeClassObj={byGradeClassObj}
        setByGradeClassObj={setByGradeClassObj}
        studyroom={studyroom}
        setStudyroom={setStudyroom}
        classStay={classStay}
        setClassStay={setClassStay}
        getStayData={getStayData}
      />
      <Classstay
        init={classstayInit}
        getStayData={getStayData}
      />
      <GotoClass getStayData={getStayData} />
    </>
  );
};

export default Common;