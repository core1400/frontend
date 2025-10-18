import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import styles from "./login.module.css";
import Form from "./components/Form";
import Popup from "./components/Popup";
import { setToken } from "../../store/authslice";
import type { SignInResponse } from "../../services/login-service";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [personalNumber, setPersonalNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "";
  }, [showPopup]);

  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await axios.post<SignInResponse>(
        "http://localhost:5215/auth/sign-in",
        { personalNumber, password }
      );

      if (response.status !== 200) {
        setErrorMsg("שגיאה בהתחברות");
        return;
      }

      if (response.data.isFirstConnection) {
        setShowPopup(true);
      } else {
        // console.log("Received token:", response.data.token); 
        dispatch(setToken(response.data.token));
        navigate("/home");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMsg("שגיאה בהתחברות");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.formWrapper}>
        <Form
          onSubmit={handleSubmit}
          loading={loading}
          errorMsg={errorMsg}
          personalNumber={personalNumber}
          password={password}
          setPersonalNumber={setPersonalNumber}
          setPassword={setPassword}
        />
      </div>

      {showPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          personalNumber={personalNumber}
          password={password}
        />
      )}
    </div>
  );
};

export default Login;
