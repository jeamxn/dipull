import "moment-timezone";
import moment from "moment";
import { NextResponse } from "next/server";

import { getApplyStartDate } from "@/app/api/stay/utils";
import { connectToDatabase } from "@/utils/db";

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
  const outingCollection = db.collection("outing");
  const requestCollection = db.collection("request");
  const stayCollection = db.collection("stay");
  const wakeupCollection = db.collection("wakeup");

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
    })
  ];

  await Promise.all(deleteArr);

  return new NextResponse(JSON.stringify({
    success: true,
    message: "Success",
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;