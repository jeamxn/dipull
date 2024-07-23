"use client";

import React from "react";

type ModalProps = {
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
  type: "show" | "hide";
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
      ...state,
      ...action.data,
      show: true,
    };
  case "hide":
    return {
      ...state,
      show: false,
    };
  default:
    return state;
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
            "absolute bottom-0 w-full h-full z-[99] bg-text/20 transition-all cursor-pointer",
            modal.show ? "opacity-100 bg-text pointer-events-auto" : "opacity-0 pointer-events-none",
          ].join(" ")}
          onClick={() => {
            modal.onCancle?.(onclick?.arguments);
            // setShow(false);
            dispatch({ type: "hide" });
          }}
        />
        <div className={[
          "absolute bottom-0 w-full px-6 z-[100] bg-background border-t rounded-t-3xl pt-6 pb-safe-offset-6 transition-all max-h-[80dvh]",
          // show ? "translate-y-0 l" : "translate-y-full hidden",
          modal.show ? "opacity-100 pointer-events-auto flex flex-col gap-4" : "opacity-0 pointer-events-none hidden",
        ].join(" ")}>
          <div className="flex flex-row items-center justify-center w-full">
            <div
              className="bg-text/15 dark:bg-text/30 w-16 h-1 cursor-pointer"
            />
          </div>
          {
            modal.label ? (
              <div className="w-full flex flex-row items-center justify-center">
                <p className="font-semibold text-lg">{modal.label}</p>
              </div>
            ) : null
          }
          <div className="flex flex-col gap-0 overflow-y-auto overflow-x-hidden items-center w-full">
            {modal.inner}
          </div>
          {
            modal.showCancelButton || modal.showConfirmButton ? (
              <div className="w-full flex flex-row items-center justify-center gap-2">
                {
                  modal.showCancelButton ? (
                    <button
                      className="w-full text-text rounded-lg px-4 py-3 font-medium border border-text dark:border-text/20"
                      onClick={() => {
                        modal.onCancle?.(onclick?.arguments);
                      // setShow(false);
                      }}
                    >
                      {modal.cancelButtonText}
                    </button>
                  ) : null
                }
                {
                  modal.showConfirmButton ? (
                    <button
                      className="w-full bg-text text-white rounded-lg px-4 py-3 font-medium border border-text"
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