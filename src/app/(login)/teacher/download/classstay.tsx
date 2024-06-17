"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

type ClassstayType = {
  grade1: boolean;
  grade2: boolean;
  grade3: boolean;
};

const Classstay = ({ init }: {
  init: boolean[],
}) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [isClassstay, setIsClassstay] = React.useState<ClassstayType>({
    grade1: init[1],
    grade2: init[2],
    grade3: init[3],
  });

  const getClassstay = async () => { 
    setLoading(true);
    try{
      const res = await instance.get("/api/teacher/stay/where");
      const newData = {
        grade1: res.data.data[1],
        grade2: res.data.data[2],
        grade3: res.data.data[3],
      };
      setIsClassstay(newData);
      router.refresh();
    }
    catch(e: any){
      alert.error(e.response.data.message);
    }
    setLoading(false);
  };

  const postClassstay = async (isClassstay_inner: ClassstayType) => {
    setLoading(true);
    const loading = alert.loading("잔류 장소 설정 중 입니다.");
    try{
      const res = await instance.post("/api/teacher/stay/where", isClassstay_inner);
      await getClassstay();
      alert.update(loading, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
  };
  
  return (
    <article className="flex flex-col gap-3">
      <h1 className="text-xl font-semibold">잔류 장소 설정</h1>
      <article className={[
        "flex flex-row gap-4 bg-white rounded border border-text/10 p-5 overflow-auto",
        loading ? "loading_background" : "",
      ].join(" ")}>
        {
          Object.entries(isClassstay).map(([key, value]) => (
            <button
              key={key}
              className={[
                "w-full rounded border border-text/10 px-10 py-3 flex flex-col gap-0 items-center justify-center",
                value ? "bg-text/10": "",
              ].join(" ")}
              onClick={() => {
                const newClassstay = {
                  ...isClassstay,
                  [key]: !value,
                };
                postClassstay(newClassstay);
                setIsClassstay(newClassstay);
              }}
            >
              <p className="font-bold">{key.replace("grade", "")}학년</p>
              <p>{ value ? "교실" : "열람실" }</p>
            </button>
          ))
        }
      </article>
    </article>
  );
};

export default Classstay;