export type BambooCommentWriteResponse = {
  success: boolean;
  error?: {
    title?: string;
    description?: string;
  }
}