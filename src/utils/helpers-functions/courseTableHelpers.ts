import type {Row, PersonRole } from "../../pages/course-info/types/course-table.types";

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

  if (typeof d.firstName === "string" && isEmpty(d.firstName)) {
    e.firstName = "שם פרטי הוא שדה חובה";
  }
  if (typeof d.lastName === "string" && isEmpty(d.lastName)) {
    e.lastName = "שם משפחה הוא שדה חובה";
  }
  if (typeof d.emergencyContact === "string" && isEmpty(d.emergencyContact)) {
    e.emergencyContact = "איש קשר לחירום הוא שדה חובה";
  }
  if (typeof d.personalId === "string" && !/^\d+$/.test(d.personalId)) {
    e.personalId = "ספרות בלבד";
  }
  if (typeof d.phone === "string" && !isValidPhone(d.phone)) {
    e.phone = "מבנה נדרש: xxx-xxxxxxx";
  }
  if (typeof d.emergencyPhone === "string" && !isValidPhone(d.emergencyPhone)) {
    e.emergencyPhone = "מבנה נדרש: xxx-xxxxxxx";
  }
  if (typeof d.birthday === "string" && !isValidISODate(d.birthday)) {
    e.birthday = "תאריך לא תקין (yyyy-mm-dd)";
  }
  if (typeof d.answersCount === "number") {
    if (!Number.isInteger(d.answersCount) || d.answersCount < 0) {
      e.answersCount = "מספר שלם, 0 ומעלה";
    }
  }

  return e;
};

export const ROLE_PRIORITY: Record<PersonRole, number> = {
  'ממ"ק': 0,
  'מפקד': 1,
  'חניך': 2,
};

export const buildInitialRows = (): Row[] =>
  Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    firstName: "שם " + (i + 1),
    lastName: "משפחה " + (i + 1),
    personalId: "12345" + i,
    phone: "050-123456" + i,
    birthday: "199" + (i % 10) + "-01-01",
    emergencyContact: "איש קשר " + (i + 1),
    emergencyPhone: "052-654321" + i,
    answersCount: i % 5,
    courseId: 1000 + (i % 3),
  }));

  