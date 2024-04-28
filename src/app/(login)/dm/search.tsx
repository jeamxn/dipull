/* eslint-disable @next/next/no-img-element */
import { AxiosResponse } from "axios";
import Link from "next/link";
import React from "react";

import { UserInfo, UserInfoResponse, defaultUserData } from "@/app/api/teacher/userinfo/utils";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

const Search = ({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedUser, setSelectedUser] = React.useState<UserInfo>(defaultUserData);
  const [userList, setUserList] = React.useState<UserInfo[]>([]);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    console.log(selectedUser);
  }, [selectedUser]);

  const searchUser = async () => {
    setLoading(true);
    try{
      const res: AxiosResponse<UserInfoResponse> = await instance.post(
        "/api/teacher/userinfo", {
          name: search
        }
      );
      setUserList(res.data.data);
    }
    catch(e: any){
      alert.error(e.response.data.message);
    }
    setLoading(false);
  };
  React.useEffect(() => {
    setSelectedUser(defaultUserData);
    if(!search.length) return setUserList([]);
    searchUser();
  }, [search]);

  return (
    <article className={[
      "flex flex-col gap-4 overflow-auto",
      loading ? "loading_background" : "",
    ].join(" ")}>
      <section className="flex flex-row justify-center items-center w-full gap-4">
        <input 
          type="text" 
          placeholder="대화 상대 검색하기" 
          className="bg-transparent rounded border border-text/10 px-4 py-2 text-base w-full"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </section>
      {
        userList.length ? <table className="w-full overflow-auto">
          <tbody className="w-full border-y border-text/10 overflow-auto">
            {
              userList.map((v, i) => {
                const click = () => {
                  setSelectedUser(v);
                };
                return (
                  <tr className="w-full" key={i} onClick={() => click()}>
                    <td className="w-full text-left p-4 whitespace-nowrap cursor-pointer hover:bg-text/5">
                      <Link href={`/dm/${v.id}`} className="flex flex-row items-center gap-3">
                        <img src={v.profile_image} alt="profile" className="w-14 h-14 rounded-full border border-text/10"/>
                        <div className="flex flex-col items-start justify-center">
                          <p className="text-left whitespace-nowrap font-medium">{v.name}</p>
                          <p className="text-left whitespace-nowrap text-sm text-text/40"> 
                            {
                              v.type === "student" ? `${Math.floor(v.number / 1000)}학년 ${Math.floor(v.number / 100) % 10}반 ${v.number % 100}번` : "교사"
                            } · {v.gender === "male" ? "남" : "여"}자
                          </p>
                        </div>
                      </Link>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table> : null
      }
    </article>
  );
};

export default Search;