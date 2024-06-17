"use server";

import { connectToDatabase } from "@/utils/db";

export const getBambooComment = async (userid: string, bambooid: string, start: number) => { 
  const client = await connectToDatabase();
  const statesCollection = client.db().collection("states");
  const counting = (await statesCollection.findOne({
    type: "bamboo_comment",
  }))?.count?.[bambooid] || 0;

  const bambooCommentCollection = client.db().collection("bamboo_comment");
  const userCollection = client.db().collection("users");
  const bamboos = await bambooCommentCollection.find({
    document: bambooid,
    number: {
      $lte: counting - start,
      $gt: counting - 20 - start,
    }
  }).toArray();
  const newBamboo = await Promise.all(
    bamboos.map(async (bamboo) => {
      const user = await userCollection.findOne({
        id: bamboo.user,
      });
      return {
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
    })
  );

  return newBamboo.sort((a, b) => b.number - a.number);
};