"use server";

import { connectToDatabase } from "@/utils/db";

export const getBamboo = async (id: string, start: number) => { 
  const client = await connectToDatabase();
  const statesCollection = client.db().collection("states");
  const counting = (await statesCollection.findOne({
    type: "bamboo",
  }))?.count || 0;

  const bambooCollection = client.db().collection("bamboo");
  const userCollection = client.db().collection("users");
  const bamboos = await bambooCollection.find({
    number: {
      $lte: counting - start,
      $gt: counting - 20 - start,
    }
  }).toArray();
  const newBamboo = await Promise.all(
    bamboos.map(async (bamboo) => {
      const [ user, commnet ] = await Promise.all([
        userCollection.findOne({
          id: bamboo.user,
        }),
        statesCollection.findOne({
          type: "bamboo_comment",
        }),
      ]);
      const gradeNaN = isNaN(Math.floor(user?.number / 1000));
      const grade = gradeNaN ? "졸업생 " : `${Math.floor(user?.number / 1000)}학년 `;
      return {
        _id: bamboo._id,
        user: `${bamboo.grade ? grade : ""}${bamboo.anonymous ? "익명" : user?.name}`,
        text: bamboo.text,
        timestamp: bamboo.timestamp,
        number: bamboo.number,
        isgood: bamboo.good?.includes(id) || false,
        isbad: bamboo.bad?.includes(id) || false,
        good: bamboo.good?.length || 0,
        bad: bamboo.bad?.length || 0,
        comment: commnet?.count?.[bamboo._id.toString()] || 0,
      };
    })
  );

  return newBamboo.sort((a, b) => b.number - a.number);
};