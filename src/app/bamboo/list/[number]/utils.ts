import { Bamboo } from "@/utils/db/utils";

export type BambooResponse = {
  user: string;
  title?: Bamboo["title"];
  // content: Bamboo["content"];
  goods: number;
  bads: number;
  myGood: boolean;
  myBad: boolean;
}