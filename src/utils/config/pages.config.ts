import type { PageConfig } from "../types/navbar.types";
import  CommonForms from "../../pages/common-forms/CommonForms";
import CourseInfo from "../../pages/course-info/CourseInfo";
// Central config for all navbar/sidebar pages
export const pages: PageConfig[] = [
  {
    id: "calender",
    label: "לו\"ז שבועי",
    path: "/calender",
    roles: ["חניך", "מפקד", "ממ\"ק"],
  },
  {
    id: "studentRole",
    label: "חנתר וא' כיתה",
    path: "/student-roles",
    roles: ["מפקד"],
  },
  {
    id: "commonForms",
    label: "טפסים נפוצים",
    path: "/common-forms",
    roles: ["מפקד", "ממ\"ק"],
    element: CommonForms,
  },
  {
    id: "Bakshatz",
    label: "בקש\"צ",
    path: "/bakshatz",
    roles: ["חניך"],
  },
  {
    id: "userManagement",
    label: "ניהול משתמשים",
    path: "/user-managment",
    roles: ["אדמין"],
  },
  {
    id: "exams",
    label: "ניהול מבחנים",
    path: "/exams",
    roles: ["מפקד"],
  },
  {
    id: "courseInfo",
    label: "מידע כללי קורס",
    path: "/course-info",
    roles: ["מפקד", "ממ\"ק"],
    element: CourseInfo,
  },
];
