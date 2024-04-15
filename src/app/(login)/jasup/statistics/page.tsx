"use client";

import moment from "moment";
import Link from "next/link";
import React from "react";

import { JasupData, JasupDataWithUser, JasupKoreanWhereArray, JasupTime, JasupWhere, WeekDayTime, englishTimeTypeToKorean, englishWhereTypeToKorean, getCurrentTime, koreanWhereTypeToEnglish } from "@/app/api/jasup/utils";
import { Outing } from "@/app/api/outing/utils";
import Insider from "@/provider/insider";
import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

import Menu from "../menu";
import Select from "../my/select";

const Jasup = () => {
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
  const [data, setData] = React.useState<JasupDataWithUser[]>([]);
  const [gradeClass, setGradeClass] = React.useState<number>(11);
  const [deafult, setDefault] = React.useState<{
    date: string;
    time: JasupTime;
  }>({
    date: moment().format("YYYY-MM-DD"),
    time: "am1",
  });
  const [statistics, setStatistics] = React.useState<{
    [key in JasupWhere]: number;
  }>({
    none: 0,
    classroom: 0,
    studyroom: 0,
    KTroom: 0,
    etcroom: 0,
    healthroom: 0,
    dormitory: 0,
    outing: 0,
    home: 0,
    afterschool: 0,
  });
  const [where, setWhere] = React.useState<JasupWhere>("none");
  const [etc, setEtc] = React.useState<JasupData["etc"]>("");
  const [tmpOuting, setTmpOuting] = React.useState<Outing>({
    start: WeekDayTime[getCurrentTime()].start,
    end: WeekDayTime[getCurrentTime()].end,
    description: "",
  });
  const [selected, setSelected] = React.useState<JasupDataWithUser | null>(null);

  const sum = Object.values(statistics).reduce((acc, cur) => acc + cur, 0);

  React.useEffect(() => {
    if(selected)
      getJasupData();
  }, [selected?.id]);

  React.useEffect(() => {
    if(where === "outing")
      setEtc(`${tmpOuting.description}(${tmpOuting.start}~${tmpOuting.end})`);
  }, [tmpOuting.start, tmpOuting.end, tmpOuting.description]);

  React.useEffect(() => {
    if(where !== "etcroom" && where !== "outing" && etc !== "물/화장실" && etc !== "세탁")
      setEtc("");
  }, [where]);

  const getJasupData = async () => {
    setLoading(true);
    try{
      if(!selected) return;
      const { data } = await instance.post("/api/jasup/someone", {
        id: selected.id,
      });
      const type = data.data.type;
      const etc = data.data.etc;
      setWhere(type);
      setEtc(etc);
      if(type === "outing") setTmpOuting({
        start: etc.split("(")[1].split(")")[0].split("~")[0],
        end: etc.split("(")[1].split(")")[0].split("~")[1],
        description: etc.split("(")[0],
      });
    }
    catch(e: any){
      alert.error(e.response.data.message);
    }
    setLoading(false);
  };
  const putJasupData = async () => {
    setLoading(true);
    if(!selected) return;
    const loading = alert.loading("자습 위치 변경 중 입니다.");
    try{
      const res = await instance.put("/api/jasup/someone", {
        id: selected.id,
        type: where,
        etc: etc,
      });
      await getJasupData();
      await getAllJasupData();
      alert.update(loading, res.data.message, "success");
    }
    catch(e: any){
      alert.update(loading, e.response.data.message, "error");
    }
    setLoading(false);
  };

  const getAllJasupData = async (gradeClassInner?: number) => {
    setLoading(true);
    try{
      const { data } = await instance.post("/api/jasup/all", {
        gradeClass: gradeClassInner,
      });
      setData(data.data.data);
      setDefault({
        date: data.data.date,
        time: data.data.time,
      });
      setStatistics(data.data.count);
      setGradeClass(data.data.gradeClass);
      setIsAdmin(data.data.isAdmin);
    }
    catch(e: any){
      alert.error(e.response.data.message);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getAllJasupData();
  }, []);

  return (
    <>
      <Menu />
      <Insider>
        <section className="flex flex-col gap-3">
          <div className="flex flex-row items-center justify-between">
            <section className="flex flex-row items-center">
              <h1 className="text-xl font-semibold">자습 통계</h1>
              <div className={[
                "hover:font-semibold cursor-pointer transition-all h-7 w-7 flex items-center justify-center pr-1",
                loading ? "rotation" : "",
              ].join(" ")} onClick={() => getAllJasupData(gradeClass)}>
                <svg width="14" height="14" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.69922 16.8835C6.46589 16.8835 4.57422 16.1085 3.02422 14.5585C1.47422 13.0085 0.699219 11.1169 0.699219 8.88354C0.699219 6.65021 1.47422 4.75855 3.02422 3.20854C4.57422 1.65854 6.46589 0.883545 8.69922 0.883545C9.84922 0.883545 10.9492 1.12104 11.9992 1.59604C13.0492 2.07104 13.9492 2.75021 14.6992 3.63354V1.88354C14.6992 1.60021 14.7951 1.36271 14.9867 1.17104C15.1784 0.979378 15.4159 0.883545 15.6992 0.883545C15.9826 0.883545 16.2201 0.979378 16.4117 1.17104C16.6034 1.36271 16.6992 1.60021 16.6992 1.88354V6.88354C16.6992 7.16688 16.6034 7.40438 16.4117 7.59605C16.2201 7.78771 15.9826 7.88354 15.6992 7.88354H10.6992C10.4159 7.88354 10.1784 7.78771 9.98672 7.59605C9.79505 7.40438 9.69922 7.16688 9.69922 6.88354C9.69922 6.60021 9.79505 6.36271 9.98672 6.17104C10.1784 5.97938 10.4159 5.88354 10.6992 5.88354H13.8992C13.3659 4.95021 12.6367 4.21688 11.7117 3.68354C10.7867 3.15021 9.78255 2.88354 8.69922 2.88354C7.03255 2.88354 5.61589 3.46688 4.44922 4.63354C3.28255 5.80021 2.69922 7.21688 2.69922 8.88354C2.69922 10.5502 3.28255 11.9669 4.44922 13.1335C5.61589 14.3002 7.03255 14.8835 8.69922 14.8835C9.83255 14.8835 10.8701 14.596 11.8117 14.021C12.7534 13.446 13.4826 12.6752 13.9992 11.7085C14.1326 11.4752 14.3201 11.3127 14.5617 11.221C14.8034 11.1294 15.0492 11.1252 15.2992 11.2085C15.5659 11.2919 15.7576 11.4669 15.8742 11.7335C15.9909 12.0002 15.9826 12.2502 15.8492 12.4835C15.1659 13.8169 14.1909 14.8835 12.9242 15.6835C11.6576 16.4835 10.2492 16.8835 8.69922 16.8835Z" fill="rgb(var(--color-primary) / 1)"/>
                </svg>
              </div>
              {
                isAdmin ? (
                  <select 
                    className="bg-transparent"
                    value={gradeClass}
                    onChange={(e) => {
                      setGradeClass(parseInt(e.target.value));
                      getAllJasupData(parseInt(e.target.value));
                    }}
                  >
                    <option value="99">전체</option>
                    <optgroup label="1학년">
                      <option value="10">1학년 전체</option>
                      <option value="11">1학년 1반</option>
                      <option value="12">1학년 2반</option>
                      <option value="13">1학년 3반</option>
                      <option value="14">1학년 4반</option>
                      <option value="15">1학년 5반</option>
                      <option value="16">1학년 6반</option>
                    </optgroup>
                    <optgroup label="2학년">
                      <option value="20">2학년 전체</option>
                      <option value="21">2학년 1반</option>
                      <option value="22">2학년 2반</option>
                      <option value="23">2학년 3반</option>
                      <option value="24">2학년 4반</option>
                      <option value="25">2학년 5반</option>
                      <option value="26">2학년 6반</option>
                    </optgroup>
                    <optgroup label="3학년">
                      <option value="30">3학년 전체</option>
                      <option value="31">3학년 1반</option>
                      <option value="32">3학년 2반</option>
                      <option value="33">3학년 3반</option>
                      <option value="34">3학년 4반</option>
                      <option value="35">3학년 5반</option>
                      <option value="36">3학년 6반</option>
                    </optgroup>
                  </select>
                ) : null
              }
            </section>
            {
              isAdmin ? (
                <Link
                  href="/jasup/fullscreen"
                  prefetch
                >
                  <div className={[
                    "hover:font-semibold cursor-pointer transition-all h-7 w-7 flex items-center justify-center",
                  ].join(" ")}>
                    <svg width="14" height="14" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.42383 16.1471H4.42383C4.70716 16.1471 4.94466 16.2429 5.13633 16.4346C5.32799 16.6263 5.42383 16.8638 5.42383 17.1471C5.42383 17.4304 5.32799 17.6679 5.13633 17.8596C4.94466 18.0513 4.70716 18.1471 4.42383 18.1471H1.42383C1.14049 18.1471 0.902995 18.0513 0.711328 17.8596C0.519661 17.6679 0.423828 17.4304 0.423828 17.1471V14.1471C0.423828 13.8638 0.519661 13.6263 0.711328 13.4346C0.902995 13.2429 1.14049 13.1471 1.42383 13.1471C1.70716 13.1471 1.94466 13.2429 2.13633 13.4346C2.32799 13.6263 2.42383 13.8638 2.42383 14.1471V16.1471ZM16.4238 16.1471V14.1471C16.4238 13.8638 16.5197 13.6263 16.7113 13.4346C16.903 13.2429 17.1405 13.1471 17.4238 13.1471C17.7072 13.1471 17.9447 13.2429 18.1363 13.4346C18.328 13.6263 18.4238 13.8638 18.4238 14.1471V17.1471C18.4238 17.4304 18.328 17.6679 18.1363 17.8596C17.9447 18.0513 17.7072 18.1471 17.4238 18.1471H14.4238C14.1405 18.1471 13.903 18.0513 13.7113 17.8596C13.5197 17.6679 13.4238 17.4304 13.4238 17.1471C13.4238 16.8638 13.5197 16.6263 13.7113 16.4346C13.903 16.2429 14.1405 16.1471 14.4238 16.1471H16.4238ZM2.42383 2.14709V4.14709C2.42383 4.43043 2.32799 4.66793 2.13633 4.85959C1.94466 5.05126 1.70716 5.14709 1.42383 5.14709C1.14049 5.14709 0.902995 5.05126 0.711328 4.85959C0.519661 4.66793 0.423828 4.43043 0.423828 4.14709V1.14709C0.423828 0.863761 0.519661 0.626261 0.711328 0.434595C0.902995 0.242928 1.14049 0.147095 1.42383 0.147095H4.42383C4.70716 0.147095 4.94466 0.242928 5.13633 0.434595C5.32799 0.626261 5.42383 0.863761 5.42383 1.14709C5.42383 1.43043 5.32799 1.66793 5.13633 1.85959C4.94466 2.05126 4.70716 2.14709 4.42383 2.14709H2.42383ZM16.4238 2.14709H14.4238C14.1405 2.14709 13.903 2.05126 13.7113 1.85959C13.5197 1.66793 13.4238 1.43043 13.4238 1.14709C13.4238 0.863761 13.5197 0.626261 13.7113 0.434595C13.903 0.242928 14.1405 0.147095 14.4238 0.147095H17.4238C17.7072 0.147095 17.9447 0.242928 18.1363 0.434595C18.328 0.626261 18.4238 0.863761 18.4238 1.14709V4.14709C18.4238 4.43043 18.328 4.66793 18.1363 4.85959C17.9447 5.05126 17.7072 5.14709 17.4238 5.14709C17.1405 5.14709 16.903 5.05126 16.7113 4.85959C16.5197 4.66793 16.4238 4.43043 16.4238 4.14709V2.14709Z" fill="rgb(var(--color-text) / 1)"/>
                    </svg>
                  </div>
                </Link>
              ) : null
            }
          </div>
          <article className={[
            "flex flex-col gap-2 bg-white rounded border border-text/10 p-5 overflow-auto",
            loading ? "loading_background" : "",
          ].join(" ")}>
            <table className="w-full border-text/10 bg-transparent border-y">
              <tbody>
                <tr className="border-y border-text/10">
                  <td colSpan={6} className="p-2">
                    <p className="text-center text-base font-bold">
                      {moment(deafult.date, "YYYY-MM-DD").format("YYYY년 MM월 DD일")} {englishTimeTypeToKorean(deafult.time)} 기준
                    </p>
                  </td>
                </tr>
                {
                  data.length ? data.map((e, i) => (
                    <tr className="border-y border-text/10" key={i}>
                      <td className="p-2 w-16">
                        <p className="text-center text-base font-bold">{e.number}</p>
                      </td>
                      <td className="p-2 w-24">
                        <p className="text-center text-base font-bold">{e.name}</p>
                      </td>
                      <td className="p-2 w-10">
                        <p className="text-center text-base font-bold">{e.gender === "male" ? "남" : "여"}</p>
                      </td>
                      <td className="p-2 min-w-20">
                        <p className="text-center">{englishWhereTypeToKorean(e.type)}</p>
                      </td>
                      <td className="p-2 min-w-20">
                        <p className="text-center">{e.etc || "-"}</p>
                      </td>
                      {
                        isAdmin ? (
                          <td 
                            className={[
                              "cursor-pointer w-10",
                              selected === e ? "opacity-100" : "opacity-30",
                            ].join(" ")}
                            onClick={() => {
                              if(selected === e) setSelected(null);
                              else setSelected(e);
                            }}
                          >
                            <div className="w-full h-full flex items-center justify-center">
                              <svg width="14" height="14" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.08789 17.9907C3.33789 17.9907 2.59622 17.8074 1.86289 17.4407C1.12956 17.074 0.537891 16.5907 0.0878906 15.9907C0.521224 15.9907 0.962891 15.8199 1.41289 15.4782C1.86289 15.1365 2.08789 14.6407 2.08789 13.9907C2.08789 13.1574 2.37956 12.449 2.96289 11.8657C3.54622 11.2824 4.25456 10.9907 5.08789 10.9907C5.92122 10.9907 6.62956 11.2824 7.21289 11.8657C7.79622 12.449 8.08789 13.1574 8.08789 13.9907C8.08789 15.0907 7.69622 16.0324 6.91289 16.8157C6.12956 17.599 5.18789 17.9907 4.08789 17.9907ZM4.08789 15.9907C4.63789 15.9907 5.10872 15.7949 5.50039 15.4032C5.89206 15.0115 6.08789 14.5407 6.08789 13.9907C6.08789 13.7074 5.99206 13.4699 5.80039 13.2782C5.60872 13.0865 5.37122 12.9907 5.08789 12.9907C4.80456 12.9907 4.56706 13.0865 4.37539 13.2782C4.18372 13.4699 4.08789 13.7074 4.08789 13.9907C4.08789 14.374 4.04206 14.724 3.95039 15.0407C3.85872 15.3574 3.73789 15.6574 3.58789 15.9407C3.67122 15.974 3.75456 15.9907 3.83789 15.9907H4.08789ZM9.83789 11.9907L7.08789 9.24069L16.0379 0.290686C16.2212 0.107352 16.4504 0.0115189 16.7254 0.00318555C17.0004 -0.00514779 17.2379 0.0906856 17.4379 0.290686L18.7879 1.64069C18.9879 1.84069 19.0879 2.07402 19.0879 2.34069C19.0879 2.60735 18.9879 2.84069 18.7879 3.04069L9.83789 11.9907Z" fill="rgb( var(--color-text) / 1 )"/>
                              </svg>
                            </div>
                          </td>
                        ) : null
                      }
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="border-y border-text/10 p-2 text-center text-text/40">데이터가 없습니다.</td>
                    </tr>
                  )
                }
                {
                  Object.entries(statistics).map(([key, value], i) => (
                    <tr className="border-y border-text/10" key={i}>
                      <td className="w-20 p-2" colSpan={3}>
                        <p className="text-center text-base font-bold">{englishWhereTypeToKorean(key as JasupWhere)}</p>
                      </td>
                      <td className="w-20 p-2" colSpan={3}>
                        <p className="text-center text-base">{value}명</p>
                      </td>
                    </tr>
                  ))
                }
                <tr className="border-y border-text/10">
                  <td className="w-20 p-2" colSpan={3}>
                    <p className="text-center text-base font-bold">합계</p>
                  </td>
                  <td className="w-20 p-2" colSpan={3}>
                    <p className="text-center text-base">{sum}명</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </article>
        </section>
        {
          selected ? (
            <Select
              loading={loading}
              etc={etc}
              setEtc={setEtc}
              where={where}
              setWhere={setWhere}
              tmpOuting={tmpOuting}
              setTmpOuting={setTmpOuting}
              onButtonClick={putJasupData}
              title={`${selected.number} ${selected.name} 자습 위치 설정하기`}
            />
          ) : null
        }
      </Insider>
    </>
  );
};


export default Jasup;