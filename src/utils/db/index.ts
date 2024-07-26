import { Db, MongoClient } from "mongodb";

import { Bamboo, BambooComment, Homecoming, LastRequest, Machine, Machine_list, Refresh_tokenDB, Timetable, UserInfo, Wakeup } from "./utils";

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
  return client.collection<Refresh_tokenDB>("refresh_tokens");
};

const machine_list = async () => { 
  const client = await connectToDatabase();
  return client.collection<Machine_list>("machine_list");
};

const machine = async () => { 
  const client = await connectToDatabase();
  return client.collection<Machine>("machine");
};

const wakeup = async () => { 
  const client = await connectToDatabase();
  return client.collection<Wakeup>("wakeup");
};

const last_request = async () => { 
  const client = await connectToDatabase();
  return client.collection<LastRequest>("last_request");
};

const bamboo = async () => { 
  const client = await connectToDatabase();
  return client.collection<Bamboo>("bamboo");
};

const bamboo_comment = async () => { 
  const client = await connectToDatabase();
  return client.collection<BambooComment>("bamboo_comment");
};

const homecoming = async () => { 
  const client = await connectToDatabase();
  return client.collection<Homecoming>("homecoming");
};

export const collections = {
  timetable,
  users,
  refresh_tokens,
  machine_list,
  machine,
  wakeup,
  last_request,
  bamboo,
  bamboo_comment,
  homecoming,
};