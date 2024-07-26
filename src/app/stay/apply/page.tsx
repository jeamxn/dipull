"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

import { ModalProps, useModalDispatch } from "@/components/Modal";
import { useAuth } from "@/hooks";

import { StayResponse } from "./student/utils";
import Studyroom from "./studyroom";


const Stay = () => {
  const { user, needLogin, onlyStudent } = useAuth();
  const modalDispatch = useModalDispatch();

  const [modalSelect, setModalSelect] = React.useState("");

  const [select, setSelect] = React.useState("");
  const [reason, setReason] = React.useState("");

  const { data, refetch } = useQuery({
    queryKey: ["homecoming_get", user.id],
    queryFn: async () => {
      const response = await axios.get<StayResponse>("/stay/apply/student");
      if (response.data.myStay) { 
        if (response.data.seat?.onSeat) {
          setSelect(response.data.seat.num);
        }
        else if(!response.data.seat?.onSeat) {
          setReason(response.data.seat?.reason || "");
        }
      }
      else {
        setSelect("");
        setReason("");
      }
      return response.data;
    },
    enabled: Boolean(user.id && user.type === "student"),
  });

  const { refetch: refetchDelete, isFetching: isFetchingDelete } = useQuery({
    queryKey: ["homecoming_put", reason, select],
    queryFn: async () => {
      const response = await axios.delete<StayResponse>("/stay/apply/student");
      await refetch();
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
  });

  const { refetch: refetchPut, isFetching: isFetchingPut } = useQuery({
    queryKey: ["stay_put", reason, select],
    queryFn: async () => {
      const response = await axios.put<StayResponse>("/stay/apply/student", {
        reason,
        seat: select,
      });
      await refetch();
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
  });

  const selectDispatchData: ModalProps = React.useMemo(() => {
    const selected = modalSelect;
    const disabledThis = Boolean(data?.myStay);
    return {
      label: "좌석 선택",
      showCancelButton: !disabledThis,
      confirmButtonText: disabledThis ? "확인" : `${selected ? `${selected} ` : "미"}선택`,
      inner: <Studyroom select={selected} setSelect={setModalSelect} disabled={disabledThis} />,
      onConfirm: () => {
        if (modalSelect) setReason("");
        setSelect(modalSelect);
        setModalSelect("");
      },
      onCancle: () => {
        setModalSelect("");
      },
    };
  }, [modalSelect, select, data?.myStay]);

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

  const disabled = React.useMemo(() => {
    return Boolean(isFetchingPut || data?.myStay);
  }, [isFetchingPut, data?.myStay]);

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
              {
                data?.myStay ? "좌석보기" : "선택하기"
              }
            </p>
          </button>
        </div>

        <div className="flex flex-col gap-2 px-4">
          <p className="text-base font-normal transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">좌석 미선택 사유</p>
          <div className="flex flex-row items-center justify-between gap-2">
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
            <button
              className="bg-text dark:bg-text-dark px-6 py-3 rounded-xl"
              onClick={() => {
                if (!user.id) return needLogin();
                if (user.type !== "student") return onlyStudent();
                setReason("교실 잔류");
              }}
              disabled={Boolean(select) || disabled}
            >
              <p className="text-white dark:text-white-dark">
              교실잔류
              </p>
            </button>
          </div>
          
        </div>
      </div>

      <div className="w-full px-4">
        {
          data?.myStay ? (
            <button
              className={[
                "p-3 bg-transparent border border-red-500 dark:bg-transparent dark:border-red-500 text-red-500 dark:text-red-500 rounded-xl font-semibold w-full transition-all",
                isFetchingDelete ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              ].join(" ")}
              disabled={isFetchingDelete}
              onClick={!user.id ? needLogin : user.type === "student" ? () => refetchDelete() : onlyStudent}
            >
              {
                isFetchingDelete ? "취소 중..." : "취소하기"
              }
            </button>
          ): (
            <button
              className={[
                "p-3 bg-text dark:bg-text-dark text-white dark:text-white-dark rounded-xl font-semibold w-full transition-all",
                !(select || reason) || disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              ].join(" ")}
              disabled={!(select || reason) || disabled}
              onClick={!user.id ? needLogin : user.type === "student" ? () => refetchPut() : onlyStudent}
            >
              {
                isFetchingPut ? "신청 중..." : "신청하기"
              }
            </button>
          )
        }
      </div>
    </div>
  );
};

export default Stay;