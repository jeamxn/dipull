"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

import { ModalProps, useModalDispatch } from "@/components/Modal";
import SelectUser from "@/components/SelectUser";
import { useAuth } from "@/hooks";
import { defaultUser, UserInfo } from "@/utils/db/utils";

import { StayResponse } from "./grant/[id]/apply/utils";
import StudyroomModal from "./studyroomModal";


const Stay = () => {
  const { user, needLogin, onlyStudent } = useAuth();
  const [selected, setSelected] = React.useState<UserInfo>(defaultUser);
  React.useEffect(() => {
    setSelected(user);
  }, [user]);
  
  const modalDispatch = useModalDispatch();

  const [modalSelect, setModalSelect] = React.useState("");

  const [select, setSelect] = React.useState("");
  const [reason, setReason] = React.useState("");

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["stay_get", selected.id, user.id],
    queryFn: async () => {
      const response = await axios.get<StayResponse>(`/stay/apply/grant/${selected.id}/apply`);
      if (response.data.myStay) { 
        if (response.data.seat?.num) {
          setSelect(response.data.seat.num);
        }
        else if(response.data.seat?.reason) {
          setReason(response.data.seat?.reason || "");
        }
      }
      else {
        setSelect("");
        setReason("");
      }
      return response.data;
    },
    enabled: Boolean(selected.id && selected.type === "student"),
  });

  const { refetch: refetchDelete, isFetching: isFetchingDelete } = useQuery({
    queryKey: ["stay_delete", reason, select, user.id],
    queryFn: async () => {
      const response = await axios.delete<StayResponse>(`/stay/apply/grant/${selected.id}/apply`);
      await refetch();
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
  });

  const { refetch: refetchPut, isFetching: isFetchingPut } = useQuery({
    queryKey: ["stay_put", reason, select, user.id],
    queryFn: async () => {
      const response = await axios.put<StayResponse>(`/stay/apply/grant/${selected.id}/apply`, {
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
    const selected_ = modalSelect;
    const disabledThis = Boolean(data?.myStay);
    return {
      label: "좌석 선택",
      showCancelButton: !disabledThis,
      confirmButtonText: disabledThis ? "확인" : `${selected_ ? `${selected_} ` : "미"}선택`,
      inner: (
        <StudyroomModal
          selected={selected}
          setSelected={setSelected}
          select={selected_}
          setSelect={setModalSelect}
          disabled={disabledThis}
        />
      ),
      onConfirm: () => {
        if (modalSelect) setReason("");
        setSelect(modalSelect);
        setModalSelect("");
      },
      onCancle: () => {
        setModalSelect("");
      },
    };
  }, [modalSelect, select, data?.myStay, selected.id]);

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
    return Boolean(isFetchingPut || data?.myStay || isFetching);
  }, [isFetchingPut, data?.myStay, isFetching]);

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-4 w-full">
        <p className="px-4 text-xl font-semibold transition-all whitespace-nowrap text-text dark:text-text-dark">좌석 선택</p>
        {
          user.type === "teacher" ? (
            <div className="w-full px-4">
              <SelectUser select={selected} setSelect={setSelected} />
            </div>
          ) : null
        }
        <div className="flex flex-row items-center justify-between px-4 gap-2">
          <div className="flex flex-col gap-1">
            <p className="text-base font-medium transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">
              {user.type === "teacher" ? "선택된" : "내가 선택한"} 좌석
            </p>
            <p className="text-xl font-semibold transition-all whitespace-nowrap text-text dark:text-text-dark">
              {isFetching ? "잔류 정보를 불러오는 중..." : select ? select : "미선택"}
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
          <p className="text-base font-medium transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">좌석 미선택 사유</p>
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
                // if (user.type !== "student") return onlyStudent();
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

        <div className="flex flex-col gap-1 px-4">
          <p className="text-base font-medium transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">잔류 신청 현황</p>
          <p className="text-lg font-semibold transition-all whitespace-nowrap text-text dark:text-text-dark">
            <a href="https://docs.google.com/spreadsheets/d/12vEO_54NcGbkePTFKxRXQ7s7SXTiuuzFmwXavHrUgB8/edit?usp=sharing" className="underline" target="_blank" rel="noreferrer">여기</a>에서 잔류 신청 현황을 확인하세요!
          </p>
        </div>
      </div>

      <div className="w-full px-4">
        {
          data?.myStay ? (
            <button
              className={[
                "p-3 bg-transparent border border-red-500 dark:bg-transparent dark:border-red-500 text-red-500 dark:text-red-500 rounded-xl font-semibold w-full transition-all",
                isFetchingDelete || !selected.id ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              ].join(" ")}
              disabled={isFetchingDelete || !selected.id}
              onClick={!user.id ? needLogin : () => refetchDelete()}
            >
              {
                isFetchingDelete ? "취소 중..." : "취소하기"
              }
            </button>
          ): (
            <button
              className={[
                "p-3 bg-text dark:bg-text-dark text-white dark:text-white-dark rounded-xl font-semibold w-full transition-all",
                !(select || reason) || disabled || !selected.id ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              ].join(" ")}
              disabled={!(select || reason) || disabled || !selected.id}
              onClick={!user.id ? needLogin : () => refetchPut()}
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