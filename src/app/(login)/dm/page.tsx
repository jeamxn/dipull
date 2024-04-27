"use client";

import React from "react";

import { UserInfo, defaultUserData } from "@/app/api/teacher/userinfo/utils";
import Insider from "@/provider/insider";

import Search from "./search";

const DM = () => {
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <Insider>
      <section className="flex flex-col gap-3">
        <section className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">다이랙트 메시지</h1>
        </section>
        <Search
          loading={loading}
          setLoading={setLoading}
        />
      </section>
      <section className="flex flex-col gap-3">
        <section className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">대화 목록</h1>
        </section>
        
      </section>
    </Insider>
  );
};


export default DM;