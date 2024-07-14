"use client";

import Fireworks, { FireworksHandlers } from "@fireworks-js/react";
import React from "react";
import { useRecoilValue } from "recoil";

import { isFireworkFrameAtom } from "@/utils/states";

const FireworkFrame = () => {
  const ref = React.useRef<FireworksHandlers>(null);
  const isFireworkFrame = useRecoilValue(isFireworkFrameAtom);
  if(!isFireworkFrame) return null;
  
  return (
    <Fireworks
      ref={ref}
      options={{
        hue: {
          min: 0,
          max: 360,
        },
        acceleration: 1.00,
        brightness: {
          min: 50,
          max: 80,
        },
        decay: {
          min: 0.0150,
          max: 0.0300,
        },
        delay: {
          min: 10.00,
          max: 10.00,
        },
        explosion: 8,
        flickering: 43.48,
        intensity: 50,
        friction: 0.97,
        gravity: 0.00,
        opacity: 0.2,
        particles: 40,
        traceLength: 7.85,
        traceSpeed: 100,
        rocketsPoint: {
          min: 50,
          max: 50,
        },
        lineWidth: {
          explosion: {
            min: 2.00,
            max: 2.00,
          },
          trace: {
            min: 0.00,
            max: 0.00,
          },
        },
        lineStyle: "round",
        mouse: {
          click: true,
          max: 15,
          move: true,
        },
      }}
      className="top-0 left-0 w-full h-full fixed bg-background"
    />
  );
};

export default FireworkFrame;