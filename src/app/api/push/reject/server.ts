"use server";

import { connectToDatabase } from "@/utils/db";

export const getReject = async (id: string) => {
  const client = await connectToDatabase();
  const notificationCollection = client.db().collection("notification_settings");
  const notification = (await notificationCollection.findOne({
    user: id,
  }))?.reject || [];
  return notification;
};