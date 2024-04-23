import dynamic from "next/dynamic";
import React from "react";

import { limit } from "@/app/api/bamboo/utils";
import { UserData } from "@/app/auth/type";

const MarkdownEditor = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  { ssr: false }
);

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
      <div className="w-full h-full">
        <MarkdownEditor 
          value={textarea}
          onChange={(e) => setTextarea(e)}
          minHeight="12rem"
          className="text-text bg-white"
          
        />
      </div>
      <div className="w-full flex flex-row items-center justify-between">
        <span className="text-text/50 text-left font-light text-sm rounded-sm py-1 cursor-text backdrop-blur-xl">
          {
            grade ? Math.floor(userInfo.number / 1000) + "학년" : ""
          }
          &nbsp;
          {
            anonymous ? "익명" : userInfo.name
          }
        </span>
        <span className={[
          "text-right font-light text-sm rounded-sm py-1 cursor-text backdrop-blur-xl",
          textarea.length > limit ? "text-[#EF4444]" : "text-text/50",
        ].join(" ")}>
          {textarea.length}/{limit}자
        </span>
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
            loading || !textarea || textarea.length > limit ? "cursor-not-allowed border-text/30 text-text/30" : "cursor-pointer bg-primary text-white",
          ].join(" ")}
          onClick={put}
          disabled={loading || !textarea || textarea.length > limit}
        >
          {placeholder?.put || "제보하기"}
        </button>
      </div>
    </article>
  );
};

export default Area;