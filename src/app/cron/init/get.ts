import "moment-timezone";
import moment from "moment";
import { NextResponse } from "next/server";

import { getApplyEndDate, getApplyStartDate } from "@/app/api/stay/utils";
import { connectToDatabase } from "@/utils/db";
import { getStates } from "@/utils/getStates";

const GET = async (
  req: Request
) => {
  // 헤더 설정
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

  const client = await connectToDatabase();
  const db = client.db();

  const applyStartDate = await getApplyStartDate();
  const now = moment(applyStartDate, "YYYY-MM-DD").tz("Asia/Seoul").valueOf();

  const homecomingCollection = db.collection("homecoming");
  const iwannagohomeCollection = db.collection("iwannagohome");
  const jasupCollection = db.collection("jasup");
  const jasupBookCollection = db.collection("jasup_book");
  const machineCollection = db.collection("machine");
  const machineLateCollection = db.collection("machine_late");
  const outingCollection = db.collection("outing");
  const requestCollection = db.collection("request");
  const stayCollection = db.collection("stay");
  const wakeupCollection = db.collection("wakeup");
  const notificationCollection = db.collection("notification");
  const wakeupAplyCollection = client.db().collection("wakeup_aply");

  const deleteArr = [
    homecomingCollection.deleteMany({
      week: {
        $lt: applyStartDate
      }
    }),
    iwannagohomeCollection.deleteMany({
      date: {
        $lt: applyStartDate
      }
    }),
    jasupCollection.deleteMany({
      date: {
        $lt: applyStartDate
      }
    }),
    jasupBookCollection.deleteMany({
      dates: {
        end: {
          $lt: applyStartDate
        }
      }
    }),
    machineCollection.deleteMany({
      date: {
        $lt: applyStartDate
      }
    }),
    machineLateCollection.deleteMany({
      date: {
        $lt: applyStartDate
      }
    }),
    outingCollection.deleteMany({
      week: {
        $lt: applyStartDate
      }
    }),
    stayCollection.deleteMany({
      week: {
        $lt: applyStartDate
      }
    }),
    wakeupCollection.deleteMany({
      week: {
        $lt: applyStartDate
      }
    }),
    requestCollection.deleteMany({
      last_search: {
        $lt: now
      }
    }),
    wakeupAplyCollection.deleteMany({
      date: {
        $lt: applyStartDate
      }
    })
  ];

  await Promise.all(deleteArr);

  const applyend = await getApplyEndDate();

  const states = await getStates("stay");
  const applyStartDateMoment = moment(await getApplyStartDate());
  const addDate = states?.grade3Add === undefined ? 1 : states.grade3Add;
  const addOneFromStartDate = applyStartDateMoment.add(addDate, "day").format("YYYY-MM-DD");

  await notificationCollection.deleteMany({
    "type": {
      $in: ["3rd-grade-students-stay", "all-students-stay"]
    }
  });

  await notificationCollection.insertMany([
    {
      "payload": {
        "title": "오늘 3학년 신청이 마감되어요!",
        "body": "잊지 말고 오늘 안으로 잔류, 외출 및 금요 귀가를 신청해주세요!"
      },
      "type": "3rd-grade-students-stay",
      "filter": {
        "type": "student",
        "number": {
          $gte: 3000,
          $lt: 4000
        }
      },
      "time": `${addOneFromStartDate} 22:30:00`
    },
    {
      "payload": {
        "title": "오늘 신청이 최종 마감되어요!",
        "body": "잊지 말고 오늘 안으로 잔류, 외출 및 금요 귀가를 신청해주세요!"
      },
      "type": "all-students-stay",
      "filter": {
        "type": "student"
      },
      "time": `${applyend} 22:30:00`
    }
  ]);

  return new NextResponse(JSON.stringify({
    success: true,
    message: "Success",
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;