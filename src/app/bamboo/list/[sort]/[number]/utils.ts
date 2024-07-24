import { Bamboo } from "@/utils/db/utils";

export type BambooResponse = {
  count: number;
  list: BambooList[];
}

export type BambooList = {
  user: string;
  title?: Bamboo["title"];
  timestamp: Bamboo["timestamp"];
  // content: Bamboo["content"];
  goods: number;
  bads: number;
  myGood: boolean;
  myBad: boolean;
}