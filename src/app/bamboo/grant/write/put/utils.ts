export type BambooWriteResponse = {
  success: boolean;
  error?: {
    title?: string;
    description?: string;
  }
}