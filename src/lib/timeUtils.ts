export const calculateShiftDurationDecimal = (
  startShift: string,
  endShift: string,
): number => {
  const [sh, sm] = startShift.split(":").map(Number);
  const [eh, em] = endShift.split(":").map(Number);

  const startMin = sh * 60 + sm;
  let endMin = eh * 60 + em;

  if (endMin < startMin) endMin += 24 * 60;

  const totalMinutes = endMin - startMin;
  // const hours = Math.floor(totalMinutes / 60);
  // const minutes = totalMinutes % 60;
  const decimalHours = Math.round((totalMinutes / 60) * 100) / 100;
  return decimalHours;
};

export const decimalToHours = (decimalHours: number): string => {
  const decimalPart = Math.round((decimalHours % 1) * 60);
  const hours = Math.floor(decimalHours);
  const finalNumber = [
    String(hours),
    ":",
    String(decimalPart).padStart(2, "0"),
  ];
  return finalNumber.join("");
};
