"use client";

import React from "react";

import Card from "./card";

const Machine = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {
        Array(20).fill(0).map((_, index) => (
          <Card
            key={index}
            id="CdZN8PI3MqM"
            vote={12312}
            rank={index + 1}
            title="Ticking Away ft. Grabbitz & bbno$ (Official Music Video) // VALORANT Champions 2023 Anthem"
          />
        ))
      }
    </div>
  );
};

export default Machine;