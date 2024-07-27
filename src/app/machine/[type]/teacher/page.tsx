"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

import { MachineType, machineTypeToKorean } from "@/app/machine/[type]/utils";
import { useAlertModalDispatch } from "@/components/AlertModal";
import { useAuth } from "@/hooks";
import { Machine_Time } from "@/utils/db/utils";

import { Machine_list_Response } from "../list/[allow]/utils";

import MachineSetting from "./machineSetting";
import { MachineEditResponse } from "./set/utils";
import { Times, TimesResponse } from "./time/utils";
import { EditMachine } from "./utils";

const Machine = ({ params }: { params: { type: MachineType } }) => {
  const current_korean = machineTypeToKorean(params.type);
  const alertDispatch = useAlertModalDispatch();

  const [machines, setMachines] = React.useState<EditMachine[]>([]);
  const [times, setTimes] = React.useState<Times>({
    default: [],
    weekend: [],
  });

  const { isFetching: machinesLoading, refetch: refetchMachines } = useQuery({
    queryKey: ["machine_list_teacher", params.type],
    queryFn: async () => {
      const response = await axios.get<Machine_list_Response[]>(`/machine/${params.type}/list/teacher`);
      setMachines(response.data.map((machine) => ({
        code: machine.code,
        type: machine.type,
        name: machine.name,
        gender: machine.gender,
        allow: machine.allow,
      })));
      return response.data;
    },
    initialData: [],
  });

  const { isFetching: timesLoading, refetch: refetchTimes } = useQuery({
    queryKey: ["time_list_teacher", params.type],
    queryFn: async () => {
      const response = await axios.get<TimesResponse>(`/machine/${params.type}/teacher/time`);
      setTimes({
        default: response.data.data?.default || [],
        weekend: response.data.data?.weekend || [],
      });
      return response.data.data;
    },
    initialData: {
      default: [],
      weekend: [],
    },
  });

  const { refetch, isFetching } = useQuery({
    queryKey: ["machine_teacher_setting_put", params.type, machines, times],
    queryFn: async () => {
      const response = await axios.put<MachineEditResponse>(`/machine/${params.type}/teacher/set`, {
        machines,
        times,
      });
      alertDispatch({
        type: "show",
        data: {
          title: "수정 성공!",
          description: "기기 목록 및 시간이 수정되었어요.",
        }
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: false,
    retry: false,
  });

  const disabled = React.useMemo(() => { 
    return Boolean(machinesLoading || timesLoading || isFetching);
  }, [machinesLoading, timesLoading, isFetching]);

  return (
    <>
      <div className="flex flex-col gap-4 px-4 overflow-x-hidden">
        <p className="text-lg font-semibold text-text dark:text-text-dark">{current_korean}기 목록 설정</p>
        <div className="flex flex-col gap-2">
          {
            machinesLoading ? (
              <div className="w-full flex flex-col items-center justify-center">
                <p className="text-text/40 dark:text-text-dark/50">{current_korean}기 목록을 불러오는 중...</p>
              </div>
            ) : machines.length ? machines.map((machine, i) => (
              <MachineSetting
                key={i}
                machines={machines}
                setMachines={setMachines}
                machine={machine}
              />
            )) : null
          }
          <div className="flex flex-row items-center justify-center py-2">
            <button
              className="flex flex-row items-center justify-center gap-1 opacity-50 -my-2 py-2 -mx-5 px-5"
              onClick={() => {
                const newMachines = [...machines];
                newMachines.push({
                  code: "",
                  type: params.type,
                  name: "",
                  gender: "male",
                  allow: [],
                });
                setMachines(newMachines);
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="fill-text dark:fill-text-dark" d="M11 13V16C11 16.2833 11.0958 16.5208 11.2875 16.7125C11.4792 16.9042 11.7167 17 12 17C12.2833 17 12.5208 16.9042 12.7125 16.7125C12.9042 16.5208 13 16.2833 13 16V13H16C16.2833 13 16.5208 12.9042 16.7125 12.7125C16.9042 12.5208 17 12.2833 17 12C17 11.7167 16.9042 11.4792 16.7125 11.2875C16.5208 11.0958 16.2833 11 16 11H13V8C13 7.71667 12.9042 7.47917 12.7125 7.2875C12.5208 7.09583 12.2833 7 12 7C11.7167 7 11.4792 7.09583 11.2875 7.2875C11.0958 7.47917 11 7.71667 11 8V11H8C7.71667 11 7.47917 11.0958 7.2875 11.2875C7.09583 11.4792 7 11.7167 7 12C7 12.2833 7.09583 12.5208 7.2875 12.7125C7.47917 12.9042 7.71667 13 8 13H11ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" />
              </svg>
              <p className="text-text dark:text-text-dark">추가하기</p>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 px-4">
        <p className="text-lg font-semibold text-text dark:text-text-dark">{current_korean}기 시간 설정</p>
        {
          (["default", "weekend"] as Machine_Time["when"][]).map((key, i) => (
            <div className="flex flex-col gap-2" key={i}>
              <p className="text-lg font-semibold text-text dark:text-text-dark">
                {key === "default" ? "평일" : "주말"}
              </p>
              <div className="flex flex-col gap-2 bg-white dark:bg-white-dark p-4 rounded-xl">
                {
                  timesLoading ? (
                    <div className="w-full flex flex-col items-center justify-center">
                      <p className="text-text/40 dark:text-text-dark/50">{current_korean} 시간을 불러오는 중...</p>
                    </div>
                  ) : times?.[key].length ? times[key].map((time, j) => (
                    <div
                      key={j}
                      className="flex flex-row items-center justify-between gap-2 rounded"
                    >
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => {
                          const newTimes = { ...times };
                          newTimes[key][j] = e.target.value;
                          setTimes(newTimes);
                        }}
                        className="w-full p-3 bg-transparent text-text dark:text-text-dark rounded-xl font-semibold border border-text/20 dark:border-text-dark/30"
                      />
                      <button
                        className="flex flex-row items-center justify-center gap-1 opacity-50 -my-3 py-3 -mx-2 px-5"
                        onClick={() => {
                          const newTimes = { ...times };
                          newTimes[key].splice(j, 1);
                          setTimes(newTimes);
                        }}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path className="fill-text dark:fill-text-dark" d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17ZM14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17Z"/>
                        </svg>
                      </button>
                    </div>
                  )) : null
                }
                <div className="flex flex-row items-center justify-center py-2">
                  <button
                    className="flex flex-row items-center justify-center gap-1 opacity-50 -my-2 py-2 -mx-5 px-5"
                    onClick={() => {
                      const newTimes = { ...times };
                      newTimes[key].push("");
                      setTimes(newTimes);
                    }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path className="fill-text dark:fill-text-dark" d="M11 13V16C11 16.2833 11.0958 16.5208 11.2875 16.7125C11.4792 16.9042 11.7167 17 12 17C12.2833 17 12.5208 16.9042 12.7125 16.7125C12.9042 16.5208 13 16.2833 13 16V13H16C16.2833 13 16.5208 12.9042 16.7125 12.7125C16.9042 12.5208 17 12.2833 17 12C17 11.7167 16.9042 11.4792 16.7125 11.2875C16.5208 11.0958 16.2833 11 16 11H13V8C13 7.71667 12.9042 7.47917 12.7125 7.2875C12.5208 7.09583 12.2833 7 12 7C11.7167 7 11.4792 7.09583 11.2875 7.2875C11.0958 7.47917 11 7.71667 11 8V11H8C7.71667 11 7.47917 11.0958 7.2875 11.2875C7.09583 11.4792 7 11.7167 7 12C7 12.2833 7.09583 12.5208 7.2875 12.7125C7.47917 12.9042 7.71667 13 8 13H11ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" />
                    </svg>
                    <p className="text-text dark:text-text-dark">추가하기</p>
                  </button>
                </div>
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
          onClick={() => refetch()}
          disabled={disabled}
        >
          {
            isFetching ? "수정 중..." : "수정하기"
          }
        </button>
      </div>
    </>
  );
};

export default Machine;