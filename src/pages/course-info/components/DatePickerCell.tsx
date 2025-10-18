import { useRef } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import styles from "./course-table.module.css";
import type { DatePickerCellProps } from "../types/course-table.types";

export default function DatePickerCell({ value, onChange, error }: DatePickerCellProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const showPicker = () => {
    const el = inputRef.current;
    if (!el) return;
    const prevRO = el.readOnly;
    el.readOnly = false;
    try {
      if (typeof el.showPicker === "function") {
        el.showPicker();
      } else {
        el.focus();
        el.click();
      }
    } finally {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.readOnly = prevRO;
      }, 0);
    }
  };

  return (
    <div className={styles.inputWithButton}>
      <input
        ref={inputRef}
        className={`${styles.editInput} ${error ? styles.invalid : ""}`}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly
        onKeyDown={(e) => e.preventDefault()}
      />
      <button
        type="button"
        className={styles.iconBtn}
        onClick={showPicker}
        title="בחר תאריך"
        aria-label="בחר תאריך"
      >
        <FaCalendarAlt />
      </button>
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  );
}
