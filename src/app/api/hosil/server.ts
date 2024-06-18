"use server";

import { connectToDatabase } from "@/utils/db";

export type Hosil = {
  [key: number]: ({
    id: string;
    name: string;
    number: number;
  } | null)[];
};

export const getHosil = async () => { 
  const client = await connectToDatabase();
  const hosilCollection = client.db().collection("hosil");
  const aggregationPipeline = [
    {
      $lookup: {
        from: "users",
        localField: "id",
        foreignField: "id",
        as: "userInfo"
      }
    },
    {
      $unwind: "$userInfo"
    },
    {
      $project: {
        _id: 0,
        id: "$id",
        name: "$userInfo.name",
        number: "$userInfo.number",
        hosil: "$hosil",
        hnumber: "$hnumber",
      }
    },
    {
      $match: {}
    }
  ];
  const result = await hosilCollection.aggregate(aggregationPipeline).toArray();

  const hosil = [
    202, 203, 204, 205, 206, 207, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222,
    302, 303, 304, 
  ];
  const data: Hosil = {};
  for (const hosilNumber of hosil) {
    data[hosilNumber] = Array(6).fill(null);
  }
  for (const { id, name, number, hosil, hnumber } of result) {
    data[hosil][hnumber] = { id, name, number };
  }

  return data;
};