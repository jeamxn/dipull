import React from "react";

import * as Select from "@/components/Select";
import { useAuth } from "@/hooks";

const SetName = ({
  selected,
  setSelected,
}: {
  selected: string;
    setSelected: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { user } = useAuth();
  const grade = React.useMemo(() => Math.floor(user.number / 1000), [user]);
  return (
    <Select.Title
      label="이름 설정하기"
      options={[
        `${grade}학년 ${user.name}`,
        `${grade}학년 익명`,
        user.name,
        "익명",
      ]}
      optionValues={[
        JSON.stringify({ grade: true, anonymous: false }),
        JSON.stringify({ grade: true, anonymous: true }),
        JSON.stringify({ grade: false, anonymous: false }),
        JSON.stringify({ grade: false, anonymous: true }),
      ]}
      value={selected}
      onConfirm={(t) => {
        setSelected(t || "최신순");
      }}
    />
  );
};

export default SetName;