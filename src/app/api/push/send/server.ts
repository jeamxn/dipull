"use server";

import webpush from "web-push";

import { connectToDatabase } from "@/utils/db";

export type NotificationPayload = {
  title: string;
  body: string;
};

const sendPushTry = async (subscription: any, payload: NotificationPayload) => {
  try {
    await webpush.sendNotification(subscription.subscription, JSON.stringify(payload));
  }
  catch (e) {
    console.error(e);
  }
};

export const sendPushNotification = async (filter: string[] | string, payload: NotificationPayload) => { 
  const client = await connectToDatabase();
  const statesCollection = client.db().collection("subscriptions");
  const list = Array.isArray(filter) ? filter : [filter];
  const subscriptions = await statesCollection.find({
    id: { $in: list }
  }).toArray();

  const notifications = subscriptions.map(subscription => sendPushTry(subscription, payload));

  await Promise.all(notifications);
};
