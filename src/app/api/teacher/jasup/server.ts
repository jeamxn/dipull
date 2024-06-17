"use server";

import { UserDB } from "@/app/auth/type";
import { connectToDatabase } from "@/utils/db";

import { UserInfo } from "../userinfo/utils";

export const getTeacherJasup = async (id: string) => {
  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  const selectMember = await userCollection.findOne({ id: id }) as unknown as UserDB;
  if (selectMember.type !== "teacher") return {
    error: true,
    message: "교사만 접근 가능합니다."
  };

  const jasupAdminCollection = client.db().collection("jasup_admin");
  const getAll = await jasupAdminCollection.find({}).toArray();

  const users: UserInfo[] = [];
  for(const data of getAll) {
    const user = await userCollection.findOne({ id: data.id }) as unknown as UserDB;
    users.push({
      id: user.id,
      gender: user.gender,
      name: user.name,
      number: user.number,
      profile_image: user.profile_image,
      type: user.type,
    });
  }

  return {
    error: false,
    data: users.sort((a, b) => a.number - b.number)
  };
};