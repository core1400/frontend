import React, { useEffect, useState } from "react";
import styles from "./login.module.css";
import Form from "./components/Form";
import Popup from "./components/Popup";
import type { LoginCredentials, LoginResult } from "./types/login.types";


async function loginRequest(creds: LoginCredentials): Promise<LoginResult> {
  await new Promise((r) => setTimeout(r, 600));

  if (!creds.username || !creds.password) {
    return { success: false, firstLogin: false, message: "פרטים חסרים" };
  }

  // the backend answer, currently a demo answer
  return {
    success: true,
    firstLogin: true,           // answer from backend
    tempPassword: "A7F9-3QZP-12"// backend gives the password
  };

  // if its not first time demo:
  // return { success: true, firstLogin: false };
}

const Login: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [showPopup]);

  const handleSubmit = async (creds: LoginCredentials) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await loginRequest(creds);

      if (!res.success) {
        setErrorMsg(res.message || "שגיאה בהתחברות");
        return;
      }

      if (res.firstLogin && res.tempPassword) {
        setTempPassword(res.tempPassword);
        setShowPopup(true);
      } else {
        // TODO: navigate("/home")
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.formWrapper}>
        <Form onSubmit={handleSubmit} loading={loading} />
      </div>

      {errorMsg && (
        <div className={styles.errorMsg}>
          {errorMsg}
        </div>
      )}


      {showPopup && tempPassword && (
        <Popup
          password={tempPassword}
          onClose={() => {
            setShowPopup(false);
            setTempPassword(null);
          }}
        />
      )}
    </div>
  );
};

export default Login;
