import React from "react";
import type { InputFieldProps } from "../../../utils/types/InputFieldType";
import styles from "./InputField.module.css"; 

const InputField: React.FC<InputFieldProps> = ({ label, type = "text", value, onChange }) => {
  return (
    <div className={styles.inputField}>
      <input
        className={styles.inputControl}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}   
      />
    </div>
  );
};

export default InputField;
