import { FaPen, FaTrash } from "react-icons/fa";
import styles from "./course-table.module.css";
import DatePickerCell from "./DatePickerCell";
import Stepper from "./Stepper";
import type { Row, PersonRole, CourseRowProps } from "../types/course-table.types";
import { onlyDigits, formatPhone } from "../../../utils/helpers-functions/courseTableHelpers";

export default function CourseRow({
  item,
  rowValues,
  displayIndex,
  isEditing,
  errors,
  isManager,
  userRole,
  personRole,
  setPersonRole,
  hanterId,
  classRepId,
  onToggleHanter,
  onToggleAkita,
  onDraftChange,
  onStartEdit,
  onSave,
  onCancel,
  onDelete,
  canSave,
}: CourseRowProps) {
  const isHanter = hanterId === item.id;
  const isAkita = classRepId === item.id;

  return (
    <tr className={`${isHanter ? styles.hanterRow : ""} ${isAkita ? styles.akitaRow : ""}`}>
      <td>{displayIndex}</td>

      {/* firstName */}
      <td>
        {isEditing ? (
          <>
            <input
              className={`${styles.editInput} ${errors.firstName ? styles.invalid : ""}`}
              value={rowValues.firstName}
              onChange={(e) => onDraftChange("firstName", e.target.value)}
              autoFocus
            />
            {errors.firstName && <div className={styles.errorText}>{errors.firstName}</div>}
          </>
        ) : (
          <>
            {item.firstName}
            {isHanter && <span className={`${styles.roleBadge} ${styles.roleHanter}`}>חנת״ר</span>}
            {isAkita && <span className={`${styles.roleBadge} ${styles.roleAkita}`}>א' כיתה</span>}
          </>
        )}
      </td>

      {/* lastName */}
      <td>
        {isEditing ? (
          <>
            <input
              className={`${styles.editInput} ${errors.lastName ? styles.invalid : ""}`}
              value={rowValues.lastName}
              onChange={(e) => onDraftChange("lastName", e.target.value)}
            />
            {errors.lastName && <div className={styles.errorText}>{errors.lastName}</div>}
          </>
        ) : (
          item.lastName
        )}
      </td>

      {/* personalId */}
      <td>
        {isEditing ? (
          <>
            <input
              className={`${styles.editInput} ${errors.personalId ? styles.invalid : ""}`}
              value={rowValues.personalId}
              onChange={(e) => onDraftChange("personalId", onlyDigits(e.target.value))}
              inputMode="numeric"
            />
            {errors.personalId && <div className={styles.errorText}>{errors.personalId}</div>}
          </>
        ) : (
          item.personalId
        )}
      </td>

      {/* phone */}
      <td>
        {isEditing ? (
          <>
            <input
              className={`${styles.editInput} ${errors.phone ? styles.invalid : ""}`}
              value={rowValues.phone}
              onChange={(e) => onDraftChange("phone", formatPhone(e.target.value))}
              inputMode="tel"
              placeholder="050-1234567"
            />
            {errors.phone && <div className={styles.errorText}>{errors.phone}</div>}
          </>
        ) : (
          item.phone
        )}
      </td>

      {/* birthday */}
      <td>
        {isEditing ? (
          <DatePickerCell
            value={rowValues.birthday}
            onChange={(v) => onDraftChange("birthday", v as Row["birthday"])}
            error={errors.birthday}
          />
        ) : (
          item.birthday
        )}
      </td>

      {/* emergencyContact */}
      <td>
        {isEditing ? (
          <>
            <input
              className={`${styles.editInput} ${errors.emergencyContact ? styles.invalid : ""}`}
              value={rowValues.emergencyContact}
              onChange={(e) => onDraftChange("emergencyContact", e.target.value)}
            />
            {errors.emergencyContact && <div className={styles.errorText}>{errors.emergencyContact}</div>}
          </>
        ) : (
          item.emergencyContact
        )}
      </td>

      {/* emergencyPhone */}
      <td>
        {isEditing ? (
          <>
            <input
              className={`${styles.editInput} ${errors.emergencyPhone ? styles.invalid : ""}`}
              value={rowValues.emergencyPhone}
              onChange={(e) => onDraftChange("emergencyPhone", formatPhone(e.target.value))}
              inputMode="tel"
              placeholder="050-1234567"
            />
            {errors.emergencyPhone && <div className={styles.errorText}>{errors.emergencyPhone}</div>}
          </>
        ) : (
          item.emergencyPhone
        )}
      </td>

      {/* answersCount */}
      <td>
        {isEditing ? (
          <Stepper
            value={rowValues.answersCount ?? 0}
            onChange={(val) => onDraftChange("answersCount", val as Row["answersCount"])}
          />
        ) : (
          item.answersCount
        )}
      </td>

      {/* role column */}
      {isManager && (
        <td>
          {isEditing ? (
            <select
              className={styles.roleSelect}
              value={personRole ?? "חניך"}
              onChange={(e) => setPersonRole(e.target.value as PersonRole)}
            >
              {userRole === "אדמין" && <option value='ממ"ק'>ממ"ק</option>}
              <option value="מפקד">מפקד</option>
              <option value="חניך">חניך</option>
            </select>
          ) : (
            personRole ?? "חניך"
          )}
        </td>
      )}

      {/* actions */}
      <td>
        <div className={styles.actions}>
          {isEditing ? (
            <>
              <button
                type="button"
                className={styles.saveBtn}
                onClick={onSave}
                disabled={!canSave}
                title={canSave ? "שמירה" : "תקן שדות שגויים"}
              >
                שמירה
              </button>
              <button type="button" className={styles.cancelBtn} onClick={onCancel}>
                ביטול
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={`${styles.roleBtn} ${styles.roleHanterBtn} ${isHanter ? styles.activeRoleBtn : ""}`}
                onClick={onToggleHanter}
                title={isHanter ? "בטל חנת״ר" : "קבע חנת״ר"}
                aria-pressed={isHanter}
              >
                חנת״ר
              </button>
              <button
                type="button"
                className={`${styles.roleBtn} ${styles.roleAkitaBtn} ${isAkita ? styles.activeRoleBtn : ""}`}
                onClick={onToggleAkita}
                title={isAkita ? "בטל א כיתה" : "קבע א כיתה"}
                aria-pressed={isAkita}
              >
                א' כיתה
              </button>

              <button
                type="button"
                className={styles.editBtn}
                onClick={onStartEdit}
                title="עריכה"
                aria-label="עריכה"
              >
                <FaPen />
              </button>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={onDelete}
                title="מחיקה"
                aria-label="מחיקה"
              >
                <FaTrash />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
