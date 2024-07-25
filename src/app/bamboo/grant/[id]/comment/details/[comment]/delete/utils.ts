export type BambooCommentDeleteResponse = {
  success: boolean;
  error?: {
    title?: string;
    description?: string;
  }
}