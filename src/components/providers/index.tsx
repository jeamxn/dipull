"use client";
import "moment/locale/ko";

import React from "react";

import CalenderModal from "../CalenderModal";
import ConfirmModal from "../ConfirmModal";
import Modal from "../Modal";
import MoreModal from "../MoreModal";
import Navigation from "../Navigation";

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
              {children}
            </CalenderModal>
          </MoreModal>
        </ConfirmModal>
      </Modal>
    </Navigation>
  );
};

export default Providers;