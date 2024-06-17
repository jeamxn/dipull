"use client";

import moment from "moment";
import { useRouter } from "next/navigation";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";

import { UserInfo } from "@/app/api/teacher/userinfo/utils";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

const Iwannagohome = ({
  init,
  userInfo,
}: {
  init: {
    count: number[];
    my: number;
    date: string;
  };
  userInfo: UserInfo;
}) => {
  const router = useRouter();
  const [count, setCount] = React.useState(init.count);
  const [my, setMy] = React.useState(init.my);
  const [date, setDate] = React.useState<moment.Moment>(moment(init.date, "YYYY-MM-DD"));
  const [pwd, setPwd] = React.useState("");

  const logout = async () => {
    await instance.get("/auth/logout");
    router.push("/login");
  };

  React.useEffect(() => {
    if (!userInfo.id) logout();
  }, []);

  React.useEffect(() => {
    if(!pwd.includes("1010011")) return;
    deleteJoke();
  }, [pwd]);

  const deleteJoke = async () => {
    try{
      await instance.delete("/api/joke");
      window.location.reload();
    }
    catch(e){
      console.error(e);
    }
  };

  const getMeal = async () => {
    try{
      const { data } = await instance.get("/api/iwannagohome");
      setCount(data.data.count);
      setMy(data.data.my);
      setDate(moment(data.data.date, "YYYY-MM-DD"));
      router.refresh();
    }
    catch(e){
      console.error(e);
    }
  };

  const sunday = date.clone().day(0);
  const saturday = date.clone().day(6).add(1, "day");

  const sum = count[0] + count[1];
  const start = (count[0] * 100 / sum) || 0;
  const end = (count[1] * 100 / sum) || 0;

  return (
    <article className="flex flex-col gap-3">
      <section className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">집가고싶어요</h1>
        <h1 className="text-base">{sunday.format("MM월 DD일")} 18시 00분 ~ {saturday.format("MM월 DD일")} 17시 59분</h1>
      </section>
      <section 
        className={[
          "rounded overflow-hidden flex flex-row",
          "bg-gradient-to-r from-[#6466F1] to-[#EC4899]"
        ].join(" ")}
        style={{
          "--tw-gradient-from-position": `${start - 50}%`,
          "--tw-gradient-to-position": `${150 - end}%`,
        } as DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>}
      >
        {
          [count[0], count[1]].map((v, i) => {
            const percent = (v * 100 / sum) || 0;
            return (
              <article 
                key={i}
                className={[
                  "h-full transition-all px-4 py-3 flex flex-col justify-center select-none cursor-pointe w-full",
                  i === 0 ? "items-start" : "items-end"
                ].join(" ")}
                style={{
                }}
                onClick={async () => {
                  const loading = alert.loading("투표 중입니다.");
                  try{
                    await instance.put("/api/iwannagohome", {
                      pick: i,
                    });
                    getMeal();
                    alert.update(loading, "투표가 완료되었습니다.", "success");
                  }
                  catch(e){
                    alert.update(loading, String(e), "error");
                  }
                  setPwd(p => `${p}${i}`);
                }}
              >
                <p className="text-sm whitespace-nowrap text-[#fff]">
                  {i === 0 ? "🛌 집에 가고 싶어요" : "ㅋㅋ난집가는데 🏠"}
                </p>
                <figure className="flex flex-row items-end gap-1">
                  <p className="text-2xl font-semibold whitespace-nowrap text-[#fff]">{Math.floor(percent)}</p>
                  <p className="text-sm -translate-y-1 whitespace-nowrap text-[#fff]">%</p>
                </figure>
                <p className="text-sm whitespace-nowrap text-[#fff]">{v === -1 ? "Loading" : v}표</p>
              </article>
            );
          })
        }
      </section>
    </article>
  );
};

export default Iwannagohome;