import { BambooComment } from "@/utils/db/utils";

export type BambooCommentResponse = {
  count: number;
  list: BambooCommentList[];
}

export type BambooCommentList = {
  id: string;
  user: string;
  timestamp: BambooComment["timestamp"];
  text: BambooComment["text"];
  goods: number;
  bads: number;
  isWriter: boolean;
  profile_image: string;
  myGood: boolean;
  myBad: boolean;
}