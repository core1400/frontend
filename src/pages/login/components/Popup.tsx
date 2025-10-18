import React, { useState } from "react";
import styles from "./popup.module.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface PopupProps {
  onSubmit: (password: string) => void | Promise<void>;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ onSubmit, onClose }) => {
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pwd = passwordInput.trim();
    if (!pwd) return;
    onClose();
    void Promise.resolve(onSubmit(pwd)).catch(() => {});
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
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="הזן סיסמה"
              aria-label="הזן סיסמה"
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
            disabled={!passwordInput.trim()}
          >
            שמור סיסמה
          </button>
        </form>
      </div>
    </div>
  );
};

export default Popup;
