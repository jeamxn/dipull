/* eslint-disable @next/next/no-img-element */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import React from "react";

import { useAlertModalDispatch } from "@/components/AlertModal";
import { MoreButton, useMoreModalDispatch } from "@/components/MoreModal";

import { BambooCommentList } from "./comment/[sort]/[number]/utils";
import { BambooCommentDeleteResponse } from "./comment/details/[comment]/delete/utils";
import { BambooCommentReact, BambooCommentReactResponse } from "./comment/details/[comment]/reaction/utils";
import { BambooRead } from "./utils";

const Comment = ({
  isFirst,
  bambooComment,
  bamboo,
  commentRefetch,
}: {
    isFirst: boolean;
    bambooComment: BambooCommentList;
    bamboo: BambooRead;
    commentRefetch: () => Promise<any>;
  }) => {
  const [emotion, setEmotion] = React.useState<"good" | "bad" | "" | "initGood" | "initBad" | "init">("init");
  const [onTimeClick, setOnTimeClick] = React.useState(false);
  const moreModalDispatch = useMoreModalDispatch();
  const alertModalDispatch = useAlertModalDispatch();

  const { refetch: deleteBambooComment, isError } = useQuery({
    queryKey: ["bamboo_comment_delete", bamboo.id, bambooComment.id],
    queryFn: async () => {
      const response = await axios.delete<BambooCommentDeleteResponse>(`/bamboo/student/${bamboo.id}/comment/details/${bambooComment.id}/delete`);
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
  });

  React.useEffect(() => {
    if (bambooComment.myGood) setEmotion("initGood");
    else if (bambooComment.myBad) setEmotion("initBad");
    else setEmotion("init");
  }, [bambooComment]);

  const { isFetching, data } = useQuery({
    queryKey: ["bamboo_comment_reaction", bamboo.id, emotion, bambooComment.goods, bambooComment.bads, bambooComment.myBad, bambooComment.myGood],
    queryFn: async () => {
      const response = await axios.post<BambooCommentReactResponse>(`/bamboo/student/${bamboo.id}/comment/details/${bambooComment.id}/reaction`, {
        type: emotion,
      });
      return response.data.data;
    },
    refetchOnWindowFocus: false,
    enabled: emotion === "initGood" || emotion === "initBad" || emotion === "init" ? false : true,
    retry: false,
    initialData: {
      goods: bambooComment.goods,
      bads: bambooComment.bads,
      myGood: bambooComment.myGood,
      myBad: bambooComment.myBad,
    }
  });

  const myMoreButtons: MoreButton[] = bambooComment.isWriter ? [
    {
      text: "댓글 삭제하기",
      type: "red",
      onClick: async () => {
        await deleteBambooComment();
        if (!isError) {
          alertModalDispatch({
            type: "show",
            data: {
              title: "댓글이 삭제되었습니다.",
              description: "댓글이 성공적으로 삭제되었습니다.",
              onAlert: () => { 
                commentRefetch();
              },
              onCancle: () => {
                commentRefetch();
              },
            }
          });
        }
      },
    },
  ] : [];

  const moreButtons: MoreButton[] = [
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

  return (
    <>
      {
        isFirst ? null : (
          <div className="w-full border-b border-text/10 dark:border-text-dark/20" />
        )
      }
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-row items-start justify-start gap-3">
          <img
            className="w-10 h-10 rounded-full border border-text/10 dark:border-text-dark/20"
            src={bambooComment.profile_image}
            alt="profile"
          />
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center justify-start gap-0.5">
              <p className="font-semibold text-sm text-text dark:text-text-dark">{bambooComment.user}</p>
              <p className="font-medium text-sm text-text/30 dark:text-text-dark/40">·</p>
              <button onClick={() => setOnTimeClick(p => !p)} className="flex flex-row items-center justify-start">
                {
                  onTimeClick ? (
                    <p className="font-normal text-sm text-text/30 dark:text-text-dark/40">{bambooComment.timestamp}</p>
                  ): (
                    <p className="font-normal text-sm text-text/30 dark:text-text-dark/40">{moment(bambooComment.timestamp).fromNow()}</p>
                  )
                }
              </button>
            </div>
            <div className="font-normal text-text dark:text-text-dark">
              {bambooComment.text}
            </div>
            <div className="flex flex-row items-center justify-start gap-1">
              <button
                className="flex flex-row items-center justify-start h-fit -m-2 p-2 w-fit gap-0.5"
                onClick={() => {
                  if (emotion === "good" || emotion === "initGood") return setEmotion("");
                  setEmotion("good");
                }}
              >
                <svg className="w-4 h-4" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path className={[
                    "transition-all",
                    emotion === "good" || emotion === "initGood" ?
                      isFetching ? "fill-green-700 dark:fill-green-400" : "fill-blue-700 dark:fill-blue-400" : "fill-text/50 dark:fill-text-dark/60"
                  ].join(" ")} d="M4.20676 12.0298V5.01525L7.35227 1.94268C7.5168 1.77815 7.69479 1.67737 7.88624 1.64035C8.07769 1.60333 8.25306 1.63436 8.41235 1.73346C8.57164 1.83255 8.68381 1.98249 8.74887 2.18329C8.81395 2.38409 8.81806 2.6019 8.76121 2.83672L8.24969 5.01525H12.0122C12.2994 5.01525 12.5566 5.12893 12.784 5.35628C13.0113 5.58363 13.125 5.84089 13.125 6.12808V7.07036C13.125 7.13159 13.122 7.19719 13.116 7.26717C13.1101 7.33714 13.0925 7.39755 13.0633 7.44841L11.3916 11.3641C11.3177 11.5604 11.1809 11.7204 10.981 11.8441C10.7812 11.9679 10.5727 12.0298 10.3555 12.0298H4.20676ZM5.15467 5.40226V11.0965H10.3138C10.3549 11.0965 10.397 11.0853 10.44 11.0628C10.483 11.0404 10.5157 11.003 10.5382 10.9506L12.1917 7.11524V6.12808C12.1917 6.07572 12.1749 6.03272 12.1412 5.99906C12.1075 5.9654 12.0645 5.94857 12.0122 5.94857H7.05611L7.80211 2.80979L5.15467 5.40226ZM2.5712 12.0298C2.26517 12.0298 2.0032 11.9208 1.78527 11.7029C1.56734 11.485 1.45837 11.223 1.45837 10.917V6.12808C1.45837 5.82205 1.56734 5.56008 1.78527 5.34215C2.0032 5.12422 2.26517 5.01525 2.5712 5.01525H4.20676L4.22135 5.94857H2.5712C2.51884 5.94857 2.47584 5.9654 2.44218 5.99906C2.40852 6.03272 2.39169 6.07572 2.39169 6.12808V10.917C2.39169 10.9693 2.40852 11.0123 2.44218 11.046C2.47584 11.0797 2.51884 11.0965 2.5712 11.0965H4.22135V12.0298H2.5712Z" />
                </svg>
                <p className={[
                  "font-medium text-sm select-none cursor-pointer duration-150",
                  emotion === "good" || emotion === "initGood" ?
                    isFetching ? "text-green-700 dark:text-green-400" : "text-blue-700 dark:text-blue-400" : "text-text/50 dark:text-text-dark/60"
                ].join(" ")}>
                  {(data || bambooComment).goods + (!data && emotion === "good" ? 1 : 0)}개
                </p>
              </button>
              <p className={[
                "font-medium text-sm select-none cursor-pointer duration-150 text-text/50 dark:text-text-dark/60"
              ].join(" ")}>·</p>
              <button
                className="flex flex-row items-center justify-start h-fit -m-2 p-2 w-fit gap-0.5"
                onClick={() => {
                  if (emotion === "bad" || emotion === "initBad") return setEmotion("");
                  setEmotion("bad");
                }}
              >
                <svg className="w-4 h-4" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path className={[
                    "transition-all",
                    emotion === "bad" || emotion === "initBad" ?
                      isFetching ? "fill-green-700 dark:fill-green-400" : "fill-blue-700 dark:fill-blue-400" : "fill-text/50 dark:fill-text-dark/60"
                  ].join(" ")} d="M1.98787 9.12784C1.70069 9.12784 1.44342 9.01416 1.21608 8.7868C0.988733 8.55946 0.875061 8.3022 0.875061 8.01501V7.07272C0.875061 7.0115 0.878051 6.9459 0.88403 6.87592C0.890009 6.80595 0.907582 6.74554 0.936749 6.69468L2.60848 2.77897C2.68235 2.58272 2.81919 2.42272 3.01902 2.29894C3.21885 2.17517 3.42736 2.11328 3.64457 2.11328H9.79329V9.12784L6.64779 12.2004C6.48326 12.3649 6.30527 12.4657 6.11382 12.5027C5.92237 12.5398 5.747 12.5087 5.58771 12.4096C5.42842 12.3105 5.31625 12.1606 5.25118 11.9598C5.18611 11.759 5.182 11.5412 5.23885 11.3064L5.75037 9.12784H1.98787ZM8.84539 8.74082V3.0466H3.68626C3.64513 3.0466 3.60306 3.05782 3.56006 3.08026C3.51705 3.1027 3.48432 3.14009 3.46188 3.19245L1.80837 7.02785V8.01501C1.80837 8.06736 1.82519 8.11037 1.85885 8.14403C1.89251 8.17769 1.93552 8.19452 1.98787 8.19452H6.94394L6.19795 11.3333L8.84539 8.74082ZM11.4289 2.11328C11.7349 2.11328 11.9969 2.22225 12.2148 2.44018C12.4327 2.6581 12.5417 2.92008 12.5417 3.22611V8.01501C12.5417 8.32104 12.4327 8.58301 12.2148 8.80094C11.9969 9.01887 11.7349 9.12784 11.4289 9.12784H9.79329L9.77871 8.19452H11.4289C11.4812 8.19452 11.5242 8.17769 11.5579 8.14403C11.5915 8.11037 11.6084 8.06736 11.6084 8.01501V3.22611C11.6084 3.17375 11.5915 3.13075 11.5579 3.09709C11.5242 3.06343 11.4812 3.0466 11.4289 3.0466H9.77871V2.11328H11.4289Z" />
                </svg>
                <p className={[
                  "font-medium text-sm select-none cursor-pointer duration-150",
                  emotion === "bad" || emotion === "initBad" ?
                    isFetching ? "text-green-700 dark:text-green-400" : "text-blue-700 dark:text-blue-400" : "text-text/50 dark:text-text-dark/60"
                ].join(" ")}>
                  {(data || bambooComment).bads + (!data && emotion === "bad" ? 1 : 0)}개
                </p>
              </button>
            </div>
          </div>
        </div>
        <div
          className="-m-2 p-2 cursor-pointer"
          onClick={() => {
            moreModalDispatch({
              type: "show",
              data: {
                buttons: moreButtons
              },
            });
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-text dark:fill-text-dark" d="M9.99564 15.3911C9.69652 15.3911 9.44192 15.2846 9.23185 15.0716C9.02178 14.8586 8.91675 14.6025 8.91675 14.3034C8.91675 14.0042 9.02326 13.7496 9.23627 13.5396C9.44928 13.3295 9.70535 13.2245 10.0045 13.2245C10.3036 13.2245 10.5582 13.331 10.7683 13.544C10.9783 13.757 11.0834 14.0131 11.0834 14.3122C11.0834 14.6113 10.9769 14.8659 10.7639 15.076C10.5508 15.2861 10.2948 15.3911 9.99564 15.3911ZM9.99564 11.0834C9.69652 11.0834 9.44192 10.9769 9.23185 10.7639C9.02178 10.5509 8.91675 10.2948 8.91675 9.99569C8.91675 9.69657 9.02326 9.44197 9.23627 9.2319C9.44928 9.02183 9.70535 8.9168 10.0045 8.9168C10.3036 8.9168 10.5582 9.0233 10.7683 9.23632C10.9783 9.44933 11.0834 9.7054 11.0834 10.0045C11.0834 10.3037 10.9769 10.5582 10.7639 10.7683C10.5508 10.9784 10.2948 11.0834 9.99564 11.0834ZM9.99564 6.77574C9.69652 6.77574 9.44192 6.66923 9.23185 6.45621C9.02178 6.2432 8.91675 5.98713 8.91675 5.68801C8.91675 5.38888 9.02326 5.13428 9.23627 4.92421C9.44928 4.71416 9.70535 4.60913 10.0045 4.60913C10.3036 4.60913 10.5582 4.71564 10.7683 4.92865C10.9783 5.14167 11.0834 5.39774 11.0834 5.69686C11.0834 5.99599 10.9769 6.25058 10.7639 6.46063C10.5508 6.6707 10.2948 6.77574 9.99564 6.77574Z" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default Comment;