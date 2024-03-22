/* eslint-disable @next/next/no-img-element */
"use client";

import moment from "moment";
import React from "react";

import { WakeupDB, WakeupGET } from "@/app/api/wakeup/utils";
import Insider from "@/provider/insider";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

import Menu from "../menu";

const Admin = () => {
  const [loading, setLoading] = React.useState(false);
  const [wakeup, setWakeup] = React.useState<WakeupGET>({});
  const [week, setWeek] = React.useState<moment.Moment>(moment());
  const [gender, setGender] = React.useState<"male" | "femal">("male");
  const [my, setMy] = React.useState<WakeupDB[]>([]);

  const getWakeup = async () => {
    setLoading(true);
    try{
      const res = await instance.get("/api/wakeup");
      setWakeup(res.data.data.all);
      setWeek(moment(res.data.data.week, "YYYY-MM-DD"));
      setGender(res.data.data.gender);
      setMy(res.data.data.my);
    }
    catch(e: any){
      alert.error(e.response.data.message);
    }
    setLoading(false);
  };

  const putWakeup = async (select: any) => {
    setLoading(true);
    const loading = alert.loading("기상송 신청 중 입니다.");
    try{
      const res = await instance.put(
        "/api/wakeup", {
          data: select
        }
      );
      await getWakeup();
      alert.update(loading, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getWakeup();
  }, []);

  const sunday = week.clone().day(0);
  const saturday = week.clone().day(6).add(1, "day");

  return (
    <>
      <Menu />
      <Insider>
        <article className="flex flex-col gap-3">
          <section className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold">기상송 신청 순위</h1>
            <h1 className="text-base">{sunday.format("MM월 DD일")} 18시 00분 ~ {saturday.format("MM월 DD일")} 17시 59분</h1>
          </section>
          <section className={[
            "flex flex-col gap-4 bg-white rounded border border-text/10 p-5 overflow-auto",
            loading ? "loading_background" : "",
          ].join(" ")}>

            <table className="w-full overflow-auto">
              <tbody className="w-full border-y border-text/10 overflow-auto">
                <tr className="w-full">
                  <th className="text-center px-4 whitespace-nowrap py-2 font-semibold w-full" colSpan={2}>{gender === "male" ? "남" : "여"}학생 기상송 신청 순위</th>
                  <td className="text-center px-4">신청</td>
                </tr>
                {
                  Object.keys(wakeup).length ? Object.entries(wakeup)
                    .sort((a, b) => a[1].count > b[1].count ? -1 : 1).map(([key, v], i) => (
                      <tr className="w-full border-y border-text/10" key={i}>
                        <td className="text-center px-4 whitespace-nowrap py-2">{i + 1}</td>
                        <td
                          className="w-full text-left p-4 border-x border-text/10"
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
                        <td
                          className="text-center px-4 select-none"
                          onClick={() => putWakeup({
                            title: v.title,
                            id: key,
                            thumbnails: v.thumbnails,
                          })}
                        >
                          <div className="flex justify-center items-center h-full">
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.33856 11.9489L6.01546 9.62581C5.87701 9.48734 5.70298 9.41651 5.49336 9.41331C5.28375 9.41009 5.1065 9.48093 4.96164 9.62581C4.81677 9.77068 4.74434 9.94631 4.74434 10.1527C4.74434 10.3591 4.81677 10.5347 4.96164 10.6796L7.70586 13.4238C7.88663 13.6046 8.09753 13.695 8.33856 13.695C8.57958 13.695 8.79047 13.6046 8.97124 13.4238L14.5347 7.86039C14.6732 7.72194 14.744 7.5479 14.7472 7.33828C14.7504 7.12867 14.6796 6.95143 14.5347 6.80656C14.3898 6.66169 14.2142 6.58926 14.0078 6.58926C13.8014 6.58926 13.6258 6.66169 13.4809 6.80656L8.33856 11.9489ZM9.75946 19.3027C8.44553 19.3027 7.2105 19.0534 6.05436 18.5547C4.89821 18.056 3.89253 17.3793 3.03731 16.5244C2.18208 15.6696 1.50502 14.6643 1.00614 13.5087C0.507254 12.3531 0.257812 11.1183 0.257812 9.80439C0.257812 8.49045 0.507146 7.25542 1.00581 6.09928C1.50448 4.94313 2.18123 3.93745 3.03606 3.08224C3.89091 2.227 4.89615 1.54994 6.05179 1.05106C7.2074 0.552177 8.44218 0.302734 9.75611 0.302734C11.07 0.302734 12.3051 0.552069 13.4612 1.05074C14.6174 1.5494 15.623 2.22615 16.4783 3.08098C17.3335 3.93583 18.0106 4.94108 18.5094 6.09671C19.0083 7.25233 19.2578 8.4871 19.2578 9.80104C19.2578 11.115 19.0084 12.35 18.5098 13.5061C18.0111 14.6623 17.3343 15.668 16.4795 16.5232C15.6247 17.3784 14.6194 18.0555 13.4638 18.5544C12.3082 19.0532 11.0734 19.3027 9.75946 19.3027ZM9.75779 17.8027C11.9911 17.8027 13.8828 17.0277 15.4328 15.4777C16.9828 13.9277 17.7578 12.036 17.7578 9.80271C17.7578 7.56938 16.9828 5.67771 15.4328 4.12771C13.8828 2.57771 11.9911 1.80271 9.75779 1.80271C7.52445 1.80271 5.63279 2.57771 4.08279 4.12771C2.53279 5.67771 1.75779 7.56938 1.75779 9.80271C1.75779 12.036 2.53279 13.9277 4.08279 15.4777C5.63279 17.0277 7.52445 17.8027 9.75779 17.8027Z" fill={my.filter((e: WakeupDB) => e.id == key).length != 0?"green":"rgb(var(--color-text) / .35)"}/>
                            </svg>
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
      </Insider>
    </>
  );
};

export default Admin;
