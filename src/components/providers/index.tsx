"use client";
import "moment/locale/ko";
import React from "react";

import AlertModal from "../AlertModal";
import CalenderModal from "../CalenderModal";
import ConfirmModal from "../ConfirmModal";
import Modal from "../Modal";
import MoreModal from "../MoreModal";
import Navigation from "../Navigation";
import SelectModal from "../SelectModal";

import ReactQueryProvider from "./ReactQueryProvider";

const Providers = ({ 
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Navigation>
      <Modal>
        <ConfirmModal>
          <MoreModal>
            <CalenderModal>
              <SelectModal>
                <AlertModal>
                  <ReactQueryProvider>
                    {children}
                  </ReactQueryProvider>
                </AlertModal>
              </SelectModal>
            </CalenderModal>
          </MoreModal>
        </ConfirmModal>
      </Modal>
    </Navigation>
  );
};

export default Providers;