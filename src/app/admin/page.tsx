"use client";

import { AxiosResponse } from "axios";
import * as jose from "jose";
import React from "react";

import { ByGradeClassObj, BySeatsObj, StayGetResponse } from "@/app/api/stay/utils";
import { TokenInfo, defaultUserData } from "@/app/auth/type";
import Studyroom from "@/app/stay/studyroom";
import Insider from "@/provider/insider";
import instance from "@/utils/instance";

import { UserInfo, UserInfoResponse } from "../api/admin/userinfo/utils";

const Admin = () => {
  const [loading, setLoading] = React.useState(false);
  const [selectedSeat, setSelectedSeat] = React.useState("@0");
  const [mySelect, setMySelect] = React.useState<StayGetResponse["data"]["mySelect"]>("");
  const [bySeatsObj, setBySeatsObj] = React.useState<BySeatsObj>({});
  const [byGradeClassObj, setByGradeClassObj] = React.useState<ByGradeClassObj>({});
  const [studyroom, setStudyroom] = React.useState<StayGetResponse["data"]["studyroom"]>([]);
  const [userInfo, setUserInfo] = React.useState(defaultUserData);

  const getStayData = async () => {
    setLoading(true);
    try{
      const res: AxiosResponse<StayGetResponse> = await instance.get("/api/stay");
      setBySeatsObj(res.data.data.bySeatsObj);
      setByGradeClassObj(res.data.data.byGradeClassObj);
      setMySelect(res.data.data.mySelect);
      setStudyroom(res.data.data.studyroom);
    }
    catch(e: any){
      alert(e.response.data.message);
    }
    setSelectedSeat("@0");
    setLoading(false);
  };
  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")!;
    const decrypt = jose.decodeJwt(accessToken) as TokenInfo;
    setUserInfo(decrypt.data);
    getStayData();
  }, []);

  const [userList, setUserList] = React.useState<UserInfo[]>([]);
  const [search, setSearch] = React.useState("");

  const stayPut = async (owner: string, seat: string) => {
    setLoading(true);
    try {
      const res: AxiosResponse = await instance.put("/api/admin/stay", { seat, owner });
      alert(res.data.message);
      await getStayData();
    }
    catch(e: any){
      alert(e.response.data.message);
    }
    setLoading(false);
  };
  const stayDelete = async (owner: string) => {
    setLoading(true);
    try {
      const res: AxiosResponse = await instance.delete(`/api/admin/stay/${owner}`);
      alert(res.data.message);
      await getStayData();
    }
    catch(e: any){
      alert(e.response.data.message);
    }
    setLoading(false);
  };

  const searchUser = async () => {
    setLoading(true);
    try{
      const res: AxiosResponse<UserInfoResponse> = await instance.post(
        "/api/admin/userinfo", {
          name: search
        }
      );
      setUserList(res.data.data);
    }
    catch(e: any){
      alert(e.response.data.message);
    }
    setLoading(false);
  };
  React.useEffect(() => {
    if(!search.length) return setUserList([]);
    searchUser();
  }, [search]);

  const type = studyroom.find(e => 
    e.seat[selectedSeat[0]]?.includes(Number(selectedSeat.slice(1, selectedSeat.length)))
  );

  return (
    <Insider className="flex flex-col gap-5">
      <article className="flex flex-col gap-3">
        <h1 className="text-xl font-semibold">잔류 수정하기</h1>
        <Studyroom
          loading={loading}
          selectedSeat={selectedSeat}
          setSelectedSeat={setSelectedSeat}
          mySelect={mySelect}
          bySeatsObj={bySeatsObj}
          studyroom={studyroom}
          userInfo={userInfo}
          allowSelect
        />
      </article>
      <article className="flex flex-col gap-3">
        <article className={[
          "flex flex-col gap-4 bg-white rounded border border-text/10 p-5",
          loading ? "loading_background" : "",
        ].join(" ")}>
          {
            selectedSeat === "@0" ? (
              <h1 className="text-xl font-semibold">선택된 좌석: 교실 잔류</h1>
            ) : (
              <h1 className="text-xl font-semibold">선택된 좌석: {selectedSeat} / {type?.grade.join(", ")}학년 / {type?.gender === "male" ? "남학생": type?.gender === "female" ? "여학생" : "선택 불가"}</h1>
            )
          }
        </article>
        <article className={[
          "flex flex-col gap-4 bg-white rounded border border-text/10 p-5",
          loading ? "loading_background" : "",
        ].join(" ")}>
          <section className="flex flex-row justify-center items-center w-full gap-4">
            <h2 className="text-xl font-semibold whitespace-nowrap">학생 검색</h2>
            <input 
              type="text" 
              placeholder="학생 이름을 입력해주세요." 
              className="bg-transparent rounded border border-text/10 px-4 py-2 text-base w-full"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </section>
          <table className="w-full">
            <tbody className="w-full border-y border-text/10">
              <tr className="w-full">
                <th className="text-center px-4 whitespace-nowrap py-2 font-semibold w-full" colSpan={2}>검색 결과</th>
                <td className="text-center px-4">신청</td>
                <td className="text-center px-4">취소</td>
              </tr>
              {
                userList.length ? userList.map((v, i) => {
                  const put = () => stayPut(v.id, selectedSeat);
                  const del = () => stayDelete(v.id);
                  return (
                    <tr className="w-full border-y border-text/10" key={i} onClick={() => {}}>
                      <td className="text-center px-4 whitespace-nowrap py-2">{i + 1}</td>
                      <td className="w-full text-left px-4 whitespace-nowrap border-x border-text/10">
                        <p className="text-left whitespace-nowrap">[{v.gender === "male" ? "남" : "여"}학생] {v.number} {v.name}</p>
                      </td>
                      <td className="text-center px-4 border-r border-text/10">
                        <div className="flex justify-center items-center h-full cursor-pointer select-none" onClick={put}>
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.58075 12.1462L6.25765 9.82308C6.1192 9.68461 5.94517 9.61378 5.73555 9.61058C5.52593 9.60736 5.34869 9.67819 5.20382 9.82308C5.05896 9.96794 4.98653 10.1436 4.98653 10.35C4.98653 10.5564 5.05896 10.732 5.20382 10.8769L7.94805 13.6211C8.12882 13.8019 8.33972 13.8923 8.58075 13.8923C8.82177 13.8923 9.03266 13.8019 9.21343 13.6211L14.7769 8.05765C14.9153 7.9192 14.9862 7.74517 14.9894 7.53555C14.9926 7.32593 14.9218 7.14869 14.7769 7.00383C14.632 6.85896 14.4564 6.78653 14.25 6.78653C14.0436 6.78653 13.8679 6.85896 13.7231 7.00383L8.58075 12.1462ZM10.0016 19.5C8.68772 19.5 7.45268 19.2506 6.29655 18.752C5.1404 18.2533 4.13472 17.5765 3.2795 16.7217C2.42427 15.8669 1.74721 14.8616 1.24833 13.706C0.749442 12.5504 0.5 11.3156 0.5 10.0017C0.5 8.68772 0.749334 7.45268 1.248 6.29655C1.74667 5.1404 2.42342 4.13472 3.27825 3.2795C4.1331 2.42427 5.13834 1.74721 6.29398 1.24833C7.44959 0.749443 8.68437 0.5 9.9983 0.5C11.3122 0.5 12.5473 0.749334 13.7034 1.248C14.8596 1.74667 15.8652 2.42342 16.7205 3.27825C17.5757 4.1331 18.2527 5.13834 18.7516 6.29398C19.2505 7.44959 19.5 8.68437 19.5 9.9983C19.5 11.3122 19.2506 12.5473 18.752 13.7034C18.2533 14.8596 17.5765 15.8652 16.7217 16.7205C15.8669 17.5757 14.8616 18.2527 13.706 18.7516C12.5504 19.2505 11.3156 19.5 10.0016 19.5ZM9.99998 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 9.99998C18 7.76664 17.225 5.87498 15.675 4.32498C14.125 2.77498 12.2333 1.99998 9.99998 1.99998C7.76664 1.99998 5.87498 2.77498 4.32498 4.32498C2.77498 5.87498 1.99998 7.76664 1.99998 9.99998C1.99998 12.2333 2.77498 14.125 4.32498 15.675C5.87498 17.225 7.76664 18 9.99998 18Z" fill="rgb(var(--color-text) / .35)"/>
                          </svg>
                        </div>
                      </td>
                      <td className="text-center px-4">
                        <div className="flex justify-center items-center h-full cursor-pointer select-none" onClick={del}>
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.0644 10.9493L13.1375 14.0224C13.276 14.1609 13.45 14.2317 13.6596 14.2349C13.8692 14.2381 14.0465 14.1673 14.1913 14.0224C14.3362 13.8775 14.4087 13.7019 14.4087 13.4955C14.4087 13.2891 14.3362 13.1135 14.1913 12.9686L11.1183 9.89548L14.1913 6.82238C14.3298 6.68393 14.4006 6.5099 14.4038 6.30028C14.407 6.09068 14.3362 5.91345 14.1913 5.76858C14.0465 5.6237 13.8708 5.55126 13.6644 5.55126C13.458 5.55126 13.2824 5.6237 13.1375 5.76858L10.0644 8.84166L6.99133 5.76858C6.85288 5.63012 6.67884 5.55928 6.46923 5.55608C6.25963 5.55287 6.0824 5.6237 5.93753 5.76858C5.79265 5.91345 5.7202 6.08908 5.7202 6.29548C5.7202 6.50188 5.79265 6.67752 5.93753 6.82238L9.0106 9.89548L5.93753 12.9686C5.79906 13.107 5.72823 13.2811 5.72503 13.4907C5.72181 13.7003 5.79265 13.8775 5.93753 14.0224C6.0824 14.1673 6.25803 14.2397 6.46443 14.2397C6.67083 14.2397 6.84646 14.1673 6.99133 14.0224L10.0644 10.9493ZM10.0661 19.3955C8.75217 19.3955 7.51714 19.1461 6.361 18.6475C5.20485 18.1488 4.19917 17.472 3.34395 16.6172C2.48872 15.7624 1.81166 14.7571 1.31278 13.6015C0.813895 12.4459 0.564453 11.2111 0.564453 9.89716C0.564453 8.58323 0.813787 7.34819 1.31245 6.19206C1.81112 5.03591 2.48787 4.03023 3.3427 3.17501C4.19755 2.31978 5.2028 1.64272 6.35843 1.14383C7.51405 0.644951 8.74882 0.395508 10.0628 0.395508C11.3767 0.395508 12.6117 0.644842 13.7679 1.14351C14.924 1.64218 15.9297 2.31892 16.7849 3.17376C17.6401 4.02861 18.3172 5.03385 18.8161 6.18948C19.315 7.3451 19.5644 8.57988 19.5644 9.89381C19.5644 11.2077 19.3151 12.4428 18.8164 13.5989C18.3177 14.7551 17.641 15.7607 16.7862 16.616C15.9313 17.4712 14.9261 18.1483 13.7704 18.6471C12.6148 19.146 11.38 19.3955 10.0661 19.3955ZM10.0644 17.8955C12.2978 17.8955 14.1894 17.1205 15.7394 15.5705C17.2894 14.0205 18.0644 12.1288 18.0644 9.89548C18.0644 7.66215 17.2894 5.77048 15.7394 4.22048C14.1894 2.67048 12.2978 1.89548 10.0644 1.89548C7.83109 1.89548 5.93943 2.67048 4.38943 4.22048C2.83943 5.77048 2.06443 7.66215 2.06443 9.89548C2.06443 12.1288 2.83943 14.0205 4.38943 15.5705C5.93943 17.1205 7.83109 17.8955 10.0644 17.8955Z" fill="rgb(var(--color-text) / .35)"/>
                          </svg>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr className="w-full border-y border-text/10">
                    <td className="text-center px-4 whitespace-nowrap py-2 text-text/50" colSpan={5}>검색 결과가 없습니다.</td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </article>

      </article>
      <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> 
    </Insider>
  );
};

export default Admin;