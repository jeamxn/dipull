import React from "react";

import ConfirmModal from "../ConfirmModal";
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
          {children}
        </MoreModal>
      </ConfirmModal>
    </Navigation>
  );
};

export default Providers;