import { FaPlus, FaMinus } from "react-icons/fa";
import styles from "./course-table.module.css";
import type { StepperProps } from "../types/course-table.types";

export default function Stepper({ value, onChange }: StepperProps) {
  return (
    <div className={styles.stepper}>
      <button
        type="button"
        className={styles.iconBtn}
        onClick={() => onChange(Math.max(0, value - 1))}
        title="הפחת אחד"
        aria-label="הפחת אחד"
      >
        <FaMinus />
      </button>

      <div className={styles.stepperValue}>{value}</div>

      <button
        type="button"
        className={styles.iconBtn}
        onClick={() => onChange(value + 1)}
        title="הוסף אחד"
        aria-label="הוסף אחד"
      >
        <FaPlus />
      </button>
    </div>
  );
}
