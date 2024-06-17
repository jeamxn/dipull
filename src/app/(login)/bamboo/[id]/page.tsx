import React from "react";

import { getBambooComment } from "@/app/api/bamboo/[id]/comment/server";
import { getBambooById } from "@/app/api/bamboo/[id]/server";
import { getUserInfo } from "@/utils/server";

import BambooCommentContent from "./BambooCommentContent";

const MachinePage = async ({
  params
}: {
  params: {
    id: string,
  }
}) => {
  const initialUserInfo = await getUserInfo();
  const init_bamboo = (await getBambooById(initialUserInfo.id, params.id)).data!;
  const init_comment = (await getBambooComment(initialUserInfo.id, params.id, 0)).map(v => ({
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
        userInfo: initialUserInfo,
      }}
    />
  );
};


export default MachinePage;