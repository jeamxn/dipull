import moment from "moment";
import React from "react";

const ScheduleBox = ({
  event,
  location,
  grading,
  participants,
  etc,
  time,
}:{
  event: string;
  location: string;
  grading: string;
  participants: {

  };
  etc: string;
  time: {
    start: string;
    end: string;
  };

}) => {
  const isCurrent = moment().isBetween(moment(time.start, "HH:mm"), moment(time.end, "HH:mm"));
  const [clicked, setClicked] = React.useState(false);
  React.useEffect(() => {
    if(isCurrent) setClicked(true);
  }, []);
  return (
    <figure 
      onClick={() => setClicked(p => !p)}
      className={[
        "w-full px-4 py-2 rounded-md flex flex-col gap-1 select-none bg-white",
        isCurrent ? "border-primary border-2" : "border-text/10 border",
        // loading ? "loading_background" : "",
      ].join(" ")}
    >
      <div className="flex flex-row justify-between font-semibold">
        <p>{event}</p> 
        <p>{time.start} ~ {time.end}</p>
      </div>
      {
        clicked && <>
          <p>• 위치 : {location}</p>
          <div>
            <p>• 배점</p>
            {
              grading.split("\n").map((element, i) => (
                <p key={i} className="pl-4">{element}</p>
              ))
            }</div>
          {/* <p>{participants}</p> */}
          <p>• 기타 : {etc}</p>
        </>
        // clicked && Object.entries(machine.time).map(([key, value], i) => (
        //   <p key={i} className={[
        //     "text-sm",
        //     !value ? "opacity-30" : "opacity-100"
        //   ].join(" ")}>
        //     <b className="font-semibold">{key}</b> {value}
        //   </p>
        // ))
      }
    </figure>
  );
};

export default ScheduleBox;