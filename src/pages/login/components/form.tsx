import React, { useState } from "react";
import styles from "./form.module.css";
import InputField from "../../../components/common/InputField/InputField";

const Form: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.form3d}>
      <div className={styles.formBack} />
      <form className={styles.form}>
        <p className={styles.heading}>התחברות </p>

        <InputField
          label="מס' אישי"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          labelBgColor="#171717"
          textBorderColor="#00ff75"
          width="100%"
          height="3rem"
          textSize="1rem"
        />

        <InputField
          label="סיסמה"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          labelBgColor="#171717"
          textBorderColor="#00ff75"
          width="100%"
          height="3rem"
          textSize="1rem"
        />

        <div className={styles.btn}>
          <button className={styles.button1}>Login</button>
        </div>
      </form>
    </div>
  );
};

export default Form;
