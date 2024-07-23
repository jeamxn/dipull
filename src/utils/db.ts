// import { MongoClient } from "mongodb";

import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "";
const options = {};

// DB 연결
export const connectToDatabase = async () => {
  return mongoose.connect(uri);
};