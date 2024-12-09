import { Db, MongoClient } from "mongodb";

import { Bamboo, BambooComment, Homecoming, LastRequest, Machine, Machine_list, Machine_Time, Meal, Outing, Refresh_tokenDB, Stay, Studyroom, Timetable, UserInfo, Wakeup } from "./utils";

const uri = process.env.MONGODB_URI || "";
const options = {};

let cachedClient: Db | null = null;

const connectToDatabase = async () => {
  if (cachedClient) {
    return cachedClient;
  }
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

const machine_time = async () => { 
  const client = await connectToDatabase();
  return client.collection<Machine_Time>("machine_time");
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

const stay = async () => { 
  const client = await connectToDatabase();
  return client.collection<Stay>("stay");
};

const studyroom = async () => {
  const client = await connectToDatabase();
  return client.collection<Studyroom>("studyroom");
};

const outing = async () => { 
  const client = await connectToDatabase();
  return client.collection<Outing>("outing");
};

const meal = async () => {
  const client = await connectToDatabase();
  return client.collection<Meal>("meals");
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
  stay,
  studyroom,
  outing,
  machine_time,
  meal
};