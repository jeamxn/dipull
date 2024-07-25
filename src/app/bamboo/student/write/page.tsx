/* eslint-disable @next/next/no-img-element */
"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React from "react";

import { useConfirmModalDispatch } from "@/components/ConfirmModal";
import * as Select from "@/components/Select";
import { useAuth } from "@/hooks";

import { BambooWriteResponse } from "./put/utils";
import SetName from "./setName";

const MarkdownEditor = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  { ssr: false }
);

function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const grade = React.useMemo(() => Math.floor(user.number / 1000), [user]);
  const [selected, setSelected] = React.useState<string>(JSON.stringify({ grade: true, anonymous: true }));
  const [title, setTitle] = React.useState<string>("");
  const [content, setContent] = React.useState<string>("");
  const confirmModalDispatch = useConfirmModalDispatch();

  const data = React.useMemo(() => { 
    const parsed = JSON.parse(selected);
    return {
      title,
      content,
      grade: parsed.grade,
      anonymous: parsed.anonymous,
    };
  }, [selected, title, content]);

  const send = () => {
    console.log(data);
    refetch();
  };

  const { refetch, isFetched, isError } = useQuery({
    queryKey: ["bamboo_put", data.title, data.content, data.grade, data.anonymous],
    queryFn: async () => {
      const response = await axios.post<BambooWriteResponse>("/bamboo/student/write/put", {
        title: data.title,
        content: data.content,
        grade: data.grade,
        anonymous: data.anonymous,
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
  });

  React.useEffect(() => { 
    if (!isFetched || isError) return;
    setTitle("");
    setContent("");
    setSelected(JSON.stringify({ grade: true, anonymous: true }));
    router.push("/bamboo");
  }, [isFetched]);

  return (
    <div className="py-6 flex flex-col gap-8">
      <div className="flex flex-row items-center justify-between gap-4 px-4">
        <button
          onClick={() => {
            confirmModalDispatch({
              type: "show",
              data: {
                title: "글 작성을 취소하시겠습니까?",
                description: "작성 중인 글은 저장되지 않습니다.",
                onConfirm: () => {
                  router.back();
                },
              }
            });
          }}
        >
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-text dark:fill-text-dark" d="M12 13.8373L7.09999 18.7373C6.91665 18.9206 6.68332 19.0123 6.39999 19.0123C6.11665 19.0123 5.88332 18.9206 5.69999 18.7373C5.51665 18.554 5.42499 18.3206 5.42499 18.0373C5.42499 17.754 5.51665 17.5206 5.69999 17.3373L10.6 12.4373L5.69999 7.5373C5.51665 7.35397 5.42499 7.12064 5.42499 6.8373C5.42499 6.55397 5.51665 6.32064 5.69999 6.1373C5.88332 5.95397 6.11665 5.8623 6.39999 5.8623C6.68332 5.8623 6.91665 5.95397 7.09999 6.1373L12 11.0373L16.9 6.1373C17.0833 5.95397 17.3167 5.8623 17.6 5.8623C17.8833 5.8623 18.1167 5.95397 18.3 6.1373C18.4833 6.32064 18.575 6.55397 18.575 6.8373C18.575 7.12064 18.4833 7.35397 18.3 7.5373L13.4 12.4373L18.3 17.3373C18.4833 17.5206 18.575 17.754 18.575 18.0373C18.575 18.3206 18.4833 18.554 18.3 18.7373C18.1167 18.9206 17.8833 19.0123 17.6 19.0123C17.3167 19.0123 17.0833 18.9206 16.9 18.7373L12 13.8373Z" />
          </svg>
        </button>
        <div className="flex flex-row items-center justify-center gap-2">
          <p className="text-xl font-semibold select-none transition-all whitespace-nowrap text-text dark:text-text-dark">새 글 쓰기</p>
          <p className="text-xl font-semibold select-none transition-all text-text dark:text-text-dark">|</p>
          <SetName selected={selected} setSelected={setSelected} />
        </div>
        <button className="-m-2 p-2" onClick={send}>
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-text dark:fill-text-dark" d="M9.54996 15.5875L18.025 7.1125C18.225 6.9125 18.4625 6.8125 18.7375 6.8125C19.0125 6.8125 19.25 6.9125 19.45 7.1125C19.65 7.3125 19.75 7.55 19.75 7.825C19.75 8.1 19.65 8.3375 19.45 8.5375L10.25 17.7375C10.05 17.9375 9.81663 18.0375 9.54996 18.0375C9.2833 18.0375 9.04996 17.9375 8.84996 17.7375L4.54996 13.4375C4.34996 13.2375 4.25413 13 4.26246 12.725C4.2708 12.45 4.37496 12.2125 4.57496 12.0125C4.77496 11.8125 5.01246 11.7125 5.28746 11.7125C5.56246 11.7125 5.79996 11.8125 5.99996 12.0125L9.54996 15.5875Z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-3 px-4">
        <input
          type="text"
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 text-xl font-semibold text-text dark:text-text-dark bg-transparent border-b border-text/10 dark:border-text-dark/20 outline-none placeholder:text-text/20 dark:placeholder:text-text-dark/30"
        />
        <MarkdownEditor
          value={content}
          onChange={setContent}
          className="text-text dark:text-text-dark bg-white dark:bg-white-dark border border-text/10 dark:border-text-dark/20 rounded-md min-h-[calc((100vh-200px)*0.7)]"
        />
      </div>
    </div>
  );
}

export default Home;