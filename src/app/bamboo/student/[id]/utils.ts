import { ErrorMessage } from "@/components/providers/utils";
import { Bamboo } from "@/utils/db/utils";

import { BambooList } from "../../list/[sort]/[number]/utils";

export type BambooRead = {
  id: string;
  user: BambooList["user"];
  profile_image: string;
  title: Bamboo["title"];
  timestamp: Bamboo["timestamp"];
  content: Bamboo["content"];
  isWriter: boolean;
};

export type BambooReact = {
  goods: BambooList["goods"];
  bads: BambooList["bads"];
  myGood: boolean;
  myBad: boolean;
};

export type BambooReactResponse = {
  success: boolean;
  error?: ErrorMessage;
};