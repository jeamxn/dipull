import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import React from "react";

import { collections } from "@/utils/db";
import { Bamboo as BambooType } from "@/utils/db/utils";
import { accessVerify } from "@/utils/jwt";

import { badsProject, goodsProject, titleProject, userProject } from "../../list/[sort]/[number]/utils";

import BambooPageContent from "./BambooPageContent";
import { BambooRead } from "./utils";

const Bamboo = async ({
  params
}:
  {
    params: {
      id: BambooType["id"] 
    }
  }
) => {
  const authorization = headers().get("cookie");
  const accessToken = authorization?.split("access_token=")[1]?.split(";")[0] || "";
  // const accessToken = req.cookies.get("access_token")?.value || "";
  const { id } = await accessVerify(accessToken);
  const bambooDB = await collections.bamboo();
  const bamboos = await bambooDB.aggregate<BambooRead>([
    {
      $match: {
        _id: new ObjectId(params.id)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "id",
        as: "userInfo"
      }
    },
    {
      $unwind: {
        path: "$userInfo",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        id: {
          $toString: "$_id"
        },
        user: userProject,
        profile_image: {
          $cond: {
            if: { $eq: ["$anonymous", false] },
            then: {
              $ifNull: ["$userInfo.profile_image", "/public/icons/icon-192-maskable.png"]
            },
            else: "/public/icons/icon-192-maskable.png"
          }
        },
        title: titleProject,
        timestamp: "$timestamp",
        content: "$content",
        goods: goodsProject,
        bads: badsProject,
        myGood: {
          $in: [id, {
            $ifNull: ["$good", []]
          }]
        },
        myBad: {
          $in: [id, {
            $ifNull: ["$bad", []]
          }]
        },
      }
    }
  ]).toArray();
  const bamboo = bamboos[0];
  return (
    <BambooPageContent bamboo={bamboo} />
  );
};

export default Bamboo;