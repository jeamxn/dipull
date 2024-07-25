import "moment-timezone";
import moment from "moment";

import { BambooRead } from "@/app/bamboo/student/[id]/utils";
import { Bamboo } from "@/utils/db/utils";

export type BambooResponse = {
  count: number;
  list: BambooList[];
}

export type BambooList = {
  id: BambooRead["id"];
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

export const profile_imageProject = {
  $cond: {
    if: { $eq: ["$anonymous", false] },
    then: {
      $ifNull: ["$userInfo.profile_image", "/public/icons/icon-192-maskable.png"]
    },
    else: "/public/icons/icon-192-maskable.png"
  }
};

export const isWriterProject = (id: string) => ({
  $cond: {
    if: { $eq: ["$user", id] },
    then: true,
    else: false
  }
});

export const sortQuery = {
  recent: {
    _id: -1,
  },
  oldest: {
    _id: 1,
  },
  daily: {
    popularity: -1,
  },
  weekly: {
    popularity: -1,
  },
  monthly: {
    popularity: -1,
  },
  all: {
    popularity: -1,
  },
};

const today = moment().tz("Asia/Seoul");

export const matchQuery = {
  recent: {},
  oldest: {},
  daily: {
    timestamp: {
      $gte: today.clone().subtract(1, "days").format("YYYY-MM-DD HH:mm:ss"),
    }
  },
  weekly: {
    timestamp: {
      $gte: today.clone().subtract(7, "days").format("YYYY-MM-DD HH:mm:ss"),
    }
  },
  monthly: {
    timestamp: {
      $gte: today.clone().subtract(1, "month").format("YYYY-MM-DD HH:mm:ss"),
    }
  },
  all: {},
};

export type BambooSort = "recent" | "daily" | "weekly" | "monthly" | "all" | "oldest";