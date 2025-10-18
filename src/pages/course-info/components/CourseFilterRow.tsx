import styles from "./course-table.module.css";
import type { CourseFilterRowProps } from "../types/course-table.types";

export default function CourseFilterRow({
  filters,
  onFilterChange,
  isManager,
}: CourseFilterRowProps) {
  return (
    <tr className={styles.filterRow}>
      <th>
        <input
          className={styles.filterInput}
          placeholder="חיפוש"
          value={filters.id}
          onChange={(e) => onFilterChange("id", e.target.value)}
          inputMode="numeric"
        />
      </th>
      <th>
        <input
          className={styles.filterInput}
          placeholder="חיפוש"
          value={filters.firstName}
          onChange={(e) => onFilterChange("firstName", e.target.value)}
        />
      </th>
      <th>
        <input
          className={styles.filterInput}
          placeholder="חיפוש"
          value={filters.lastName}
          onChange={(e) => onFilterChange("lastName", e.target.value)}
        />
      </th>
      <th>
        <input
          className={styles.filterInput}
          placeholder="חיפוש"
          value={filters.personalId}
          onChange={(e) => onFilterChange("personalId", e.target.value)}
          inputMode="numeric"
        />
      </th>
      <th>
        <input
          className={styles.filterInput}
          placeholder="חיפוש"
          value={filters.phone}
          onChange={(e) => onFilterChange("phone", e.target.value)}
          inputMode="tel"
        />
      </th>
      <th>
        <input
          className={styles.filterInput}
          placeholder="חיפוש"
          value={filters.birthday}
          onChange={(e) => onFilterChange("birthday", e.target.value)}
        />
      </th>
      <th>
        <input
          className={styles.filterInput}
          placeholder="חיפוש"
          value={filters.emergencyContact}
          onChange={(e) => onFilterChange("emergencyContact", e.target.value)}
        />
      </th>
      <th>
        <input
          className={styles.filterInput}
          placeholder="חיפוש"
          value={filters.emergencyPhone}
          onChange={(e) => onFilterChange("emergencyPhone", e.target.value)}
          inputMode="tel"
        />
      </th>
      <th>
        <input
          className={styles.filterInput}
          placeholder="חיפוש"
          value={filters.answersCount}
          onChange={(e) => onFilterChange("answersCount", e.target.value)}
          inputMode="numeric"
        />
      </th>
      {isManager && <th></th>}
      <th></th>
    </tr>
  );
}
