import React from "react";

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
      <ConfirmModal>
        <MoreModal>
          <Modal>
            {children}
          </Modal>
        </MoreModal>
      </ConfirmModal>
    </Navigation>
  );
};

export default Providers;