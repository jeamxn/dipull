"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

import { useAlertModalDispatch } from "@/components/AlertModal";
import { ModalProps, useModalDispatch } from "@/components/Modal";
import SelectUser from "@/components/SelectUser";
import { useAuth } from "@/hooks";
import { defaultUser, UserInfo } from "@/utils/db/utils";

import { initailOutingResponse, OutingResponse } from "./grant/[id]/utils";
import Outing from "./outing";
import { initailOuting, initialMeals, koreanMeals, koreanWeekends, Meals, meals, OutingInfo, OutingType, sundayOuting, Weekend, weekends } from "./utils";

const StayOuting = () => {
  const { user, needLogin, onlyStudent } = useAuth();
  const [selected, setSelected] = React.useState<UserInfo>(defaultUser);
  React.useEffect(() => {
    setSelected(user);
  }, [user]);

  const modalDispatch = useModalDispatch();
  const alertModalDispatch = useAlertModalDispatch();

  const [modalOuting, setModalOuting] = React.useState<OutingInfo>(initailOuting);

  const [outing, setOuting] = React.useState<OutingType>(initailOutingResponse);
  const [meal, setMeal] = React.useState<Meals>(initialMeals);

  React.useEffect(() => {
    if(outing.sunday.includes(sundayOuting)) {
      setMeal(p => ({
        ...p,
        sunday: {
          ...p.sunday,
          lunch: false,
        },
      }));
    }
  }, [outing]);

  const { refetch, isFetching: loadingOuting, data } = useQuery({
    queryKey: ["outing_get", selected.id, user.id],
    queryFn: async () => {
      const response = await axios.get<OutingResponse>(`/stay/outing/grant/${selected.id}`);
      if (response.data.outing) {
        setOuting(response.data.outing);
      }
      if (response.data.meals) {
        setMeal(response.data.meals);
      }
      return response.data;
    },
    enabled: Boolean(selected.id && selected.type === "student"),
  });

  const { refetch: refetchPut, isFetching: isFetchingPut } = useQuery({
    queryKey: ["outing_put", outing, data, user.id, selected.id],
    queryFn: async () => {
      const response = await axios.put<OutingResponse>(`/stay/outing/grant/${selected.id}`, {
        outing,
        meals: meal,
      });
      alertModalDispatch({
        type: "show",
        data: {
          title: "외출 신청 완료!",
          description: "신청한 시간 안에 귀교해주세요.",
        }
      });
      await refetch();
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
  });

  const outingDispatchData: ModalProps = React.useMemo(() => ({
    label: "외출 추가",
    showCancelButton: true,
    confirmButtonText: "추가",
    inner: <Outing select={modalOuting} setSelect={setModalOuting} />,
    onConfirm: () => {
      if (
        !modalOuting.reason || !modalOuting.start || !modalOuting.end || !modalOuting.day
      ) {
        return alertModalDispatch({
          type: "show",
          data: {
            title: "어라라?",
            description: "모든 정보를 입력해주세요.",
          }
        });
      }
      if (modalOuting.start >= modalOuting.end) {
        return alertModalDispatch({
          type: "show",
          data: {
            title: "어라라?",
            description: "외출 시작 시간이 종료 시간보다 빠를 수 없어요.",
          }
        });
      }

      setOuting(p => ({
        ...p,
        [modalOuting.day]: [
          ...p[modalOuting.day],
          modalOuting,
        ],
      }));
      setModalOuting(initailOuting);
    },
    onCancle: () => {
      setModalOuting(initailOuting);
    },
  }), [...Object.values(modalOuting)]);
  const showOuting = () => { 
    modalDispatch({
      type: "show",
      data: outingDispatchData,
    });
  };
  React.useEffect(() => {
    modalDispatch({
      type: "update",
      data: outingDispatchData,
    });
  }, [outingDispatchData]);

  const disabled = React.useMemo(() => {
    return Boolean(isFetchingPut || loadingOuting);
  }, [isFetchingPut, loadingOuting]);

  return (
    <div className="flex flex-col gap-8 w-full">
      
      <div className="flex flex-col gap-4 px-4 w-full overflow-hidden">
        <p className="text-xl font-semibold transition-all whitespace-nowrap text-text dark:text-text-dark">외출 신청</p>
        {
          user.type === "teacher" ? (
            <SelectUser select={selected} setSelect={setSelected} />
          ) : null
        }
        <div className="flex flex-row items-start justify-between gap-4 w-full flex-wrap">
          <div className="flex flex-col gap-4">
            {
              Object.entries(outing).map(([day, outs]) => (
                <div key={day} className="flex flex-col items-start justify-start gap-1">
                  <p className="text-base font-medium transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">
                    {koreanWeekends[day as Weekend]}요일
                  </p>
                  <div className="flex flex-col items-start justify-start gap-0">
                    {
                      outs.length ? outs.map((out, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            const deleted = outing[day as keyof OutingType].filter((o) => o !== out);
                            setOuting({
                              ...outing,
                              [day]: deleted,
                            });
                          }}
                          className="flex flex-row items-center justify-start gap-0"
                        >
                          <p className="text-lg font-medium transition-all whitespace-nowrap text-text dark:text-text-dark">
                            {out.reason} ({out.start}~{out.end})
                          </p>
                          <svg className="w-6 h-6 -ml-0.5" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path className="fill-text dark:fill-text-dark" d="M12.8157 13.4622L9.91572 16.3622C9.73239 16.5455 9.49906 16.6372 9.21572 16.6372C8.93239 16.6372 8.69906 16.5455 8.51572 16.3622C8.33239 16.1789 8.24072 15.9455 8.24072 15.6622C8.24072 15.3789 8.33239 15.1455 8.51572 14.9622L11.4157 12.0622L8.51572 9.18721C8.33239 9.00387 8.24072 8.77054 8.24072 8.48721C8.24072 8.20387 8.33239 7.97054 8.51572 7.78721C8.69906 7.60387 8.93239 7.51221 9.21572 7.51221C9.49906 7.51221 9.73239 7.60387 9.91572 7.78721L12.8157 10.6872L15.6907 7.78721C15.8741 7.60387 16.1074 7.51221 16.3907 7.51221C16.6741 7.51221 16.9074 7.60387 17.0907 7.78721C17.2907 7.98721 17.3907 8.22471 17.3907 8.49971C17.3907 8.77471 17.2907 9.00387 17.0907 9.18721L14.1907 12.0622L17.0907 14.9622C17.2741 15.1455 17.3657 15.3789 17.3657 15.6622C17.3657 15.9455 17.2741 16.1789 17.0907 16.3622C16.8907 16.5622 16.6532 16.6622 16.3782 16.6622C16.1032 16.6622 15.8741 16.5622 15.6907 16.3622L12.8157 13.4622Z" />
                          </svg>

                        </button>
                      )) : (
                        <p className="text-lg font-medium transition-all whitespace-nowrap text-text dark:text-text-dark">
                          {loadingOuting ? "외출 정보를 불러오는 중..." : "없음"}
                        </p>
                      )
                    }
                  </div>
                </div>
              ))
            }
          </div>
          <div>
            <button
              className="bg-text dark:bg-text-dark px-6 py-3 rounded-xl"
              onClick={showOuting}
              disabled={disabled}
            >
              <p className="text-white dark:text-white-dark">추가하기</p>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 w-full overflow-hidden">
        <p className="text-xl font-semibold transition-all whitespace-nowrap text-text dark:text-text-dark">급식 신청</p>
        {
          weekends.map((day) => (
            <div className="flex flex-col gap-2" key={day}>
              <p className="text-base font-medium transition-all whitespace-nowrap text-text/40 dark:text-text-dark/50">
                {koreanWeekends[day]}요일
              </p>
              <div className={[
                "flex flex-row items-center justify-between",
                loadingOuting ? "opacity-50" : "",
              ].join(" ")}>
                {
                  meals.map((thisMeal) => (
                    <button
                      className={[
                        "flex flex-row items-center justify-start gap-1 w-full transition-opacity -my-2 py-2",
                        meal[day][thisMeal] ? "opacity-100" : "opacity-30",
                      ].join(" ")}
                      key={thisMeal}
                      onClick={() => {
                        setMeal(p => ({
                          ...p,
                          [day]: {
                            ...p[day],
                            [thisMeal]: !p[day][thisMeal],
                          },
                        }));
                      }}
                      disabled={disabled}
                    >
                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {
                          meal[day][thisMeal] ? (
                            <path className="fill-text dark:fill-text-dark" d="M5.4585 21.3165C4.9085 21.3165 4.43766 21.1207 4.046 20.729C3.65433 20.3374 3.4585 19.8665 3.4585 19.3165V5.31653C3.4585 4.76653 3.65433 4.2957 4.046 3.90403C4.43766 3.51236 4.9085 3.31653 5.4585 3.31653H17.9335C18.2168 3.31653 18.4543 3.41236 18.646 3.60403C18.8377 3.79569 18.9335 4.03319 18.9335 4.31653C18.9335 4.59986 18.8377 4.83736 18.646 5.02903C18.4543 5.22069 18.2168 5.31653 17.9335 5.31653H5.4585V19.3165H19.4585V12.8165C19.4585 12.5332 19.5543 12.2957 19.746 12.104C19.9377 11.9124 20.1752 11.8165 20.4585 11.8165C20.7418 11.8165 20.9793 11.9124 21.171 12.104C21.3627 12.2957 21.4585 12.5332 21.4585 12.8165V19.3165C21.4585 19.8665 21.2627 20.3374 20.871 20.729C20.4793 21.1207 20.0085 21.3165 19.4585 21.3165H5.4585ZM11.9835 14.5165L20.4835 6.01653C20.6668 5.8332 20.8918 5.74153 21.1585 5.74153C21.4252 5.74153 21.6585 5.8332 21.8585 6.01653C22.0585 6.19986 22.1585 6.4332 22.1585 6.71653C22.1585 6.99986 22.0585 7.24153 21.8585 7.44153L12.6835 16.6165C12.4835 16.8165 12.2502 16.9165 11.9835 16.9165C11.7168 16.9165 11.4835 16.8165 11.2835 16.6165L7.0335 12.3665C6.85016 12.1832 6.7585 11.9499 6.7585 11.6665C6.7585 11.3832 6.85016 11.1499 7.0335 10.9665C7.21683 10.7832 7.45016 10.6915 7.7335 10.6915C8.01683 10.6915 8.25016 10.7832 8.4335 10.9665L11.9835 14.5165Z" />
                          ) : (
                            <path className="fill-text dark:fill-text-dark" d="M5.4585 21.3165C4.9085 21.3165 4.43766 21.1207 4.046 20.729C3.65433 20.3374 3.4585 19.8665 3.4585 19.3165V5.31653C3.4585 4.76653 3.65433 4.2957 4.046 3.90403C4.43766 3.51236 4.9085 3.31653 5.4585 3.31653H19.4585C20.0085 3.31653 20.4793 3.51236 20.871 3.90403C21.2627 4.2957 21.4585 4.76653 21.4585 5.31653V19.3165C21.4585 19.8665 21.2627 20.3374 20.871 20.729C20.4793 21.1207 20.0085 21.3165 19.4585 21.3165H5.4585ZM5.4585 19.3165H19.4585V5.31653H5.4585V19.3165Z" />
                          )
                        }
                      </svg>
                      <p className="text-lg font-medium transition-all whitespace-nowrap text-text dark:text-text-dark">
                        {koreanMeals[thisMeal]}
                      </p>
                    </button>
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>

      <div className="w-full px-4">
        <button
          className={[
            "p-3 bg-text dark:bg-text-dark text-white dark:text-white-dark rounded-xl font-semibold w-full transition-all",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          ].join(" ")}
          onClick={!user.id ? needLogin : () => refetchPut()}
          disabled={disabled}
        >
          {
            isFetchingPut ? "신청 중..." : "신청하기"
          }
        </button>
      </div>
    </div>
  );
};

export default StayOuting;