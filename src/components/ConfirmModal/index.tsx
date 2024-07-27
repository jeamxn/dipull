"use client";

import React from "react";

type ConfirmModalProps = {
  title?: string;
  description?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  onConfirm?: (...any: any) => any | Promise<(...any: any) => any>;
  onCancle?: (...any: any) => any | Promise<(...any: any) => any>;
};

type ConfirmModalPropsWithShow = ConfirmModalProps & {
  show: boolean;
};

const initialState: ConfirmModalPropsWithShow = {
  show: false,
  title: "",
  description: "",
  confirmButtonText: "네",
  cancelButtonText: "아니요",
  showConfirmButton: true,
  showCancelButton: true,
  onConfirm: () => {},
  onCancle: () => {},
};

type ConfirmModalAction = {
  type: "show" | "hide" | "update";
  data?: ConfirmModalProps;
};

const ConfirmModalContext = React.createContext(initialState);
const ConfirmModalDispatchContext = React.createContext((action: ConfirmModalAction) => {});

export const useConfirmModal = () => {
  return React.useContext(ConfirmModalContext);
};

export const useConfirmModalDispatch = () => {
  return React.useContext(ConfirmModalDispatchContext);
};

const confrimModalReducer = (state: ConfirmModalPropsWithShow, action: ConfirmModalAction) => {
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

const ConfirmModal = ({ 
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [modal, dispatch] = React.useReducer(confrimModalReducer, initialState);

  return (
    <ConfirmModalContext.Provider value={modal}>
      <ConfirmModalDispatchContext.Provider value={dispatch}>
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
              {
                modal.showCancelButton || modal.showConfirmButton ? (
                  <div className="w-full flex flex-row gap-2">
                    {
                      modal.showCancelButton ? (
                        <button
                          className="rounded-lg bg-text/10 dark:bg-text-dark/20 py-3 px-4 w-full"
                          onClick={() => {
                            modal.onCancle?.(onclick?.arguments);
                            // modal.setShow(false);
                            dispatch({
                              type: "hide",
                            });
                          }}
                        >
                          <p className="font-semibold text-lg text-text/60 dark:text-text-dark/65 select-none">{modal.cancelButtonText}</p>
                        </button>
                      ) : null
                    }
                    {
                      modal.showConfirmButton ? (
                        <button
                          className="rounded-lg bg-text dark:bg-text-dark py-3 px-4 w-full"
                          onClick={() => {
                            modal.onConfirm?.(onclick?.arguments);
                            dispatch({
                              type: "hide",
                            });
                          }}
                        >
                          <p className="font-semibold text-lg text-white dark:text-white-dark select-none">{modal.confirmButtonText}</p>
                        </button>
                      ) : null
                    }
                  </div>
                ) : null
              }
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
      </ConfirmModalDispatchContext.Provider>
    </ConfirmModalContext.Provider>
  );
};

export default ConfirmModal;