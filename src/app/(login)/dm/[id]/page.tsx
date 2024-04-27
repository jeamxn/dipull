/* eslint-disable @next/next/no-img-element */
// "use client";

import Link from "next/link";
import React from "react";

import { UserInfo, defaultUserData } from "@/app/api/teacher/userinfo/utils";
import { UserDB } from "@/app/auth/type";
import Insider from "@/provider/insider";
import { connectToDatabase } from "@/utils/db";

import Chats from "./chats";

const DM = async (
  { params }: { params: {
    id: string,
  } }
) => {
  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  
  const result = await userCollection.findOne({  
    id: params.id
  }) as unknown as UserDB;
  const data: UserInfo = {
    id: result.id,
    gender: result.gender,
    name: result.name,
    number: result.number,
    profile_image: result.profile_image,
    type: result.type,
  };

  return (
    <main 
      className="flex flex-col gap-0"
    >
      <section className="flex flex-col justify-center h-24 gap-3 border-b border-text/10 px-4 fixed bg-background/50 backdrop-blur-xl w-full max-w-[700px]">
        <section className="flex flex-row gap-1 items-center">
          <Link
            href={"/dm"}
            className="p-2 m-2 cursor-pointer rounded hover:bg-text/15"
          >
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="fill-text" d="M4.0958 9.06719L8.9958 13.9672C9.1958 14.1672 9.29163 14.4005 9.2833 14.6672C9.27497 14.9339 9.1708 15.1672 8.9708 15.3672C8.7708 15.5505 8.53747 15.6464 8.2708 15.6547C8.00413 15.663 7.7708 15.5672 7.5708 15.3672L0.970801 8.76719C0.870801 8.66719 0.799967 8.55885 0.758301 8.44219C0.716634 8.32552 0.695801 8.20052 0.695801 8.06719C0.695801 7.93385 0.716634 7.80885 0.758301 7.69219C0.799967 7.57552 0.870801 7.46719 0.970801 7.36719L7.5708 0.767188C7.75413 0.583854 7.9833 0.492188 8.2583 0.492188C8.5333 0.492188 8.7708 0.583854 8.9708 0.767188C9.1708 0.967188 9.2708 1.20469 9.2708 1.47969C9.2708 1.75469 9.1708 1.99219 8.9708 2.19219L4.0958 7.06719H15.2708C15.5541 7.06719 15.7916 7.16302 15.9833 7.35469C16.175 7.54635 16.2708 7.78385 16.2708 8.06719C16.2708 8.35052 16.175 8.58802 15.9833 8.77969C15.7916 8.97135 15.5541 9.06719 15.2708 9.06719H4.0958Z" />
            </svg>
          </Link>
          <section className="flex flex-row items-center gap-3">
            <img src={data.profile_image} alt="profile" className="w-14 h-14 rounded-full border border-text/10"/>
            <div className="flex flex-col items-start justify-center">
              <p className="text-left whitespace-nowrap font-medium">{data.name}</p>
              <p className="text-left whitespace-nowrap text-sm text-text/40"> 
                {
                  data.type === "student" ? `${Math.floor(data.number / 1000)}학년 ${Math.floor(data.number / 100) % 10}반 ${data.number % 100}번` : "교사"
                } · {data.gender === "male" ? "남" : "여"}자
              </p>
            </div>
          </section> 
        </section>
      </section>
      <Chats />
    </main>
  );
};


export default DM;