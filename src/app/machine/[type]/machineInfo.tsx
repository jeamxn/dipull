import moment from "moment";
import React from "react";

import { useAuth } from "@/hooks";
import { MachineJoin } from "@/utils/db/utils";

import { Machine_list_Response } from "./list/[allow]/utils";

const MachineInfo = ({
  machine,
  times,
  machine_current,
}: {
    machine: Machine_list_Response;
    times: string[];
    machine_current: MachineJoin[];
}) => {
  const { user } = useAuth();
  const [show, setShow] = React.useState(false);

  React.useEffect(() => { 
    const grade = Math.floor(user.number / 1000);
    if (
      (
        user.gender === machine.gender
      && machine.allow.includes(grade)
      )
      || user.type === "teacher"
    )
      setShow(true);
    else
      setShow(false);
  }, [user, machine, machine_current]);

  return (
    <button
      className={[
        "snap-center rounded-2xl p-6 bg-white dark:bg-text-dark/15 flex flex-col items-start justify-end gap-2 w-[calc(30rem)] max-md:w-[max(calc(100vw-2rem),250px)] h-max",
      ].join(" ")}
      onClick={() => setShow(p => !p)}
    >
      <p className="text-xl font-semibold text-text dark:text-text-dark">[{machine.allow.join(", ")}학년] {machine.name}</p>
      {
        show ? (
          <div className="flex flex-col gap-0.5">
            {
              user.id ? times.map((time, i) => {
                const this_user = () => {
                  try {
                    return machine_current?.find((item) => item.time === time && item.code === machine.code);
                  }
                  catch {
                    return undefined;
                  }
                };
                return (
                  <div key={i} className={[
                    "flex flex-row gap-1",
                    this_user() ? "opacity-90" : "opacity-30",
                  ].join(" ")}>
                    <p className="font-semibold text-text dark:text-text-dark">{moment(time, "HH:mm").format("a h시 mm분")}</p>
                    <p className="text-text dark:text-text-dark">{this_user()?.owner.number} {this_user()?.owner.name}</p>
                  </div>
                );
              }) : (
                <div className={[
                  "flex flex-row gap-1 opacity-30",
                ].join(" ")}>
                  <p className="text-text dark:text-text-dark">로그인 후 확인 가능합니다.</p>
                </div>
              )
            }
          </div>
        ) : null
      }
    </button>
  );
};

export default MachineInfo;