import React from "react";

import { MachineConfig } from "@/app/api/machine/[type]/utils";

import Config from "./config";

const ConfigBox = ({
  type,
  machine,
  machineConfig,
  setMachineConfig,
  loading,
}: {
  type: "stay" | "common";
  machine: "washer" | "dryer";
  machineConfig: MachineConfig;
  setMachineConfig: React.Dispatch<React.SetStateAction<MachineConfig>>;
  loading: boolean;
}) => {
  return (
    <article className={[
      "flex flex-col gap-4 bg-white rounded border border-text/10 p-5 overflow-auto w-full",
      loading ? "loading_background" : "",
    ].join(" ")}>
      <h1 className="text-xl font-semibold">{type === "stay" ? "잔류" : "평일"} 시간표</h1>
      {
        machineConfig[type][machine].map((key) => (
          <Config
            type={type}
            machine={machine}
            key={key}
            keys={key}
            setMachineConfig={setMachineConfig}
          />
        ))
      }
      <div
        className="flex flex-row gap-2 items-center justify-center cursor-pointer"
        onClick={() => {
          setMachineConfig((prev) => {
            const newConfig = { ...prev };
            newConfig[type][machine].push("");
            return newConfig;
          });
        }}
      >
        <svg className="w-4 h-4" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className="fill-primary/75" d="M9.36328 11.708V14.708C9.36328 14.9913 9.45911 15.2288 9.65078 15.4205C9.84245 15.6122 10.0799 15.708 10.3633 15.708C10.6466 15.708 10.8841 15.6122 11.0758 15.4205C11.2674 15.2288 11.3633 14.9913 11.3633 14.708V11.708H14.3633C14.6466 11.708 14.8841 11.6122 15.0758 11.4205C15.2674 11.2288 15.3633 10.9913 15.3633 10.708C15.3633 10.4247 15.2674 10.1872 15.0758 9.99551C14.8841 9.80384 14.6466 9.70801 14.3633 9.70801H11.3633V6.70801C11.3633 6.42467 11.2674 6.18717 11.0758 5.99551C10.8841 5.80384 10.6466 5.70801 10.3633 5.70801C10.0799 5.70801 9.84245 5.80384 9.65078 5.99551C9.45911 6.18717 9.36328 6.42467 9.36328 6.70801V9.70801H6.36328C6.07995 9.70801 5.84245 9.80384 5.65078 9.99551C5.45911 10.1872 5.36328 10.4247 5.36328 10.708C5.36328 10.9913 5.45911 11.2288 5.65078 11.4205C5.84245 11.6122 6.07995 11.708 6.36328 11.708H9.36328ZM10.3633 20.708C8.97995 20.708 7.67995 20.4455 6.46328 19.9205C5.24661 19.3955 4.18828 18.683 3.28828 17.783C2.38828 16.883 1.67578 15.8247 1.15078 14.608C0.625781 13.3913 0.363281 12.0913 0.363281 10.708C0.363281 9.32467 0.625781 8.02467 1.15078 6.80801C1.67578 5.59134 2.38828 4.53301 3.28828 3.63301C4.18828 2.73301 5.24661 2.02051 6.46328 1.49551C7.67995 0.970508 8.97995 0.708008 10.3633 0.708008C11.7466 0.708008 13.0466 0.970508 14.2633 1.49551C15.4799 2.02051 16.5383 2.73301 17.4383 3.63301C18.3383 4.53301 19.0508 5.59134 19.5758 6.80801C20.1008 8.02467 20.3633 9.32467 20.3633 10.708C20.3633 12.0913 20.1008 13.3913 19.5758 14.608C19.0508 15.8247 18.3383 16.883 17.4383 17.783C16.5383 18.683 15.4799 19.3955 14.2633 19.9205C13.0466 20.4455 11.7466 20.708 10.3633 20.708ZM10.3633 18.708C12.5966 18.708 14.4883 17.933 16.0383 16.383C17.5883 14.833 18.3633 12.9413 18.3633 10.708C18.3633 8.47467 17.5883 6.58301 16.0383 5.03301C14.4883 3.48301 12.5966 2.70801 10.3633 2.70801C8.12995 2.70801 6.23828 3.48301 4.68828 5.03301C3.13828 6.58301 2.36328 8.47467 2.36328 10.708C2.36328 12.9413 3.13828 14.833 4.68828 16.383C6.23828 17.933 8.12995 18.708 10.3633 18.708Z" />
        </svg>
        <p
          className="text-base text-primary/75 whitespace-nowrap"
        >추가하기</p>
      </div>
    </article>
  );
};

export default ConfigBox;