export type MachineEditResponse = {
  success: boolean;
  error?: {
    title?: string;
    description?: string;
  }
}