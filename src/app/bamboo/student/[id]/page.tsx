import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

import { collections } from "@/utils/db";
import { accessVerify } from "@/utils/jwt";
import { getServerUser } from "@/utils/server";

import { isWriterProject, profile_imageProject, titleProject, userProject } from "../../list/[sort]/[number]/utils";

import BambooPageContent from "./BambooPageContent";
import { BambooRead } from "./utils";

const Bamboo = async ({
  params
}:
  {
    params: {
      id: BambooRead["id"];
    }
  }
) => {
  const { id } = await getServerUser();
  const bambooDB = await collections.bamboo();

  try {
    const find = await bambooDB.countDocuments({
      _id: ObjectId.createFromHexString(params.id)
    });
    if (find < 1) {
      throw new Error("Bamboo not found");
    }
  }
  catch {
    return redirect("/bamboo");
  }

  const bamboos = await bambooDB.aggregate<BambooRead>([
    {
      $match: {
        _id: ObjectId.createFromHexString(params.id)
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
        _id: 0,
        user: userProject,
        isWriter: isWriterProject(id),
        profile_image: profile_imageProject,
        title: titleProject,
        timestamp: "$timestamp",
        content: "$content",
      }
    }
  ]).toArray();
  const bamboo = bamboos[0];
  return <BambooPageContent bamboo={bamboo} />;
};

export default Bamboo;