import { cookies } from "next/headers";
import React from "react";

import { getBambooComment } from "@/app/api/bamboo/[id]/comment/post";
import { getBambooById } from "@/app/api/bamboo/[id]/get";
import { defaultUserData } from "@/app/auth/type";
import { verify } from "@/utils/jwt";

import BambooCommentContent from "./BambooCommentContent";

const MachinePage = async ({
  params
}: {
  params: {
    id: string,
  }
}) => {
  const accessToken = cookies().get("accessToken")?.value || "";
  const verified = await verify(accessToken|| "");
  const userInfo = verified.payload?.data || defaultUserData;

  const init_bamboo = (await getBambooById(verified.payload?.id!, params.id)).data!;
  const init_comment = (await getBambooComment(verified.payload?.id!, params.id, 0)).map(v => ({
    ...v,
    _id: String(v._id),
  }));

  return (
    <BambooCommentContent
      params={params}
      init={{
        bamboo: {
          ...init_bamboo,
          comment: init_comment.length,
          _id: String(init_bamboo._id),
        },
        comment: init_comment,
        userInfo
      }}
    />
  );
};


export default MachinePage;