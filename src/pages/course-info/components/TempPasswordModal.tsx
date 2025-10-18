import { useMemo, useState, useRef, useEffect } from "react";
import { FaCopy } from "react-icons/fa";
import styles from "./temp-password-modal.module.css";
import type { PasswordModalProps } from "../types/course-table.types";

export default function TempPasswordModal({
  isOpen,
  password,
  onChangePassword,
  onCreate,
  onClose,
}: PasswordModalProps) {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  const is8Chars = useMemo(() => (password?.length ?? 0) >= 8, [password]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        setCopied(false);
        copyTimerRef.current = null;
      }, 1500);
    } catch {
    }
  };

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>הגדרת סיסמה למשתמש החדש</h3>
          <button type="button" className={styles.modalCloseBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          <label className={styles.modalLabel}>סיסמה (8+ תווים):</label>
          <div className={styles.passwordRow}>
            <input
              className={`${styles.passwordInput} ${password.length > 0 && !is8Chars ? styles.invalid : ""}`}
              type="text"
              placeholder="הקלד סיסמה (8+ תווים)"
              value={password}
              onChange={(e) => onChangePassword(e.target.value)}
            />
            <button
              type="button"
              className={styles.copyBtn}
              onClick={copyToClipboard}
              disabled={!password}
              title={copied ? "הועתק!" : "העתק סיסמה"}
              aria-label="העתק סיסמה"
            >
              <FaCopy />
            </button>
            {copied && (
              <span className={styles.copiedText} aria-live="polite">הועתק!</span>
            )}
          </div>

          {password.length > 0 && !is8Chars && (
            <div className={styles.errorText}>הסיסמה חייבת להכיל לפחות 8 תווים</div>
          )}
        </div>

        <div className={styles.modalActions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            ביטול
          </button>
          <button
            type="button"
            className={styles.createBtn}
            onClick={onCreate}
            disabled={!is8Chars}
            title={is8Chars ? "צור משתמש" : "הזן לפחות 8 תווים"}
          >
            יצירה
          </button>
        </div>
      </div>
    </div>
  );
}
