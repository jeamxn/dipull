import { useRouter } from "next/navigation";
import React from "react";

import { useAlertModalDispatch } from "@/components/AlertModal";
import { useConfirmModalDispatch } from "@/components/ConfirmModal";
import { UserContext } from "@/components/providers/UserProvider";
import { getUserInfo } from "@/utils/cookies";
import { defaultUser, UserInfo } from "@/utils/db/utils";

const useAuth = () => { 
  const router = useRouter();
  const confirmModalDispatch = useConfirmModalDispatch();
  const alertModalDispatch = useAlertModalDispatch();
  // const [user, setUser] = React.useState<UserInfo>(defaultUser);
  const user = React.useContext(UserContext);

  // React.useEffect(() => {
  //   setUser(getUserInfo());
  // }, []);

  // const refreshUser = () => { 
  //   setUser(getUserInfo());
  // };
  const login = () => {
    router.push(`${process.env.NEXT_PUBLIC_DIMIGOIN_URI}/oauth?client=${process.env.NEXT_PUBLIC_DIMIGOIN_KEY}&redirect=${window.location.origin}/auth`);
  };
  const logout = () => { 
    window.location.href = "/auth/logout";
  };
  const onlyStudent = () => {
    alertModalDispatch({
      type: "show",
      data: {
        title: "학생 전용 서비스입니다.",
        description: "학생 전용 서비스입니다. 학생 계정으로 로그인해주세요.",
      }
    });
  };
  const onlyTeacher = () => { 
    alertModalDispatch({
      type: "show",
      data: {
        title: "교사 전용 서비스입니다.",
        description: "교사 전용 서비스입니다. 교사 계정으로 로그인해주세요.",
      }
    });
  };
  const needLogin = () => {
    confirmModalDispatch({
      type: "show",
      data: {
        title: "로그인이 필요합니다.",
        description: "로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?",
        onConfirm: () => {
          login();
        }
      }
    });
  };

  return { needLogin, login, logout, user, onlyStudent, onlyTeacher };
};

export default useAuth;