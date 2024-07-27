export type WakeupDeleteResponse = {
  success: boolean;
  error?: {
    title?: string;
    description?: string;
  }
}