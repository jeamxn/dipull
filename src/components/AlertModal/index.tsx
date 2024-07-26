"use client";

import React from "react";

type AlertModalProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  onAlert?: (...any: any) => any | Promise<(...any: any) => any>;
  onCancle?: (...any: any) => any | Promise<(...any: any) => any>;
};

type AlertModalPropsWithShow = AlertModalProps & {
  show: boolean;
};

const initialState: AlertModalPropsWithShow = {
  show: false,
  title: "",
  description: "",
  buttonText: "확인",
  onAlert: () => {},
  onCancle: () => {},
};

type AlertModalAction = {
  type: "show" | "hide" | "update";
  data?: AlertModalProps;
};

const AlertModalContext = React.createContext(initialState);
const AlertModalDispatchContext = React.createContext((action: AlertModalAction) => {});

export const useAlertModal = () => {
  return React.useContext(AlertModalContext);
};

export const useAlertModalDispatch = () => {
  return React.useContext(AlertModalDispatchContext);
};

const confrimModalReducer = (state: AlertModalPropsWithShow, action: AlertModalAction) => {
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

const AlertModal = ({ 
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [modal, dispatch] = React.useReducer(confrimModalReducer, initialState);

  return (
    <AlertModalContext.Provider value={modal}>
      <AlertModalDispatchContext.Provider value={dispatch}>
        {children}
        <div
          className={[
            "w-full h-full bg-text/20 dark:bg-text-dark/20 absolute top-0 left-0 z-[99999] flex flex-col items-center justify-center transition-all",
            modal.show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <div
            className="w-full h-full"
            onClick={() => {
              modal.onCancle?.();
              dispatch({
                type: "hide",
              });
            }}
          />
          <div className="w-full flex flex-col items-center justify-center px-4">
            <div className="w-full bg-background dark:bg-background-dark rounded-2xl p-6 flex flex-col gap-4">
              <div className="w-full flex flex-col gap-2">
                {
                  modal.title ? (
                    <p className="text-xl font-semibold text-text dark:text-text-dark">{modal.title}</p>
                  ) : null
                }
                <div className="w-full flex flex-col gap-0">
                  {
                    modal.description?.split("\n").length ? modal.description?.split("\n").map((e, i) => {
                      return (
                        <p key={i} className="text-lg font-normal text-text/90 dark:text-text-dark/90">{e}</p>
                      );
                    }) : null
                  }
                </div>
              </div>
              <div className="w-full flex flex-row gap-2 items-center justify-end">
                <button
                  className="-m-4 p-4"
                  onClick={() => {
                    modal.onAlert?.(onclick?.arguments);
                    dispatch({
                      type: "hide",
                    });
                  }}
                >
                  <p className="text-blue-600 dark:text-blue-500 text-lg font-semibold select-none px-1">{modal.buttonText}</p>
                </button>
              </div>
            </div>
          </div>
          <div
            className="w-full h-full"
            onClick={() => {
              modal.onCancle?.();
              dispatch({
                type: "hide",
              });
            }}
          />
        </div>
      </AlertModalDispatchContext.Provider>
    </AlertModalContext.Provider>
  );
};

export default AlertModal;