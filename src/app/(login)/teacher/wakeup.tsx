/* eslint-disable @next/next/no-img-element */

import moment from "moment";
import React from "react";

import { WakeupGET } from "@/app/api/wakeup/utils";
import instance from "@/utils/instance";

const Wakeup = ({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
})  => {
  const [wakeup, setWakeup] = React.useState<WakeupGET>({});
  const [today, setToday] = React.useState<moment.Moment>(moment());
  const [gender, setGender] = React.useState<"male" | "femal">("male");

  const getWakeup = async () => {
    setLoading(true);
    try{
      const res = await instance.get("/api/wakeup");
      setWakeup(res.data.data.all);
      setToday(moment(res.data.data.today, "YYYY-MM-DD"));
      setGender(res.data.data.gender);
    }
    catch(e: any){
      alert(e.response.data.message);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getWakeup();
  }, []);

  return (
    <article className="flex flex-col gap-3">
      <section className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">기상송 신청 순위</h1>
        <h1 className="text-base">{today.format("MM월 DD일")} 08시 00분 ~ {today.clone().add(1, "day").format("MM월 DD일")} 07시 59분</h1>
      </section>
      <section className={[
        "flex flex-col gap-4 bg-white rounded border border-text/10 p-5",
        loading ? "loading_background" : "",
      ].join(" ")}>
          
        <table className="w-full">
          <tbody className="w-full border-y border-text/10">
            <tr className="w-full">
              <th className="text-center px-4 whitespace-nowrap py-2 font-semibold w-full" colSpan={2}>{gender === "male" ? "남" : "여"}학생 기상송 신청 순위</th>
            </tr>
            {
              Object.keys(wakeup).length ? Object.entries(wakeup)
                .sort((a, b) => a[1].count > b[1].count ? -1 : 1).map(([key, v], i) => (
                  <tr className="w-full border-y border-text/10" key={i}>
                    <td className="text-center px-4 whitespace-nowrap py-2">{i + 1}</td>
                    <td 
                      className="w-full text-left p-4 border-l border-text/10"
                      onClick={() => {
                        const win = window.open(`https://www.youtube.com/watch?v=${key}`, "_blank");
                        if(win) win.focus();
                      }}
                    >
                      <div className="flex flex-col gap-3">
                        <img 
                          src={v.thumbnails.high?.url || v.thumbnails.medium?.url || v.thumbnails.default?.url || ""} 
                          alt={v.title}
                          className="max-w-[160px] object-cover rounded aspect-video cursor-pointer"
                        />
                        <p className="text-left cursor-pointer">[{v.count}표] {v.title}</p>
                      </div>
                    </td>
                  </tr>
                )) : (
                <tr className="w-full border-y border-text/10">
                  <td className="text-center px-4 whitespace-nowrap py-2 text-text/50" colSpan={3}>신청된 기상송이 없습니다.</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </section>
    </article>
  );
};

export default Wakeup;