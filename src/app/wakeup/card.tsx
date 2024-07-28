/* eslint-disable @next/next/no-img-element */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

import { useAuth } from "@/hooks";

import { WakeupPutResponse } from "./grant/apply/utils";
import { WakeupListData } from "./list/get/utlis";
import { MyWakeupResponseString } from "./my/grant/list/utils";

const imglist = [
  "maxresdefault",
  "sddefault",
  "hqdefault",
  "0",
  "mqdefault",
  "default",
  "3",
  "2",
  "1"
];

const Card = ({
  _id,
  id,
  vote,
  title,
  rank,
  type = "add",
  parentRefetch,
  myList,
  isMyList,
  disabled = false,
}: {
  _id?: string;
  id: string;
  vote?: number;
  title: string;
  rank?: number;
  type?: "add" | "remove";
    parentRefetch?: () => any;
    myList?: MyWakeupResponseString["data"];
    isMyList?: boolean;
    disabled?: boolean;
  }) => {
  const { user, needLogin } = useAuth();
  const [click, setClick] = React.useState<"" | "loading" | "success">("");

  const isInclude = React.useMemo(() => {
    if(!myList) return false;
    return myList?.findIndex((item) => item.video === id) !== -1;
  }, [myList, id]);

  const onClick = () => {
    if (!user.id) {
      needLogin();
      return;
    }
    setClick("loading");
    refetch();
  };

  const { refetch } = useQuery({
    queryKey: ["wakeup_put", id, type],
    queryFn: async () => {
      const response = await axios<WakeupPutResponse>({
        method: type === "add" ? "PUT" : "DELETE",
        url: "/wakeup/grant/apply",
        data: {
          id, _id,
        },
      });
      setClick("");
      parentRefetch && parentRefetch();
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
    retryOnMount: false,
  });

  return (
    <div
      className="px-4 w-full relative cursor-default overflow-x-hidden"
      onClick={disabled ? () => { } : onClick}
    >
      <img
        className="w-full h-auto aspect-video object-cover select-none rounded-2xl"
        alt="기상송 유튜브 썸네일"
        src={`https://i.ytimg.com/vi/${id}/${imglist[1]}.jpg`}
      />
      <div className="absolute top-0 left-0 px-4 w-full h-full">
        <div className={[
          "bg-text/50 p-4 w-full h-full rounded-2xl flex flex-col justify-end items-start gap-1 max-sm:gap-0 max-md:gap-1 max-lg:gap-0",
          click === "loading" ? "border-8 max-lg:border-4 max-md:border-8 max-sm:border-4 border-yellow-400" : "",
          isInclude && !isMyList ? "border-8 max-lg:border-4 max-md:border-8 max-sm:border-4 border-green-400" : "",
        ].join(" ")}>
          {
            rank || vote ? (
              <div className="flex flex-row gap-1 justify-start">
                <div className="-m-4 p-4 flex flex-col items-center justify-center">
                  <svg className="aspect-square w-8 max-sm:w-5 max-md:w-8 max-lg:w-5" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className="fill-white" d="M5.86664 22.229C5.31664 22.229 4.8458 22.0331 4.45414 21.6415C4.06247 21.2498 3.86664 20.779 3.86664 20.229V16.429C3.86664 16.1956 3.9083 15.9623 3.99164 15.729C4.07497 15.4956 4.19997 15.2873 4.36664 15.104L5.91664 13.354C6.09997 13.1373 6.33747 13.0248 6.62914 13.0165C6.9208 13.0081 7.16664 13.104 7.36664 13.304C7.54997 13.4873 7.64997 13.7123 7.66664 13.979C7.6833 14.2456 7.59997 14.479 7.41664 14.679L6.04164 16.229H19.6916L18.3666 14.729C18.1833 14.529 18.1 14.2956 18.1166 14.029C18.1333 13.7623 18.2333 13.5373 18.4166 13.354C18.6166 13.154 18.8625 13.0581 19.1541 13.0665C19.4458 13.0748 19.6833 13.1873 19.8666 13.404L21.3666 15.104C21.5333 15.2873 21.6583 15.4956 21.7416 15.729C21.825 15.9623 21.8666 16.1956 21.8666 16.429V20.229C21.8666 20.779 21.6708 21.2498 21.2791 21.6415C20.8875 22.0331 20.4166 22.229 19.8666 22.229H5.86664ZM5.86664 20.229H19.8666V18.229H5.86664V20.229ZM11.4916 14.604L7.96664 11.079C7.5833 10.6956 7.3958 10.2248 7.40414 9.66647C7.41247 9.10814 7.6083 8.6373 7.99164 8.25397L12.8916 3.35397C13.275 2.97064 13.75 2.77064 14.3166 2.75397C14.8833 2.7373 15.3583 2.92064 15.7416 3.30397L19.2666 6.82897C19.65 7.2123 19.85 7.67897 19.8666 8.22897C19.8833 8.77897 19.7 9.24564 19.3166 9.62897L14.3166 14.629C13.9333 15.0123 13.4625 15.1998 12.9041 15.1915C12.3458 15.1831 11.875 14.9873 11.4916 14.604ZM17.8666 8.25397L14.3416 4.72897L9.39164 9.67897L12.9166 13.204L17.8666 8.25397Z" />
                  </svg>
                </div>
                <div className="flex flex-row gap-0 justify-start">
                  {
                    rank ? (
                      <p className="select-none text-white text-3xl max-sm:text-xl max-md:text-3xl max-lg:text-xl font-bold drop-shadow-2xl">{rank.toLocaleString()}위</p>
                    ) : null
                  }
                  {
                    rank && vote ? (
                      <p className="select-none text-white text-3xl max-sm:text-xl max-md:text-3xl max-lg:text-xl font-bold drop-shadow-2xl">:&nbsp;</p>
                    ) : null
                  }
                  {
                    vote ? (
                      <p className="select-none text-white text-3xl max-sm:text-xl max-md:text-3xl max-lg:text-xl font-bold drop-shadow-2xl">{vote.toLocaleString()}표</p>
                    ) : null
                  }
                </div>
              </div>
            ) : null
          }
          <button
            className="overflow-x-hidden w-full"
            onClick={(event) => {
              event.stopPropagation();
              window.open(`https://youtu.be/${id}`, "_blank");
            }}
          >
            <p className="select-none text-white text-xl max-sm:text-base max-md:text-xl max-lg:text-base font-bold drop-shadow-2xl text-left overflow-x-hidden">{title}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;