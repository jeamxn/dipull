import MarkdownPreview from "@uiw/react-markdown-preview";
import moment from "moment";
import { useRouter } from "next/navigation";
import React from "react";

import { alert } from "@/utils/alert";

import { Data } from "./page";

const BambooBox = ({
  item,
  loading,
  put_reaction,
  click = true,
  isComment = false,
}: {
  item: Data;
  loading: boolean;
  put_reaction: (id: string, reaction: "good" | "bad") => void;
  click?: boolean;
  isComment?: boolean;
}) => {
  const router = useRouter();
  const diff = moment().diff(moment(item.timestamp, "YYYY-MM-DD HH:mm:ss"), "minutes");
  return (
    <article 
      className={[
        "flex flex-col gap-2 bg-white rounded border border-text/10 p-5 justify-start items-start overflow-auto",
        loading ? "loading_background" : "",
      ].join(" ")}
    >
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-row">
          <b className="font-medium">{item.user}</b>의 대나무{isComment ? " 가지" : ""}&nbsp;
        </div>
        <p className="text-text/30">
          {
            diff < 1 ? "방금 전" :
              diff < 60 ? `${diff}분 전` :
                diff < 1440 ? `${Math.floor(diff / 60)}시간 전` :
                  diff < 10080 ? `${Math.floor(diff / 1440)}일 전` :
                    diff < 40320 ? `${Math.floor(diff / 10080)}주 전` :
                      diff < 525600 ? `${Math.floor(diff / 40320)}달 전` :
                        `${Math.floor(diff / 525600)}년 전`
          }
          &nbsp;
          <button
            className="text-text/30 hover:text-primary transition-colors underline"
            onClick={() => {
              if(isComment) return;
              let tempInput = document.createElement("input");
              tempInput.value = `${process.env.NEXT_PUBLIC_APP_URI}/bamboo/${item._id}`;
              document.body.appendChild(tempInput);
              tempInput.select();
              document.execCommand("copy");
              document.body.removeChild(tempInput);
              alert.info("대나무 링크가 복사되었습니다.");
            }}
          >(#{item.number || 0})</button>
        </p>
      </div>
      <div className="flex flex-col justify-start items-start">
        <MarkdownPreview 
          source={item.text} 
          className="bg-white text-text"
        />
      </div>
      <div className="flex flex-row gap-1">
        <button
          className={[
            "text-sm hover:text-primary transition-colors",
            item.isgood ? "text-primary" : "text-text/40",
          ].join(" ")}
          onClick={() => put_reaction(item._id, "good")}
        >추천 {item.good || 0}</button>
        <p className="text-sm text-text/40 transition-colors">·</p>
        <button
          className={[
            "text-sm hover:text-primary transition-colors",
            item.isbad ? "text-primary" : "text-text/40",
          ].join(" ")}
          onClick={() => put_reaction(item._id, "bad")}
        >비추 {item.bad || 0}</button>
        {
          !isComment && (
            <>
              <p className="text-sm text-text/40 transition-colors">·</p>
              <button
                className={[
                  "text-sm hover:text-primary text-text/40 transition-colors",
                ].join(" ")}
                onClick={() => router.push(`/bamboo/${item._id}`)}
              >댓글 {item?.comment || 0}</button>
            </>
          )
        }
      </div>
    </article>
  );
};

export default BambooBox;