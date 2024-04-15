"use client";

import * as jose from "jose";
import React from "react";

import { MachineDB, Machine as MachineType } from "@/app/api/machine/[type]/utils";
import { TokenInfo, defaultUserData } from "@/app/auth/type";
import Insider from "@/provider/insider";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

import Menu from "../menu";

import StatusBox from "./statusBox";
import { machineName, machineToKorean } from "./utils";

const machineKorean = {
  "washer": "세탁",
  "dryer": "건조",
};

type Params = {
  type: "washer" | "dryer";
};

const Machine = (
  { params }: { params: Params }
) => {
  const [loading, setLoading] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState(defaultUserData);
  const [data, setData] = React.useState<{
    [key: string]: MachineType;
  }>({});
  const [selectedMachine, setSelectedMachine] = React.useState<string>("");
  const [selectedTime, setSelectedTime] = React.useState<string>("");
  const [myBooking, setMyBooking] = React.useState<{
    booked: boolean;
    info: MachineDB;
  }>({
    booked: false,
    info: {
      machine: "",
      time: "",
      date: "",
      owner: "",
      type: params.type,
    },
  });

  const getWasherData = async () => {
    setLoading(true);
    try{
      const res = await instance.get(`/api/machine/${params.type}`);
      setData(res.data.data);
      setMyBooking(res.data.myBooking);
    }
    catch(e){
      console.error(e);
    }
    setLoading(false);
  };

  const putWasherData = async () => {
    setLoading(true);
    const loading = alert.loading("신청 중 입니다.");
    try{
      const res = await instance.put(`/api/machine/${params.type}`, {
        machine: selectedMachine,
        time: selectedTime,
      });
      await getWasherData();
      alert.update(loading, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
  };

  const deleteWasherData = async () => {
    setLoading(true);
    const loading = alert.loading("신청 취소 중 입니다.");
    try{
      const deletemsg = await instance.delete(`/api/machine/${params.type}`);
      setSelectedMachine("");
      setSelectedTime("");
      await getWasherData();
      alert.update(loading, deletemsg.data.message, "success");
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
  };

  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")!;
    const decrypt = jose.decodeJwt(accessToken) as TokenInfo;
    setUserInfo(decrypt.data);
    getWasherData();
  }, []);

  return (
    <>
      <Menu />
      <Insider>
        <section className="flex flex-col gap-3">
          <h1 className="text-xl font-semibold">{machineKorean[params.type]}기 신청하기</h1>
          {
            myBooking.booked ? (
              <section className="flex flex-col gap-1">
                <figure className="flex flex-col gap-1 justify-center items-center my-5">
                  <h1 className="text-xl font-semibold">오늘 예약한 {machineKorean[params.type]}기가 있어요.</h1>
                  <p>{machineName(myBooking.info.machine)} {myBooking.info.time.replace("* ", "")}</p>
                </figure>
                <button 
                  className={[
                    "w-full bg-primary text-white font-semibold px-4 py-2 rounded-md text-base "
                  ].join(" ")}
                  onClick={deleteWasherData}
                >취소하기</button>
              </section>
            ) : (
              <section className="flex flex-col gap-1">
                <figure className={[
                  "w-full bg-white border border-text/10 px-4 py-2 rounded-md text-base",
                  loading ? "loading_background" : "",
                ].join(" ")}>
                  <select 
                    value={selectedMachine}
                    onChange={(e) => setSelectedMachine(e.target.value)}
                    className="w-full h-full bg-transparent"
                  >
                    <option value="">{machineKorean[params.type]}기를 선택해주세요</option>
                    {
                      Object.entries(data).map(([name, machine], i) => (
                        <option 
                          key={i} 
                          value={name}
                          disabled={
                            machine.allow.grades.indexOf(
                              Math.floor(userInfo.number / 1000)
                            ) === -1 ||
                          userInfo.gender !== machine.allow.gender
                          }
                        >
                          { machineToKorean(name, machine) }
                        </option>
                      ))
                    }
                  </select>
                </figure>
                <figure className={[
                  "w-full bg-white border border-text/10 px-4 py-2 rounded-md text-base",
                  loading ? "loading_background" : "",
                ].join(" ")}>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full h-full bg-transparent"
                  >
                    <option value="">{machineKorean[params.type]} 시간을 선택해주세요</option>
                    {
                      data[selectedMachine] &&
                    Object.entries(data[selectedMachine].time).map(([time, status], i) => (
                      <option 
                        key={i} 
                        value={time} 
                        disabled={!!status}
                      >{time}</option>
                    ))
                    }
                  </select>
                </figure>
                <button 
                  className={[
                    "w-full bg-primary text-white font-semibold px-4 py-2 rounded-md text-base ",
                    !selectedMachine || !selectedTime ? "opacity-50" : "opacity-100"
                  ].join(" ")}
                  disabled={!selectedMachine || !selectedTime}
                  onClick={putWasherData}
                >신청하기</button>
              </section>
            )
          }
        </section>
        <section className="flex flex-col gap-3">
          <div className="flex flex-row items-center">
            <h1 className="text-xl font-semibold">{machineKorean[params.type]}기 신청 현황</h1>
            <div className={[
              "hover:font-semibold cursor-pointer transition-all h-7 w-7 flex items-center justify-center",
              loading ? "rotation" : "",
            ].join(" ")} onClick={getWasherData}>
              <svg width="14" height="14" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.69922 16.8835C6.46589 16.8835 4.57422 16.1085 3.02422 14.5585C1.47422 13.0085 0.699219 11.1169 0.699219 8.88354C0.699219 6.65021 1.47422 4.75855 3.02422 3.20854C4.57422 1.65854 6.46589 0.883545 8.69922 0.883545C9.84922 0.883545 10.9492 1.12104 11.9992 1.59604C13.0492 2.07104 13.9492 2.75021 14.6992 3.63354V1.88354C14.6992 1.60021 14.7951 1.36271 14.9867 1.17104C15.1784 0.979378 15.4159 0.883545 15.6992 0.883545C15.9826 0.883545 16.2201 0.979378 16.4117 1.17104C16.6034 1.36271 16.6992 1.60021 16.6992 1.88354V6.88354C16.6992 7.16688 16.6034 7.40438 16.4117 7.59605C16.2201 7.78771 15.9826 7.88354 15.6992 7.88354H10.6992C10.4159 7.88354 10.1784 7.78771 9.98672 7.59605C9.79505 7.40438 9.69922 7.16688 9.69922 6.88354C9.69922 6.60021 9.79505 6.36271 9.98672 6.17104C10.1784 5.97938 10.4159 5.88354 10.6992 5.88354H13.8992C13.3659 4.95021 12.6367 4.21688 11.7117 3.68354C10.7867 3.15021 9.78255 2.88354 8.69922 2.88354C7.03255 2.88354 5.61589 3.46688 4.44922 4.63354C3.28255 5.80021 2.69922 7.21688 2.69922 8.88354C2.69922 10.5502 3.28255 11.9669 4.44922 13.1335C5.61589 14.3002 7.03255 14.8835 8.69922 14.8835C9.83255 14.8835 10.8701 14.596 11.8117 14.021C12.7534 13.446 13.4826 12.6752 13.9992 11.7085C14.1326 11.4752 14.3201 11.3127 14.5617 11.221C14.8034 11.1294 15.0492 11.1252 15.2992 11.2085C15.5659 11.2919 15.7576 11.4669 15.8742 11.7335C15.9909 12.0002 15.9826 12.2502 15.8492 12.4835C15.1659 13.8169 14.1909 14.8835 12.9242 15.6835C11.6576 16.4835 10.2492 16.8835 8.69922 16.8835Z" fill="rgb(var(--color-primary) / 1)"/>
              </svg>
            </div>
          </div>
          <article className="flex flex-col gap-1">
            {
              Object.entries(data).sort(
                ([,], [, machine1]) => 
                  machine1.allow.grades.includes(Math.floor(userInfo.number / 1000)) 
                  && machine1.allow.gender === userInfo.gender ? 1 : -1
              ).map(([name, machine], i) => (
                <StatusBox 
                  key={i} 
                  name={name} 
                  machine={machine} 
                  loading={loading} 
                  userInfo={userInfo}
                />
              ))
            }
          </article>
        </section>
      </Insider>
    </>
  );
};


export default Machine;