import moment from "moment";
import React from "react";

const ScheduleBox = ({
  event,
  location,
  grading,
  participants,
  time,
  currentTime,
}:{
  event: string;
  location: string;
  grading: string;
  participants: string;
  time: {
    start: string;
    end: string;
  };
  currentTime: moment.Moment;
}) => {
  const isCurrent = currentTime.isBetween(moment(time.start, "HH:mm"), moment(time.end, "HH:mm"));
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
      ].join(" ")}
    >
      <div className="flex flex-row justify-between font-semibold">
        <p>{event}</p> 
        <p>{time.start} ~ {time.end}</p>
      </div>
      {
        clicked && <>
          <p>• 위치 : {location}</p>
          <p>• 배점 : </p>
          {
            grading.split("\n").map((element, i) => (
              <p key={i} className="pl-4"> - {element}</p>
            ))
          }
          <p>• 진행 : </p>
          {
            participants.split("\n").map((element, i) => (
              <p key={i} className="pl-4"> - {element}</p>
            ))
          }
        </>
      }
    </figure>
  );
};

export default ScheduleBox;