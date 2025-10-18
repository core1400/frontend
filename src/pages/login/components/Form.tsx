import React, { useState } from "react";
import styles from "./form.module.css";
import InputField from "../../../components/common/InputField/InputField";
import type { LoginCredentials } from "../types/login.types";

export interface LoginFormProps {
  onSubmit: (creds: LoginCredentials) => void | Promise<void>;
  loading?: boolean;
  errorMsg?: string | null;
}

const Form: React.FC<LoginFormProps> = ({ onSubmit, loading = false, errorMsg }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <div className={styles.loginCard}>
      <div className={styles.cardBackdrop} />
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <p className={styles.loginTitle}>התחברות</p>

        <InputField
          label="מס' אישי"
          type="text"
          value={username}
          valueColor="white"
          onChange={(e) => setUsername(e.target.value)}
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

        {errorMsg && (
          <div className={styles.errorMsg}>
            {errorMsg}
          </div>
        )}

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
