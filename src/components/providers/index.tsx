import React from "react";

import ConfirmModal from "../ConfirmModal";
import Navigation from "../Navigation";

const Providers = ({ 
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Navigation>
      <ConfirmModal>
        {children}
      </ConfirmModal>
    </Navigation>
  );
};

export default Providers;