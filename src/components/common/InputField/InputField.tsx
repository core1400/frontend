import React from "react";
import type { InputFieldProps } from "../../../utils/types/input-field.types";
import styles from "./input-field.module.css";

/**
 * שדה קלט דינאמי עם עיצוב וסטייל משתנים.
 * תומך בכל הפרופס הקיימים + required אופציונלי.
 */
const InputField: React.FC<InputFieldProps & { required?: boolean }> = ({
  label,
  type = "text",
  value,
  valueColor,
  onChange,
  labelBgColor,
  textBorderColor,
  width,
  height,
  textSize,
  required = true
}) => {
  return (
    <div
      className={styles.formControl}
      style={
        {
          "--field-width": width,
          "--field-height": height,
          "--text-size": textSize,
          "--value-color": valueColor,
          "--label-bg": labelBgColor,
          "--border-focus": textBorderColor,
          "--border-pulse-a": "#ffffff",
          "--border-pulse-b": textBorderColor,
        } as React.CSSProperties
      }
    >
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete="off"
      />

      <label className={styles.label}>{label}</label>
    </div>
  );
};

export default InputField;
