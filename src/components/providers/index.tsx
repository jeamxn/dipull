"use client";
import "moment/locale/ko";
import React from "react";

import { UserInfo } from "@/utils/db/utils";

import AlertModal from "../AlertModal";
import CalenderModal from "../CalenderModal";
import ConfirmModal from "../ConfirmModal";
import Modal from "../Modal";
import MoreModal from "../MoreModal";
import Navigation from "../Navigation";
import SelectModal from "../SelectModal";

import ReactQueryProvider from "./ReactQueryProvider";
import UserProvider from "./UserProvider";

const Providers = ({ 
  children,
  userInfo
}: Readonly<{
  children: React.ReactNode;
  userInfo: UserInfo;
}>) => {
  return (
    <UserProvider userInfo={userInfo}>
      <Modal>
        <ConfirmModal>
          <MoreModal>
            <CalenderModal>
              <SelectModal>
                <AlertModal>
                  <ReactQueryProvider>
                    <Navigation>
                      <Modal>
                        <ConfirmModal>
                          <MoreModal>
                            <CalenderModal>
                              <SelectModal>
                                <AlertModal>
                                  {children}
                                </AlertModal>
                              </SelectModal>
                            </CalenderModal>
                          </MoreModal>
                        </ConfirmModal>
                      </Modal>
                    </Navigation>
                  </ReactQueryProvider>
                </AlertModal>
              </SelectModal>
            </CalenderModal>
          </MoreModal>
        </ConfirmModal>
      </Modal>
    </UserProvider>
  );
};

export default Providers;