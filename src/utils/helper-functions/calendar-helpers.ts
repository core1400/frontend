/** Utilities that do not depend on React state/UI */

/** 2-digit zero pad */
export const zeroPad2 = (n: number) => String(n).padStart(2, "0");

/** Format Date -> "YYYY-MM-DD" */
export const formatYmd = (d: Date) =>
  `${d.getFullYear()}-${zeroPad2(d.getMonth() + 1)}-${zeroPad2(d.getDate())}`;

/** Week starts on Sunday (0). Returns the Sunday of the given date at 00:00 */
export const getWeekStartSunday = (d: Date) => {
  const copy = new Date(d);
  const day = copy.getDay(); // 0..6 (0=Sunday)
  copy.setDate(copy.getDate() - day);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

/** Add days without mutating original date */
export const addDaysSafe = (d: Date, days: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
};

/** "HH:mm - HH:mm" for two Date objects */
export const formatHourRange = (start: Date, end: Date) => {
  const fmt = (t: Date) => `${zeroPad2(t.getHours())}:${zeroPad2(t.getMinutes())}`;
  return `${fmt(start)} - ${fmt(end)}`;
};

/** 2-digit pad for numbers (Hebrew UI uses it in EventModal date label) */
export const pad2 = (n: number) => String(n).padStart(2, "0");

/** Convert "HH:mm" string to total minutes since midnight (safe for compares) */
export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
