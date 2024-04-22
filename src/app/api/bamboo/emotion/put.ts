import "moment-timezone";
import moment from "moment";
import { ObjectId, UpdateResult } from "mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

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

  const { _id, type }: {
    _id: string;
    type: "good" | "bad";
  } = await req.json();
  if(!_id) return new NextResponse(JSON.stringify({
    message: "대상을 선택해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });
  else if (type !== "good" && type !== "bad") return new NextResponse(JSON.stringify({
    message: "유효하지 않은 반응입니다.",
  }), {
    status: 400,
    headers: new_headers
  });

  const client = await connectToDatabase();
  const bambooCollection = client.db().collection("bamboo");
  const objcet_id = ObjectId.createFromHexString(_id);
  const bamboo_old = await bambooCollection.findOne({
    _id: objcet_id,
  });

  if(!bamboo_old) return new NextResponse(JSON.stringify({
    message: "대상을 찾을 수 없습니다.",
  }), {
    status: 400,
    headers: new_headers
  });

  const opposite = type === "good" ? "bad" : "good";
  let bamboo: UpdateResult;

  if(bamboo_old[type]?.includes(verified.payload.id)) {
    bamboo = await bambooCollection.updateOne(
      { _id: objcet_id },
      { $pull: { [type]: verified.payload.id } },
    );
  }
  else {
    bamboo = await bambooCollection.updateOne(
      { _id: objcet_id },
      { 
        $addToSet: { [type]: verified.payload.id },
        $pull: { [opposite]: verified.payload.id },
      },
    );
  }

  if(bamboo.modifiedCount || bamboo.upsertedCount) return new NextResponse(JSON.stringify({
    message: "반응이 등록되었습니다.",
  }), {
    status: 200,
    headers: new_headers
  });
  else return new NextResponse(JSON.stringify({
    message: "대상을 찾을 수 없습니다.",
  }), {
    status: 400,
    headers: new_headers
  });
};

export default PUT;