import "moment-timezone";
import moment from "moment";
import { AnyBulkWriteOperation, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import { collections } from "@/utils/db";
import { Machine, Machine_Time } from "@/utils/db/utils";

import { MachineType, machineTypeToKorean } from "../../utils";
import { Times } from "../time/utils";
import { EditMachine } from "../utils";

import { MachineEditResponse } from "./utils";


const PUT = async (
  req: NextRequest,
  { params }: {
    params: {
      type: MachineType
    }
  }
) => {
  try {
    const { machines, times }: {
      machines: EditMachine[];
      times: Times;
    } = await req.json();
    if (!machines || !times) {
      throw new Error("빈칸을 모두 채워주세요.");
    }

    const collection = await collections.machine_list();
    await collection.deleteMany({
      type: params.type,
    });
    await collection.insertMany(machines.map(machine => {
      const newObjectId = machine.code ? ObjectId.createFromHexString(machine.code) : new ObjectId();
      return {
        _id: newObjectId,
        type: params.type,
        name: machine.name,
        gender: machine.gender,
        allow: {
          default: machine.allow,
          weekend: [1, 2, 3]
        },
      };
    }));

    const timeCollection = await collections.machine_time();
    const timeBulk: AnyBulkWriteOperation<Machine_Time>[] = [
      {
        updateOne: {
          filter: { type: params.type, when: "default" },
          update: {
            $set: {
              time: times.default,
            }
          },
          upsert: true,
        }
      },
      {
        updateOne: {
          filter: { type: params.type, when: "weekend" },
          update: {
            $set: {
              time: times.weekend,
            }
          },
          upsert: true,
        }
      }
    ];
    await timeCollection.bulkWrite(timeBulk);

    const response = NextResponse.json<MachineEditResponse>({
      success: true,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<MachineEditResponse>({
      success: false,
      error: {
        title: "기기 정보 수정에 실패했어요.",
        description: e.message,
      }
    }, {
      status: 400,
    });
    console.error(e.message);
    return response;
  }
};

export default PUT;