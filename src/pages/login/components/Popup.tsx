import React, { useEffect, useRef, useState } from "react";
import styles from "./popup.module.css";

interface PopupProps {
  password: string;
  onClose: () => void;
}

const TOTAL_SECONDS = 60;

const Popup: React.FC<PopupProps> = ({ password, onClose }) => {
  const [secondsLeftUntilPopupClose, setSecondsLeftUntilPopupClose] = useState(TOTAL_SECONDS);
  const timerRef = useRef<number | null>(null);
  const closedRef = useRef(false); 

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setSecondsLeftUntilPopupClose((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  // Closing automaticaly when timer finish
  useEffect(() => {
    if (secondsLeftUntilPopupClose === 0 && !closedRef.current) {
      closedRef.current = true;
      onClose();
    }
  }, [secondsLeftUntilPopupClose, onClose]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    alert("הסיסמה הועתקה");
  };

  const handleCloseClick = () => {
    const ok = window.confirm("לסגור את החלון? לאחר הסגירה לא תוכל לראות שוב את הסיסמה.");
    if (ok && !closedRef.current) {
      closedRef.current = true;
      onClose();
    }
  };

  const mm = String(Math.floor(secondsLeftUntilPopupClose / 60)).padStart(2, "0");
  const ss = String(secondsLeftUntilPopupClose % 60).padStart(2, "0");
  const remainingPrecent = Math.round((secondsLeftUntilPopupClose / TOTAL_SECONDS) * 100);

  return (
    <div className={styles.backdrop}>
      <div className={styles.popup} role="dialog" aria-modal="true">
        <h2 className={styles.title}>התחברות ראשונה</h2>

        <div className={styles.passwordBox} dir="ltr" aria-live="polite">
          <span className={styles.password}>{password}</span>
          <button
            className={styles.copyBtn}
            onClick={handleCopy}
            title="העתק סיסמה"
            aria-label="העתק סיסמה"
            disabled={secondsLeftUntilPopupClose === 0}
          >
            <svg
              className={styles.copyIcon}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="3" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className={styles.timerWrap} aria-label="טיימר דקה">
          <div className={styles.timerRow}>
            <span className={styles.timerLabel}>זמן שנותר:</span>
            <span className={styles.timerValue}>{mm}:{ss}</span>
          </div>
          <div className={styles.progressOuter} aria-hidden="true">
            <div className={styles.progressInner} style={{ width: `${remainingPrecent}%` }} />
          </div>
        </div>

        <p className={styles.warning}>
          יש לך דקה לשמור את הסיסמא, אל תראה אותה לאף אחד!
        </p>

        <button className={styles.closeBtn} onClick={handleCloseClick}>
          סגור
        </button>
      </div>
    </div>
  );
};

export default Popup;
