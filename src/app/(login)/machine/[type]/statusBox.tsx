import React from "react";

import { Machine } from "@/app/api/machine/[type]/utils";

import { machineToKorean } from "./utils";

const StatusBox = ({
  name,
  machine,
  loading,
}: {
  name: string;
  machine: Machine;
  loading: boolean;
}) => {
  const [clicked, setClicked] = React.useState(false);
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