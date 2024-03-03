import "moment-timezone";
import moment from "moment";
import { YouTubeSearchResults } from "youtube-search";

export type WakeupData = {
  title: YouTubeSearchResults["title"];
  id: YouTubeSearchResults["id"];
  thumbnails: YouTubeSearchResults["thumbnails"];
  date: string;
  owner: string;
  gender: string;
}

export type WakeupDB = WakeupData & {
  _id: string;
}

export type WakeupGET = {
  [key: WakeupDB["id"]]: {
    title: WakeupDB["title"];
    thumbnails: WakeupDB["thumbnails"];
    date: WakeupDB["date"];
    count: number;
  };
};

export const getToday = () => {
  const seoul = moment.tz("Asia/Seoul");
  if(seoul.hour() < 8){
    seoul.subtract(1, "day");
  }
  const today = moment(seoul.format("YYYY-MM-DD"), "YYYY-MM-DD");
  return today;
};