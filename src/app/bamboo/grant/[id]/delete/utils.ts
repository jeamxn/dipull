export type BambooDeleteResponse = {
  success: boolean;
  error?: {
    title?: string;
    description?: string;
  }
}