export type MachineApplyResponse = {
  success: boolean;
  error?: {
    title?: string;
    description?: string;
  }
}