import React from "react";
import type { InputFieldProps } from "../../../utils/types/InputFieldType";
import styles from "./InputField.module.css";

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  value,
  onChange,
  labelBgColor,
  textBorderColor,
  width,
  height,
  textSize,
}) => {

  return (
    <div
      className={styles.formControl}
      style={
        {
          "--field-width": width,
          "--field-height": height,
          "--text-size": textSize,
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
        required
        autoComplete="off"
      />

      <label className={styles.label}>{label}</label>
    </div>
  );
};

export default InputField;