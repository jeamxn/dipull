import { YouTubeSearchResults } from "youtube-search";

export type WakeupData = {
  title: YouTubeSearchResults["title"];
  id: YouTubeSearchResults["id"];
  thumbnails: YouTubeSearchResults["thumbnails"];
  date: string;
  owner: string;
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