"use client";

import React from "react";

import { ModalProps, useModalDispatch } from "@/components/Modal";
import { useAuth } from "@/hooks";

import Studyroom from "./studyroom";

const Stay = () => {
  const { user, needLogin, onlyStudent } = useAuth();
  const modalDispatch = useModalDispatch();

  const [modalSelect, setModalSelect] = React.useState("");

  const [select, setSelect] = React.useState("");
  const [reason, setReason] = React.useState("");

  const selectDispatchData: ModalProps = React.useMemo(() => {
    const selected = modalSelect;
    return {
      label: "좌석 선택",
      showCancelButton: true,
      confirmButtonText: `${selected ? `${selected} ` : "미"}선택`,
      inner: <Studyroom select={selected} setSelect={setModalSelect} />,
      onConfirm: () => {
        if (modalSelect) setReason("");
        setSelect(modalSelect);
        setModalSelect("");
      },
      onCancle: () => {
        setModalSelect("");
      },
    };
  }, [modalSelect, select]);

  const showStudyroom = () => {
    modalDispatch({
      type: "show",
      data: selectDispatchData,
    });
  };

  React.useEffect(() => {
    modalDispatch({
      type: "update",
      data: selectDispatchData,
    });
  }, [selectDispatchData]);

  const disabled = React.useMemo(() => !user.id || user.type !== "student", [user]);

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-4 w-full">
        <p className="px-4 text-xl font-semibold transition-all whitespace-nowrap text-text dark:text-text-dark">좌석 선택</p>
        <div className="flex flex-row items-center justify-between px-4 gap-2">
          <div className="flex flex-col gap-1">
            <p className="text-base font-normal transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">내가 선택한 좌석</p>
            <p className="text-xl font-semibold transition-all whitespace-nowrap text-text dark:text-text-dark">
              {select ? select : "미선택"}
            </p>
          </div>
          <button className="bg-text dark:bg-text-dark px-6 py-3 rounded-xl" onClick={() => {
            if (!user.id) return needLogin();
            setModalSelect(select);
            showStudyroom();
          }}>
            <p className="text-white dark:text-white-dark">
              선택하기
            </p>
          </button>
        </div>

        <div className="flex flex-col gap-2 px-4">
          <p className="text-base font-normal transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">좌석 미선택 사유</p>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={[
              "w-full px-4 py-3 border border-text/20 dark:border-text-dark/30 rounded-xl outline-none text-text dark:text-text-dark",
              select || disabled ? "cursor-not-allowed bg-text/10 dark:bg-text-dark/20" : "bg-transparent",
            ].join(" ")}
            placeholder="좌석 미선택 사유를 입력해주세요."
            disabled={Boolean(select) || disabled}
          />
        </div>
      </div>

      <div className="w-full px-4">
        <button
          className={[
            "p-3 bg-text dark:bg-text-dark text-white dark:text-white-dark rounded-xl font-semibold w-full transition-all",
            !(select || reason) || disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          ].join(" ")}
          disabled={!(select || reason) || disabled}
          onClick={!user.id ? needLogin : user.type === "student" ? () => {} : onlyStudent}
        >
          신청하기
          {/* {
          isFetching ? "신청 중..." : "신청하기"
        } */}
        </button>
      </div>
    </div>
  );
};

export default Stay;