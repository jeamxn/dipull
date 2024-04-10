export type AtheleticScoreDB = {
  _id: string;
  team: "white" | "blue";
  score: string;
  type: "score" | "set";
}
