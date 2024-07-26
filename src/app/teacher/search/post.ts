import moment from "moment";
import "moment-timezone";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { collections } from "@/utils/db";
import { UserInfo } from "@/utils/db/utils";
import { accessVerify } from "@/utils/jwt";

import { UserSearchResponse } from "./utils";

const POST = async (
  req: NextRequest,
) => {
  try {
    const { query } = await req.json();
    if (!query) { 
      throw new Error("검색어를 입력해주세요.");
    }

    const user = await collections.users();
    const find = await user.aggregate<UserInfo>([
      {
        $match: {
          $or: [
            {
              name: {
                $regex: query,
                $options: "i",
              },
            },
            {
              email: {
                $regex: query,
                $options: "i",
              },
            },
            {
              number: Number(query),
            }
          ],
        },
      },
      {
        $limit: 20,
      },
      {
        $unset: ["_id"],
      }
    ]).toArray();
    
    const response = NextResponse.json<UserSearchResponse>({
      success: true,
      data: find,
    });
    return response;
  }
  catch (e: any) {
    const response = NextResponse.json<UserSearchResponse>({
      success: false,
      // message: e.message,
      error: {
        title: "영상 검색을 실패했어요.",
        description: e.message,
      }
    }, {
      status: 400,
    });
    console.error(e.message);
    return response;
  }
};

export default POST;