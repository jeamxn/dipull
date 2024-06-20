"use client";

import React from "react";
import Swal from "sweetalert2";

import { alert } from "@/utils/alert";
import instance from "@/utils/instance";


const GotoClass = ({
  getStayData
}: {
  getStayData: () => Promise<void>
}) => {
  const [loading, setLoading] = React.useState(false);

  const download = async (grade: number) => {
    setLoading(true);
    const loading = alert.loading(`${grade}학년 전체 교실로 잔류 위치 수정 중 입니다.`);
    try{
      const res = await instance.post("/api/teacher/stay/sendtoclass", {
        grade,
      });
      await getStayData();
      alert.update(loading, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
  };
  
  return (
    <article className="flex flex-col gap-3">
      <h1 className="text-xl font-semibold">학년 전체 교실로 잔류 위치 수정</h1>
      <article className={[
        "flex flex-row gap-2 bg-white rounded border border-text/10 p-5",
        loading ? "loading_background" : "",
      ].join(" ")}>
        {
          new Array(3).fill(0).map((_, i) => (
            <button 
              key={i}
              onClick={() => {
                Swal.fire({
                  title: `${i + 1}학년 전체 교실로 잔류 위치 수정`,
                  text: `정말 ${i + 1}학년 전체 교실로 잔류 위치를 수정하시겠습니까?`,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "수정",
                  cancelButtonText: "취소",
                  background: "rgb(var(--color-white) / 1)",
                  color: "rgb(var(--color-text) / 1)",
                }).then((result) => {
                  if (result.isConfirmed) {
                    download(i + 1);
                  }
                });
              }}
              className="text-base rounded h-10 hover:bg-text/10 border border-text/10 px-4 w-full transition-colors"
            >
              {i + 1}학년
            </button>
          ))
        }
      </article>
    </article>
  );
};

export default GotoClass;