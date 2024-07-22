import React from "react";

const Modal = ({
  label,
  show,
  setShow,
  children,
  showConfirmButton = true,
  confirmButtonText = "확인",
  showCancelButton = false,
  cancelButtonText = "취소",
  onClick,
}: {
  label?: string;
  show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    children?: React.ReactNode;
    confirmButtonText?: string;
    cancelButtonText?: string;
    showConfirmButton?: boolean;
    showCancelButton?: boolean;
    onClick?: (...any: any) => any | Promise<(...any: any) => any>;
}) => {
  return (
    <>
      <div
        className={[
          "absolute bottom-0 w-full h-full z-[99] bg-text/20 transition-all cursor-pointer",
          show ? "opacity-100 bg-text pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setShow(false)}
      />
      <div className={[
        "absolute bottom-0 w-full px-6 z-[100] bg-background border-t rounded-t-3xl pt-6 pb-safe-offset-6 transition-all",
        // show ? "translate-y-0 l" : "translate-y-full hidden",
        show ? "opacity-100 pointer-events-auto flex flex-col gap-4" : "opacity-0 pointer-events-none hidden",
      ].join(" ")}>
        <div className="flex flex-row items-center justify-center w-full">
          <div
            className="bg-text/15 dark:bg-text/30 w-16 h-1 cursor-pointer"
            onClick={() => setShow(false)}
          />
        </div>
        {
          label ? (
            <div className="w-full flex flex-row items-center justify-center">
              <p className="font-semibold text-lg">{label}</p>
            </div>
          ) : null
        }
        <div className="flex flex-col gap-0">
          {children}
        </div>
        {
          showCancelButton || showConfirmButton ? (
            <div className="w-full flex flex-row items-center justify-center gap-2">
              {
                showCancelButton ? (
                  <button
                    className="w-full text-text/80 rounded-lg px-4 py-3 font-medium border border-text/80 dark:border-text/20"
                    onClick={() => setShow(false)}
                  >
                    {cancelButtonText}
                  </button>
                ) : null
              }
              {
                showConfirmButton ? (
                  <button
                    className="w-full bg-text/80 text-white rounded-lg px-4 py-3 font-medium border border-text/80"
                    onClick={() => {
                      onClick?.(onclick?.arguments);
                      setShow(false);
                    }}
                  >
                    {confirmButtonText}
                  </button>
                ) : null
              }
            </div>
          ) : null
        }
      </div>
    </>
  );
};

export default Modal;