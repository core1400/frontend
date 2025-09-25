import React from "react";
import type { InputFieldProps } from "../../../utils/types/InputFieldType";
import styles from "./InputField.module.css";

const InputField: React.FC<InputFieldProps> = ({ label, type = "text", value, onChange }) => {

  return (
    <div className={styles.formControl}>
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={onChange}
        required
        autoComplete="off"
      />
      <label  className={styles.label}>
        {label}
      </label>
    </div>
  );
};

export default InputField;
