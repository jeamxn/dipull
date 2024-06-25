import "moment-timezone";
import moment from "moment";
import { NextResponse } from "next/server";

import { sendPushNotification } from "@/app/api/push/send/server";
import { getApplyStartDate } from "@/app/api/stay/utils";
import { connectToDatabase } from "@/utils/db";

const GET = async (
  req: Request
) => {
  const new_headers = new Headers();
  new_headers.append("Content-Type", "application/json; charset=utf-8");
  
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse(JSON.stringify({
      success: false,
      message: "Unauthorized",
    }), {
      status: 401,
      headers: new_headers
    });
  }

  const client = await connectToDatabase();
  const notificationCollection = client.db().collection("notification");
  const now = moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
  const notifications = await notificationCollection.aggregate([
    {
      $match: {
        time: { $lt: now },
      }
    },
    {
      $project: {
        _id: "$_id",
        data: {
          id: "$id",
          payload: "$payload",
        }
      }
    }
  ]).toArray();

  const sendAndDelete = async (notification: any) => { 
    await sendPushNotification(notification.data.id, notification.data.payload);
    await notificationCollection.deleteOne({ _id: notification._id });
  };
  const notification_promise = notifications.map(async notification => sendAndDelete(notification));

  await Promise.all(notification_promise);

  return new NextResponse(JSON.stringify({
    success: true,
    message: "Success",
  }), {
    status: 200,
    headers: new_headers
  });
};

export default GET;