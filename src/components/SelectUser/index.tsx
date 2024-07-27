import React from "react";

import { ModalProps, useModalDispatch } from "@/components/Modal";
import { useAuth } from "@/hooks";
import { defaultUser, UserInfo } from "@/utils/db/utils";

import SelectUserInner from "./inner";

const SelectUser = ({
  select: selected,
  setSelect: setSelected,
}: {
  select: UserInfo;
  setSelect: React.Dispatch<React.SetStateAction<UserInfo>>;
  }) => {
  const { user, needLogin, onlyTeacher } = useAuth();
  const modalDispatch = useModalDispatch();

  const [modalSelect, setModalSelect] = React.useState<UserInfo>(defaultUser);
  // const [selected, setSelected] = React.useState<UserInfo>(defaultUser);

  React.useEffect(() => {
    setModalSelect(selected);
  }, [selected]);

  const selectModalData: ModalProps = React.useMemo(() => {
    return {
      label: "사용자 선택",
      showCancelButton: true,
      confirmButtonText: modalSelect.id ? `${modalSelect.type === "student" ? modalSelect.number : ""} ${modalSelect.name} 선택` : "선택 취소",
      inner: (
        <SelectUserInner
          select={modalSelect}
          setSelect={setModalSelect}
        />
      ),
      onConfirm: () => {
        setSelected(modalSelect);
        modalDispatch({ type: "hide" });
      },
      onCancle: () => {
        setModalSelect(selected);
        modalDispatch({ type: "hide" });
      },
    };
  }, [modalSelect]);
  const show = () => {
    modalDispatch({
      type: "show",
      data: selectModalData
    });
  };
  React.useEffect(() => {
    modalDispatch({
      type: "update",
      data: selectModalData,
    });
  }, [selectModalData]);

  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">사용자 선택하기</p>
        <p className="text-xl font-semibold transition-all whitespace-nowrap text-text dark:text-text-dark">
          {selected.id ? `${selected.type === "student" ? selected.number : ""} ${selected.name} (${selected.gender === "male" ? "남" : "여"})` : "미선택"}
        </p>
      </div>
      <button className="bg-text dark:bg-text-dark px-6 py-3 rounded-xl" onClick={() => {
        if (!user.id) return needLogin();
        if (user.type !== "teacher") return onlyTeacher();
        show();
        // setModalSelect(select);
      }}>
        <p className="text-white dark:text-white-dark">
          선택하기
          {/* {
            data?.myStay ? "좌석보기" : "선택하기"
          } */}
        </p>
      </button>
    </div>
  );
};

export default SelectUser;