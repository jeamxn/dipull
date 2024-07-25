"use client";

import React from "react";

import { ModalProps, useModalDispatch } from "@/components/Modal";
import { useAuth } from "@/hooks";

import Studyroom from "./studyroom";

type Outing = {
  saturday: string[];
  sunday: string[];
};

const Stay = () => {
  const { user, needLogin, onlyStudent } = useAuth();
  const modalDispatch = useModalDispatch();

  const [modalSelect, setModalSelect] = React.useState("");
  const [select, setSelect] = React.useState("");

  const [outing, setOuting] = React.useState<Outing>({
    saturday: [],
    sunday: [],
  });
  const [reason, setReason] = React.useState("");

  const selectDispatchData: ModalProps = React.useMemo(() => ({
    label: "좌석 선택",
    showCancelButton: true,
    confirmButtonText: `${modalSelect || select} 선택`,
    inner: <Studyroom select={modalSelect || select} setSelect={setModalSelect} />,
    onConfirm: () => { 
      setSelect(modalSelect);
      setModalSelect("");
    },
    onCancle: () => {
      setModalSelect("");
    },
  }), [modalSelect, select]);

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
  }, [modalSelect]);

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
          <button className="bg-text dark:bg-text-dark px-6 py-3 rounded-xl" onClick={showStudyroom}>
            <p className="text-white dark:text-white-dark">선택하기</p>
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
              select ? "cursor-not-allowed bg-text/10 dark:bg-text-dark/20" : "cursor-pointer bg-transparent",
            ].join(" ")}
            placeholder="좌석 미선택 사유를 입력해주세요."
            disabled={select ? true : false}
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-4 px-4 w-full overflow-hidden">
        <p className="text-xl font-semibold transition-all whitespace-nowrap text-text dark:text-text-dark">외출 신청</p>
        <div className="flex flex-row items-start justify-between gap-4 w-full flex-wrap">
          <div className="flex flex-col gap-4">
            {
              Object.entries(outing).map(([day, outs]) => (
                <div key={day} className="flex flex-col items-start justify-start gap-1">
                  <p className="text-base font-normal transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">
                    {day === "saturday" ? "토요일" : "일요일"}
                  </p>
                  <div className="flex flex-col items-start justify-start gap-0">
                    {
                      outs.length ? outs.map((out) => (
                        <button
                          key={out}
                          onClick={(e) => {
                            const deleted = outing[day as keyof Outing].filter((o) => o !== out);
                            setOuting({
                              ...outing,
                              [day]: deleted,
                            });
                          }}
                          className="flex flex-row items-center justify-start gap-0"
                        >
                          <p className="text-lg font-medium transition-all whitespace-nowrap text-text dark:text-text-dark">
                            {out}
                          </p>
                          <svg className="w-6 h-6 -ml-0.5" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path className="fill-text dark:fill-text-dark" d="M12.8157 13.4622L9.91572 16.3622C9.73239 16.5455 9.49906 16.6372 9.21572 16.6372C8.93239 16.6372 8.69906 16.5455 8.51572 16.3622C8.33239 16.1789 8.24072 15.9455 8.24072 15.6622C8.24072 15.3789 8.33239 15.1455 8.51572 14.9622L11.4157 12.0622L8.51572 9.18721C8.33239 9.00387 8.24072 8.77054 8.24072 8.48721C8.24072 8.20387 8.33239 7.97054 8.51572 7.78721C8.69906 7.60387 8.93239 7.51221 9.21572 7.51221C9.49906 7.51221 9.73239 7.60387 9.91572 7.78721L12.8157 10.6872L15.6907 7.78721C15.8741 7.60387 16.1074 7.51221 16.3907 7.51221C16.6741 7.51221 16.9074 7.60387 17.0907 7.78721C17.2907 7.98721 17.3907 8.22471 17.3907 8.49971C17.3907 8.77471 17.2907 9.00387 17.0907 9.18721L14.1907 12.0622L17.0907 14.9622C17.2741 15.1455 17.3657 15.3789 17.3657 15.6622C17.3657 15.9455 17.2741 16.1789 17.0907 16.3622C16.8907 16.5622 16.6532 16.6622 16.3782 16.6622C16.1032 16.6622 15.8741 16.5622 15.6907 16.3622L12.8157 13.4622Z" />
                          </svg>

                        </button>
                      )) : (
                        <p className="text-lg font-medium transition-all whitespace-nowrap text-text dark:text-text-dark">
                          없음
                        </p>
                      )
                    }
                  </div>
                </div>
              ))
            }
          </div>
          <div>
            <button className="bg-text dark:bg-text-dark px-6 py-3 rounded-xl">
              <p className="text-white dark:text-white-dark">추가하기</p>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-4">
        <button
          className={[
            "p-3 bg-text dark:bg-text-dark text-white dark:text-white-dark rounded-xl font-semibold w-full transition-all",
          // true ? "cursor-pointer" : "cursor-not-allowed opacity-50",
          ].join(" ")}
          // disabled={!machine || !time}
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