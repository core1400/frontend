import React, { useState } from "react";
import styles from "./form.module.css";
import InputField from "../../../components/common/InputField/InputField";

const Form: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.loginCard}>
      <div className={styles.cardBackdrop} />
      <form className={styles.loginForm}>
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

        <div className={styles.actions}>
          <button className={styles.submitButton}>Login</button>
        </div>
      </form>
    </div>
  );
};

export default Form;
