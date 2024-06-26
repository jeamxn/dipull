import { isArray } from "lodash";
import React from "react";

const NotificationButton = ({
  rejectList,
  setRejectList,
  type,
  text,
}: {
  type: string | string[];
  text: string;
  rejectList: string[];
  setRejectList: React.Dispatch<React.SetStateAction<string[]>>;
  }) => {
  const isAllowed = isArray(type) ? type.every(e => !rejectList.includes(e)) : !rejectList.includes(type);
  return (
    <button
      className={[
        "w-full rounded border border-text/10 px-1 py-4 flex flex-col gap-1 items-center justify-center",
        !isAllowed ? "bg-text/10" : "",
      ].join(" ")}
      onClick={() => {
        if (isAllowed) {
          if (isArray(type)) setRejectList(p => [...p, ...type]);
          else setRejectList(p => [...p, type]);
          return;
        }
        if (isArray(type)) setRejectList(p => p.filter(e => !type.includes(e)));
        else setRejectList(p => p.filter(e => e !== type));
      }}
    >
      <p className="font-bold leading-tight">{text}</p>
      <p className="leading-tight">{isAllowed ? "O" : "X"}</p>
    </button>
  );
};

export default NotificationButton;