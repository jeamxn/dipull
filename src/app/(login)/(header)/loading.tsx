import { usePathname } from "next/navigation";
import React from "react";
import { useRecoilState } from "recoil";

import { loadingAtom } from "@/utils/states";

const Loading = ({
  fixed = true,
}: {
  fixed?: boolean,
}) => {
  const [loading, setLoading] = useRecoilState(loadingAtom);

  const pathname = usePathname();
  const handleComplete = () => {
    setTimeout(() => { 
      setLoading(false);
    }, 500);
  };
  React.useEffect(() => {
    window.addEventListener("load", handleComplete);
    return () => {
      window.removeEventListener("load", handleComplete);
    };
  }, []);
  React.useEffect(() => {
    handleComplete();
  }, [pathname]);

  return (
    <div className={[
      "w-full h-[0.125rem]",
      fixed ? "fixed top-0 z-50" : "absolute bottom-0",
    ].join (" ")}>
      <div
        className={[
          "h-full rainbow ease-in-out transition-all",
          loading ? "w-full duration-500" : "w-0 transition-none",
        ].join(" ")}
      />
    </div>
  );
};

export default Loading;