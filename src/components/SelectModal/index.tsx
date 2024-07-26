"use client";

import React from "react";

import { useModalDispatch } from "../Modal";

export type SelectModalProps = {
  label?: string;
  placeholder?: string;
  options?: string[];
  optionValues?: any[];
  disables?: boolean[];
  value?: any;
  onConfirm?: (value?: any) => any | Promise<(value?: any) => any>;
  onCancle?: (value?: any) => any | Promise<(value?: any) => any>;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  autoClose?: boolean;
};

type SelectModalPropsWithShow = SelectModalProps & {
  show: boolean;
};

const initialState: SelectModalPropsWithShow = {
  show: false,
  label: "",
  placeholder: "",
  options: [],
  optionValues: [],
  disables: [],
  value: "",
  onConfirm: () => {},
  onCancle: () => {},
  confirmButtonText: "확인",
  cancelButtonText: "취소",
  showConfirmButton: true,
  showCancelButton: false,
  autoClose: false,
};

type SelectModalAction = {
  type: "show" | "hide" | "update";
  data?: SelectModalProps;
};

const SelectModalContext = React.createContext(initialState);
const SelectModalDispatchContext = React.createContext((action: SelectModalAction) => {});

export const useSelectModal = () => {
  return React.useContext(SelectModalContext);
};

export const useSelectModalDispatch = () => {
  return React.useContext(SelectModalDispatchContext);
};

const selectModalReducer = (state: SelectModalPropsWithShow, action: SelectModalAction) => {
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

const SelectModal = ({ 
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [selectModal, dispatch] = React.useReducer(selectModalReducer, initialState);
  const modalDispatch = useModalDispatch();
  
  const [selected, setSelected] = React.useState<any>(selectModal.value);

  React.useEffect(() => {
    const cur = selectModal.optionValues?.length ? selectModal.optionValues : selectModal.options;
    const finding = cur?.find((option) => option === selectModal.value) || "";
    setSelected(finding);
  }, [selectModal.show]);

  React.useEffect(() => { 
    modalDispatch({
      type: selectModal.show ? "show" : "hide",
      data: {
        label: selectModal.label,
        showConfirmButton: selectModal.showConfirmButton,
        confirmButtonText: selectModal.confirmButtonText,
        showCancelButton: selectModal.showCancelButton,
        cancelButtonText: selectModal.cancelButtonText,
        onConfirm: () => {
          selectModal.onConfirm?.(selected);
          dispatch({ type: "hide" });
        },
        onCancle: () => {
          selectModal.onCancle?.(selected);
          dispatch({ type: "hide" });
        },
        inner: selectModal.options?.length ? selectModal.options?.map((option, index) => {
          return (
            <div
              key={index}
              className={[
                "select-none w-full py-4 flex flex-row gap-2 items-center justify-start transition-all",
                selectModal.disables && selectModal.disables[index] ? "opacity-25 dark:opacity-40 cursor-not-allowed" : "cursor-pointer",
              ].join(" ")}
              onClick={() => {
                if (selectModal.disables && selectModal.disables[index]) return;
                setSelected(selectModal.optionValues?.[index] || option);
                if (selectModal.autoClose) {
                  selectModal.onConfirm?.(option);
                  dispatch({ type: "hide" });
                }
              }}
            >
              <svg className="w-4 h-4 transition-all" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                {
                  selected === (selectModal.optionValues?.[index] || option) ? (
                    <path className="fill-text dark:fill-text-dark" d="M8.00004 11.3335C8.92226 11.3335 9.70837 11.0085 10.3584 10.3585C11.0084 9.7085 11.3334 8.92238 11.3334 8.00016C11.3334 7.07794 11.0084 6.29183 10.3584 5.64183C9.70837 4.99183 8.92226 4.66683 8.00004 4.66683C7.07782 4.66683 6.29171 4.99183 5.64171 5.64183C4.99171 6.29183 4.66671 7.07794 4.66671 8.00016C4.66671 8.92238 4.99171 9.7085 5.64171 10.3585C6.29171 11.0085 7.07782 11.3335 8.00004 11.3335ZM8.00004 14.6668C7.07782 14.6668 6.21115 14.4918 5.40004 14.1418C4.58893 13.7918 3.88337 13.3168 3.28337 12.7168C2.68337 12.1168 2.20837 11.4113 1.85837 10.6002C1.50837 9.78905 1.33337 8.92238 1.33337 8.00016C1.33337 7.07794 1.50837 6.21127 1.85837 5.40016C2.20837 4.58905 2.68337 3.8835 3.28337 3.2835C3.88337 2.6835 4.58893 2.2085 5.40004 1.8585C6.21115 1.5085 7.07782 1.3335 8.00004 1.3335C8.92226 1.3335 9.78893 1.5085 10.6 1.8585C11.4112 2.2085 12.1167 2.6835 12.7167 3.2835C13.3167 3.8835 13.7917 4.58905 14.1417 5.40016C14.4917 6.21127 14.6667 7.07794 14.6667 8.00016C14.6667 8.92238 14.4917 9.78905 14.1417 10.6002C13.7917 11.4113 13.3167 12.1168 12.7167 12.7168C12.1167 13.3168 11.4112 13.7918 10.6 14.1418C9.78893 14.4918 8.92226 14.6668 8.00004 14.6668Z" />
                    
                  ) : (
                    <path className="fill-text dark:fill-text-dark" d="M8.00004 14.6668C7.07782 14.6668 6.21115 14.4918 5.40004 14.1418C4.58893 13.7918 3.88337 13.3168 3.28337 12.7168C2.68337 12.1168 2.20837 11.4113 1.85837 10.6002C1.50837 9.78905 1.33337 8.92238 1.33337 8.00016C1.33337 7.07794 1.50837 6.21127 1.85837 5.40016C2.20837 4.58905 2.68337 3.8835 3.28337 3.2835C3.88337 2.6835 4.58893 2.2085 5.40004 1.8585C6.21115 1.5085 7.07782 1.3335 8.00004 1.3335C8.92226 1.3335 9.78893 1.5085 10.6 1.8585C11.4112 2.2085 12.1167 2.6835 12.7167 3.2835C13.3167 3.8835 13.7917 4.58905 14.1417 5.40016C14.4917 6.21127 14.6667 7.07794 14.6667 8.00016C14.6667 8.92238 14.4917 9.78905 14.1417 10.6002C13.7917 11.4113 13.3167 12.1168 12.7167 12.7168C12.1167 13.3168 11.4112 13.7918 10.6 14.1418C9.78893 14.4918 8.92226 14.6668 8.00004 14.6668ZM8.00004 13.3335C9.48893 13.3335 10.75 12.8168 11.7834 11.7835C12.8167 10.7502 13.3334 9.48905 13.3334 8.00016C13.3334 6.51127 12.8167 5.25016 11.7834 4.21683C10.75 3.1835 9.48893 2.66683 8.00004 2.66683C6.51115 2.66683 5.25004 3.1835 4.21671 4.21683C3.18337 5.25016 2.66671 6.51127 2.66671 8.00016C2.66671 9.48905 3.18337 10.7502 4.21671 11.7835C5.25004 12.8168 6.51115 13.3335 8.00004 13.3335Z" />
                  )
                }
              </svg>
              <p className="text-text dark:text-text-dark">{option}</p>
            </div>
          );
        }) : (
          <div className="p-4 flex flex-row gap-1 items-center justify-center w-full">
            <p className="text-text/30 dark:text-text-dark/40">선택 가능한 옵션이 없습니다.</p>
          </div>
        ),
      },
    });
  }, [selected, ...Object.values(selectModal)]);

  return (
    <SelectModalContext.Provider value={selectModal}>
      <SelectModalDispatchContext.Provider value={dispatch}>
        {children}
      </SelectModalDispatchContext.Provider>
    </SelectModalContext.Provider>
  );
};

export default SelectModal;