export const isDarkColor = (r: number, g: number, b: number): boolean => {
  return Math.sqrt(
    0.299 * (r * r) + 
    0.587 * (g * g) +
    0.114 * (b * b)
  ) <= 127.5;
};