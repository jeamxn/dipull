import React from "react";

const Timetable = () => {
  const [gradeClass, setGradeClass] = React.useState(11);
  
  return (
    <article>
      <h1 className="text-xl font-semibold flex flex-row gap-2 items-center">
          시간표
        <select 
          value={gradeClass}
          onChange={(e) => setGradeClass(Number(e.target.value))}
          className="bg-transparent text-base font-normal"
        >
          {
            new Array(3).fill(0).map((_, i) => (
              <optgroup key={i} label={`${i + 1}학년`}>
                {
                  new Array(6).fill(0).map((_, j) => (
                    <option key={j} value={(i + 1) * 10 + j + 1}>{i + 1}학년 {j + 1}반</option>
                  ))
                }
              </optgroup>
            ))
          }
        </select>
      </h1>
    </article>
  );
};

export default Timetable;