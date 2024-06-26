import "moment-timezone";
import { Comcigan } from "comcigan";
import moment from "moment";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";

export type Timetable = {
  grd: number;
  cls: number;
  weekday: number;
  period: number;
  teacher: string;
  subject: string;
  classroom: string;
  changed: boolean;
  code: string;
};

const GET = async (
  req: Request
) => {
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
  
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
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

  const client = await connectToDatabase();
  const notificationCollection = client.db().collection("notification");
  await notificationCollection.deleteMany({ type: { $in: ["timetable"] } });

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
        for (let period = 1; period <= 7; period++) {
          const time = timetable?.[grade]?.[classroom]?.[day]?.[period];
          if (!time) continue;
          if (time.subject) timeArr.push(`${time.subject}(${time.teacher}□)`);
          if (time.changed && day === today_day) {
            const payLoad1 = {
              "payload": {
                "title": "바뀐 시간표가 있어요!",
                "body": `${period}교시가 ${time.subject}(${time.teacher}□)로 바뀌었어요.`
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
            await notificationCollection.insertOne(payLoad1);
          }
          flat.push(time);
        }
        if (day !== today_day) continue;
        const timeString = timeArr.join(" | ");
        const payLoad = {
          "payload": {
            "title": "[오늘의 시간표] 오늘 하루도 힘차게 보내요!",
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
        await notificationCollection.insertOne(payLoad);
      }
    }
  }

  const timetableCollection = client.db().collection("timetable");
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