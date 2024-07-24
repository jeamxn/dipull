"use client";

import React from "react";

import Card from "./card";

const Machine = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {
        Array(20).fill(0).length ? Array(20).fill(0).map((_, index) => (
          <Card
            key={index}
            id="CdZN8PI3MqM"
            vote={12312}
            rank={index + 1}
            title="Ticking Away ft. Grabbitz & bbno$ (Official Music Video) // VALORANT Champions 2023 Anthem"
          />
        )) : (
          <div className="w-full px-6 flex flex-row items-center justify-center">
            <p className="text-text/40 dark:text-text-dark/50 text-center">신청된 기상송이 없습니다.</p>
          </div>
        )
      }
    </div>
  );
};

export default Machine;