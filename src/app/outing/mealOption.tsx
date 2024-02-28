import moment from "moment";
import React from "react";

import { MealData, Outing, OutingAndMealData } from "@/app/api/outing/utils";

const MealKorean = {
  breakfast: "조식",
  lunch: "중식",
  dinner: "석식",
};

export const defaultOutingData: OutingAndMealData = {
  meal: {
    breakfast: true,
    lunch: true,
    dinner: true,
  },
  outing: []
};

const MealOption = ({
  data,
  setData,
  title,
  loading,
}: {
  data: OutingAndMealData;
  setData: React.Dispatch<React.SetStateAction<OutingAndMealData>>;
  title?: string;
  loading: boolean;
}) => {
  const [tmpOuting, setTmpOuting] = React.useState<Outing>({
    start: "10:20",
    end: "14:00",
    description: "",
  });
  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold">{title}</h1>
      <article className={[
        "flex flex-col gap-2 bg-white rounded border border-text/10 p-5",
        loading ? "loading_background" : "",
      ].join(" ")}>
        <section className="flex flex-row justify-center items-center w-full gap-2">
          <input 
            type="text" 
            placeholder="외출 사유를 입력 해주세요."
            className="bg-transparent rounded border border-text/10 px-4 py-2 text-base w-full"
            value={tmpOuting.description}
            onChange={e => setTmpOuting(p => ({ ...p, description: e.target.value }))}
          />
          {
            title === "일요일" ? (
              <button 
                className="w-min text-base rounded h-10 bg-text/10 border border-text/10 px-4"
                onClick={() => {
                  setData(p => {
                    const outing = [ ...p.outing ];
                    outing.push({
                      start: "10:20",
                      end: "14:00",
                      description: "자기계발외출"
                    });
                    return { ...p, outing };
                  });
                }}
              >
                자기계발외출
              </button>
            ) : null
          }
        </section>
        <section className="flex flex-row justify-center items-center w-full gap-2">
          <input 
            type="time"
            className="bg-transparent rounded border border-text/10 px-4 py-2 text-base w-full text-center"
            value={tmpOuting.start}
            onChange={e => setTmpOuting(p => ({ ...p, 
              start: moment(e.target.value, "HH:mm").format("HH:mm")
            }))}
          />
          <p>~</p>
          <input 
            type="time" 
            className="bg-transparent rounded border border-text/10 px-4 py-2 text-base w-full text-center"
            value={tmpOuting.end}
            onChange={e => setTmpOuting(p => ({ ...p, 
              end: moment(e.target.value, "HH:mm").format("HH:mm")
            }))}
          />
          <button 
            className="w-min text-base rounded h-10 bg-text/10 border border-text/10 px-4"
            onClick={() => {
              if(
                !tmpOuting.start 
                || !tmpOuting.end 
                || !tmpOuting.description
                || moment(tmpOuting.start, "HH:mm").isAfter(moment(tmpOuting.end, "HH:mm"))
              ) return;
              setData(p => {
                const outing = [ ...p.outing ];
                outing.push(tmpOuting);
                return { ...p, outing };
              });
              setTmpOuting({
                start: "10:20",
                end: "14:00",
                description: "",
              });
            }}
          >
            +
          </button>
        </section>
      </article>
      <article className={[
        "flex flex-col gap-2 bg-white rounded border border-text/10 p-5",
        loading ? "loading_background" : "",
      ].join(" ")}>
        <table className="w-full">
          <tbody className="w-full border-y border-text/10">
            <tr className="w-full">
              <th className="text-center px-4 whitespace-nowrap py-2 font-semibold" colSpan={3}>외출 신청 목록</th>
              {/* <th className="w-full text-center px-4 whitespace-nowrap border-l border-text/10" colSpan={2}>사유</th> */}
              {/* <th className="text-center px-4">삭제</th> */}
            </tr>
            {
              data.outing.length ? data.outing.map((outing, index) => {
                const remove = () => {
                  if (setData) {
                    setData(p => {
                      const outing = [ ...p.outing ];
                      outing.splice(index, 1);
                      return { ...p, outing };
                    });
                  }
                };
                return (
                  <tr className="w-full border-y border-text/10" key={index}>
                    <td className="text-center px-4 whitespace-nowrap py-2">{outing.start} ~ {outing.end}</td>
                    <td className="w-full text-left px-4 whitespace-nowrap border-x border-text/10">{outing.description}</td>
                    <td className="text-center px-4 cursor-pointer select-none" onClick={remove}>
                      <div className="flex justify-center items-center h-full">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.0644 10.9493L13.1375 14.0224C13.276 14.1609 13.45 14.2317 13.6596 14.2349C13.8692 14.2381 14.0465 14.1673 14.1913 14.0224C14.3362 13.8775 14.4087 13.7019 14.4087 13.4955C14.4087 13.2891 14.3362 13.1135 14.1913 12.9686L11.1183 9.89548L14.1913 6.82238C14.3298 6.68393 14.4006 6.5099 14.4038 6.30028C14.407 6.09068 14.3362 5.91345 14.1913 5.76858C14.0465 5.6237 13.8708 5.55126 13.6644 5.55126C13.458 5.55126 13.2824 5.6237 13.1375 5.76858L10.0644 8.84166L6.99133 5.76858C6.85288 5.63012 6.67884 5.55928 6.46923 5.55608C6.25963 5.55287 6.0824 5.6237 5.93753 5.76858C5.79265 5.91345 5.7202 6.08908 5.7202 6.29548C5.7202 6.50188 5.79265 6.67752 5.93753 6.82238L9.0106 9.89548L5.93753 12.9686C5.79906 13.107 5.72823 13.2811 5.72503 13.4907C5.72181 13.7003 5.79265 13.8775 5.93753 14.0224C6.0824 14.1673 6.25803 14.2397 6.46443 14.2397C6.67083 14.2397 6.84646 14.1673 6.99133 14.0224L10.0644 10.9493ZM10.0661 19.3955C8.75217 19.3955 7.51714 19.1461 6.361 18.6475C5.20485 18.1488 4.19917 17.472 3.34395 16.6172C2.48872 15.7624 1.81166 14.7571 1.31278 13.6015C0.813895 12.4459 0.564453 11.2111 0.564453 9.89716C0.564453 8.58323 0.813787 7.34819 1.31245 6.19206C1.81112 5.03591 2.48787 4.03023 3.3427 3.17501C4.19755 2.31978 5.2028 1.64272 6.35843 1.14383C7.51405 0.644951 8.74882 0.395508 10.0628 0.395508C11.3767 0.395508 12.6117 0.644842 13.7679 1.14351C14.924 1.64218 15.9297 2.31892 16.7849 3.17376C17.6401 4.02861 18.3172 5.03385 18.8161 6.18948C19.315 7.3451 19.5644 8.57988 19.5644 9.89381C19.5644 11.2077 19.3151 12.4428 18.8164 13.5989C18.3177 14.7551 17.641 15.7607 16.7862 16.616C15.9313 17.4712 14.9261 18.1483 13.7704 18.6471C12.6148 19.146 11.38 19.3955 10.0661 19.3955ZM10.0644 17.8955C12.2978 17.8955 14.1894 17.1205 15.7394 15.5705C17.2894 14.0205 18.0644 12.1288 18.0644 9.89548C18.0644 7.66215 17.2894 5.77048 15.7394 4.22048C14.1894 2.67048 12.2978 1.89548 10.0644 1.89548C7.83109 1.89548 5.93943 2.67048 4.38943 4.22048C2.83943 5.77048 2.06443 7.66215 2.06443 9.89548C2.06443 12.1288 2.83943 14.0205 4.38943 15.5705C5.93943 17.1205 7.83109 17.8955 10.0644 17.8955Z" fill="rgb(var(--color-text) / .35)"/>
                        </svg>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr className="w-full border-y border-text/10">
                  <td className="text-center px-4 whitespace-nowrap py-2 text-text/50" colSpan={3}>외출 신청 내역이 없습니다.</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </article>
      <article className={[
        "flex flex-row gap-2 bg-white rounded border border-text/10 p-5",
        loading ? "loading_background" : "",
      ].join(" ")}>
        {
          (Object.entries(data.meal) as [ keyof MealData, boolean ][]).map(([key, value]) => (
            <figure 
              key={key}
              className={[
                "w-full rounded border border-text/10 p-4 flex flex-col justify-center items-center select-none transition-colors cursor-pointer",
                value ? "bg-transpart" : "bg-text/5",
                // loading ? "loading_background" : "",
              ].join(" ")}
              onClick={() => setData && setData(p => {
                const meal = { ...p.meal };
                meal[key] = !meal[key];
                return { ...p, meal };
              })}
            >
              <h3 className="text-base font-semibold">{MealKorean[key]}</h3>
              <p className="text-base font-light">{ value ? "취소 안함" : "취소함" }</p>
            </figure>
          ))
        }
      </article>
    </section>
  );
};

export default MealOption;