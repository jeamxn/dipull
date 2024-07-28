import "moment-timezone";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

import { MachineType } from "@/app/machine/[type]/utils";
import { ErrorMessage } from "@/components/providers/utils";
import { collections } from "@/utils/db";

const POST = async (
  req: NextRequest,
  { params }: { params: { type: MachineType } }
) => {
  try {
    const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");

    const machine = await collections.machine();
    const machines = await machine.aggregate([
      {
        $match: {
          type: params.type,
          date: today,
        },
      },
      {
        $lookup: {
          from: "machine_list",
          let: { codeAsObjectId: { $toObjectId: "$code" } }, // code 문자열을 ObjectId로 변환
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$codeAsObjectId"] // 변환된 code와 washers의 _id를 비교
                }
              }
            }
          ],
          as: "washerDetails"
        }
      },
      {
        $unwind: "$washerDetails"
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          name: "$washerDetails.name",
          owner: {
            $concat: [{
              $toString: "$user.number",
            }, " ", "$user.name"],
          },
          time: {
            $concat: [
              { $substr: ["$time", 0, 2], },
              "시 ",
              { $substr: ["$time", 3, 7], },
              "분"
            ]
          },
        }
      },
      {
        $group: {
          _id: "$name",
          machines: {
            $push: {
              owner: "$owner",
              time: "$time",
            }
          }
        }
      }
    ]).toArray();
  
    const response = NextResponse.json({
      data: machines,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<{
      error: ErrorMessage;
    }>({
      error: {
        title: "시간 조회를 실패했어요.",
        description: e.message,
      },
    }, {
      status: 400,
    });
    console.error(e.message);
    return response;
  }
  
};

export default POST;