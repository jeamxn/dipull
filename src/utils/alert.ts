import { Id, ToastContent, ToastOptions, TypeOptions, UpdateOptions, Zoom, toast } from "react-toastify";

const defaultOptions: ToastOptions = {
  transition: Zoom,
  position: "top-left",
  autoClose: 1500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: "light",
  closeButton: false,
};

const warn = (message: ToastContent, options?: ToastOptions) => {
  return toast.warn(message, { ...defaultOptions, ...options });
};

const error = (message: ToastContent, options?: ToastOptions) => {
  return toast.error(message, { ...defaultOptions, ...options });
};

const success = (message: ToastContent, options?: ToastOptions) => {
  return toast.success(message, { ...defaultOptions, ...options });
};

const loading = (message: ToastContent, options?: ToastOptions) => {
  return toast.loading(message, { ...defaultOptions, ...options });
};

const info = (message: ToastContent, options?: ToastOptions) => {
  return toast.info(message, { ...defaultOptions, ...options });
};

const update = (id: Id, message: ToastContent, type?: TypeOptions, options?: UpdateOptions) => {
  if(type)
    return toast.update(id, { render: message, ...defaultOptions, ...options, type, isLoading: false });
  else
    return toast.update(id, { render: message, ...defaultOptions, ...options });
};

const done = (id: Id) => { 
  return toast.done(id);
};
interface NotificationOptions {
  badge?: string;
  body?: string;
  data?: any;
  dir?: "auto" | "ltr" | "rtl";
  icon?: string;
  lang?: string;
  requireInteraction?: boolean;
  silent?: boolean | null;
  tag?: string;
}

const nofitication = ({
  url,
  message,
  options,
  toToastify, 
  onGranted = true,
  noError = false,
}: {
  url?: string;
  message: string;
  options?: NotificationOptions;
  toToastify?: {
    toastifyType: "warn" | "error" | "success" | "loading" | "info";
    options?: ToastOptions;
  } | {
    toastifyType: "update";
    id: Id;
    type?: TypeOptions;
    options?: UpdateOptions;
  }, 
  onGranted?: boolean;
  noError?: boolean;
}) => {
  const notify = () => {
    const notification = new window.Notification(message, { icon: "/favicon.ico", ...options });
    notification.onclick = () => {
      window.open(url || window.location.href, "_blank");
    };
  };
  if (!("Notification" in window)) {
    if(noError) return false;
    if(toToastify) {
      if(toToastify.toastifyType === "update") {
        update(toToastify.id, message, toToastify.type, toToastify.options);
      }
      else {
        toast[toToastify.toastifyType](message, { ...defaultOptions, ...toToastify.options });
      }
    }
    else alert.warn("이 브라우저는 알림을 지원하지 않습니다.");
    return false;
  }
  else if(window.Notification.permission === "denied") {
    if(noError) return false;
    if(toToastify) {
      if(toToastify.toastifyType === "update") {
        update(toToastify.id, message, toToastify.type, toToastify.options);
      }
      else {
        toast[toToastify.toastifyType](message, { ...defaultOptions, ...toToastify.options });
      }
    }
    else alert.warn("알림이 거부되어 있습니다.");
    return false;
  }
  else if (window.Notification.permission === "default") {
    window.Notification.requestPermission().then((permission) => {
      if(permission === "denied") {
        if(noError) return false;
        if(toToastify) {
          if(toToastify.toastifyType === "update") {
            update(toToastify.id, message, toToastify.type, toToastify.options);
          }
          else {
            toast[toToastify.toastifyType](message, { ...defaultOptions, ...toToastify.options });
          }
        }
        else alert.warn("알림을 거부하셨습니다.");
        return false;
      }
      else if(permission === "granted") {
        notify();
        return true;
      }
    });
  }
  else if(window.Notification.permission === "granted" && onGranted) {
    notify();
    return true;
  }
  return true;
};

export const alert = {
  warn,
  error,
  success,
  loading,
  update,
  info,
  nofitication,
  done,
};