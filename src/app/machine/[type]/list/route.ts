import { NextRequest, NextResponse } from "next/server";

import { collections } from "@/utils/db";
import { Machine_list } from "@/utils/db/utils";

import { MachineType } from "../utils";

export const GET = async (
  req: NextRequest,
  { params }: { params: { type: MachineType } }
) => {
  try {
    const washer_list = await collections.machine_list();
    const getAll = await washer_list.aggregate<Machine_list>([
      {
        $match: {
          type: params.type,
        },
      },
      {
        $project: {
          _id: 0,
        }
      }
    ]).toArray();
    const response = NextResponse.json(getAll);
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
