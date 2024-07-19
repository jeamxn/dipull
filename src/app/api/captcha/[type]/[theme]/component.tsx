import React from "react";

import { rand } from "@/utils/random";

const Component = ({
  darkmode = false,
  random,
}: {
  random: string;
  darkmode?: boolean;
  }) => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      color: darkmode ? "rgb(230 230 230)" : "rgb(11 17 54)",
      backgroundColor: darkmode ? "rgb(15 15 15)" : "rgb(255 255 255)",
    }}>
      {random.split("").map((char, i) => (
        <div
          key={i}
          style={{
            fontSize: `${rand(12,30)}rem`,
            fontWeight: `${rand(1, 10)}00`,
            // fontSize: `${rand(20, 60)}px`,
            color: darkmode ? "rgb(230 230 230)" : "rgb(11 17 54)",
          }}
        >
          {char}
        </div>
      ))}
      {
        Array(rand(5, 10)).fill(0).map((_, i) => {
          const width = rand(100, 200);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: `${width}%`,
                height: "2.5rem",
                marginTop: `${rand(width / 2 * -1, width / 2)}px`,
                background: darkmode ? "rgb(230 230 230)" : "rgb(11 17 54)",
                transform: `translateX(${rand(-50, 50)}%) rotate(${rand(-45, 45)}deg)`,
              }}
            />
          );
        })
      }
    </div>
  );
};

export default Component;