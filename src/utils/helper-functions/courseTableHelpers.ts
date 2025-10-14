import type { Test, Row } from "../../pages/course-info/types/course-table.types";

export function makeTests(seed: number): Test[] {
  const base = (n: number) => ((seed * 17 + n * 29) % 41) + 60; // 60–100
  return [
    { name: "מבחן 1", grade: base(1) },
    { name: "מבחן 2", grade: base(2) },
    { name: "מבחן 3", grade: base(3) },
  ];
}

/* ---------- helpers ---------- */
export const onlyDigits = (s: string) => s.replace(/\D+/g, "");

export const formatPhone = (s: string) => {
  const digits = onlyDigits(s).slice(0, 10); // 3 + 7
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 10);
  return part2 ? `${part1}-${part2}` : part1;
};
export const isValidPhone = (s: string) => /^\d{3}-\d{7}$/.test(s);

export const isValidISODate = (s: string) => {
  // expect yyyy-mm-dd
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s);
  // Date must be valid and match same yyyy-mm-dd after toISOString slice
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
};

export const validateDraft = (d: Partial<Row> | null) => {
  const e: Record<string, string> = {};
  if (!d) return e;

  const isEmpty = (v: unknown) => String(v ?? "").trim().length === 0;

  // --- שדות חובה ---
  if (typeof d.firstName === "string" && isEmpty(d.firstName)) {
    e.firstName = "שם פרטי הוא שדה חובה";
  }
  if (typeof d.lastName === "string" && isEmpty(d.lastName)) {
    e.lastName = "שם משפחה הוא שדה חובה";
  }
  if (typeof d.emergencyContact === "string" && isEmpty(d.emergencyContact)) {
    e.emergencyContact = "איש קשר לחירום הוא שדה חובה";
  }

  // personalId: ספרות בלבד
  if (typeof d.personalId === "string" && !/^\d+$/.test(d.personalId)) {
    e.personalId = "ספרות בלבד";
  }

  // phones: xxx-xxxxxxx
  if (typeof d.phone === "string" && !isValidPhone(d.phone)) {
    e.phone = "מבנה נדרש: xxx-xxxxxxx";
  }
  if (typeof d.emergencyPhone === "string" && !isValidPhone(d.emergencyPhone)) {
    e.emergencyPhone = "מבנה נדרש: xxx-xxxxxxx";
  }

  // birthday: yyyy-mm-dd תקין
  if (typeof d.birthday === "string" && !isValidISODate(d.birthday)) {
    e.birthday = "תאריך לא תקין (yyyy-mm-dd)";
  }

  // answersCount: מספר שלם >= 0
  if (typeof d.answersCount === "number") {
    if (!Number.isInteger(d.answersCount) || d.answersCount < 0) {
      e.answersCount = "מספר שלם, 0 ומעלה";
    }
  }

  // tests: שם מבחן לא ריק וציונים בין 0–100
  if (Array.isArray(d.tests)) {
    const hasEmptyName = d.tests.some((t) => isEmpty(t.name));
    if (hasEmptyName) e.testsName = "שם מבחן לא יכול להיות ריק";

    const badGrade = d.tests.some((t) => Number(t.grade) < 0 || Number(t.grade) > 100);
    if (badGrade) e.tests = "ציונים בין 0 ל-100";
  }

  return e;
};

  