import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import moment from "moment";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import firebaseDB from "@/utils/firebase_config";
import { verify } from "@/utils/jwt";

const GET = async (
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

  const db = firebaseDB;
  const currentTime = Timestamp.now();
  const tenMinutesAgo = new Timestamp(currentTime.seconds - (10 * 60), 0);
  
  const q = query(collection(db, "rooms"), where("timestamp", ">=", tenMinutesAgo), where("timestamp", "<=", currentTime));
  const roomsSnapshot = await getDocs(q);

  const roomsData: any[] = [];
  roomsSnapshot.forEach(doc => {
    roomsData.push({
      id: doc.id,
      time: moment(doc.data().timestamp.toDate()).format("YYYY-MM-DD HH:mm:ss"),
      player: doc.data().offer.name,
    });
  });


  return new NextResponse(JSON.stringify({
    ok: true,
    data: roomsData,
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;