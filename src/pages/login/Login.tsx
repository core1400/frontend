import React from "react";
import styles from "./login.module.css";
import Form from "./components/Form";

const Login: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.formWrapper}>
        <Form />
      </div>
    </div>
  );
};

export default Login;
