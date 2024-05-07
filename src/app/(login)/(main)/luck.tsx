import moment from "moment";
import React from "react";

import { LuckData } from "@/app/api/luck/utils";
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
    "학업, 성적운": "",
    "건강운": "",
  });

  const get = async () => {
    setLoading(true);
    try{
      const { data } = await instance.post("/api/luck", {
        date: moment(date).format("YYYYMMDD"),
      });
      setData(data.data);
      console.log(data);
    }
    catch(e){
      console.error(e);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    get();
  }, [date]);

  return (
    <article className="flex flex-col gap-3">
      <section className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">오늘의 운세</h1>
        {/* <h1 className="text-base">{moment().format("YYYY년 MM월 DD일")}</h1> */}
        <input 
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 rounded border border-text/10 text-text"
        />
      </section>

      {
        loading || !data["총운"] ? (
          <h1 className="text-base text-text/40 w-full text-center">운세를 불러오는 중...</h1>
        ) : (
          Object.entries(data).map(([key, value]) => (
            <LuckComponent 
              key={key} 
              keyString={key} 
              value={value} 
              loading={loading}
            />
          ))
        )
      }
      
    </article>
  );
};

export default Luck;