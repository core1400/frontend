import styles from "./course-table.module.css";
import type { CourseTopBarProps } from "../types/course-table.types";

export default function CourseTopBar({
  userRole,
  courseFilter,
  onChangeCourseFilter,
  onAddRow,
}: CourseTopBarProps) {
  return (
    <div className={styles.topBar}>
      <button type="button" className={styles.addBtn} onClick={onAddRow}>
        {userRole === "אדמין"
          ? 'הוסף חניך / מפקד / ממ"ק'
          : userRole === 'ממ"ק'
          ? "הוסף חניך / מפקד"
          : "הוסף חניך"}
      </button>

      {userRole === "אדמין" && (
        <input
          className={styles.adminCourseInput}
          placeholder="סינון לפי מספר קורס"
          value={courseFilter}
          onChange={(e) => onChangeCourseFilter(e.target.value)}
          inputMode="numeric"
        />
      )}
    </div>
  );
}
