import { AxiosResponse } from "axios";
import React from "react";

import OutingOption from "@/app/(login)/stay/outing/outingOption";
import { OutingAndMealData, OutingGetResponse, defaultOutingData } from "@/app/api/outing/utils";
import { UserInfo } from "@/app/api/teacher/userinfo/utils";
import instance from "@/utils/instance";


const Outing = ({
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
  const [sat, setSat] = React.useState<OutingAndMealData>(defaultOutingData);
  const [sun, setSun] = React.useState<OutingAndMealData>(defaultOutingData);

  React.useEffect(() => {
    getOutingData();
  }, [selectedUser]);

  const getOutingData = async () => {
    setLoading(true);
    try{
      const res: AxiosResponse<OutingGetResponse> = await instance.post(
        "/api/teacher/outing",
        { owner: selectedUser.id }
      );
      setSat(res.data.data.sat);
      setSun(res.data.data.sun);
    }
    catch(e: any){
      alert(e.response.data.message);
    }
    setLoading(false);
  };

  const putOutingData = async () => {
    setLoading(true);
    try{
      const res = await instance.put("/api/teacher/outing", {
        owner: selectedUser.id,
        sat, sun,
      });
      await getOutingData();
      alert(res.data.message);
    }
    catch(e: any){
      alert(e.response.data.message);
    }
    setLoading(false);
  };

  return (
    <article className="flex flex-col gap-4">
      <section className="flex flex-col gap-2 pb-2">
        <h1 className="text-xl font-semibold">외출 및 급식 변경 수정하기</h1>
        <p className="text-base">
          선택된 학생: [{selectedUser.gender === "male" ? "남학생" : "여학생"}] {selectedUser?.number} {selectedUser?.name}
        </p>
      </section>
      <section className="flex flex-col gap-3">
        <OutingOption
          title="토요일"
          data={sat}
          setData={setSat}
          loading={loading}
        />
        <OutingOption 
          title="일요일"
          data={sun}
          setData={setSun}
          loading={loading}
        />
      </section>
      <button 
        className="bg-primary text-white w-full text-base font-semibold rounded h-10"
        onClick={putOutingData}
      >
        수정하기
      </button>
    </article>
  );
};

export default Outing;