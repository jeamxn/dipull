"use client";

import React from "react";
import { ToastContainer } from "react-toastify";

const ToastProvider = ({ 
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        bodyClassName="bg-white"
        toastClassName="bg-white"
        className="bg-transparent"
      />
    </>
  );
};

export default ToastProvider;