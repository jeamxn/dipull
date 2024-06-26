import "moment-timezone";
import moment from "moment";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import xss from "xss";

import { connectToDatabase } from "@/utils/db";
import { verify } from "@/utils/jwt";

import { limit } from "../../utils";

const PUT = async (
  req: Request,
  { params }: { params: {
    id: string,
  } }
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

  const { textarea, anonymous, grade } = await req.json();
  if(!textarea) return new NextResponse(JSON.stringify({
    message: "내용을 입력해주세요.",
  }), {
    status: 400,
    headers: new_headers
  });
  else if(textarea.length > limit) return new NextResponse(JSON.stringify({
    message: `최대 ${limit}자까지 입력 가능합니다.`,
  }), {
    status: 400,
    headers: new_headers
  });
  
  const client = await connectToDatabase();
  const statesCollection = client.db().collection("states");
  const state = await statesCollection.findOneAndUpdate({
    type: "bamboo_comment",
  }, {
    $inc: {
      [`count.${params.id}`]: 1,
    }
  }, {
    upsert: true,
    returnDocument: "after",
  });
  const bambooCommentCollection = client.db().collection("bamboo_comment");
  const { insertedId } = await bambooCommentCollection.insertOne({
    document: params.id,
    user: verified.payload.id,
    text: xss(textarea),
    timestamp: moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"),
    anonymous: anonymous, 
    grade: grade,
    number: state?.count?.[params.id] || 0,
  });

  const bambooCollection = client.db().collection("bamboo");
  const _this = await bambooCollection.findOne({
    _id: ObjectId.createFromHexString(params.id),
  });

  if (_this) {
    const notificationCollection = client.db().collection("notification");
    const userNumber = verified.payload.data.number;
    const gradeNaN = isNaN(Math.floor(userNumber / 1000));
    const gradeString = gradeNaN ? "졸업생 " : `${Math.floor(userNumber / 1000)}학년 `;
    const nameString = `${grade ? gradeString : ""}${anonymous ? "익명" : verified.payload.data.name}`;
    const notification_query = {
      id: _this.user,
      payload: {
        title: "누군가 댓글을 남겼어요!",
        body: `[${nameString}] ${xss(textarea)}`,
      },
      type: "bamboo-comment",
      time: "1999-12-31 23:59:59",
    };
    await notificationCollection.insertOne(notification_query);
  }

  if(!insertedId) return new NextResponse(JSON.stringify({
    message: "제보에 실패했습니다.",
  }), {
    status: 500,
    headers: new_headers
  });
  else return new NextResponse(JSON.stringify({
    message: "제보에 성공했습니다.",
  }), {
    status: 200,
    headers: new_headers
  });  
};

export default PUT;