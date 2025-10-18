import React, { useState } from "react";
import styles from "./popup.module.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";

interface PopupProps {
  onClose: () => void;
  personalNumber: string;
  password: string;
}

const setPassword = async (personalNumber: string, newPassword: string, password: string) => {
  const response = await axios.post("http://localhost:5215/auth/set-password", {
    personalNumber,
    newPassword,
    password,
  });
  return response.data;
};

const Popup: React.FC<PopupProps> = ({ onClose, personalNumber, password }) => {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pwd = newPassword.trim();
    if (!pwd) return;

    try {
      await setPassword(personalNumber, pwd, password);
      onClose();
    } catch (err: any) {
      console.error("Error setting password:", err);
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.popup} role="dialog" aria-modal="true">
        <h2 className={styles.title}>התחברות ראשונה</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.passwordBox} dir="ltr" aria-live="polite">
            <input
              className={styles.password}
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="הזן סיסמה חדשה"
              aria-label="הזן סיסמה חדשה"
              autoFocus
            />
            <button
              type="button"
              className={styles.copyBtn}
              onClick={() => setShowPassword((v) => !v)}
              title={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
              aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
            >
              {showPassword ? (
                <FiEyeOff className={styles.toggleIcon} aria-hidden="true" />
              ) : (
                <FiEye className={styles.toggleIcon} aria-hidden="true" />
              )}
            </button>
          </div>

          <p className={styles.warning}>בחר סיסמה חזקה ושמור אותה במקום בטוח.</p>

          <button
            className={styles.closeBtn}
            type="submit"
            disabled={!newPassword.trim()}
          >
            שמור סיסמה
          </button>
        </form>
      </div>
    </div>
  );
};

export default Popup;
