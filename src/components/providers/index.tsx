"use client";
import "moment/locale/ko";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

import CalenderModal from "../CalenderModal";
import ConfirmModal from "../ConfirmModal";
import Modal from "../Modal";
import MoreModal from "../MoreModal";
import Navigation from "../Navigation";
import SelectModal from "../SelectModal";

const queryClient = new QueryClient();

const Providers = ({ 
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Navigation>
        <Modal>
          <ConfirmModal>
            <MoreModal>
              <CalenderModal>
                <SelectModal>
                  {children}
                </SelectModal>
              </CalenderModal>
            </MoreModal>
          </ConfirmModal>
        </Modal>
      </Navigation>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Providers;