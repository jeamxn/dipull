"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { defaultWakeupAvail } from "@/app/api/wakeup/apply/utils";
import { Rank } from "@/app/api/wakeup/ranking/utils";
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

  return (
    <article className="flex flex-col gap-3">
      <div className="flex flex-row items-center justify-between">
        <section className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">상위권 순위표</h1>
          <h1 className="text-base text-primary">기본 개수인 {defaultWakeupAvail}개 제외.</h1>
        </section>
        <button
          className="border border-text/10 rounded py-2 px-4 bg-white text-text/50 font-semibold"
          onClick={gooola}
        >복구하기</button>
      </div>
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