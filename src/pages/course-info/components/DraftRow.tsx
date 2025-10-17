import styles from "./course-table.module.css";
import Stepper from "./Stepper";
import DatePickerCell from "./DatePickerCell";
import type { Row, DraftRowProps } from "../types/course-table.types";
import { onlyDigits, formatPhone } from "../../../utils/helpers-functions/courseTableHelpers";

export default function DraftRow({
  draft,
  errors,
  isManager,
  userRole,
  draftRole,
  onDraftRoleChange,
  onDraftChange,
  onSave,
  onCancel,
  canSave,
  rowNumber,
}: DraftRowProps) {
  return (
    <tr>
      <td>{rowNumber}</td>

      <td>
        <input
          className={`${styles.editInput} ${errors.firstName ? styles.invalid : ""}`}
          value={draft.firstName ?? ""}
          onChange={(e) => onDraftChange("firstName", e.target.value as Row["firstName"])}
          autoFocus
        />
        {errors.firstName && <div className={styles.errorText}>{errors.firstName}</div>}
      </td>

      <td>
        <input
          className={`${styles.editInput} ${errors.lastName ? styles.invalid : ""}`}
          value={draft.lastName ?? ""}
          onChange={(e) => onDraftChange("lastName", e.target.value as Row["lastName"])}
        />
        {errors.lastName && <div className={styles.errorText}>{errors.lastName}</div>}
      </td>

      <td>
        <input
          className={`${styles.editInput} ${errors.personalId ? styles.invalid : ""}`}
          value={draft.personalId ?? ""}
          onChange={(e) => onDraftChange("personalId", onlyDigits(e.target.value))}
          inputMode="numeric"
        />
        {errors.personalId && <div className={styles.errorText}>{errors.personalId}</div>}
      </td>

      <td>
        <input
          className={`${styles.editInput} ${errors.phone ? styles.invalid : ""}`}
          value={draft.phone ?? ""}
          onChange={(e) => onDraftChange("phone", formatPhone(e.target.value))}
          inputMode="tel"
          placeholder="050-1234567"
        />
        {errors.phone && <div className={styles.errorText}>{errors.phone}</div>}
      </td>

      <td>
        <DatePickerCell
          value={draft.birthday ?? ""}
          onChange={(v) => onDraftChange("birthday", v as Row["birthday"])}
          error={errors.birthday}
        />
      </td>

      <td>
        <input
          className={`${styles.editInput} ${errors.emergencyContact ? styles.invalid : ""}`}
          value={draft.emergencyContact ?? ""}
          onChange={(e) => onDraftChange("emergencyContact", e.target.value as Row["emergencyContact"])}
        />
        {errors.emergencyContact && <div className={styles.errorText}>{errors.emergencyContact}</div>}
      </td>

      <td>
        <input
          className={`${styles.editInput} ${errors.emergencyPhone ? styles.invalid : ""}`}
          value={draft.emergencyPhone ?? ""}
          onChange={(e) => onDraftChange("emergencyPhone", formatPhone(e.target.value))}
          inputMode="tel"
          placeholder="050-1234567"
        />
        {errors.emergencyPhone && <div className={styles.errorText}>{errors.emergencyPhone}</div>}
      </td>

      <td>
        <Stepper
          value={draft.answersCount ?? 0}
          onChange={(val) => onDraftChange("answersCount", val as Row["answersCount"])}
        />
      </td>

      {isManager && (
        <td>
          <select
            className={styles.roleSelect}
            value={draftRole}
            onChange={(e) => onDraftRoleChange(e.target.value as any)}
          >
            {userRole === "אדמין" && <option value='ממ"ק'>ממ"ק</option>}
            <option value="מפקד">מפקד</option>
            <option value="חניך">חניך</option>
          </select>
        </td>
      )}

      <td>
        <div className={styles.actions}>
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
        </div>
      </td>
    </tr>
  );
}
