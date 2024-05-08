import moment from "moment";
import React from "react";

import { LuckData } from "@/app/api/luck/utils";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

import LuckComponent from "./luckCompoenet";

const Luck = () => {
  const [loading, setLoading] = React.useState(false);
  const [date, setDate] = React.useState(moment("20060927").format("YYYYMMDD"));
  const [data, setData] = React.useState<LuckData>({
    "총운": "",
    "애정운": "",
    "금전운": "",
    "직장운": "",
    "학업운": "",
    "건강운": "",
  });
  const [show, setShow] = React.useState(false);
  const [current, setCurrent] = React.useState<keyof LuckData | null>("총운");

  const get = async () => {
    if(date > moment().format("YYYYMMDD")){
      alert.info("오늘 이후의 운세는 확인할 수 없습니다.");
      return;
    }
    setLoading(true);
    setShow(true);
    try{
      const { data } = await instance.post("/api/luck", {
        date: moment(date).format("YYYYMMDD"),
      });
      setCurrent("총운");
      setData(data.data);
      console.log(data);
    }
    catch(e){
      console.error(e);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    const birthday = localStorage.getItem("birthday");
    console.log(birthday);
    if(birthday) setDate(birthday);
  }, []);

  return (
    <article className="flex flex-col gap-3">
      <section className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">오늘의 운세</h1>
      </section>

      <div className="bg-white rounded border border-text/10 p-4 flex flex-row gap-1 justify-between">
        <div className="flex flex-col gap-1">
          <input 
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              localStorage.setItem("birthday", e.target.value);
            }}
            className="bg-transparent w-full text-text"
          />
          <p className="text-text/45">생일을 입력해주세요.</p>
          <p className="text-text/45">운세는 <a className="text-primary/50 underline" href="https://search.naver.com/search.naver?query=네이버+운세" target="_blank" rel="noreferrer">네이버</a>에서 불러옵니다! 재미로만 참고해주세요!</p>
        </div>
        <button 
          onClick={get}
          className="bg-primary/10 text-primary rounded py-2 px-4 select-none"
        >운세보기</button>
      </div>

      {
        show ? (
          <div className="bg-white rounded border border-text/10 px-4 py-6 flex flex-col gap-4">
            {
              loading || !data["총운"] ? (
                <h1 className="text-base text-text/40 w-full text-center">운세를 불러오는 중...</h1>
              ) : 
                Object.entries(data).map(([key, value], index) => (
                  <>
                    <LuckComponent 
                      key={key}
                      keyString={key as keyof LuckData}
                      current={current}
                      setCurrent={setCurrent}
                      value={value} 
                      loading={loading}
                    />
                    {
                      index === Object.keys(data).length - 1 ? null : <hr className="border-t border-text/10" />
                    }
                  </>
                ))
            }
          </div>
        ) : null
      }
      
    </article>
  );
};

export default Luck;