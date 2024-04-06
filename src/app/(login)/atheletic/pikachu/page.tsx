"use client";
import moment from "moment";
import Image from "next/image";
import React from "react";

import Comments from "@/components/comments";
import Insider from "@/provider/insider";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

import Menu from "../menu";

import PikachuVolleyball from "./pikachuVolleyball";

const Gallary = () => {
  return (
    <>
      <Menu />
      <Insider>
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold">피카츄 배구 (오프라인)</h1>
          </div>
          <section className="flex flex-wrap gap-4 flex-row items-center justify-center">
            <PikachuVolleyball />
          </section>
        </section>
        <Comments />
      </Insider>
    </>
  );
};


export default Gallary;