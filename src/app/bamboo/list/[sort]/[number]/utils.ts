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
  myGood: boolean;
  myBad: boolean;
}

export type BambooSort = "recent" | "daily" | "weekly" | "monthly" | "all";