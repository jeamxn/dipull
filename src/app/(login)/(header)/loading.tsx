import React from "react";
import { useRecoilValue } from "recoil";

import { loadingAtom } from "@/utils/states";

const Loading = () => {
  const on = useRecoilValue(loadingAtom);
  const [percent, setPercent] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (on) {
      setLoading(true);
      const timer = setTimeout(() => {
        if(percent < 85)
          setPercent((prev) => prev + 1);
      }, 20);
      return () => clearTimeout(timer);
    }
    else {
      setPercent(0);
      setLoading(false);
    }
  }, [on, percent]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return loading ? (
    <div className="absolute bottom-0 w-full">
      <div
        className="border-primary border-b-2"
        style={{
          width: loading ? `${percent}%` : "0%",
        }}
      />
    </div>
  ) : null;
};

export default Loading;