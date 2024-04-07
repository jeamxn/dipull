"use client";
import React from "react";

import Comments from "@/components/comments";
import Insider from "@/provider/insider";

import Menu from "../menu";

import List from "./list";
import PikachuVolleyball from "./pikachuVolleyball";

const Gallary = () => {
  return (
    <>
      <Menu />
      <Insider>
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold">피카츄 배구</h1>
          </div>
          <section className="flex flex-wrap gap-4 flex-row items-center justify-center">
            <PikachuVolleyball />
          </section>
        </section>
        <List />
      </Insider>
    </>
  );
};


export default Gallary;