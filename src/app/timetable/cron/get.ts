import "moment-timezone";
import { Comcigan } from "comcigan";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { getMeal } from "@/app/meal/[date]/server";
import { collections } from "@/utils/db";
import { Timetable } from "@/utils/db/utils";

const GET = async (
  req: NextRequest
) => {
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
  
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV !== "development") {
    return new NextResponse(JSON.stringify({
      success: false,
      message: "Unauthorized",
    }), {
      status: 401,
      headers: new_headers
    });
  }
    
  const today = moment().tz("Asia/Seoul");
  const today_day = today.day();
  const today_string = today.format("YYYY-MM-DD");


  const comcigan = new Comcigan();
  await comcigan.init();
  const school = (await comcigan.searchSchool("한국디지털미디어고"))[0];
  comcigan.setSchoolCode(school.schoolCode);
  const timetable = await comcigan.getTimetable();

  const flat: Timetable[] = [];
  for (let grade = 1; grade <= 3; grade++) {
    for (let classroom = 1; classroom <= 6; classroom++) {
      for (let day = 1; day <= 5; day++) {
        const timeArr = [];
        const changed: string[] = [];
        for (let period = 1; period <= 7; period++) {
          const time = timetable?.[grade]?.[classroom]?.[day]?.[period];
          if (!time) continue;
          if (time.subject) timeArr.push(`${time.subject}(${time.teacher}${["자율", "창체"].includes(time.teacher) ? "" : "□"})`);
          if (time.subject && time.changed && day === today_day) {
            changed.push(`${period}교시 ${time.subject}(${time.teacher}${["자율", "창체"].includes(time.teacher) ? "" : "□"})`);
          }
          flat.push(time);
        }
        if (day !== today_day) continue;
        const timeString = timeArr.join(" | ");
        const payLoad = {
          "payload": {
            "title": "오늘 하루도 힘차게 보내요!",
            "body": timeString
          },
          "type": "timetable",
          "filter": {
            "type": "student",
            "number": {
              $gte: grade * 1000 + classroom * 100,
              $lt: grade * 1000 + (classroom + 1) * 100
            }
          },
          "time": `${today_string} 07:00:00`
        };
        // await notificationCollection.insertOne(payLoad);
        if (changed.length) {
          const payLoad1 = {
            "payload": {
              "title": "바뀐 시간표가 있어요!",
              "body": `${changed.join(", ")}로 바뀌었어요.`
            },
            "type": "timetable-changed",
            "filter": {
              "type": "student",
              "number": {
                $gte: grade * 1000 + classroom * 100,
                $lt: grade * 1000 + (classroom + 1) * 100
              }
            },
            "time": `${today_string} 07:00:00`
          };
          // await notificationCollection.insertOne(payLoad1);
        }
      }
    }
  }

  const isStay = moment().tz("Asia/Seoul").day() === 0 || moment().tz("Asia/Seoul").day() === 6;
  const meal = await getMeal(today_string);
  const payLoad = [
    {
      "payload": {
        "title": "아침에는 무엇을 먹을까요?",
        "body": meal.breakfast.join("/")
      },
      "type": "meal-breakfast",
      "filter": {
        "type": "student",
      },
      "time": `${today_string} ${isStay ? "07:30:00" : "07:00:00"}`
    },
    {
      "payload": {
        "title": "우와!! 곧 점심 시간이에요!",
        "body": meal.lunch.join("/")
      },
      "type": "meal-lunch",
      "filter": {
        "type": "student",
      },
      "time": `${today_string} ${isStay ? "12:54:00" : "11:59:00"}`
    },
    {
      "payload": {
        "title": "오늘 저녁 어때요?",
        "body": meal.dinner.join("/")
      },
      "type": "meal-dinner",
      "filter": {
        "type": "student",
      },
      "time": `${today_string} ${isStay ? "17:59:00" : "18:29:00"}`
    }
  ];
  // await notificationCollection.insertMany(payLoad);

  const timetableCollection = await collections.timetable();
  await timetableCollection.deleteMany({});
  await timetableCollection.insertMany(flat);

  return new NextResponse(JSON.stringify({
    success: true,
    message: "Success",
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;