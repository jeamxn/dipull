import "moment-timezone";
import moment from "moment";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import { collections } from "@/utils/db";
import { accessVerify } from "@/utils/jwt";

import { BambooRead } from "../utils";

import { BambooDeleteResponse } from "./utils";

const DELETE = async (
  req: NextRequest,
  { params }: {
    params: {
      id: BambooRead["id"];
    }
  }
) => {
  try {
    const accessToken = req.cookies.get("access_token")?.value || "";
    const { id } = await accessVerify(accessToken);

    const bambooDB = await collections.bamboo();
    const deleteBamboo = await bambooDB.deleteOne({
      _id: ObjectId.createFromHexString(params.id),
      user: id,
    });

    if (deleteBamboo.deletedCount === 0) {
      throw new Error("대나무를 삭제할 수 없습니다.");
    }

    const response = NextResponse.json<BambooDeleteResponse>({
      success: true,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<BambooDeleteResponse>({
      success: false,
      error: {
        title: "대나무를 삭제하는 중 오류가 발생했습니다.",
        description: e.message,
      }
    }, {
      status: 400,
    });
    console.error(e.message);
    return response;
  }
};

export default DELETE;