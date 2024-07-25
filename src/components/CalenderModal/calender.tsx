import moment, { Moment } from "moment";
import React from "react";

import CalButton from "./calButton";

const Calender = ({
  show,
  value,
  seleted: clicked,
  setSelected: setClicked,
}: {
  show: boolean;
  value?: Moment;
  seleted: Moment;
  setSelected: React.Dispatch<React.SetStateAction<Moment>>;
  }) => {
  const [current, setCurrent] = React.useState<Moment>(clicked || moment());

  React.useEffect(() => { 
    console.log(show, clicked, value);
    setCurrent(clicked || moment());
  }, [show, clicked, value]);
  
  const monthStart = current.clone().startOf("month");
  const monthStartDay = monthStart.day();

  const daysInMonth = current.daysInMonth();

  const monthEnd = current.clone().endOf("month");
  const monthEndDay = monthEnd.day();

  const prevMonth = current.clone().subtract(1, "month");
  const prevMonthEnd = prevMonth.clone().endOf("month");

  const lineCnt = ((daysInMonth - monthEndDay - 1) - (7 - monthStartDay)) / 7;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="w-full flex flex-row gap-2 items-center justify-between">
        <button
          className="-m-3 p-3"
          onClick={() => setCurrent(current.clone().subtract(1, "month"))}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-text dark:fill-text-dark" d="M7.16265 8.99972L12.6751 14.5122C12.8626 14.6997 12.9533 14.9185 12.947 15.1685C12.9408 15.4185 12.8439 15.6372 12.6564 15.8247C12.4689 16.0122 12.2501 16.106 12.0001 16.106C11.7501 16.106 11.5314 16.0122 11.3439 15.8247L5.5689 10.0685C5.4189 9.91847 5.3064 9.74972 5.2314 9.56222C5.1564 9.37472 5.1189 9.18722 5.1189 8.99972C5.1189 8.81222 5.1564 8.62472 5.2314 8.43722C5.3064 8.24972 5.4189 8.08097 5.5689 7.93097L11.3439 2.15597C11.5314 1.96847 11.7533 1.87784 12.0095 1.88409C12.2658 1.89034 12.4876 1.98722 12.6751 2.17472C12.8626 2.36222 12.9564 2.58097 12.9564 2.83097C12.9564 3.08097 12.8626 3.29972 12.6751 3.48722L7.16265 8.99972Z" />
          </svg>
        </button>
        <div className="flex flex-row gap-1">
          <p className="font-semibold text-lg text-text dark:text-text-dark">{current.format("YYYY년 M월")}</p>
          <button
            onClick={() => {
              setCurrent(moment());
              setClicked(moment());
            }}
          >
            <p className="font-semibold text-lg underline underline-offset-1 cursor-pointer text-text dark:text-text-dark">(오늘)</p>
          </button>
        </div>
        <button
          className="-m-3 p-3"
          onClick={() => setCurrent(current.clone().add(1, "month"))}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-text dark:fill-text-dark" d="M10.8565 9L5.34395 3.4875C5.15645 3.3 5.06583 3.07812 5.07208 2.82188C5.07833 2.56563 5.1752 2.34375 5.3627 2.15625C5.5502 1.96875 5.77208 1.875 6.02833 1.875C6.28458 1.875 6.50645 1.96875 6.69395 2.15625L12.4502 7.93125C12.6002 8.08125 12.7127 8.25 12.7877 8.4375C12.8627 8.625 12.9002 8.8125 12.9002 9C12.9002 9.1875 12.8627 9.375 12.7877 9.5625C12.7127 9.75 12.6002 9.91875 12.4502 10.0688L6.6752 15.8438C6.4877 16.0312 6.26895 16.1219 6.01895 16.1156C5.76895 16.1094 5.5502 16.0125 5.3627 15.825C5.1752 15.6375 5.08145 15.4156 5.08145 15.1594C5.08145 14.9031 5.1752 14.6813 5.3627 14.4938L10.8565 9Z" />
          </svg>
        </button>
      </div>
      
      <div className="w-full flex flex-col gap-3 mb-3">
        <div className="w-full flex flex-row items-center justify-center">
          {
            Array(7).fill(0).map((_, index) => { 
              return (
                <div className="w-full flex flex-row items-center justify-center" key={index}>
                  <p className={[
                    "font-semibold",
                    index % 7 === 0 ? "text-red-600 dark:text-red-300" :
                      index % 7 === 6 ? "text-blue-700 dark:text-blue-400" : "text-text dark:text-text-dark",
                  ].join(" ")}>
                    {moment().day(index).format("dd")}
                  </p>
                </div>
              );
            })
          }
        </div>
        <div className="w-full flex flex-row items-center justify-center">
          {
            Array(monthStartDay).fill(0).map((_, index) => {
              const date = prevMonthEnd.date() - monthStartDay + index + 1;
              return (
                <CalButton 
                  key={index} 
                  clicked={clicked} 
                  setClicked={setClicked} 
                  show={current} 
                  setShow={setCurrent} 
                  date={date} 
                  prev
                />
              );
            })
          }
          {
            Array(7 - monthStartDay).fill(0).map((_, index) => {
              const date = index + 1;
              return (
                <CalButton 
                  key={index} 
                  clicked={clicked} 
                  setClicked={setClicked} 
                  show={current} 
                  setShow={setCurrent} 
                  date={date} 
                />
              );
            })
          }
        </div>
        
        {
          Array(lineCnt).fill(0).map((_, index) => {
            return (
              <div className="w-full flex flex-row items-center justify-center" key={index * 10}>
                {
                  Array(7).fill(0).map((_, index2) => {
                    const date = (7 - monthStartDay) + (index2 + 1) + (7 * index);
                    return (
                      <CalButton
                        key={index2 + index * 10 + 1}
                        clicked={clicked}
                        setClicked={setClicked}
                        show={current}
                        setShow={setCurrent}
                        date={date}
                      />
                    );
                  })
                }
              </div>
            );
          })
        }
        <div className="w-full flex flex-row items-center justify-center">
          {
            Array(monthEndDay + 1).fill(0).map((_, index) => {
              const date = daysInMonth - monthEndDay + index;
              return (
                <CalButton 
                  key={index} 
                  clicked={clicked} 
                  setClicked={setClicked} 
                  show={current} 
                  setShow={setCurrent} 
                  date={date} 
                />
              );
            })
          }
          {
            Array(6 - monthEndDay).fill(0).map((_, index) => {
              const date = index + 1;
              return (
                <CalButton 
                  key={index} 
                  clicked={clicked} 
                  setClicked={setClicked} 
                  show={current} 
                  setShow={setCurrent} 
                  date={date} 
                  next
                />
              );
            })
          }
        </div>
        {
          Array(4 - lineCnt).fill(0).map((_, index) => (
            <div key={index} className="h-10" />
          ))
        }
      </div>
    </div>
  );
};

export default Calender;