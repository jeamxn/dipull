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
    const client = await connectToDatabase();
    const statesCollection = client.db().collection("subscriptions");
    await statesCollection.deleteOne({ _id: subscription._id });
  }
};

export const sendPushNotification = async (
  filter: string[] | string,
  payload: NotificationPayload,
  type: string,
) => { 
  const client = await connectToDatabase();
  const subscriptionsCollection = client.db().collection("subscriptions");
  const notificationCollection = client.db().collection("notification_settings");
  const list = Array.isArray(filter) ? filter : [filter];
  const settings = (await notificationCollection.aggregate([
    {
      $match: {
        user: { $in: list },
        reject: {
          $not: {
            $in: [type]
          }
        }
      }
    },
    {
      $project: {
        user: "$user",
      }
    }
  ]).toArray()).map(setting => setting.user);
  const subscriptions = await subscriptionsCollection.find({
    id: { $in: settings }
  }).toArray();
  const notifications = subscriptions.map(subscription => sendPushTry(subscription, payload));
  await Promise.all(notifications);
};
