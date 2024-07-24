import { Db, MongoClient } from "mongodb";

import { Machine, Machine_list, Timetable, UserInfo } from "./utils";

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

const users = async () => {
  const client = await connectToDatabase();
  return client.collection<UserInfo>("users");
};

const refresh_tokens = async () => { 
  const client = await connectToDatabase();
  return client.collection("refresh_tokens");
};

const machine_list = async () => { 
  const client = await connectToDatabase();
  return client.collection<Machine_list>("machine_list");
};

const machine = async () => { 
  const client = await connectToDatabase();
  return client.collection<Machine>("machine");
};

export const collections = {
  timetable,
  users,
  refresh_tokens,
  machine_list,
  machine,
};