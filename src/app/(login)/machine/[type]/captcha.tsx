/* eslint-disable @next/next/no-img-element */
import { isNaN } from "lodash";
import moment from "moment";
import React from "react";
import { useRecoilValue } from "recoil";

import instance from "@/utils/instance";
import { darkModeAtom } from "@/utils/states";

const Captcha = ({
  setShowRecaptcha,
  submit,
}: {
  submit?: (id: string, recaptcha: string) => any;
  setShowRecaptcha: React.Dispatch<React.SetStateAction<boolean>>;
}) => { 
  const [loading, setLoading] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [captcha, setCaptcha] = React.useState({
    id: "",
    image: "",
    until: "",
  });
  const isDarkMode = useRecoilValue(darkModeAtom);
  const [left, setLeft] = React.useState(-1);

  const getCaptcha = async () => { 
    setLoading(true);
    try {
      const res = await instance.get(`/api/captcha/json/${isDarkMode ? "dark" : "light"}`);
      setCaptcha(res.data);
      setInput("");
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };
  React.useEffect(() => { getCaptcha(); }, [isDarkMode]);

  React.useEffect(() => {
    const intv = () => {
      const now = moment();
      const until = moment(captcha.until, "YYYY-MM-DD HH:mm:ss");
      const diff = until.diff(now);
      if (diff <= 0) return getCaptcha();
      setLeft(Math.max(0, Math.floor(diff / 1000)));
    };
    intv();
    const interval = setInterval(intv, 1000);
    return () => clearInterval(interval);
  }, [captcha]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex flex-col items-center bg-text/20 dark:bg-white/70 justify-center z-50"
    >
      <div className="bg-background px-4 py-5 rounded shadow-xl flex flex-col items-center justify-center gap-2">
        <p className="text-primary font-bold text-lg">자동 입력 방지 {left === -1 && !isNaN(left) ? "" : `(${left}초 남음)`}</p>
        <div className={[
          "w-80 h-[97px] border border-text/10 rounded bg-white overflow-hidden",
          loading ? "loading_background" : "",
        ].join(" ")}>  
          {
            captcha.image ? <img
              src={captcha.image}
              alt="captcha image loading..."
              className="w-80 h-[97px]"
            /> : null
          }
        </div>
        <div className="flex flex-row items-center justify-center gap-1 w-full">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder="자동 입력 방지 문자를 입력해주세요."
            className={[
              "w-full px-4 py-2 h-11 bg-white border border-text/10 rounded",
              loading ? "loading_background" : "",
            ].join(" ")}
          />
          <button onClick={getCaptcha} disabled={loading}>
            <svg className={[
              "w-12 h-11 p-3 cursor-pointer flex flex-row items-center justify-center bg-white border border-text/10 rounded",
              loading ? "loading_background" : "",
            ].join(" ")} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="fill-text" d="M2 8.05C2 8.8 2.14167 9.52917 2.425 10.2375C2.70833 10.9458 3.15 11.6 3.75 12.2L4 12.45V11C4 10.7167 4.09583 10.4792 4.2875 10.2875C4.47917 10.0958 4.71667 10 5 10C5.28333 10 5.52083 10.0958 5.7125 10.2875C5.90417 10.4792 6 10.7167 6 11V15C6 15.2833 5.90417 15.5208 5.7125 15.7125C5.52083 15.9042 5.28333 16 5 16H1C0.716667 16 0.479167 15.9042 0.2875 15.7125C0.0958333 15.5208 0 15.2833 0 15C0 14.7167 0.0958333 14.4792 0.2875 14.2875C0.479167 14.0958 0.716667 14 1 14H2.75L2.35 13.65C1.48333 12.8833 0.875 12.0083 0.525 11.025C0.175 10.0417 0 9.05 0 8.05C0 6.48333 0.4 5.0625 1.2 3.7875C2 2.5125 3.075 1.53333 4.425 0.85C4.65833 0.716667 4.90417 0.708333 5.1625 0.825C5.42083 0.941667 5.59167 1.13333 5.675 1.4C5.75833 1.65 5.75417 1.9 5.6625 2.15C5.57083 2.4 5.40833 2.59167 5.175 2.725C4.20833 3.25833 3.4375 3.99583 2.8625 4.9375C2.2875 5.87917 2 6.91667 2 8.05ZM14 7.95C14 7.2 13.8583 6.47083 13.575 5.7625C13.2917 5.05417 12.85 4.4 12.25 3.8L12 3.55V5C12 5.28333 11.9042 5.52083 11.7125 5.7125C11.5208 5.90417 11.2833 6 11 6C10.7167 6 10.4792 5.90417 10.2875 5.7125C10.0958 5.52083 10 5.28333 10 5V1C10 0.716667 10.0958 0.479167 10.2875 0.2875C10.4792 0.0958333 10.7167 0 11 0H15C15.2833 0 15.5208 0.0958333 15.7125 0.2875C15.9042 0.479167 16 0.716667 16 1C16 1.28333 15.9042 1.52083 15.7125 1.7125C15.5208 1.90417 15.2833 2 15 2H13.25L13.65 2.35C14.4667 3.16667 15.0625 4.05417 15.4375 5.0125C15.8125 5.97083 16 6.95 16 7.95C16 9.51667 15.6 10.9375 14.8 12.2125C14 13.4875 12.925 14.4667 11.575 15.15C11.3417 15.2833 11.0958 15.2917 10.8375 15.175C10.5792 15.0583 10.4083 14.8667 10.325 14.6C10.2417 14.35 10.2458 14.1 10.3375 13.85C10.4292 13.6 10.5917 13.4083 10.825 13.275C11.7917 12.7417 12.5625 12.0042 13.1375 11.0625C13.7125 10.1208 14 9.08333 14 7.95Z" />
            </svg>
          </button>

        </div>
        <div className="flex flex-row items-center justify-center gap-1 w-full">
          <button 
            className="w-full border border-primary text-primary bg-background font-semibold px-4 py-2 rounded-md text-base"
            onClick={() => setShowRecaptcha(false)}
          >
            취소
          </button>
          <button 
            className={`w-full bg-primary text-white font-semibold px-4 py-2 rounded-md text-base ${!input ? "opacity-50" : "opacity-100"}`}
            disabled={!input}
            onClick={() => {
              if (!input) return;
              if (submit) submit(captcha.id, input);
              setShowRecaptcha(false);
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Captcha;