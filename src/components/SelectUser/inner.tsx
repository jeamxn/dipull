/* eslint-disable @next/next/no-img-element */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

import { UserSearchResponse } from "@/app/teacher/search/utils";
import { useAuth } from "@/hooks";
import { UserInfo } from "@/utils/db/utils";

const SelectUserInner = ({
  select,
  setSelect,
}: {
  select: UserInfo;
    setSelect: React.Dispatch<React.SetStateAction<UserInfo>>;
  }) => { 
  const { user, needLogin, onlyTeacher } = useAuth();
  const [search, setSearch] = React.useState("");

  const onSearch = () => {
    if (!user.id) return needLogin();
    if (user.type !== "teacher") return onlyTeacher();
    refetch();
  };

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["user_search", search],
    queryFn: async () => {
      const response = await axios.post<UserSearchResponse>("/teacher/search", {
        query: search
      });
      return response.data.data;
    },
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
  });

  return (
    <div className="w-full overflow-x-hidden">
      <div className="px-3 w-full border-b border-text/10 dark:border-text-dark/20 flex flex-row gap-1 justify-between items-center">
        <input
          type="text"
          placeholder="학번 또는 이름을 입력하세요"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          className="w-full py-2 text-xl font-semibold text-text dark:text-text-dark bg-transparent outline-none placeholder:text-text/20 dark:placeholder:text-text-dark/30"
        />
        <button
          className="-m-4 p-4 cursor-pointer"
          onClick={onSearch}
        >
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-text dark:fill-text-dark" d="M9.5 16.4375C7.68333 16.4375 6.14583 15.8083 4.8875 14.55C3.62917 13.2917 3 11.7542 3 9.9375C3 8.12083 3.62917 6.58333 4.8875 5.325C6.14583 4.06667 7.68333 3.4375 9.5 3.4375C11.3167 3.4375 12.8542 4.06667 14.1125 5.325C15.3708 6.58333 16 8.12083 16 9.9375C16 10.6708 15.8833 11.3625 15.65 12.0125C15.4167 12.6625 15.1 13.2375 14.7 13.7375L20.3 19.3375C20.4833 19.5208 20.575 19.7542 20.575 20.0375C20.575 20.3208 20.4833 20.5542 20.3 20.7375C20.1167 20.9208 19.8833 21.0125 19.6 21.0125C19.3167 21.0125 19.0833 20.9208 18.9 20.7375L13.3 15.1375C12.8 15.5375 12.225 15.8542 11.575 16.0875C10.925 16.3208 10.2333 16.4375 9.5 16.4375ZM9.5 14.4375C10.75 14.4375 11.8125 14 12.6875 13.125C13.5625 12.25 14 11.1875 14 9.9375C14 8.6875 13.5625 7.625 12.6875 6.75C11.8125 5.875 10.75 5.4375 9.5 5.4375C8.25 5.4375 7.1875 5.875 6.3125 6.75C5.4375 7.625 5 8.6875 5 9.9375C5 11.1875 5.4375 12.25 6.3125 13.125C7.1875 14 8.25 14.4375 9.5 14.4375Z" />
          </svg>
        </button>
      </div>
      {
        isFetching ? (
          <div className="p-4 flex flex-row gap-1 items-center justify-center">
            <p className="text-text/30 dark:text-text-dark/40">사용자 검색 중...</p>
          </div>
        ) : data?.length ? data.map((user, index) => {
          return (
            <button
              key={index}
              className={[
                "px-3 py-4 w-full border-b border-text/10 dark:border-text-dark/20 flex flex-row gap-1 justify-between items-center",
                select.id === user.id ? "bg-text/10 dark:bg-text-dark/20" : "",
              ].join(" ")}
              onClick={() => {
                setSelect(user);
              }}
            >
              <div className="flex flex-row items-center justify-start gap-2">
                <img src={user.profile_image} alt="avatar" className="w-8 h-8 rounded-full border border-text/10 dark:border-text-dark/20" />
                <p className="text-lg font-semibold text-text dark:text-text-dark">{user.type === "student" ? user.number : ""} {user.name} ({user.gender === "male" ? "남" : "여"})</p>
              </div>
              <p className="text-lg font-semibold text-text/40 dark:text-text-dark/50">
                {user.type === "student" ? "학생" : "선생님"}
              </p>
            </button>
          );
        }) : (
          <div className="p-4 flex flex-row gap-1 items-center justify-center">
            <p className="text-text dark:text-text-dark">검색 결과가 없습니다.</p>
          </div>
        )
      }
    </div>
  );
};

export default SelectUserInner;