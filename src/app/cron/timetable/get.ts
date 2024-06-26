import { Comcigan } from "comcigan";
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

  const comcigan = new Comcigan();
  await comcigan.init();
  const school = (await comcigan.searchSchool("한국디지털미디어고"))[0];
  comcigan.setSchoolCode(school.schoolCode);
  const timetable = await comcigan.getTimetable();
  const flat: Timetable[] = [];
  for (let grade = 1; grade <= 3; grade++) {
    for (let classroom = 1; classroom <= 6; classroom++) {
      for(let day = 1; day <= 5; day++) {
        for (let period = 1; period <= 7; period++) {
          const time = timetable?.[grade]?.[classroom]?.[day]?.[period];
          if (!time) continue;
          flat.push(time);
        }
      }
    }
  }

  const client = await connectToDatabase();
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