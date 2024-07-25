"use client";

import React from "react";

export type MoreButton = {
  text: string;
  type: "default" | "blue" | "red";
  onClick?: (...any: any) => any | Promise<(...any: any) => any>;
};

type MoreModalProps = {
  buttons: MoreButton[];
};

type MoreModalPropsWithShow = MoreModalProps & {
  show: boolean;
};

const initialState: MoreModalPropsWithShow = {
  show: false,
  buttons: [],
};

type MoreModalAction = {
  type: "show" | "hide" | "update";
  data?: MoreModalProps;
};

const MoreModalContext = React.createContext(initialState);
const MoreModalDispatchContext = React.createContext((action: MoreModalAction) => {});

export const useMoreModal = () => {
  return React.useContext(MoreModalContext);
};

export const useMoreModalDispatch = () => {
  return React.useContext(MoreModalDispatchContext);
};

const confrimModalReducer = (state: MoreModalPropsWithShow, action: MoreModalAction) => {
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

const MoreModal = ({ 
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [modal, dispatch] = React.useReducer(confrimModalReducer, initialState);

  return (
    <MoreModalContext.Provider value={modal}>
      <MoreModalDispatchContext.Provider value={dispatch}>
        {children}
        <div
          className={[
            "w-full h-full bg-text/20 dark:bg-text-dark/25 absolute top-0 left-0 z-[99999] flex flex-col items-center justify-center transition-all",
            modal.show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          ].join(" ")}
          onClick={() => dispatch({ type: "hide" })}
        />
        <div
          className={[
            "w-full absolute bottom-safe-offset-6 left-0 z-[99999] flex flex-col items-center justify-center gap-3 transition-all",
            modal.show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <div className="w-full flex flex-col items-center justify-center px-4 ">
            <div className="w-full flex flex-col gap-0 items-center justify-center bg-background dark:bg-background-dark rounded-xl">
              {
                modal.buttons.map((button, index) => (
                  <React.Fragment key={index}>
                    {
                      index !== 0 ? (
                        <div className="w-full border-t border-text/10 dark:border-text-dark/20" />
                      ) : null
                    }
                    <div
                      className="w-full py-4 flex flex-row items-center justify-center cursor-pointer"
                      onClick={() => {
                        button.onClick?.();
                        dispatch({ type: "hide" });
                      }}
                    >
                      <p className={[
                        "font-normal",
                        button.type === "blue" ? "text-blue-700 dark:text-blue-400" : button.type === "red" ? "text-red-600 dark:text-red-300" : "text-text"
                      ].join(" ")}>{button.text}</p>
                    </div>
                  </React.Fragment>
                ))
              }
            </div>
          </div>
          <div className="w-full flex flex-col items-center justify-center px-4">
            <div
              className="w-full py-4 flex flex-row items-center justify-center bg-background dark:bg-background-dark rounded-xl cursor-pointer"
              onClick={() => dispatch({ type: "hide" })}
            >
              <p className="font-medium text-text dark:text-text-dark">닫기</p>
            </div>
          </div>
        </div>
      </MoreModalDispatchContext.Provider>
    </MoreModalContext.Provider>
  );
};

export default MoreModal;