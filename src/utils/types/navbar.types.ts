export type Role = "חניך" | "מפקד" | "ממ\"ק" | "אדמין";

export interface PageConfig {
  id: string;
  label: string;
  path: string;
  roles: Role[];   // which roles can see this page
}