import React from "react";
import styles from "./Login.module.css";
import Form from "./components/form";

const Login: React.FC = () => {
  return (
    <div className="container">
      <div className={styles.page}>
        <div className={styles.formWrapper}>
          <Form />
        </div>
      </div>
    </div>
  );
};

export default Login;
