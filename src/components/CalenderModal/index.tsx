"use client";

import moment, { Moment } from "moment";
import React from "react";

import { useModalDispatch } from "../Modal";

import Calender from "./calender";

type CalenderModalProps = {
  label?: string;
  value?: Moment;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  onConfirm?: (date: Moment) => any | Promise<(date: Moment) => any>;
  onCancle?: (date: Moment) => any | Promise<(date: Moment) => any>;
};

type CalenderModalPropsWithShow = CalenderModalProps & {
  show: boolean;
};

const initialState: CalenderModalPropsWithShow = {
  show: false,
  label: "",
  value: moment(),
  confirmButtonText: "확인",
  cancelButtonText: "취소",
  showConfirmButton: true,
  showCancelButton: false,
  onConfirm: () => { },
  onCancle: () => { },
};

type CalenderModalAction = {
  type: "show" | "hide" | "update";
  data?: CalenderModalProps;
};

const CalenderModalContext = React.createContext(initialState);
const CalenderModalDispatchContext = React.createContext((action: CalenderModalAction) => {});

export const useCalenderModal = () => {
  return React.useContext(CalenderModalContext);
};

export const useCalenderModalDispatch = () => {
  return React.useContext(CalenderModalDispatchContext);
};

const calenderModalReducer = (state: CalenderModalPropsWithShow, action: CalenderModalAction) => {
  switch (action.type) {
  case "show":
    return {
      ...initialState,
      ...action.data,
      show: true,
    };
  case "hide":
    return {
      ...state,
      show: false,
    };
  case "update":
    return {
      ...state,
      ...action.data,
    };
  default:
    return state;
  }
};

const CalenderModal = ({ 
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [calenderModal, dispatch] = React.useReducer(calenderModalReducer, initialState);
  const modalDispatch = useModalDispatch();
  const [selected, setSelected] = React.useState<Moment>(calenderModal.value || moment());

  React.useEffect(() => { 
    setSelected(calenderModal.value || moment());
  }, [calenderModal.show]);

  React.useEffect(() => { 
    modalDispatch({
      type: calenderModal.show ? "show" : "hide",
      data: {
        label: "날짜 선택",
        showCancelButton: true,
        cancelButtonText: "취소",
        confirmButtonText: "선택",
        onConfirm: () => {
          calenderModal.onConfirm?.(selected);
          console.log(selected.format("YYYY-MM-DD"));
          dispatch({ type: "hide" });
        },
        onCancle: () => {
          calenderModal.onCancle?.(selected);
          dispatch({ type: "hide" });
        },
        inner: (
          <div className="w-full flex flex-row items-start justify-center overflow-y-auto overflow-x-hidden">
            <Calender
              show={calenderModal.show}
              value={calenderModal.value}
              seleted={selected}
              setSelected={setSelected}
            />
          </div>
        )
      },
    });
  }, [selected, ...Object.values(calenderModal)]);

  return (
    <CalenderModalContext.Provider value={calenderModal}>
      <CalenderModalDispatchContext.Provider value={dispatch}>
        {children}
      </CalenderModalDispatchContext.Provider>
    </CalenderModalContext.Provider>
  );
};

export default CalenderModal;