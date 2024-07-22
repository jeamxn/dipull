import React from "react";

const ConfirmModal = ({
  show,
  setShow,
  title,
  description,
  showConfirmButton = true,
  confirmButtonText = "확인",
  showCancelButton = true,
  cancelButtonText = "취소",
  onConfirm,
  onCancle,
}: {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  description?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  onConfirm?: (...any: any) => any | Promise<(...any: any) => any>;
  onCancle?: (...any: any) => any | Promise<(...any: any) => any>;
}) => {
  return (
    <div
      className={[
        "w-full h-full bg-text/20 absolute top-0 left-0 z-[99999] flex flex-col items-center justify-center",
        show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <div className="w-full flex flex-col items-center justify-center px-6">
        <div className="w-full bg-white rounded-2xl p-6 flex flex-col gap-4">
          <div className="w-full flex flex-col gap-2">
            {
              title ? (
                <p className="text-xl font-semibold">{title}</p>
              ) : null
            }
            {
              description ? (
                <p className="text-lg font-normal text-text/90">{description}</p>
              ) : null
            }
          </div>
          {
            showCancelButton || showConfirmButton ? (
              <div className="w-full flex flex-row gap-2">
                {
                  showCancelButton ? (
                    <button
                      className="rounded-lg bg-text/10 dark:bg-text/20 py-3 px-4 w-full"
                      onClick={() => {
                        onCancle?.(onclick?.arguments);
                        setShow(false);
                      }}
                    >
                      <p className="font-semibold text-lg text-text/60 dark:text-text/65 select-none">아니요</p>
                    </button>
                  ) : null
                }
                {
                  showConfirmButton ? (
                    <button
                      className="rounded-lg bg-text/80 py-3 px-4 w-full"
                      onClick={() => {
                        onConfirm?.(onclick?.arguments);
                        setShow(false);
                      }}
                    >
                      <p className="font-semibold text-lg text-white select-none">네</p>
                    </button>
                  ) : null
                
                }
              </div>
            ) : null
          }
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;