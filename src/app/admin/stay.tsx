import { AxiosResponse } from "axios";
import * as jose from "jose";
import React from "react";

import { UserInfo } from "@/app/api/admin/userinfo/utils";
import { ByGradeClassObj, BySeatsObj, StayGetResponse } from "@/app/api/stay/utils";
import { TokenInfo, defaultUserData } from "@/app/auth/type";
import Studyroom from "@/app/stay/studyroom";
import instance from "@/utils/instance";


const Stay = ({
  loading,
  setLoading,
  selectedUser,
  setSelectedUser,
}: {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUser: UserInfo;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserInfo>>;
}) => {
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
  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")!;
    const decrypt = jose.decodeJwt(accessToken) as TokenInfo;
    setUserInfo(decrypt.data);
    getStayData();
  }, []);

  const stayPut = async (owner: string, seat: string) => {
    setLoading(true);
    try {
      const res: AxiosResponse = await instance.put("/api/admin/stay", { seat, owner });
      alert(res.data.message);
      await getStayData();
    }
    catch(e: any){
      alert(e.response.data.message);
    }
    setLoading(false);
  };
  const stayDelete = async (owner: string) => {
    setLoading(true);
    try {
      const res: AxiosResponse = await instance.delete(`/api/admin/stay/${owner}`);
      alert(res.data.message);
      await getStayData();
    }
    catch(e: any){
      alert(e.response.data.message);
    }
    setLoading(false);
  };

  const type = studyroom.find(e => 
    e.seat[selectedSeat[0]]?.includes(Number(selectedSeat.slice(1, selectedSeat.length)))
  );

  return (
    <article className="flex flex-col gap-3">
      <h1 className="text-xl font-semibold">잔류 수정하기</h1>
      <Studyroom
        loading={loading}
        selectedSeat={selectedSeat}
        setSelectedSeat={setSelectedSeat}
        mySelect={mySelect}
        bySeatsObj={bySeatsObj}
        studyroom={studyroom}
        userInfo={userInfo}
        allowSelect
      />
      <article className={[
        "flex flex-col gap-4 bg-white rounded border border-text/10 p-5",
        loading ? "loading_background" : "",
      ].join(" ")}>
        <figure className="flex flex-col gap-2">
          <p>
            {
              selectedSeat === "@0" ? (
                <h1 className="text-xl font-semibold">선택된 좌석: 교실 잔류</h1>
              ) : (
                <h1 className="text-xl font-semibold">선택된 좌석: {selectedSeat} / {type?.grade.join(", ")}학년 / {type?.gender === "male" ? "남학생": type?.gender === "female" ? "여학생" : "선택 불가"}</h1>
              )
            }
          </p>
          <p>
            선택된 학생: [{selectedUser.gender === "male" ? "남학생" : "여학생"}] {selectedUser?.number} {selectedUser?.name}
          </p>
        </figure>
        <section className="w-full flex flex-row gap-2">
          <button 
            className="w-full py-2 rounded font-semibold text-[#EF4444] border border-[#EF4444]"
            onClick={() => stayDelete(selectedUser?.id!)}
          >
            잔류 취소
          </button>
          <button 
            className="w-full py-2 text-white bg-primary rounded font-semibold"
            onClick={() => stayPut(selectedUser?.id!, selectedSeat)}
          >
            선택 좌석에 잔류 신청
          </button>
        </section>
      </article>
    </article>
  );
};

export default Stay;