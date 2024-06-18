"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Swal from "sweetalert2";

import { Hosil } from "@/app/api/hosil/server";
import { UserInfo } from "@/app/api/teacher/userinfo/utils";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

const HosilContent = ({
  userInfo,
  init,
}: {
  userInfo: UserInfo;
  init: Hosil;
}) => { 
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [hosilData, setHosilData] = React.useState<Hosil>(init);
  const mySelectedHosil =
    Object.keys(hosilData).map((hosil) => {
      const o = hosilData[Number(hosil)];
      const map = o.map((user, i) => {
        return user?.id;
      });
      const index = map.indexOf(userInfo.id);
      if (index !== -1) {
        return {
          hosil: Number(hosil),
          number: index + 1,
        };
      }
      return null;
    }).filter((i) => i)[0] || { hosil: -1, number: -1 };
  
  React.useEffect(() => {
    console.log(mySelectedHosil);
  }, [mySelectedHosil]);

  const getHosilData = async () => {
    setLoading(true);
    try {
      const { data } = await instance.get("/api/hosil");
      setHosilData(data.data);
      router.refresh();
    } catch (e: any) {
      alert.warn(e.response.data.message);
    }
    setLoading(false);
  };

  const selectHosilSwal = async (hosil: number, number: number) => {
    Swal.fire({
      title: "호실 선택",
      text: `${hosil}호 ${number + 1}번 호실을 선택하시겠습니까?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "선택",
      cancelButtonText: "취소",
      background: "rgb(var(--color-white) / 1)",
      color: "rgb(var(--color-text) / 1)",
    }).then((result) => {
      if (result.isConfirmed) {
        selectHosil(hosil, number);
      }
    });
  };
  const selectHosil = async (hosil: number, number: number) => {
    setLoading(true);
    try {
      const { data } = await instance.put("/api/hosil", {
        hosil,
        hnumber: number,
      });
      await getHosilData();
      router.refresh();
    } catch (e: any) {
      alert.warn(e.response.data.message);
    }
    setLoading(false);
  };

  const cancleSelectSwal = async () => { 
    Swal.fire({
      title: "호실 선택 취소",
      text: "호실 선택을 취소하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "선택 취소",
      cancelButtonText: "하지 않기",
      background: "rgb(var(--color-white) / 1)",
      color: "rgb(var(--color-text) / 1)",
    }).then((result) => {
      if (result.isConfirmed) {
        cancleSelect();
      }
    });
  };

  const cancleSelect = async () => {
    setLoading(true);
    try {
      const { data } = await instance.delete("/api/hosil");
      await getHosilData();
      router.refresh();
    } catch (e: any) {
      alert.warn(e.response.data.message);
    }
    setLoading(false);
  };

  return (
    <>
      <article className="flex flex-col gap-3">
        <h1 className="text-xl font-semibold">호실 선택하기</h1>
        {
          mySelectedHosil.hosil === -1 ? (
            <p className="text-base text-primary">선택한 호실이 없습니다. 신청 가능한 호실을 선택해주세요.</p>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="text-base text-primary">내가 선택한 호실: {mySelectedHosil.hosil}호 {mySelectedHosil.number}번</p>
              <button
                className="underline text-primary text-base cursor-pointer w-full text-start"
                onClick={cancleSelectSwal}
              >
                호실 선택 취소
              </button>
            </div>
          )
        }
      </article>
      <article className="flex flex-col gap-3">
        <table className={[
          "w-full border-text/10",
          loading ? "loading_background rounded overflow-hidden border" : "bg-transparent border-y"
        ].join(" ")}>
          <tbody>
            <tr className="border-y border-text/10">
              <td className="w-20 p-2 ">
                <p className="text-center text-base font-bold">호실</p>
              </td>
              <td className="">
                <p className="text-base text-center">1번 (2)</p>
              </td>
              <td className="">
                <p className="text-center text-base">2번 (1)</p>
              </td>
              <td className="">
                <p className="text-center text-base">3번 (2)</p>
              </td>
              <td className="">
                <p className="text-center text-base">4번 (1)</p>
              </td>
              <td className="">
                <p className="text-center text-base">5번 (2)</p>
              </td>
              <td className="">
                <p className="text-center text-base">6번 (1)</p>
              </td>
            </tr>
            {
              Object.keys(hosilData).map((i) => (
                <tr
                  className={[
                    "border-y border-text/10",
                    Number(i) % 2 === 0 ? "bg-text/5" : "bg-transparent"
                  ].join(" ")}
                  key={i}
                >
                  <td className="w-20 p-2 ">
                    <p className="text-center text-base font-bold">{i}호</p>
                  </td>
                  {
                    hosilData[Number(i)].map((user, j) => {
                      return user ? (
                        <td key={j} className="p-2">
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-center text-base">{user.number}</p>
                            <p className="text-center text-base">{user.name}</p>
                          </div>
                        </td>
                      ) : mySelectedHosil.hosil === -1 ? (
                        <td key={j}>
                          <div className="text-center text-base flex flex-row items-center justify-center">
                            <div className="p-2 cursor-pointer" onClick={() => selectHosilSwal(Number(i), j)}>
                              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className="fill-text/30 cursor-pointer" d="M8.6 11.8L6.45 9.65C6.26667 9.46667 6.03333 9.375 5.75 9.375C5.46667 9.375 5.23333 9.46667 5.05 9.65C4.86667 9.83333 4.775 10.0667 4.775 10.35C4.775 10.6333 4.86667 10.8667 5.05 11.05L7.9 13.9C8.1 14.1 8.33333 14.2 8.6 14.2C8.86667 14.2 9.1 14.1 9.3 13.9L14.95 8.25C15.1333 8.06667 15.225 7.83333 15.225 7.55C15.225 7.26667 15.1333 7.03333 14.95 6.85C14.7667 6.66667 14.5333 6.575 14.25 6.575C13.9667 6.575 13.7333 6.66667 13.55 6.85L8.6 11.8ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" />
                              </svg>
                            </div>
                          </div>
                        </td>
                      ) : (
                        <td key={j} className="p-2">
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-center text-base">-</p>
                          </div>
                        </td>
                      );
                    })
                  }
                </tr>
              ))
            }
          </tbody>
        </table>  
      </article>
    </>
  );
};

export default HosilContent;