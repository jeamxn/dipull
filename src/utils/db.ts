import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const options = {};

let cachedClient: MongoClient | null = null;

// DB 연결
export const connectToDatabase = async () => {
  // 이미 연결된 클라이언트가 있다면 그 클라이언트를 반환
  if (cachedClient) {
    return cachedClient;
  }

  // 새로운 클라이언트 생성
  const client = await MongoClient.connect(uri, options);
  cachedClient = client;
  return client;
};