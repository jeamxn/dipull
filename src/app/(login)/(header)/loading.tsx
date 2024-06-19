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
  const [end, setEnd] = React.useState(true);

  React.useEffect(() => { 
    if (loading) {
      setEnd(false);
    }
  }, [loading]);

  const pathname = usePathname();
  const handleComplete = () => {
    // if (!loading) return;
    setEnd(true);
    setTimeout(() => { 
      setLoading(false);
      setEnd(false);
    }, 200);
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
      "w-full",
      fixed ? "fixed top-0 z-50" : "absolute bottom-0"
    ].join (" ")}>
      <div
        className={[
          "border-primary border-b-2 ease-in-out transition-all",
          end ? "w-full duration-200" : loading ? "w-10/12 duration-[5s]" : "w-0 transition-none",
        ].join(" ")}
      />
    </div>
  );
};

export default Loading;