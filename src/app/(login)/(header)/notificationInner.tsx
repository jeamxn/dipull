import { useRouter } from "next/navigation";
import React from "react";

import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

import NotificationButton from "./notificationButton";

const NotificationInner = ({
  init,
  isClicked,
  setIsClicked,
  isRead,
  setIsRead,
}: {
  init: string[];
  isClicked: boolean;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
  isRead: boolean;
  setIsRead: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isBlock, setIsBlock] = React.useState(false);
  const [notificationPermission, setNotificationPermission] = React.useState<"default" | "denied" | "granted">("default");
  const [rejectList, setRejectList] = React.useState<string[]>(init);
  const [isFirst, setIsFirst] = React.useState(true);

  React.useEffect(() => { 
    if (isFirst) return setIsFirst(false);
    console.log(rejectList);
    changeRejectList();
  }, [rejectList]);

  const changeRejectList = async () => { 
    // setLoading(true);
    const loading = alert.loading("알림 설정을 변경하는 중입니다.");
    try {
      const { data } = await instance.post("/api/push/reject", {
        reject: rejectList,
      });
      // await getHosilData();
      alert.update(loading, data.message, "success");
      router.refresh();
    } catch (e: any) {
      alert.update(loading, e.response.data.message, "error");
    }
    // setLoading(false);
  };

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    setNotificationPermission(window.Notification.permission);
  }, [window.Notification.permission]);

  const allow = () => {
    window.Notification.requestPermission();
    alert.nofitication({
      message: "알림을 허용했습니다.",
      options: {
        body: "알림을 허용했습니다.",
      },
      onGranted: true,
      noError: false,
    });
  };

  React.useEffect(() => {
    async function setupPushNotifications() {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          const registration = await navigator.serviceWorker.register("/service-worker.js");
          console.log("Service Worker 등록 성공:", registration.scope);
          const existingSubscription = await registration.pushManager.getSubscription();
          if (existingSubscription) {
            await existingSubscription.unsubscribe();
            console.log("기존 구독 해제됨");
          }
          const response = await instance.get("/api/push/vapid");
          const { publicKey }: { publicKey: string } = response.data;

          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: publicKey
          });
          await instance.post("/api/push/subscribe", subscription);
          await instance.post("/api/push/subscribe", subscription);
          console.log("새 구독 완료");
        } catch (err) {
          console.error("Push 알림 설정 실패:", err);
        }
      }
    }

    setupPushNotifications();
  }, []);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if(isClicked) {
      setIsBlock(true);
    }
    else {
      timer = setTimeout(() => {
        setIsBlock(false);
      }, 300);
    }
    return () => clearTimeout(timer);
  }, [isClicked]);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if(
        !(e.target as HTMLElement).closest(".notification-icon") 
        && !(e.target as HTMLElement).closest(".notification")
      ) {
        setIsClicked(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <div 
        className={[
          "mt-safe bg-white absolute top-[3.6rem] right-0 z-50 notification w-[100vw] max-w-96 border border-text/10 rounded flex-col transition-opacity duration-300 overflow-y-auto h-[36rem] shadow-xl",
          "max-[520px]:rounded-none max-[520px]:top-[3.3rem] max-[520px]:max-w-[100vw] max-[520px]:fixed max-[520px]:h-[calc(100vh-3.3rem)] max-[520px]:bg-background",
          "p-4 flex flex-col gap-4",
          isBlock ? "flex" : "hidden",
          isClicked ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        <div className="flex flex-row items-center gap-1">
          <h1 className="text-xl font-semibold">알림 설정</h1>          
        </div>
        {
          notificationPermission === "granted" ? (
            <>
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-medium">세탁/건조 시작</h1>
                <div className="flex flex-row gap-2 bg-white border border-text/10 rounded p-3">
                  <NotificationButton
                    rejectList={rejectList}
                    setRejectList={setRejectList}
                    type={["machine-washer-start-30", "machine-dryer-start-30"]}
                    text="30분 전"
                  />
                  <NotificationButton
                    rejectList={rejectList}
                    setRejectList={setRejectList}
                    type={["machine-washer-start-10", "machine-dryer-start-10"]}
                    text="10분 전"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-medium">세탁/건조 종료</h1>
                <div className="flex flex-row gap-2 bg-white border border-text/10 rounded p-3">
                  <NotificationButton
                    rejectList={rejectList}
                    setRejectList={setRejectList}
                    type={["machine-washer-end-10", "machine-dryer-end-10"]}
                    text="10분 전"
                  />
                  <NotificationButton
                    rejectList={rejectList}
                    setRejectList={setRejectList}
                    type={["machine-washer-end-5", "machine-dryer-end-5"]}
                    text="5분 전"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-medium">급식 (기능 추가 예정)</h1>
                <div className="flex flex-row gap-2 bg-white border border-text/10 rounded p-3">
                  <NotificationButton
                    rejectList={rejectList}
                    setRejectList={setRejectList}
                    type="meal-breakfast"
                    text="아침"
                  />
                  <NotificationButton
                    rejectList={rejectList}
                    setRejectList={setRejectList}
                    type="meal-lunch"
                    text="점심"
                  />
                  <NotificationButton
                    rejectList={rejectList}
                    setRejectList={setRejectList}
                    type="meal-dinner"
                    text="저녁"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-medium">기타</h1>
                <div className="flex flex-col gap-2 bg-white border border-text/10 rounded p-3">
                  <div className="flex flex-row gap-2">
                    <NotificationButton
                      rejectList={rejectList}
                      setRejectList={setRejectList}
                      type="bamboo-comment"
                      text="대숲 댓글"
                    />
                    <NotificationButton
                      rejectList={rejectList}
                      setRejectList={setRejectList}
                      type={["3rd-grade-students-stay", "all-students-stay"]}
                      text="잔류 마감"
                    />
                  </div>
                  <div className="flex flex-row gap-2">
                    <NotificationButton
                      rejectList={rejectList}
                      setRejectList={setRejectList}
                      type="teacher-send"
                      text="선생님 전송"
                    />
                    <NotificationButton
                      rejectList={rejectList}
                      setRejectList={setRejectList}
                      type="admin-send"
                      text="관리자 전송"
                    />
                  </div>
                  <NotificationButton
                    rejectList={rejectList}
                    setRejectList={setRejectList}
                    type="timetable"
                    text="시간표 (기능 추가 예정)"
                  />
                </div>
              </div>
            </>
          ) : (
            <button className="flex flex-col items-center justify-center" onClick={allow}>
              <p className="text-sm text-primary underline">알림이 거부되어 있습니다.</p>
              <p className="text-sm text-primary underline">디바이스 또는 브라우저 설정에서 허용해주세요.</p>
            </button>
          )
        }
      </div>
    </>
  );
};

export default NotificationInner;