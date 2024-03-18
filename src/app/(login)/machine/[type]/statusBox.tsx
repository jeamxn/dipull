import React from "react";

import { Machine } from "@/app/api/machine/[type]/utils";
import { UserData } from "@/app/auth/type";

import { machineToKorean } from "./utils";

const StatusBox = ({
  name,
  machine,
  loading,
  userInfo,
}: {
  name: string;
  machine: Machine;
  loading: boolean;
  userInfo: UserData;
}) => {
  const isOurGrade = machine.allow.grades.includes(Math.floor(userInfo.number / 1000)) && machine.allow.gender === userInfo.gender;
  const [clicked, setClicked] = React.useState(isOurGrade);
  return (
    <figure 
      onClick={() => setClicked(p => !p)}
      className={[
        "w-full bg-white border border-text/10 px-4 py-2 rounded-md flex flex-col gap-1 select-none",
        loading ? "loading_background" : "",
      ].join(" ")}
    >
      <p>{machineToKorean(name, machine)}</p>
      {
        clicked && Object.entries(machine.time).map(([key, value], i) => (
          <p key={i} className={[
            "text-sm",
            !value ? "opacity-30" : "opacity-100"
          ].join(" ")}>
            <b className="font-semibold">{key}</b> {value}
          </p>
        ))
      }
    </figure>
  );
};

export default StatusBox;