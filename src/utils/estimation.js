export function calculateUsage(currentReading, initialReading) {
  return Math.max(0, currentReading - initialReading);
}

export function computeProjections(usage, startDate, readingDate) {
  const start = new Date(startDate);
  const current = new Date(readingDate);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const daysElapsed = Math.ceil((current - start) / (1000 * 60 * 60 * 24));
  const totalCycleDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const projectedUsage = Math.round((usage / daysElapsed) * totalCycleDays);
  const avg = usage / daysElapsed;

  return { projectedUsage, avgPerDay: avg };
}
