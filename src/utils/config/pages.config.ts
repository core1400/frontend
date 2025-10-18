import type { PageConfig } from "../types/navbar.types";
import  CommonForms from "../../pages/common-forms/CommonForms";
import CourseInfo from "../../pages/course-info/CourseInfo";
import Calendar from "../../pages/calendar/Calendar";
import Requests from "../../pages/requests/Requests";
import CourseCreate from "../../pages/course-create/CourseCreate";

// Central config for all navbar/sidebar pages
export const pages: PageConfig[] = [
  {
    id: "calender",
    label: "לו\"ז שבועי",
    path: "/calender",
    roles: ["חניך", "מפקד", "ממ\"ק"],
    element: Calendar
  },
  {
    id: "courseCreation",
    label: "יצירת קורס",
    path: "/course-creation",
    roles: [ "אדמין","מפקד"],
    element: CourseCreate
  },
  {
    id: "commonForms",
    label: "טפסים נפוצים",
    path: "/common-forms",
    roles: ["מפקד", "ממ\"ק"],
    element: CommonForms,
  },
  {
    id: "StudentRequests",
    label: "בקשות חניכים",
    path: "/student-requests",
    roles: ["חניך", "מפקד", "ממ\"ק"],
    element: Requests,
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
    roles: ["מפקד", "ממ\"ק","אדמין"],
    element: CourseInfo,
  },
];
