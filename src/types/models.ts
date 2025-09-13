export type Shift = {
  shiftStart: string;
  shiftEnd: string;
  totalHours: {
    hours: number;
    minutes: number;
    decimalHours: number;
  };
  date: Date;
};
