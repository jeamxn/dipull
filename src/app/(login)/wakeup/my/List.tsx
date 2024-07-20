"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useRecoilState } from "recoil";

import { defaultWakeupAvail } from "@/app/api/wakeup/apply/utils";
import { Rank } from "@/app/api/wakeup/ranking/utils";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

const List = ({
  avail,
  ranking: initailRanking,
}: {
    avail: number,
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

  return (
    <article className="flex flex-col gap-3">
      <section className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">상위권 순위표</h1>
        <h1 className="text-base text-primary">기본 개수인 {defaultWakeupAvail}개 제외.</h1>
      </section>
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