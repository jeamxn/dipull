import { ErrorMessage } from "@/components/providers/utils";

import { BambooCommentList } from "../../../[sort]/[number]/utils";

export type BambooCommentReactResponse = {
  success: boolean;
  data?: BambooCommentReact;
  error?: ErrorMessage;
};

export type BambooCommentReact = {
  goods: BambooCommentList["goods"];
  bads: BambooCommentList["bads"];
  myGood: boolean;
  myBad: boolean;
};