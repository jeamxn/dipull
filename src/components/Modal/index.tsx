"use client";

import React from "react";

export type ModalProps = {
  label?: string;
  inner?: React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  onConfirm?: (...any: any) => any | Promise<(...any: any) => any>;
  onCancle?: (...any: any) => any | Promise<(...any: any) => any>;
};

type ModalPropsWithShow = ModalProps & {
  show: boolean;
};

const initialState: ModalPropsWithShow = {
  show: false,
  label: "",
  inner: null,
  confirmButtonText: "확인",
  cancelButtonText: "취소",
  showConfirmButton: true,
  showCancelButton: false,
  onConfirm: () => { },
  onCancle: () => { },
};

type ModalAction = {
  type: "show" | "hide" | "update";
  data?: ModalProps;
};

const ModalContext = React.createContext(initialState);
const ModalDispatchContext = React.createContext((action: ModalAction) => {});

export const useModal = () => {
  return React.useContext(ModalContext);
};

export const useModalDispatch = () => {
  return React.useContext(ModalDispatchContext);
};

const modalReducer = (state: ModalPropsWithShow, action: ModalAction) => {
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
    return initialState;
  }
};

const Modal = ({ 
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [modal, dispatch] = React.useReducer(modalReducer, initialState);
  return (
    <ModalContext.Provider value={modal}>
      <ModalDispatchContext.Provider value={dispatch}>
        {children}
        <div
          className={[
            "absolute bottom-0 w-full h-full z-[99] bg-text/20 dark:bg-text-dark/25 transition-all cursor-pointer",
            modal.show ? "opacity-100 bg-text dark:bg-text-dark pointer-events-auto" : "opacity-0 pointer-events-none",
          ].join(" ")}
          onClick={() => {
            modal.onCancle?.(onclick?.arguments);
            // setShow(false);
            dispatch({ type: "hide" });
          }}
        />
        <div className={[
          "absolute bottom-0 w-full px-4 z-[100] bg-background dark:bg-background-dark border-t rounded-t-3xl pt-6 pb-safe-offset-6 transition-all max-h-[90dvh]",
          // show ? "translate-y-0 l" : "translate-y-full hidden",
          modal.show ? "opacity-100 pointer-events-auto flex flex-col gap-4" : "opacity-0 pointer-events-none hidden",
        ].join(" ")}>
          <div className="flex flex-row items-center justify-center w-full">
            <div
              className="bg-text/15 dark:bg-text-dark/30 w-16 h-1 cursor-pointer"
            />
          </div>
          {
            modal.label ? (
              <div className="w-full flex flex-row items-center justify-center">
                <p className="font-semibold text-lg text-text dark:text-text-dark">{modal.label}</p>
              </div>
            ) : null
          }
          <div className="flex flex-col gap-0 overflow-auto items-start w-full">
            {modal.inner}
          </div>
          {
            modal.showCancelButton || modal.showConfirmButton ? (
              <div className="w-full flex flex-row items-center justify-center gap-2">
                {
                  modal.showCancelButton ? (
                    <button
                      className="w-full text-text dark:text-text-dark rounded-xl px-4 py-3 font-medium border border-text dark:border-text-dark/20"
                      onClick={() => {
                        modal.onCancle?.(onclick?.arguments);
                        // setShow(false);
                        dispatch({ type: "hide" });
                      }}
                    >
                      {modal.cancelButtonText}
                    </button>
                  ) : null
                }
                {
                  modal.showConfirmButton ? (
                    <button
                      className="w-full bg-text dark:bg-text-dark text-white dark:text-white-dark rounded-xl px-4 py-3 font-medium border border-text dark:border-text-dark"
                      onClick={() => {
                        modal.onConfirm?.(onclick?.arguments);
                        // setShow(false);
                        dispatch({ type: "hide" });
                      }}
                    >
                      {modal.confirmButtonText}
                    </button>
                  ) : null
                }
              </div>
            ) : null
          }
        </div>
      </ModalDispatchContext.Provider>
    </ModalContext.Provider>
  );
};

export default Modal;