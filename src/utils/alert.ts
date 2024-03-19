import { ToastOptions, Zoom, toast } from "react-toastify";

const defaultOptions: ToastOptions = {
  transition: Zoom,
};

const warn = (message: string, options?: ToastOptions) => {
  toast.warn(message, { ...defaultOptions, ...options });
};

const error = (message: string, options?: ToastOptions) => {
  toast.error(message, { ...defaultOptions, ...options });
};

const success = (message: string, options?: ToastOptions) => {
  toast.success(message, { ...defaultOptions, ...options });
};

export const alert = {
  warn,
  error,
  success,
};