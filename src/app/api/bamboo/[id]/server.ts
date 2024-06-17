"use server";

import "moment-timezone";
import { ObjectId } from "mongodb";

import { Data } from "@/app/(login)/bamboo/page";
import { connectToDatabase } from "@/utils/db";

export const getBambooById = async (userid: string, bambooid: string) => {
  const client = await connectToDatabase();
  const bambooCollection = client.db().collection("bamboo");
  const objcet_id = ObjectId.createFromHexString(bambooid);
  const bamboo = await bambooCollection.findOne({
    _id: objcet_id,
  });
  const userCollection = client.db().collection("users");

  if (!bamboo) return {
    error: true,
    message: "해당하는 글을 찾을 수 없습니다.",
  };

  const user = await userCollection.findOne({
    id: bamboo.user,
  });
  const newBamboo: Data = {
    _id: bamboo._id,
    user: `${bamboo.grade ? `${Math.floor(user?.number / 1000)}학년 ` : ""}${bamboo.anonymous ? "익명" : user?.name}`,
    text: bamboo.text,
    timestamp: bamboo.timestamp,
    number: bamboo.number,
    isgood: bamboo.good?.includes(userid) || false,
    isbad: bamboo.bad?.includes(userid) || false,
    good: bamboo.good?.length || 0,
    bad: bamboo.bad?.length || 0,
  };

  return {
    error: false,
    data: newBamboo,
  };
};