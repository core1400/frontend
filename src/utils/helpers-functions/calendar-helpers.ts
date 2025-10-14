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

export const COLOR_PALETTE = [
  "#E6E8FA", "#EFD3F5", "#FAD6E7", "#FFE0F2",
  "#D1F7FF", "#C8F7E4", "#E4F9D4", "#FFF2B3",
  "#FFE7A7", "#FBE0A1", "#FFD8B5", "#FFD6A5",
  "#CDE1FF", "#BFE8FF", "#BDE0FE", "#D7F3FF",
  "#D0F0C0", "#C2F0D6", "#F0FFC2", "#FFF7CC",
  "#F1E0FF", "#E0D1FF", "#E8F0FF", "#F0F4FF",
];

export const HEBREW_DAY_NAMES = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

export const MAX_DESCRIPTION_CHARS = 300;
