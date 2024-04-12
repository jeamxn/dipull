"use client";

import moment from "moment";
import React from "react";

import Insider from "@/provider/insider";

import Menu from "../menu";

import ScheduleBox from "./ScheduleBox";

const schedule = [
  {
    "event" : "오리엔테이션",
    "location": "체육관",
    "grading": "기본 점수 5000점\n응원 점수 100점 씩 부여",
    "participants": "교장선생님 훈화 말씀 10분 컷 기원",
    "time": {
      "start": "09:30",
      "end": "09:40"
    }
  },
  {
    "event" : "사제족구",
    "location": "체육관",
    "grading": "선생님 팀과의 득실차 * 100\nex) 선생님 팀 21점 : 학생 팀 15점, 선생님 팀 100 * (21 - 15) 점 추가",
    "participants": "1학년: 4명\n2학년: 4명\n3학년: 4명",
    "time": {
      "start": "09:40",
      "end": "10:30"
    }
  },
  {
    "event" : "피구",
    "location": "체육관",
    "grading": "각 쿼터 승 : +2000\n각 세트 별 생존자 수 * 100",
    "participants": "1쿼터: 여학생(21명)\n2쿼터: 남학생(21명)\n3쿼터: 혼성(21명)\n5분 1쿼터",
    "time": {
      "start": "10:30",
      "end": "11:05"
    }
  },
  {
    "event" : "농구",
    "location": "체육관",
    "grading": "게임 스코어 * 100",
    "participants": "1쿼터: 여학생 1,2,3학년  합쳐서 5명\n2쿼터 1학년: 5명\n3쿼터 2학년: 5명\n4쿼터 3학년: 5명\n각 쿼터 교체 5인까지\n7분 4쿼터\n작전타임 x 교체만 가능\n모든 선수들(교체 선수까지) 출전 필수",
    "time": {
      "start": "11:05",
      "end": "11:55"
    }
  },
  {
    "event" : "미션 달리기",
    "location": "체육관",
    "grading": "{(승리 팀 기록 초) - (진 팀 기록 초)} * 100\n→ 승리팀에게’만’ 제공",
    "participants": "1쿼터: 1학년 8명\n2쿼터: 2학년 8명\n3쿼터: 3학년 8명\n1. 각 미션 당 1명 배치\n2. 미션 수행 후 다음 주자에게 바톤 전달\n[ 미션순서 ]\n1. 코끼리코 10바퀴 돌기\n2. 레몬 먹고 휘파람 불기\n3. 림보\n4. 사탕찾기\n5. 2인 3각 \n6. 훌라후프\n7. 제기차기\n8. 2인 3각",
    "time": {
      "start": "11:55",
      "end": "12:35"
    }
  },
  {
    "event" : "점심시간",
    "location": "급식실",
    "grading": "밥 마싯게 무라 from 김형석",
    "participants": "디넌 말 안들으면 현피 뜸 ㅅㄱ",
    "time": {
      "start": "12:50",
      "end": "13:50"
    }
  },
  {
    "event" : "판 뒤집기",
    "location": "체육관",
    "grading": "{(승리 팀 판) - (진 팀 판)}*100\n→ 승리팀에게’만’ 제공",
    "participants": "각 학년마다 10명씩 출전\n각 쿼터당 학년끼리 대결\n2분 1쿼터",
    "time": {
      "start": "13:50",
      "end": "14:15"
    }
  },
  {
    "event" : "줄다리기",
    "location": "체육관",
    "grading": "쿼터별 승리팀에게 3000점",
    "participants": "남자 8명, 여자 8명\n각 쿼터당 학년끼리 대결",
    "time": {
      "start": "14:15",
      "end": "14:30"
    }
  },
  {
    "event" : "단체 줄넘기",
    "location": "체육관",
    "grading": "가장 많이 한 횟수 * 100",
    "participants": "참여 인원 : 15명\n줄넘기 기회 : 3회\n전원 줄넘기 안에 들어가서 시작",
    "time": {
      "start": "14:30",
      "end": "14:45"
    }
  },
  {
    "event" : "축구",
    "location": "운동장",
    "grading": "득점 점수 * 1000\n승리팀 + 2000",
    "participants": "1쿼터: 1학년 9명\n2쿼터: 2학년 9명\n3쿼터: 3학년 9명\n12분 3쿼터",
    "time": {
      "start": "14:50",
      "end": "15:30"
    }
  },
  {
    "event" : "계주",
    "location": "운동장",
    "grading": "승리팀 + 10000",
    "participants": "1학년 : 여학생(3인), 남학생(3인)\n2학년 : 여학생(3인), 남학생(3인)\n3학년 : 여학생(3인), 남학생(3인)\n여/남/여/남 순서로 반 바퀴씩 돌기\n마지막 남자 주자 1바퀴",
    "time": {
      "start": "15:30",
      "end": "15:50"
    }
  },
  {
    "event" : "폐회식",
    "location": "운동장",
    "grading": "금방 끝내주시길 ㅜㅜ",
    "participants": "크크",
    "time": {
      "start": "15:50",
      "end": "16:00"
    }
  }
];

const Schedule = () => {
  const [currentTime, setCurrentTime] = React.useState(moment());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 10 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Menu />
      <Insider>
        <section className="flex flex-col gap-3">
          <h1 className="text-xl font-semibold">일정</h1>
          <section className="flex flex-col gap-1">
            {
              schedule.map((element) => {
                return <ScheduleBox key={element.event} currentTime={currentTime} {...element} />;
              })
            }
          </section>

        </section>
      </Insider>
    </>
  );
};


export default Schedule;