import { AxiosResponse } from "axios";
import * as jose from "jose";
import { useRouter } from "next/navigation";
import React from "react";

import Studyroom from "@/app/(login)/stay/apply/studyroom";
import { ByGradeClassObj, BySeatsObj, StayGetResponse } from "@/app/api/stay/utils";
import { UserInfo } from "@/app/api/teacher/userinfo/utils";
import { TokenInfo, defaultUserData } from "@/app/auth/type";
import { alert } from "@/utils/alert";
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
  const router = useRouter();
  const [selectedSeat, setSelectedSeat] = React.useState("@0");
  const [mySelect, setMySelect] = React.useState<StayGetResponse["data"]["mySelect"]>("");
  const [bySeatsObj, setBySeatsObj] = React.useState<BySeatsObj>({});
  const [byGradeClassObj, setByGradeClassObj] = React.useState<ByGradeClassObj>({});
  const [studyroom, setStudyroom] = React.useState<StayGetResponse["data"]["studyroom"]>([]);
  const [userInfo, setUserInfo] = React.useState(defaultUserData);
  const [classStay, setClassStay] = React.useState<StayGetResponse["data"]["classStay"]>({
    1: false,
    2: false,
    3: false,
  });

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
    setSelectedSeat("@0");
    setLoading(false);
  };
  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")!;
    const decrypt = jose.decodeJwt(accessToken) as TokenInfo;
    setUserInfo(decrypt.data);
    getStayData();
  }, [selectedUser]);

  const stayPut = async (owner: string, seat: string) => {
    setLoading(true);
    const loading = alert.loading("잔류 신청 중 입니다.");
    try {
      const res: AxiosResponse = await instance.put("/api/teacher/stay", { seat, owner });
      await getStayData();
      alert.update(loading, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
  };
  const stayDelete = async (owner: string) => {
    setLoading(true);
    const loading = alert.loading("잔류 신청 취소 중 입니다.");
    try {
      const res: AxiosResponse = await instance.delete(`/api/teacher/stay/${owner}`);
      await getStayData();
      alert.update(loading, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
  };

  const types = studyroom.filter(e =>
    e.seat[selectedSeat[0]]?.includes(Number(selectedSeat.slice(1, selectedSeat.length)))
  );
  const grades = types.map(e => e.grade).sort().join(", ");
  const gender = types.map(e => e.gender === "male" ? "남학생" : "여학생")
    .filter((e, i, arr) => arr.indexOf(e) === i).join(", ");
  
  const myApply = byGradeClassObj[Math.floor(selectedUser.number / 1000)]?.[Math.floor(selectedUser.number / 100) % 10].find(e => e.id === selectedUser.id);
  const isApplyed = myApply?.id;
  
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
        allowSelect={!isApplyed}
        disabled={!!isApplyed}
        classStay={classStay}
      />
      <article className={[
        "flex flex-col gap-4 bg-white rounded border border-text/10 p-5",
        loading ? "loading_background" : "",
      ].join(" ")}>
        <figure className="flex flex-col gap-2">
          {
            isApplyed ? (
              <h1 className="text-xl font-semibold">잔류 신청된 좌석: {myApply?.seat}</h1>
            ) :
              selectedSeat === "@0" ? (
                <h1 className="text-xl font-semibold">선택된 좌석: 교실 잔류</h1>
              ) : (
                <h1 className="text-xl font-semibold">선택된 좌석: {selectedSeat} ({grades}학년 / {gender})</h1>
              )
          }
          <p>
            선택된 학생: [{selectedUser.gender === "male" ? "남학생" : "여학생"}] {selectedUser?.number} {selectedUser?.name}
          </p>
        </figure>
        <section className="w-full flex flex-row gap-2">
          {
            isApplyed ? (
              <button 
                className="w-full py-2 rounded font-semibold text-[#EF4444] border border-[#EF4444]"
                onClick={() => stayDelete(selectedUser?.id!)}
              >
                잔류 신청 취소
              </button>
            ) : (
              <button 
                className="w-full py-2 text-white bg-primary rounded font-semibold"
                onClick={() => stayPut(selectedUser?.id!, selectedSeat)}
              >
                선택 좌석에 잔류 신청
              </button>
            )
          }
        </section>
      </article>
    </article>
  );
};

export default Stay;