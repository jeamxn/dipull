import moment from "moment";
import React from "react";

import { Meal as MealType } from "@/app/api/meal/[date]/route";
import { Day } from "@/utils/date";
import instance from "@/utils/instance";

type MealKey = keyof MealType["meal"];

const korean_meal = {
  "breakfast": "아침",
  "lunch": "점심",
  "dinner": "저녁",
};

const Meal = () => {
  const [loading, setLoading] = React.useState(false);
  const [date, setDate] = React.useState(moment());
  const [meal, setMeal] = React.useState<MealType["meal"]>({
    breakfast: "",
    lunch: "",
    dinner: "",
  });

  const getMeal = async () => {
    setLoading(true);
    try{
      const { data } = await instance.get(`/api/meal/${date.format("YYYY-MM-DD")}`);
      setMeal(data.data.meal);
    }
    catch(e){
      console.error(e);
    }
    setLoading(false);
  };
  React.useEffect(() => {
    getMeal();
  }, [date]);

  return (
    <article className="flex flex-col gap-3">
      <section className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">급식</h1>
        <h1 className="text-base">{date.format("YYYY년 MM월 DD일 ")}{Day[date.day()]}요일</h1>
      </section>
      <article className="overflow-auto">
        <figure className="flex flex-row w-max gap-2">
          {
            (Object.entries(meal) as [MealKey, string][]).map(([key, value]) => (
              <figure 
                className={[
                  "p-5 bg-white rounded-md border border-text/10 min-w-[217px]",
                  loading ? "loading_background" : "",
                ].join(" ")}
                key={key}
              >
                <h2 className="text-lg font-semibold">{korean_meal[key]}</h2>
                {
                  value.split("/").length > 1 ? value.split("/").map((v, i) => (
                    <p key={i}>{v}</p>
                  )) : (
                    <p>급식 정보가 없습니다.</p>
                  )
                }
              </figure>
            ))
          }
        </figure>
      </article>
      <article className="w-full flex flex-row gap-2">
        {
          [
            {
              icon: (
                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.86914 15.2952L1.26914 8.69523C1.16914 8.59523 1.09831 8.48689 1.05664 8.37023C1.01497 8.25356 0.994141 8.12856 0.994141 7.99523C0.994141 7.86189 1.01497 7.73689 1.05664 7.62023C1.09831 7.50356 1.16914 7.39523 1.26914 7.29523L7.86914 0.695227C8.05247 0.511893 8.28164 0.41606 8.55664 0.407727C8.83164 0.399393 9.06914 0.495227 9.26914 0.695227C9.46914 0.87856 9.57331 1.10773 9.58164 1.38273C9.58997 1.65773 9.49414 1.89523 9.29414 2.09523L4.39414 6.99523H15.5691C15.8525 6.99523 16.09 7.09106 16.2816 7.28273C16.4733 7.47439 16.5691 7.71189 16.5691 7.99523C16.5691 8.27856 16.4733 8.51606 16.2816 8.70773C16.09 8.89939 15.8525 8.99523 15.5691 8.99523H4.39414L9.29414 13.8952C9.47747 14.0786 9.57331 14.3119 9.58164 14.5952C9.58997 14.8786 9.49414 15.1119 9.29414 15.2952C9.11081 15.4952 8.87747 15.5952 8.59414 15.5952C8.31081 15.5952 8.06914 15.4952 7.86914 15.2952Z" fill="rgb(var(--color-text) / 1)"/>
                </svg>              
              ),
              onClick: () => setDate(date.clone().subtract(1, "day")),
            },
            {
              icon: (
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 16H5V10H11V16H14V7L8 2.5L2 7V16ZM2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V7C0 6.68333 0.0708333 6.38333 0.2125 6.1C0.354167 5.81667 0.55 5.58333 0.8 5.4L6.8 0.9C6.98333 0.766667 7.175 0.666667 7.375 0.6C7.575 0.533333 7.78333 0.5 8 0.5C8.21667 0.5 8.425 0.533333 8.625 0.6C8.825 0.666667 9.01667 0.766667 9.2 0.9L15.2 5.4C15.45 5.58333 15.6458 5.81667 15.7875 6.1C15.9292 6.38333 16 6.68333 16 7V16C16 16.55 15.8042 17.0208 15.4125 17.4125C15.0208 17.8042 14.55 18 14 18H9V12H7V18H2Z" fill="rgb(var(--color-text) / 1)"/>
                </svg>
              ),
              onClick: () => setDate(moment()),
            },
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.3 15.2998C7.11667 15.1165 7.02083 14.8831 7.0125 14.5998C7.00417 14.3165 7.09167 14.0831 7.275 13.8998L12.175 8.9998H1C0.716667 8.9998 0.479167 8.90397 0.2875 8.71231C0.0958333 8.52064 0 8.28314 0 7.9998C0 7.71647 0.0958333 7.47897 0.2875 7.2873C0.479167 7.09564 0.716667 6.9998 1 6.9998H12.175L7.275 2.0998C7.09167 1.91647 7.00417 1.68314 7.0125 1.3998C7.02083 1.11647 7.11667 0.883138 7.3 0.699805C7.48333 0.516471 7.71667 0.424805 8 0.424805C8.28333 0.424805 8.51667 0.516471 8.7 0.699805L15.3 7.2998C15.4 7.38314 15.4708 7.4873 15.5125 7.6123C15.5542 7.7373 15.575 7.86647 15.575 7.9998C15.575 8.13314 15.5542 8.25814 15.5125 8.3748C15.4708 8.49147 15.4 8.59981 15.3 8.69981L8.7 15.2998C8.51667 15.4831 8.28333 15.5748 8 15.5748C7.71667 15.5748 7.48333 15.4831 7.3 15.2998Z" fill="rgb(var(--color-text) / 1)"/>
                </svg>
              ),
              onClick: () => setDate(date.clone().add(1, "day")),
            }
          ].map((v, i) => (
            <button key={i} className="w-full flex flex-row items-center justify-center" onClick={v.onClick}>
              <figure className="h-10 flex flex-row items-center justify-center w-full bg-white rounded-md border border-text/10">
                {v.icon}
              </figure>
            </button>
          ))
        }
      </article>
    </article>
  );
};

export default Meal;