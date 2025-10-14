import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./event-modal.module.css";
import type { EventFormValues } from "../types/event-modal.types";
import { pad2, toMinutes } from "../../../utils/helper-functions/calendar-helpers";

const COLOR_PALETTE = [
  "#E6E8FA", "#EFD3F5", "#FAD6E7", "#FFE0F2",
  "#D1F7FF", "#C8F7E4", "#E4F9D4", "#FFF2B3",
  "#FFE7A7", "#FBE0A1", "#FFD8B5", "#FFD6A5",
  "#CDE1FF", "#BFE8FF", "#BDE0FE", "#D7F3FF",
  "#D0F0C0", "#C2F0D6", "#F0FFC2", "#FFF7CC",
  "#F1E0FF", "#E0D1FF", "#E8F0FF", "#F0F4FF",
];

const MAX_DESCRIPTION_CHARS = 300;

export function EventModal(props: {
  dateForEvent: Date;
  mode?: "create" | "edit";
  readOnly?: boolean;
  initialValues?: EventFormValues;
  onClose: () => void;
  onSubmit: (values: EventFormValues) => void;
  onDelete?: () => void;
}) {
  const {
    dateForEvent,
    mode = "create",
    readOnly = false,
    initialValues,
    onClose,
    onSubmit,
    onDelete,
  } = props;

  const [formValues, setFormValues] = useState<EventFormValues>(
    initialValues ?? {
      title: "",
      description: "",
      startTime: "10:00",
      endTime: "11:00",
      color: "#C8F7E4",
    }
  );

  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const autosizeDescription = () => {
    const el = descriptionRef.current;
    if (!el) return;
    const maxPx = Math.round(window.innerHeight * 0.4); 
    el.style.height = "0px";
    const h = Math.min(el.scrollHeight, maxPx);
    el.style.height = h + "px";
    el.style.overflowY = el.scrollHeight > maxPx ? "auto" : "hidden";
  };

  useEffect(() => { autosizeDescription(); }, []);
  useEffect(() => { autosizeDescription(); }, [formValues.description]);

  // if modal is opened for another event, seed new values
  useEffect(() => {
    if (initialValues) setFormValues(initialValues);
  }, [initialValues]);

  const dateLabel = useMemo(() => {
    const d = dateForEvent;
    return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
  }, [dateForEvent]);

  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isTimeRangeInvalid =
    toMinutes(formValues.startTime) >= toMinutes(formValues.endTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return onClose();
    if (!formValues.title.trim()) return;
    if (isTimeRangeInvalid) return; // אל תשמור אם הטווח לא תקין
    onSubmit(formValues);
  };

  const descriptionLength = formValues.description?.length ?? 0;
  const remainingChars = Math.max(0, MAX_DESCRIPTION_CHARS - descriptionLength);

  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
      <form className={styles.modal} onSubmit={handleSubmit} dir="rtl">
        <div className={styles.modalHeader}>
          <div>
            {readOnly ? "צפייה באירוע" : mode === "edit" ? "עריכת אירוע" : "אירוע חדש"} – {dateLabel}
          </div>
          <button type="button" className={styles.iconBtn} onClick={onClose} aria-label="סגור">✕</button>
        </div>

        {/* scrollable body if content grows */}
        <div className={styles.modalBody}>
          {/* Title */}
          <label className={styles.field}>
            <span>כותרת</span>
            {readOnly ? (
              <div className={`${styles.readonlyBox} ${styles.wrapAnywhere}`}>{formValues.title}</div>
            ) : (
              <input
                required
                type="text"
                dir="auto"
                maxLength={80}
                className={styles.wrapInput}
                value={formValues.title}
                onChange={(e) => setFormValues((s) => ({ ...s, title: e.target.value }))}
              />
            )}
          </label>

          {/* Description */}
          <label className={styles.field}>
            <div className={styles.fieldRow}>
              <span>תיאור</span>
              {!readOnly && (
                <span className={styles.counter} aria-live="polite">
                  נשארו {remainingChars}/{MAX_DESCRIPTION_CHARS}
                </span>
              )}
            </div>

            {readOnly ? (
              <div className={`${styles.readonlyBox} ${styles.wrapAnywhere}`}>
                {formValues.description || "-"}
              </div>
            ) : (
              <textarea
                ref={descriptionRef}
                dir="auto"
                rows={2}
                maxLength={MAX_DESCRIPTION_CHARS}
                className={`${styles.textarea} ${styles.wrapAnywhere}`}
                value={formValues.description ?? ""}
                onChange={(e) =>
                  setFormValues((s) => ({
                    ...s,
                    description: e.target.value.slice(0, MAX_DESCRIPTION_CHARS),
                  }))
                }
              />
            )}
          </label>

          {/* Times */}
          <div className={styles.grid2}>
            <label className={styles.field}>
              <span>משעה</span>
              {readOnly ? (
                <div className={styles.readonlyBox}>{formValues.startTime}</div>
              ) : (
                <input
                  type="time"
                  value={formValues.startTime}
                  onChange={(e) => setFormValues((s) => ({ ...s, startTime: e.target.value }))}
                  className={`${styles.timeInput} ${isTimeRangeInvalid ? styles.invalid : ""}`}
                  aria-invalid={isTimeRangeInvalid}
                />
              )}
            </label>

            <label className={styles.field}>
              <span>עד שעה</span>
              {readOnly ? (
                <div className={styles.readonlyBox}>{formValues.endTime}</div>
              ) : (
                <input
                  type="time"
                  value={formValues.endTime}
                  onChange={(e) => setFormValues((s) => ({ ...s, endTime: e.target.value }))}
                  className={`${styles.timeInput} ${isTimeRangeInvalid ? styles.invalid : ""}`}
                  aria-invalid={isTimeRangeInvalid}
                />
              )}
            </label>
          </div>

          {!readOnly && isTimeRangeInvalid && (
            <div className={styles.timeErrorText}>שעת התחלה חייבת להיות לפני שעת סיום</div>
          )}

          {/* Color */}
          <div className={styles.field}>
            <span>צבע (של רקע)</span>
            <div className={styles.colorGrid} aria-disabled={readOnly}>
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.colorSwatch} ${formValues.color === c ? styles.isActive : ""}`}
                  style={{
                    backgroundColor: c,
                    opacity: readOnly ? 0.6 : 1,
                    pointerEvents: readOnly ? ("none" as const) : "auto",
                  }}
                  onClick={() => !readOnly && setFormValues((s) => ({ ...s, color: c }))}
                  aria-label={`בחר צבע ${c}`}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.modalActions}>
          {readOnly ? (
            <button type="button" className={styles.ghostBtn} onClick={onClose}>סגור</button>
          ) : (
            <>
              {onDelete && (
                <button type="button" className={styles.ghostBtn} onClick={onDelete}>מחק</button>
              )}
              <button
                type="submit"
                className={styles.primaryBtn}
                disabled={isTimeRangeInvalid}
              >
                {mode === "edit" ? "שמור" : "הוסף +"}
              </button>
              <button type="button" className={styles.ghostBtn} onClick={onClose}>בטל</button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
