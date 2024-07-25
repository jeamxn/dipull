import { Bamboo } from "@/utils/db/utils";

export type BambooResponse = {
  count: number;
  list: BambooList[];
}

export type BambooList = {
  id: Bamboo["id"];
  user: string;
  title: Bamboo["title"];
  timestamp: Bamboo["timestamp"];
  // content: Bamboo["content"];
  goods: number;
  bads: number;
  comments: number;
  // myGood: boolean;
  // myBad: boolean;
}

export const userProject = {
  $concat: [
    {
      $cond: {
        if: { $eq: ["$grade", true] },
        then: {
          $concat: [
            {
              $toString: {
                $trunc: {
                  $divide: [{
                    $ifNull: ["$userInfo.number", 0]
                  }, 1000]
                },
              }
            },
            "학년 "]
        },
        else: ""
      }
    },
    {
      $cond: {
        if: { $eq: ["$anonymous", false] },
        then: {
          $ifNull: ["$userInfo.name", "익명"]
        },
        else: "익명"
      }
    }
  ]
};

export const titleProject = {
  $ifNull: [
    "$title",
    {
      $concat: [
        {
          $substrCP: ["$content", 0, 30],
        },
        "..."
      ]
    }
  ],
};

export const goodsProject = {
  $size: {
    $ifNull: ["$good", []]
  }
};

export const badsProject = {
  $size: {
    $ifNull: ["$bad", []]
  }
};

export type BambooSort = "recent" | "daily" | "weekly" | "monthly" | "all";