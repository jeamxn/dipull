import React from "react";

import { UserData } from "@/app/auth/type";

const Area = ({
  loading,
  textarea,
  setTextarea,
  anonymous,
  setAnonymous,
  grade,
  setGrade,
  put,
  userInfo,
  placeholder,
}: {
  loading: boolean,
  textarea: string,
  setTextarea: React.Dispatch<React.SetStateAction<string>>,
  anonymous: boolean,
  setAnonymous: React.Dispatch<React.SetStateAction<boolean>>,
  grade: boolean,
  setGrade: React.Dispatch<React.SetStateAction<boolean>>,
  put: () => (any | Promise<any>),
  userInfo: UserData,
  placeholder?: {
    textarea?: string,
    put?: string,
  },
}) => {
  return (
    <article className={[
      "flex flex-col gap-1 bg-white rounded border border-text/10 p-5 justify-start items-start overflow-auto",
      loading ? "loading_background" : "",
    ].join(" ")}>
      <div className="w-full h-full relative">
        <textarea 
          className="w-full min-h-40 h-full border border-text/10 rounded p-3 bg-transparent"
          placeholder={placeholder?.textarea || "제보할 내용을 입력해주세요."}
          value={textarea}
          onChange={(e) => setTextarea(e.target.value)}
          maxLength={380}
        />
        <span className="text-text/50 text-right font-light text-sm absolute right-0 bottom-0 my-4 mx-2 px-2 rounded-sm py-1 cursor-text backdrop-blur-xl">{textarea.length}/380자</span>
        <span className="text-text/50 text-left font-light text-sm absolute left-0 bottom-0 my-4 mx-2 px-2 rounded-sm py-1 cursor-text backdrop-blur-xl">
          {
            grade ? Math.floor(userInfo.number / 1000) + "학년" : ""
          }
          &nbsp;
          {
            anonymous ? "익명" : userInfo.name
          }</span>
      </div>
      <div className="flex flex-row items-center justify-end gap-2 w-full">
        <button 
          className={[
            "border w-full max-w-32 text-base font-medium rounded h-10 cursor-pointer",
            !grade ? "border-text/30 text-text/30" : "border-primary text-primary",
          ].join(" ")}
          onClick={() => setGrade(p => !p)}
        >
          학년 {grade ? "O" : "X"}
        </button>
        <button 
          className={[
            "border w-full max-w-32 text-base font-medium rounded h-10 cursor-pointer",
            !anonymous ? "border-text/30 text-text/30" : "border-primary text-primary",
          ].join(" ")}
          onClick={() => setAnonymous(p => !p)}
        >
          익명 {anonymous ? "O" : "X"}
        </button>
        <button 
          className={[
            "border w-full max-w-32 text-base font-medium rounded h-10",
            loading || !textarea ? "cursor-not-allowed border-text/30 text-text/30" : "cursor-pointer bg-primary text-white",
          ].join(" ")}
          onClick={put}
        >
          {placeholder?.put || "제보하기"}
        </button>
      </div>
    </article>
  );
};

export default Area;