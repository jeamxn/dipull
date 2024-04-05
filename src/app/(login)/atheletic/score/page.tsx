"use client";

import React, { DetailedHTMLProps, HTMLAttributes } from "react";

import Insider from "@/provider/insider";
import instance from "@/utils/instance";

import Menu from "../menu";

const Score = () => {
  const [loading, setLoading] = React.useState(false);
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
          <section className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold">점수 현황</h1>
          </section>
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
                  <th className="text-center px-4 whitespace-nowrap py-2 font-semibold w-full" colSpan={3}>승점 획득 현황</th>
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