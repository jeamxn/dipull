/* eslint-disable @next/next/no-img-element */
"use client";

import { useQuery } from "@tanstack/react-query";
import MarkdownPreview from "@uiw/react-markdown-preview";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import React from "react";

import { useAlertModalDispatch } from "@/components/AlertModal";
import { MoreButton, useMoreModalDispatch } from "@/components/MoreModal";
import Mover from "@/components/Mover";
import * as Select from "@/components/Select";

import { BambooSort } from "../../list/[sort]/[number]/utils";
import { sortOptions, sortOptionValues } from "../../sort";
import Target from "../../target";
import SetName from "../write/setName";

import Comment from "./comment";
import { BambooCommentResponse } from "./comment/[sort]/[number]/utils";
import { BambooCommentWriteResponse } from "./comment/put/utils";
import { BambooDeleteResponse } from "./delete/utils";
import { BambooReact, BambooReactResponse, BambooRead } from "./utils";

const BambooPageContent = ({
  bamboo
}: {
    bamboo: BambooRead;
  }) => {
  const router = useRouter();
  const moreModalDispatch = useMoreModalDispatch();
  const alertModalDispatch = useAlertModalDispatch();
  const [myEmotion, setMyEmotion] = React.useState<"good" | "bad" | "" | "initGood" | "initBad" | "init">("init");
  const [number, setNumber] = React.useState(0);
  const [current, setCurrent] = React.useState(1);
  const [selected, setSelected] = React.useState<BambooSort>("recent");
  const maxCurrent = React.useMemo(() => Math.ceil(number / 20), [number]);
  const [selected_type, setSelected_type] = React.useState<string>(JSON.stringify({ grade: true, anonymous: true }));
  const [comment, setComment] = React.useState("");

  const comment_data = React.useMemo(() => { 
    const parsed = JSON.parse(selected_type);
    return {
      text: comment,
      grade: parsed.grade,
      anonymous: parsed.anonymous,
    };
  }, [selected, comment]);

  const { refetch: commentRefetch, isFetched: isCommentFetched, isError: commentIsError, isFetching: isFetchingCommentPut } = useQuery({
    queryKey: ["bamboo_put", comment_data.text, comment_data.grade, comment_data.anonymous],
    queryFn: async () => {
      const response = await axios.post<BambooCommentWriteResponse>(`/bamboo/student/${bamboo.id}/comment/put`, {
        text: comment_data.text,
        grade: comment_data.grade,
        anonymous: comment_data.anonymous,
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
  });
  const send = () => {
    console.log(comment_data);
    commentRefetch();
  };
  React.useEffect(() => { 
    if (!isCommentFetched || commentIsError) return;
    setComment("");
    setSelected_type(JSON.stringify({ grade: true, anonymous: true }));
    refetch();
  }, [isCommentFetched]);

  const { data, isFetching: isCommentFetching, refetch } = useQuery({
    queryKey: ["bamboo_comment_list", selected, current],
    queryFn: async () => {
      const response = await axios.get<BambooCommentResponse>(`/bamboo/student/${bamboo.id}/comment/${selected}/${current}`);
      setNumber(response.data.count);
      return response.data.list;
    },
    initialData: [],
  });

  const { refetch: deleteBamboo, isError } = useQuery({
    queryKey: ["bamboo_delete", bamboo.id],
    queryFn: async () => {
      const response = await axios.delete<BambooDeleteResponse>(`/bamboo/student/${bamboo.id}/delete`);
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
  });

  const myMoreButtons: MoreButton[] = bamboo.isWriter ? [
    {
      text: "게시글 삭제하기",
      type: "red",
      onClick: async () => {
        await deleteBamboo();
        if (!isError) {
          alertModalDispatch({
            type: "show",
            data: {
              title: "게시글이 삭제되었습니다.",
              description: "게시글이 성공적으로 삭제되었습니다.",
              onAlert: () => { router.replace("/bamboo"); },
              onCancle: () => {
                router.replace("/bamboo");
              },
            }
          });
        }
      },
    },
  ] : [];

  const moreButtons: MoreButton[] = [
    {
      text: "공유하기",
      type: "blue",
      onClick: () => {handleShareClick();},
    },
    ...myMoreButtons,
    {
      text: "신고하기",
      type: "red",
      onClick: () => { 
        alertModalDispatch({
          type: "show",
          data: {
            title: "아직 지원되지 않아요.",
            description: "빠른 시일 내로 개발할 예정입니다.",
          },
        });
      },
    }
  ];

  const { data: reaction, refetch: fetchReaction, isFetching: isReactionLoading } = useQuery({
    queryKey: ["bamboo_reaction_get", bamboo.id],
    queryFn: async () => {
      const response = await axios.get<BambooReact>(`/bamboo/student/${bamboo.id}/reaction`);
      if (response.data.myGood) setMyEmotion("initGood");
      else if (response.data.myBad) setMyEmotion("initBad");
      else setMyEmotion("init");
      return response.data;
    },
  });

  const { isFetching } = useQuery({
    queryKey: ["bamboo_reaction", bamboo.id, myEmotion],
    queryFn: async () => {
      const response = await axios.post<BambooReactResponse>(`/bamboo/student/${bamboo.id}/reaction`, {
        type: myEmotion,
      });
      // await fetchReaction();
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: myEmotion === "initGood" || myEmotion === "initBad" || myEmotion === "init" ? false : true,
    retry: false,
  });

  const handleShareClick = React.useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alertModalDispatch({
          type: "show",
          data: {
            title: "링크가 복사되었습니다.",
            description: "다른 곳에 공유하려면 붙여넣기(Ctrl+V)를 사용하세요.",
          }
        });
      }
    } catch (e) {
      console.log(e);
      alertModalDispatch({
        type: "show",
        data: {
          title: "오잉?",
          description: "공유 중 오류가 발생했습니다. 다시 시도해주세요!",
        }
      });
    }
  }, []);

  return (
    <>
      <div className="py-6 flex flex-col gap-6">
        <div className="flex flex-row items-center justify-between gap-4 px-4">
          <div className="flex flex-row items-center justify-start gap-4">
            <Mover
              onClick={() => router.back()}
              className="-m-2 p-2"
            >
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="fill-text dark:fill-text-dark" d="M9.54995 12.4376L16.9 19.7876C17.15 20.0376 17.2708 20.3293 17.2625 20.6626C17.2541 20.9959 17.125 21.2876 16.875 21.5376C16.625 21.7876 16.3333 21.9126 16 21.9126C15.6666 21.9126 15.375 21.7876 15.125 21.5376L7.42495 13.8626C7.22495 13.6626 7.07495 13.4376 6.97495 13.1876C6.87495 12.9376 6.82495 12.6876 6.82495 12.4376C6.82495 12.1876 6.87495 11.9376 6.97495 11.6876C7.07495 11.4376 7.22495 11.2126 7.42495 11.0126L15.125 3.31261C15.375 3.06261 15.6708 2.94178 16.0125 2.95011C16.3541 2.95844 16.65 3.08761 16.9 3.33761C17.15 3.58761 17.275 3.87928 17.275 4.21261C17.275 4.54594 17.15 4.83761 16.9 5.08761L9.54995 12.4376Z" />
              </svg>
            </Mover>
            <Mover
              className="-m-2 p-2 opacity-0"
            >
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="fill-text dark:fill-text-dark" d="M9.54995 12.4376L16.9 19.7876C17.15 20.0376 17.2708 20.3293 17.2625 20.6626C17.2541 20.9959 17.125 21.2876 16.875 21.5376C16.625 21.7876 16.3333 21.9126 16 21.9126C15.6666 21.9126 15.375 21.7876 15.125 21.5376L7.42495 13.8626C7.22495 13.6626 7.07495 13.4376 6.97495 13.1876C6.87495 12.9376 6.82495 12.6876 6.82495 12.4376C6.82495 12.1876 6.87495 11.9376 6.97495 11.6876C7.07495 11.4376 7.22495 11.2126 7.42495 11.0126L15.125 3.31261C15.375 3.06261 15.6708 2.94178 16.0125 2.95011C16.3541 2.95844 16.65 3.08761 16.9 3.33761C17.15 3.58761 17.275 3.87928 17.275 4.21261C17.275 4.54594 17.15 4.83761 16.9 5.08761L9.54995 12.4376Z" />
              </svg>
            </Mover>
          </div>
        
          <div className="flex flex-row items-center justify-end gap-4">
            <button
              className="-m-2 p-2"
              onClick={handleShareClick}
            >
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="fill-text dark:fill-text-dark" d="M6 23.4374C5.45 23.4374 4.97917 23.2416 4.5875 22.8499C4.19583 22.4582 4 21.9874 4 21.4374V10.4374C4 9.8874 4.19583 9.41657 4.5875 9.0249C4.97917 8.63324 5.45 8.4374 6 8.4374H8C8.28333 8.4374 8.52083 8.53324 8.7125 8.7249C8.90417 8.91657 9 9.15407 9 9.4374C9 9.72074 8.90417 9.95824 8.7125 10.1499C8.52083 10.3416 8.28333 10.4374 8 10.4374H6V21.4374H18V10.4374H16C15.7167 10.4374 15.4792 10.3416 15.2875 10.1499C15.0958 9.95824 15 9.72074 15 9.4374C15 9.15407 15.0958 8.91657 15.2875 8.7249C15.4792 8.53324 15.7167 8.4374 16 8.4374H18C18.55 8.4374 19.0208 8.63324 19.4125 9.0249C19.8042 9.41657 20 9.8874 20 10.4374V21.4374C20 21.9874 19.8042 22.4582 19.4125 22.8499C19.0208 23.2416 18.55 23.4374 18 23.4374H6ZM11 5.2624L10.1 6.1624C9.9 6.3624 9.66667 6.45824 9.4 6.4499C9.13333 6.44157 8.9 6.3374 8.7 6.1374C8.51667 5.9374 8.42083 5.70407 8.4125 5.4374C8.40417 5.17074 8.5 4.9374 8.7 4.7374L11.3 2.1374C11.5 1.9374 11.7333 1.8374 12 1.8374C12.2667 1.8374 12.5 1.9374 12.7 2.1374L15.3 4.7374C15.4833 4.92074 15.575 5.1499 15.575 5.4249C15.575 5.6999 15.4833 5.9374 15.3 6.1374C15.1 6.3374 14.8625 6.4374 14.5875 6.4374C14.3125 6.4374 14.075 6.3374 13.875 6.1374L13 5.2624V15.4374C13 15.7207 12.9042 15.9582 12.7125 16.1499C12.5208 16.3416 12.2833 16.4374 12 16.4374C11.7167 16.4374 11.4792 16.3416 11.2875 16.1499C11.0958 15.9582 11 15.7207 11 15.4374V5.2624Z" />
              </svg>
            </button>
            <button
              className="-m-2 p-2"
              onClick={() => {
                moreModalDispatch({
                  type: "show",
                  data: {
                    buttons: moreButtons,
                  }
                });
              }}
            >
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="fill-text dark:fill-text-dark" d="M12 20.4375C11.45 20.4375 10.9792 20.2417 10.5875 19.85C10.1958 19.4583 10 18.9875 10 18.4375C10 17.8875 10.1958 17.4167 10.5875 17.025C10.9792 16.6333 11.45 16.4375 12 16.4375C12.55 16.4375 13.0208 16.6333 13.4125 17.025C13.8042 17.4167 14 17.8875 14 18.4375C14 18.9875 13.8042 19.4583 13.4125 19.85C13.0208 20.2417 12.55 20.4375 12 20.4375ZM12 14.4375C11.45 14.4375 10.9792 14.2417 10.5875 13.85C10.1958 13.4583 10 12.9875 10 12.4375C10 11.8875 10.1958 11.4167 10.5875 11.025C10.9792 10.6333 11.45 10.4375 12 10.4375C12.55 10.4375 13.0208 10.6333 13.4125 11.025C13.8042 11.4167 14 11.8875 14 12.4375C14 12.9875 13.8042 13.4583 13.4125 13.85C13.0208 14.2417 12.55 14.4375 12 14.4375ZM12 8.4375C11.45 8.4375 10.9792 8.24167 10.5875 7.85C10.1958 7.45833 10 6.9875 10 6.4375C10 5.8875 10.1958 5.41667 10.5875 5.025C10.9792 4.63333 11.45 4.4375 12 4.4375C12.55 4.4375 13.0208 4.63333 13.4125 5.025C13.8042 5.41667 14 5.8875 14 6.4375C14 6.9875 13.8042 7.45833 13.4125 7.85C13.0208 8.24167 12.55 8.4375 12 8.4375Z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="w-full px-4 flex flex-row items-center justify-start gap-2">
          <div>
            <img
              className="w-10 h-10 rounded-full border border-text/10 dark:border-text-dark/20"
              src={bamboo.profile_image || "/public/icons/icon-192-maskable.png"}
              alt="profile"
            />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-sm text-text dark:text-text-dark">{bamboo.user}</p>
            <p className="font-normal text-sm text-text/50 dark:text-text-dark/60">
              {moment(bamboo.timestamp).fromNow()}
              {" · "}
              {bamboo.timestamp}
            </p>
          </div>
        </div>

        <div className="w-full px-4 flex flex-col gap-3">
          <p className="font-semibold text-xl text-text dark:text-text-dark">{bamboo.title}</p>
          <MarkdownPreview
            source={bamboo.content}
            className="bg-transparent font-normal text-base text-text dark:text-text-dark"
            components={{
              a: ({ href, children }) => (
                <a 
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {children}
                </a>
              ),
            }}
          />
        </div>

        <div className="w-full px-4 flex flex-row gap-3 items-center justify-around border-y border-text/10 dark:border-text-dark/20">
          <button
            className="flex flex-row gap-1 items-center justify-center cursor-pointer py-3 w-full"
            onClick={() => {
              if(myEmotion === "good" || myEmotion === "initGood") return setMyEmotion("");
              setMyEmotion("good");
            }}
            disabled={isReactionLoading || isFetching}
          >
            <svg className="w-5 h-5" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className={[
                "transition-all",
                myEmotion === "good" || myEmotion === "initGood" ? 
                  isFetching ? "fill-green-700 dark:fill-green-400" : "fill-blue-700 dark:fill-blue-400" : "fill-text/50 dark:fill-text-dark/60"
              ].join(" ")} d="M4.20676 12.0298V5.01525L7.35227 1.94268C7.5168 1.77815 7.69479 1.67737 7.88624 1.64035C8.07769 1.60333 8.25306 1.63436 8.41235 1.73346C8.57164 1.83255 8.68381 1.98249 8.74887 2.18329C8.81395 2.38409 8.81806 2.6019 8.76121 2.83672L8.24969 5.01525H12.0122C12.2994 5.01525 12.5566 5.12893 12.784 5.35628C13.0113 5.58363 13.125 5.84089 13.125 6.12808V7.07036C13.125 7.13159 13.122 7.19719 13.116 7.26717C13.1101 7.33714 13.0925 7.39755 13.0633 7.44841L11.3916 11.3641C11.3177 11.5604 11.1809 11.7204 10.981 11.8441C10.7812 11.9679 10.5727 12.0298 10.3555 12.0298H4.20676ZM5.15467 5.40226V11.0965H10.3138C10.3549 11.0965 10.397 11.0853 10.44 11.0628C10.483 11.0404 10.5157 11.003 10.5382 10.9506L12.1917 7.11524V6.12808C12.1917 6.07572 12.1749 6.03272 12.1412 5.99906C12.1075 5.9654 12.0645 5.94857 12.0122 5.94857H7.05611L7.80211 2.80979L5.15467 5.40226ZM2.5712 12.0298C2.26517 12.0298 2.0032 11.9208 1.78527 11.7029C1.56734 11.485 1.45837 11.223 1.45837 10.917V6.12808C1.45837 5.82205 1.56734 5.56008 1.78527 5.34215C2.0032 5.12422 2.26517 5.01525 2.5712 5.01525H4.20676L4.22135 5.94857H2.5712C2.51884 5.94857 2.47584 5.9654 2.44218 5.99906C2.40852 6.03272 2.39169 6.07572 2.39169 6.12808V10.917C2.39169 10.9693 2.40852 11.0123 2.44218 11.046C2.47584 11.0797 2.51884 11.0965 2.5712 11.0965H4.22135V12.0298H2.5712Z" />
            </svg>
            <p className={[
              "text-base select-none font-normal",
              myEmotion === "good" || myEmotion === "initGood" ?
                isFetching ? "text-green-700 dark:text-green-400" : "text-blue-700 dark:text-blue-400" : "text-text/50 dark:text-text-dark/60"
            ].join(" ")}>
              {
                reaction ? reaction.goods + (myEmotion === "good" ? 1 : 0) : "..."
              }개
            </p>
          </button>
          <button
            className="flex flex-row gap-1 items-center justify-center cursor-pointer py-3 w-full"
            onClick={() => {
              if(myEmotion === "bad" || myEmotion === "initBad") return setMyEmotion("");
              setMyEmotion("bad");
            }}
            disabled={isReactionLoading || isFetching}
          >
            <svg className="w-5 h-5" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className={[
                "transition-all",
                myEmotion === "bad" || myEmotion === "initBad" ?
                  isFetching? "fill-green-700 dark:fill-green-400" : "fill-blue-700 dark:fill-blue-400" : "fill-text/50 dark:fill-text-dark/60"
              ].join(" ")} d="M1.98787 9.12784C1.70069 9.12784 1.44342 9.01416 1.21608 8.7868C0.988733 8.55946 0.875061 8.3022 0.875061 8.01501V7.07272C0.875061 7.0115 0.878051 6.9459 0.88403 6.87592C0.890009 6.80595 0.907582 6.74554 0.936749 6.69468L2.60848 2.77897C2.68235 2.58272 2.81919 2.42272 3.01902 2.29894C3.21885 2.17517 3.42736 2.11328 3.64457 2.11328H9.79329V9.12784L6.64779 12.2004C6.48326 12.3649 6.30527 12.4657 6.11382 12.5027C5.92237 12.5398 5.747 12.5087 5.58771 12.4096C5.42842 12.3105 5.31625 12.1606 5.25118 11.9598C5.18611 11.759 5.182 11.5412 5.23885 11.3064L5.75037 9.12784H1.98787ZM8.84539 8.74082V3.0466H3.68626C3.64513 3.0466 3.60306 3.05782 3.56006 3.08026C3.51705 3.1027 3.48432 3.14009 3.46188 3.19245L1.80837 7.02785V8.01501C1.80837 8.06736 1.82519 8.11037 1.85885 8.14403C1.89251 8.17769 1.93552 8.19452 1.98787 8.19452H6.94394L6.19795 11.3333L8.84539 8.74082ZM11.4289 2.11328C11.7349 2.11328 11.9969 2.22225 12.2148 2.44018C12.4327 2.6581 12.5417 2.92008 12.5417 3.22611V8.01501C12.5417 8.32104 12.4327 8.58301 12.2148 8.80094C11.9969 9.01887 11.7349 9.12784 11.4289 9.12784H9.79329L9.77871 8.19452H11.4289C11.4812 8.19452 11.5242 8.17769 11.5579 8.14403C11.5915 8.11037 11.6084 8.06736 11.6084 8.01501V3.22611C11.6084 3.17375 11.5915 3.13075 11.5579 3.09709C11.5242 3.06343 11.4812 3.0466 11.4289 3.0466H9.77871V2.11328H11.4289Z" />
            </svg>
            <p className={[
              "text-base select-none font-normal",
              myEmotion === "bad" || myEmotion === "initBad" ? 
                isFetching ? "text-green-700 dark:text-green-400" : "text-blue-700 dark:text-blue-400" : "text-text/50 dark:text-text-dark/60"
            ].join(" ")}>
              {
                reaction ? reaction.bads + (myEmotion === "bad" ? 1 : 0) : "..."
              }개
            </p>
          </button>
          <button
            className="flex flex-row gap-1 items-center justify-center cursor-pointer py-3 w-full"
          >
            <svg className="w-5 h-5" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="fill-text/50 dark:fill-text-dark/60" d="M2.36099 7.53817C2.23802 7.53817 2.12974 7.49137 2.03618 7.39776C1.9426 7.30415 1.89581 7.19534 1.89581 7.07133C1.89581 6.94731 1.9426 6.83856 2.03618 6.74509C2.12974 6.65161 2.23802 6.60487 2.36099 6.60487H11.6389C11.7619 6.60487 11.8702 6.65167 11.9638 6.74527C12.0573 6.83889 12.1041 6.9477 12.1041 7.07171C12.1041 7.19572 12.0573 7.30447 11.9638 7.39795C11.8702 7.49143 11.7619 7.53817 11.6389 7.53817H2.36099ZM2.36018 10.3584C2.23774 10.3584 2.12974 10.3116 2.03618 10.2179C1.9426 10.1243 1.89581 10.0155 1.89581 9.89151C1.89581 9.76749 1.9426 9.65875 2.03618 9.56527C2.12974 9.47179 2.23774 9.42505 2.36018 9.42505H8.13975C8.26219 9.42505 8.37019 9.47186 8.46377 9.56547C8.55733 9.65908 8.60412 9.76789 8.60412 9.89191C8.60412 10.0159 8.55733 10.1247 8.46377 10.2181C8.37019 10.3116 8.26219 10.3584 8.13975 10.3584H2.36018ZM2.36099 4.71799C2.23802 4.71799 2.12974 4.67118 2.03618 4.57756C1.9426 4.48396 1.89581 4.37515 1.89581 4.25113C1.89581 4.12712 1.9426 4.01838 2.03618 3.9249C2.12974 3.83141 2.23802 3.78467 2.36099 3.78467H11.6389C11.7619 3.78467 11.8702 3.83148 11.9638 3.92509C12.0573 4.01871 12.1041 4.12752 12.1041 4.25152C12.1041 4.37554 12.0573 4.48429 11.9638 4.57777C11.8702 4.67125 11.7619 4.71799 11.6389 4.71799H2.36099Z" />
            </svg>
            <p className="text-base select-none font-normal text-text/50 dark:text-text-dark/60">
              {
                isCommentFetching ? "..." : number
              }개
            </p>
          </button>
        </div>

        <div className="flex flex-row items-center justify-start gap-2 px-4">
          <p className="text-xl font-semibold select-none transition-all whitespace-nowrap text-text dark:text-text-dark">댓글</p>
          <p className="text-xl font-semibold select-none transition-all text-text dark:text-text-dark">|</p>
          <Select.Title
            label="정렬 기준 선택하기"
            optionValues={sortOptionValues}
            options={sortOptions}
            value={selected}
            onConfirm={(t) => {
              setSelected(t);
              setCurrent(1);
            }}
          />
        </div>
      
        <div className="flex flex-col gap-5 px-4">
          {
            !data || isCommentFetching ? (
              <div className="w-full h-10 flex flex-row items-center justify-center">
                <p className="text-lg font-semibold text-text/40 dark:text-text-dark/50">대나무 댓글을 찾는 중...</p>
              </div>
            ) : data.length ?
              data.map((_, index) => (
                <Comment
                  key={index}
                  isFirst={index === 0}
                  bambooComment={_}
                  bamboo={bamboo}
                  commentRefetch={refetch}
                />
              )) : (
                <div className="w-full h-10 flex flex-row items-center justify-center">
                  <p className="text-lg font-semibold text-text dark:text-text-dark">해당 정렬 기준의 댓글이 없습니다.</p>
                </div>
              )
          }
        </div>

        <Target
          current={current}
          setCurrent={setCurrent}
          maxCurrent={maxCurrent}
        />

      </div>

      <div className="pt-14" />

      <div className="absolute bottom-0 w-full px-4 z-[100] bg-background dark:bg-background-dark border-t rounded-t-3xl pt-3 pb-safe-offset-3 transition-all">
        <div className="w-full flex flex-row items-center justify-between gap-1">
          <div className="w-full flex flex-row items-center justify-start">
            <div className="scale-75 w-fit -mr-1">
              <SetName selected={selected_type} setSelected={setSelected_type} />
            </div>
            {
              isFetchingCommentPut ? (
                <p className="w-full py-3 text-text/30 dark:text-text-dark/50 select-none">댓글을 등록하는 중...</p>
              ): (
                <input
                  type="text"
                  className="w-full bg-transparent outline-none py-3 text-text dark:text-text-dark"
                  placeholder="댓글을 입력해주세요."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                />
              )
            }
            
          </div>
          <button
            className="cursor-pointer flex flex-row items-center justify-end gap-1"
            onClick={send}
            disabled={isFetchingCommentPut || !comment}
          >
            <p className="font-medium select-none text-text dark:text-text-dark">전송</p>
            <div className="-m-2 p-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="fill-text dark:fill-text-dark" d="M2.91675 14.8494V5.15074C2.91675 4.86294 3.03321 4.64382 3.26612 4.49339C3.49903 4.34294 3.74829 4.32496 4.01391 4.43943L15.5192 9.25968C15.8429 9.39846 16.0048 9.64576 16.0048 10.0016C16.0048 10.3574 15.8429 10.6037 15.5192 10.7404L4.01391 15.5607C3.74829 15.6752 3.49903 15.6572 3.26612 15.5067C3.03321 15.3563 2.91675 15.1372 2.91675 14.8494ZM4.25006 14.0417L13.8126 10.0001L4.25006 5.95839V8.88949L8.76925 10.0001L4.25006 11.1106V14.0417Z" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default BambooPageContent;