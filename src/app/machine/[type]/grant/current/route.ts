import "moment-timezone";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { collections } from "@/utils/db";
import { MachineJoin } from "@/utils/db/utils";

import { MachineType } from "../../utils";

export const GET = async (
  req: NextRequest,
  { params }: { params: { type: MachineType } }
) => {
  try {
    // const accessToken = req.cookies.get("access_token")?.value || "";
    // const { id, gender, number } = await accessVerify(accessToken);
    
    const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");

    const machine = await collections.machine();
    const machine_current = await machine.aggregate<MachineJoin>([
      {
        $match: {
          type: params.type,
          date: today,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "id",
          as: "userInfo"
        }
      },
      {
        $unwind: "$userInfo"
      },
      {
        $project: {
          _id: 0,
          code: "$code",
          type: "$type",
          date: "$date",
          time: "$time",
          owner: {
            gender: "$userInfo.gender",
            name: "$userInfo.name",
            number: "$userInfo.number",
          },
        },
      }
    ]).toArray();

    const response = NextResponse.json(machine_current);
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json({
      message: e.message,
    }, {
      status: 401,
    });
    console.error(e.message);
    return response;
  }
  
};
