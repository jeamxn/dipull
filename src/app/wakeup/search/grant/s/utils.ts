export type YTSearchResponse = {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
  }[]; 
}