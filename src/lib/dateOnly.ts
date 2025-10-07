import { format } from "date-fns";

export const toYMD = (d: Date) => format(d, "yyyy-MM-dd");
export const fromYMD = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
