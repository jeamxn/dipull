import { Db, MongoClient } from "mongodb";

import { Timetable } from "@/app/timetable/[grade]/[class]/utils";

const uri = process.env.MONGODB_URI || "";
const options = {};

let cachedClient: Db | null = null;

// DB 연결
const connectToDatabase = async () => {
  // 이미 연결된 클라이언트가 있다면 그 클라이언트를 반환
  if (cachedClient) {
    return cachedClient;
  }

  // 새로운 클라이언트 생성
  const client = (await MongoClient.connect(uri, options)).db();
  cachedClient = client;
  return client;
};

const timetable = async () => {
  const client = await connectToDatabase();
  return client.collection<Timetable>("timetables");
};

export const collections = {
  timetable
};