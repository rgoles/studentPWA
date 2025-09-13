export const calculateShiftDuration = (
  startShift: string,
  endShift: string,
) => {
  const [sh, sm] = startShift.split(":").map(Number);
  const [eh, em] = endShift.split(":").map(Number);

  const startMin = sh * 60 + sm;
  let endMin = eh * 60 + em;

  if (endMin < startMin) endMin += 24 * 60;

  const totalMinutes = endMin - startMin;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const decimalHours = Math.round((totalMinutes / 60) * 100) / 100;
  return { hours, minutes, decimalHours };
};
