import React from "react";
import styles from "./form.module.css";
import InputField from "../../../components/common/InputField/InputField";

export interface FormProps {
  onSubmit: () => void | Promise<void>;
  loading?: boolean;
  errorMsg?: string | null;
  personalNumber: string;
  password: string;
  setPersonalNumber: (v: string) => void;
  setPassword: (v: string) => void;
}

const Form: React.FC<FormProps> = ({
  onSubmit,
  loading = false,
  errorMsg,
  personalNumber,
  password,
  setPersonalNumber,
  setPassword,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className={styles.loginCard}>
      <div className={styles.cardBackdrop} />
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <p className={styles.loginTitle}>התחברות</p>

        <InputField
          label="מס' אישי"
          type="text"
          value={personalNumber}
          valueColor="white"
          onChange={(e) => setPersonalNumber(e.target.value)}
          labelBgColor="#152411"
          textBorderColor="#00ff75"
          width="100%"
          height="48px"
          textSize="16px"
        />

        <InputField
          label="סיסמה"
          type="password"
          value={password}
          valueColor="#ffffffff"
          onChange={(e) => setPassword(e.target.value)}
          labelBgColor="#152113"
          textBorderColor="#00ff75"
          width="100%"
          height="48px"
          textSize="16px"
        />

        {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "מבצע התחברות..." : "התחברות"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
