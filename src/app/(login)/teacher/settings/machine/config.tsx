import React from "react";

import { MachineConfig } from "@/app/api/machine/[type]/utils";

const Config = ({
  type,
  machine,
  keys,
  setMachineConfig,
}: {
  type: "stay" | "common";
  machine: "washer" | "dryer";
  keys: string;
  setMachineConfig: React.Dispatch<React.SetStateAction<MachineConfig>>;
  }) => {
  const [edit, setEdit] = React.useState(false);
  const [thisKey, setThisKey] = React.useState(keys);

  return (
    <div key={keys} className="flex flex-row gap-4 items-center justify-between">
      <input
        type="text"
        className={[
          "w-full p-2 border border-text/10 rounded",
          edit ? "bg-transparent" : "bg-text/10",
        ].join(" ")}
        value={thisKey}
        onChange={(e) => {
          setThisKey(e.target.value);
        }}
        disabled={!edit}
      />
      <div className="flex flex-row gap-1 select-none">
        {
          edit ? (
            <h2
              className="text-base cursor-pointer whitespace-nowrap text-primary"
              onClick={() => {
                setEdit(false);
                setMachineConfig((prev) => {
                  const newConfig = {...prev};
                  newConfig[type][machine] = newConfig[type][machine].map((v) => v === keys ? thisKey : v);
                  return newConfig;
                });
              }}
            >
              저장
            </h2>
          ): (
            <h2
              className="text-base cursor-pointer whitespace-nowrap text-primary/75"
              onClick={() => setEdit(true)}
            >
              수정
            </h2>
          )
        }
        <h2 className="text-base text-text/40 whitespace-nowrap">·</h2>
        {
          edit ? (
            <h2
              className="text-base text-[#EF4444] cursor-pointer whitespace-nowrap"
              onClick={() => {
                setEdit(false);
                setThisKey(keys);
              }}
            >취소</h2>
          ) : (
            <h2
              className="text-base text-[#EF4444]/75 cursor-pointer whitespace-nowrap"
              onClick={() => setMachineConfig((prev) => {
                const newConfig = {...prev};
                newConfig[type][machine] = newConfig[type][machine].filter((v) => v !== keys);
                return newConfig;
              })}
            >삭제</h2>
          )
        }
      </div>
    </div>
  );
};

export default Config;