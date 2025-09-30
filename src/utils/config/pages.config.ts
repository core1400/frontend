import type {Role} from "../types/navbar.types";
import type { PageConfig } from "../types/navbar.types";

// Central config for all navbar/sidebar pages
export const pages: PageConfig[] = [
  {
    id: "schedule",
    label: "לו\"ז שבועי",
    path: "/schedule",
    roles: ["חניך", "מפקד", "ממ\"ק", "אדמין"],
  },
  {
    id: "forms",
    label: "טפסים שימושיים",
    path: "/forms",
    roles: ["חניך", "מפקד", "ממ\"ק", "אדמין"],
  },
  {
    id: "students",
    label: "מאגר מידע חניכים",
    path: "/students",
    roles: ["מפקד", "ממ\"ק", "אדמין"],
  },
  {
    id: "class",
    label: "חנתר וא' כיתה",
    path: "/class",
    roles: ["חניך", "מפקד", "ממ\"ק"],
  },
  {
    id: "files",
    label: "הגשת טפסים",
    path: "/files",
    roles: ["חניך"],
  },
  {
    id: "admin",
    label: "ניהול מערכת",
    path: "/admin",
    roles: ["אדמין"],
  },
];
