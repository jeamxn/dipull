import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { StayData, getApplyStartDate } from "@/app/api/stay/utils";
import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { MachineConfig } from "../../machine/[type]/utils";


const PUT = async (
  req: Request,
) => {
  // 헤더 설정
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
  
  // Authorization 헤더 확인
  const authorization = headers().get("authorization");
  const verified = await verify(authorization?.split(" ")[1] || "");
  if(!verified.ok || !verified.payload?.id) return new NextResponse(JSON.stringify({
    message: "로그인이 필요합니다.",
  }), {
    status: 401,
    headers: new_headers
  });
  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  const selectMember = await userCollection.findOne({ id: verified.payload.data.id }) as unknown as UserDB;
  if(selectMember.type !== "teacher") return new NextResponse(JSON.stringify({
    message: "교사만 접근 가능합니다.",
  }), {
    status: 403,
    headers: new_headers
  });

  const { data, allowAllType, allowAllTime }: {
    data: MachineConfig,
    allowAllType: boolean,
    allowAllTime: boolean,
  } = await req.json();
  const statesCollection = client.db().collection("states");
  
  const updates = [
    statesCollection.updateOne({ type: "machine_time" }, {
      $set: {
        data: data,
      }
    }, {
      upsert: true,
    }),
    statesCollection.updateOne({ type: "machine_all_time" }, {
      $set: {
        data: allowAllTime
      }
    }, {
      upsert: true,
    }),
    statesCollection.updateOne({ type: "machine_all_washer" }, {
      $set: {
        data: allowAllType
      }
    }, {
      upsert: true,
    })
  ];
  await Promise.all(updates);

  return new NextResponse(JSON.stringify({
    success: true,
    message: "저장되었습니다.",
  }), {
    status: 200,
    headers: new_headers
  });
};

export default PUT;