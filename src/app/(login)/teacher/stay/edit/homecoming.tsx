import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import React from "react";

import { goTime } from "@/app/api/homecoming/utils";
import { UserInfo } from "@/app/api/teacher/userinfo/utils";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";


const Homecoming = ({
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
  const [myApply, setMyApply] = React.useState("");
  const [input, setInput] = React.useState("");
  const [goTimeI, setGoTimeI] = React.useState(-1);

  const getHomecomingData = async () => {
    setLoading(true);
    try{
      const res: AxiosResponse = await instance.get(`/api/teacher/homecoming/${selectedUser.id}`);
      setMyApply(res.data.data.reason);
      setInput(res.data.data.reason);
      setGoTimeI(goTime.indexOf(res.data.data.time));
      router.refresh();
    }
    catch(e: any){
      alert.error(e.response.data.message);
    }
    setLoading(false);
  };
  const putHomecomingData = async () => {
    setLoading(true);
    const loading = alert.loading("금요귀가 신청 중 입니다.");
    try{
      await instance.put(`/api/teacher/homecoming/${selectedUser.id}`, { 
        reason: input,
        time: goTime[goTimeI],
      });
      await getHomecomingData();
      alert.update(loading, "금요귀가 신청이 완료되었습니다.", "success");
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
  };
  const deleteHomecomingData = async () => {
    setLoading(true);
    const loading = alert.loading("금요귀가 신청 취소 중 입니다.");
    try{
      await instance.delete(`/api/teacher/homecoming/${selectedUser.id}`);
      await getHomecomingData();
      alert.update(loading, "금요귀가 신청이 취소되었습니다.", "success");
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getHomecomingData();
  }, [selectedUser]);

  return (
    <section className="flex flex-col gap-3">
      <section className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">금요귀가 신청하기</h1>
        <p className="text-base">
          선택된 학생: [{selectedUser.gender === "male" ? "남학생" : "여학생"}] {selectedUser?.number} {selectedUser?.name}
        </p>
        <h1 className="text-base text-[#e11d48]">학년부 또는 생활관 사정에 따라 금요귀가 신청이 반려될 수 있습니다.</h1>
      </section>
      <section className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold w-max whitespace-nowrap">귀가 시간</h1>
        <article className={[
          "flex flex-wrap flex-row gap-2 bg-white rounded border border-text/10 p-5 justify-center items-center",
          loading ? "loading_background" : "",
        ].join(" ")}>
          {
            goTime.map((_, i) => (
              <button 
                key={i}
                onClick={() => setGoTimeI(i)}
                className={[
                  "text-base rounded h-10 border border-text/10 px-4 w-full transition-colors",
                  goTimeI === i ? "bg-text/10" : "",
                ].join(" ")}
                disabled={loading || !!myApply}
              >
                {_}
              </button>
            ))
          }
        </article>
      </section>
      <section className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold w-max whitespace-nowrap">사유 입력</h1>
        <section className={[
          "bg-white p-5 border border-text/10 rounded",
          loading ? "loading_background" : "",
        ].join(" ")}>
          <input 
            type="text" 
            placeholder="금요귀가 사유를 입력해주세요." 
            className="w-full h-10 border border-text/10 rounded px-3 bg-transparent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || !!myApply}
          />
        </section>
      </section>
      {
        myApply ? (
          <button 
            className="w-full py-2 rounded font-semibold text-[#EF4444] border border-[#EF4444]"
            onClick={deleteHomecomingData}
          >
            금요귀가 신청 취소하기
          </button>
        ) : (
          <button 
            className="bg-primary text-white w-full text-base font-semibold rounded h-10"
            onClick={putHomecomingData}
          >
            금요귀가 신청하기
          </button>
        )
      }
    </section>
  );
};

export default Homecoming;