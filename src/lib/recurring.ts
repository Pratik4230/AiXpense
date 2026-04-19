import type { Frequency } from "@/constants/expense";

export function computeNextDueDate(
  from: Date,
  frequency: Frequency,
  recurOnDate?: number,
): Date {
  const d = new Date(from);
  switch (frequency) {
    case "daily":
      d.setDate(d.getDate() + 1);
      break;
    case "weekly":
      d.setDate(d.getDate() + 7);
      break;
    case "monthly": {
      const day = recurOnDate ?? d.getDate();
      d.setMonth(d.getMonth() + 1);
      d.setDate(Math.min(day, 28));
      break;
    }
    case "yearly":
      d.setFullYear(d.getFullYear() + 1);
      break;
  }
  return d;
}

export function getInitialNextDueDate(
  startDate: Date,
  frequency: Frequency,
  recurOnDate?: number,
): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (frequency === "monthly" && recurOnDate) {
    const day = Math.min(recurOnDate, 28);
    const candidate = new Date(startDate);
    candidate.setHours(0, 0, 0, 0);
    candidate.setDate(day);

    if (candidate < today) {
      candidate.setMonth(candidate.getMonth() + 1);
      candidate.setDate(day);
    }
    if (candidate < today) {
      candidate.setMonth(candidate.getMonth() + 1);
      candidate.setDate(day);
    }
    return candidate;
  }

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  if (start >= today) return start;

  let next = new Date(start);
  while (next < today) {
    next = computeNextDueDate(next, frequency, recurOnDate);
  }
  return next;
}
