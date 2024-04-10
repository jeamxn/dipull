"use client";

import moment from "moment";
import Link from "next/link";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";

import Insider from "@/provider/insider";
import instance from "@/utils/instance";

import Menu from "../menu";

const Score = () => {
  const [loading, setLoading] = React.useState(false);
  const [time, setTime] = React.useState<moment.Moment>(moment());
  const [score, setScore] = React.useState({
    white: 0,
    blue: 0,
  });
  const [scoreDescriptions, setScoreDescriptions] = React.useState<{
    team: "white" | "blue";
    score: number;
    description: string;
  }[]>([]);

  const getScore = async () => {
    setLoading(true);
    try{
      const { data } = await instance.get("/api/atheletic/score");
      setTime(moment());
      setScore(data.data.count);
      setScoreDescriptions(data.data.getDescriptions);
    }
    catch(e){
      console.error(e);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getScore();
  }, []);

  const sum = score.blue + score.white;
  const start = (score.blue * 100 / sum) || 0;
  const end = (score.white * 100 / sum) || 0;

  return (
    <>
      <Menu />
      <Insider>
        <article className="flex flex-col gap-3">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <h1 className="text-xl font-semibold">전체 점수 현황</h1>
              <div className={[
                "hover:font-semibold cursor-pointer transition-all h-7 w-7 flex items-center justify-center",
                loading ? "rotation" : "",
              ].join(" ")} onClick={getScore}>
                <svg width="14" height="14" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.69922 16.8835C6.46589 16.8835 4.57422 16.1085 3.02422 14.5585C1.47422 13.0085 0.699219 11.1169 0.699219 8.88354C0.699219 6.65021 1.47422 4.75855 3.02422 3.20854C4.57422 1.65854 6.46589 0.883545 8.69922 0.883545C9.84922 0.883545 10.9492 1.12104 11.9992 1.59604C13.0492 2.07104 13.9492 2.75021 14.6992 3.63354V1.88354C14.6992 1.60021 14.7951 1.36271 14.9867 1.17104C15.1784 0.979378 15.4159 0.883545 15.6992 0.883545C15.9826 0.883545 16.2201 0.979378 16.4117 1.17104C16.6034 1.36271 16.6992 1.60021 16.6992 1.88354V6.88354C16.6992 7.16688 16.6034 7.40438 16.4117 7.59605C16.2201 7.78771 15.9826 7.88354 15.6992 7.88354H10.6992C10.4159 7.88354 10.1784 7.78771 9.98672 7.59605C9.79505 7.40438 9.69922 7.16688 9.69922 6.88354C9.69922 6.60021 9.79505 6.36271 9.98672 6.17104C10.1784 5.97938 10.4159 5.88354 10.6992 5.88354H13.8992C13.3659 4.95021 12.6367 4.21688 11.7117 3.68354C10.7867 3.15021 9.78255 2.88354 8.69922 2.88354C7.03255 2.88354 5.61589 3.46688 4.44922 4.63354C3.28255 5.80021 2.69922 7.21688 2.69922 8.88354C2.69922 10.5502 3.28255 11.9669 4.44922 13.1335C5.61589 14.3002 7.03255 14.8835 8.69922 14.8835C9.83255 14.8835 10.8701 14.596 11.8117 14.021C12.7534 13.446 13.4826 12.6752 13.9992 11.7085C14.1326 11.4752 14.3201 11.3127 14.5617 11.221C14.8034 11.1294 15.0492 11.1252 15.2992 11.2085C15.5659 11.2919 15.7576 11.4669 15.8742 11.7335C15.9909 12.0002 15.9826 12.2502 15.8492 12.4835C15.1659 13.8169 14.1909 14.8835 12.9242 15.6835C11.6576 16.4835 10.2492 16.8835 8.69922 16.8835Z" fill="rgb(var(--color-primary) / 1)"/>
                </svg>
              </div>
            </div>
            <Link
              href="/atheletic/fullscreen"
              prefetch
            >
              <div className={[
                "hover:font-semibold cursor-pointer transition-all h-7 w-7 flex items-center justify-center",
              ].join(" ")}>
                <svg width="14" height="14" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.42383 16.1471H4.42383C4.70716 16.1471 4.94466 16.2429 5.13633 16.4346C5.32799 16.6263 5.42383 16.8638 5.42383 17.1471C5.42383 17.4304 5.32799 17.6679 5.13633 17.8596C4.94466 18.0513 4.70716 18.1471 4.42383 18.1471H1.42383C1.14049 18.1471 0.902995 18.0513 0.711328 17.8596C0.519661 17.6679 0.423828 17.4304 0.423828 17.1471V14.1471C0.423828 13.8638 0.519661 13.6263 0.711328 13.4346C0.902995 13.2429 1.14049 13.1471 1.42383 13.1471C1.70716 13.1471 1.94466 13.2429 2.13633 13.4346C2.32799 13.6263 2.42383 13.8638 2.42383 14.1471V16.1471ZM16.4238 16.1471V14.1471C16.4238 13.8638 16.5197 13.6263 16.7113 13.4346C16.903 13.2429 17.1405 13.1471 17.4238 13.1471C17.7072 13.1471 17.9447 13.2429 18.1363 13.4346C18.328 13.6263 18.4238 13.8638 18.4238 14.1471V17.1471C18.4238 17.4304 18.328 17.6679 18.1363 17.8596C17.9447 18.0513 17.7072 18.1471 17.4238 18.1471H14.4238C14.1405 18.1471 13.903 18.0513 13.7113 17.8596C13.5197 17.6679 13.4238 17.4304 13.4238 17.1471C13.4238 16.8638 13.5197 16.6263 13.7113 16.4346C13.903 16.2429 14.1405 16.1471 14.4238 16.1471H16.4238ZM2.42383 2.14709V4.14709C2.42383 4.43043 2.32799 4.66793 2.13633 4.85959C1.94466 5.05126 1.70716 5.14709 1.42383 5.14709C1.14049 5.14709 0.902995 5.05126 0.711328 4.85959C0.519661 4.66793 0.423828 4.43043 0.423828 4.14709V1.14709C0.423828 0.863761 0.519661 0.626261 0.711328 0.434595C0.902995 0.242928 1.14049 0.147095 1.42383 0.147095H4.42383C4.70716 0.147095 4.94466 0.242928 5.13633 0.434595C5.32799 0.626261 5.42383 0.863761 5.42383 1.14709C5.42383 1.43043 5.32799 1.66793 5.13633 1.85959C4.94466 2.05126 4.70716 2.14709 4.42383 2.14709H2.42383ZM16.4238 2.14709H14.4238C14.1405 2.14709 13.903 2.05126 13.7113 1.85959C13.5197 1.66793 13.4238 1.43043 13.4238 1.14709C13.4238 0.863761 13.5197 0.626261 13.7113 0.434595C13.903 0.242928 14.1405 0.147095 14.4238 0.147095H17.4238C17.7072 0.147095 17.9447 0.242928 18.1363 0.434595C18.328 0.626261 18.4238 0.863761 18.4238 1.14709V4.14709C18.4238 4.43043 18.328 4.66793 18.1363 4.85959C17.9447 5.05126 17.7072 5.14709 17.4238 5.14709C17.1405 5.14709 16.903 5.05126 16.7113 4.85959C16.5197 4.66793 16.4238 4.43043 16.4238 4.14709V2.14709Z" fill="rgb(var(--color-text) / 1)"/>
                </svg>
              </div>
            </Link>
          </div>
          <section 
            className={[
              "rounded overflow-hidden flex flex-row",
              "bg-gradient-to-r from-[#6466F1] to-[#adadad]"
            ].join(" ")}
            style={{
              "--tw-gradient-from-position": `${start - 50}%`,
              "--tw-gradient-to-position": `${150 - end}%`,
            } as DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>}
          >
            {
              [score.blue, score.white].map((v, i) => {
                const percent = (v * 100 / sum) || 0;
                return (
                  <article 
                    key={i}
                    className={[
                      "h-full transition-all px-4 py-3 flex flex-col justify-center select-none cursor-pointe w-full",
                      i === 0 ? "items-start" : "items-end"
                    ].join(" ")}
                  >
                    <p className="text-sm whitespace-nowrap text-[#fff]">
                      {i === 0 ? "📘 청팀" : "백팀 📖"}
                    </p>
                    <figure className="flex flex-row items-end gap-1">
                      <p className="text-2xl font-semibold whitespace-nowrap text-[#fff]">{Math.floor(percent)}</p>
                      <p className="text-sm -translate-y-1 whitespace-nowrap text-[#fff]">%</p>
                    </figure>
                    <p className="text-sm whitespace-nowrap text-[#fff]">{v === -1 ? "Loading" : v.toLocaleString()}점</p>
                  </article>
                );
              })
            }
          </section>
        </article>
        <section className="flex flex-col gap-3">
          <section className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold">점수 기록</h1>
          </section>
          <section className={[
            "flex flex-col gap-4 bg-white rounded border border-text/10 p-5 overflow-auto ",
            loading ? "loading_background" : "",
          ].join(" ")}>
            <table className="w-full overflow-auto">
              <tbody className="w-full border-y border-text/10 overflow-auto">
                <tr className="w-full">
                  <th className="text-center px-4 whitespace-nowrap py-2 font-semibold w-full" colSpan={3}>
                    승점 획득 현황 ({time.format("YYYY-MM-DD HH:mm")} 기준)
                  </th>
                </tr>
                {
                  scoreDescriptions?.length ? scoreDescriptions.reverse().map((v, i) => (
                    <tr 
                      className={[
                        "w-full border-y border-text/10",
                      ].join(" ")}
                      key={i}
                    >
                      <td className="text-center px-4 whitespace-nowrap py-2 font-semibold text-inherit">
                        {v.team === "white" ? "백팀" : "청팀"}
                      </td>
                      <td className="px-4 select-none text-left border-x border-text/10 text-inherit">
                        {v.score > 0 ? `+${v.score}` : v.score}점
                      </td>
                      <td className="w-full text-left px-4 text-inherit">
                        {v.description}
                      </td>
                    </tr>
                  )) : (
                    <tr className="w-full border-y border-text/10">
                      <td className="text-center px-4 whitespace-nowrap py-2 text-text/50" colSpan={3}>승점 획득 내역이 없습니다.</td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </section>
        </section>
      </Insider>
    </>
  );
};


export default Score;