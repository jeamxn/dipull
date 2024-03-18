"use client";

import * as jose from "jose";
import React from "react";
import { toast } from "react-toastify";

import { MachineDB, Machine as MachineType } from "@/app/api/machine/[type]/utils";
import { TokenInfo, defaultUserData } from "@/app/auth/type";
import Insider from "@/provider/insider";
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
      type: "",
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
    try{
      const res = await instance.put(`/api/machine/${params.type}`, {
        machine: selectedMachine,
        time: selectedTime,
      });
      await getWasherData();
      toast.success(res.data.message);
    }
    catch(e: any){
      toast.error(e.response.data.message);
    }
    setLoading(false);
  };

  const deleteWasherData = async () => {
    setLoading(true);
    try{
      const deletemsg = await instance.delete(`/api/machine/${params.type}`);
      setSelectedMachine("");
      setSelectedTime("");
      await getWasherData();
      toast.success(deletemsg.data.message);
    }
    catch(e: any){
      toast.error(e.response.data.message);
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
                    "w-full bg-primary text-white font-semibold px-4 py-2 rounded-md text-base transition-opacity"
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
                    "w-full bg-primary text-white font-semibold px-4 py-2 rounded-md text-base transition-opacity",
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
          <h1 className="text-xl font-semibold">{machineKorean[params.type]}기 신청 현황</h1>
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