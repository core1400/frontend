import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
// TEMP: reuse page CSS until we split it
import styles from "./course-creation-form.module.css";

import InputField from "../../../components/common/InputField/InputField";
import type { Trainee } from "../types/course-types.types";
import {
  isDigitsOnly,
  isDigitsList,
  splitDigitsList,
  everyTokenIsNumber,
} from "../../../utils/helpers-functions/course-create-helpers";

export default function CourseCreationForm() {
  /* Course form state */
  const [courseName, setCourseName] = useState("");
  const [courseNumber, setCourseNumber] = useState("");
  const [commandersRaw, setCommandersRaw] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [mmkNumber, setMmkNumber] = useState("");

  /* Trainees */
  const [traineeList, setTraineeList] = useState<Trainee[]>([]);
  const [newTraineePersonalNumber, setNewTraineePersonalNumber] = useState("");

  /* Derived */
  const commanderPersonalNumbers = useMemo(
    () => splitDigitsList(commandersRaw),
    [commandersRaw]
  );
  const mmkNumberValid = isDigitsOnly(mmkNumber);
  const courseNumberValid = isDigitsOnly(courseNumber);
  const commandersRawValid =
    isDigitsList(commandersRaw) &&
    everyTokenIsNumber(commanderPersonalNumbers);
  const traineePnValid = isDigitsOnly(newTraineePersonalNumber);

  /* Mock for backend later */
  async function fetchTraineeByPersonalNumber(
    personalNumber: string
  ): Promise<{ name: string | null }> {
    return { name: null };
  }

  /* Handlers */
  const handleAddTrainee = async () => {
    const pn = newTraineePersonalNumber.trim();
    if (!pn || !/^\d+$/.test(pn)) return; 

    if (traineeList.some((t) => t.personalNumber === pn)) {
      alert("מספר אישי זה כבר קיים ברשימה");
      return;
    }

    const { name } = await fetchTraineeByPersonalNumber(pn);
    setTraineeList((prev) => [
      ...prev,
      { id: crypto.randomUUID(), personalNumber: pn, name },
    ]);
    setNewTraineePersonalNumber("");
  };

  const handleRemoveTrainee = (id: string) =>
    setTraineeList((prev) => prev.filter((t) => t.id !== id));

  const handleResetForm = () => {
    setCourseName("");
    setCourseNumber("");
    setCommandersRaw("");
    setDepartmentName("");
    setTraineeList([]);
    setNewTraineePersonalNumber("");
    setMmkNumber("");
  };

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();

    if (
      !courseNumberValid ||
      !commandersRawValid ||
      traineeList.some((t) => !/^\d+$/.test(t.personalNumber))
    ) {
      alert("תקן את השדות המסומנים באדום לפני שליחה.");
      return;
    }

    const payload = {
      name: courseName,
      number: courseNumber,
      mmknumber: mmkNumber,
      department: departmentName,
      commanders: commanderPersonalNumbers,
      trainees: traineeList.map((t) => ({
        personalNumber: t.personalNumber,
        name: t.name ?? null,
      })),
    };

    console.log("Submitting course:", payload);
    alert("הטופס מוכן – ראה קונסול.");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmitForm} dir="rtl">
      {/* Course name (טקסט חופשי) */}
      <div>
        <InputField
          label="שם קורס"
          type="text"
          value={courseName}
          valueColor="#000"
          labelBgColor="#ffffff"
          textBorderColor="#8bc4a3"
          width="100%"
          height="44px"
          textSize="16px"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setCourseName(e.target.value)
          }
        />
      </div>

      <div>
        <InputField
          label={"מס' אישי של ממ\"ק"}
          type="text"
          value={mmkNumber}
          valueColor="#000"
          labelBgColor="#ffffff"
          textBorderColor={mmkNumberValid ? "#8bc4a3" : "#e06666"}
          width="100%"
          height="44px"
          textSize="16px"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMmkNumber(e.target.value)
          }
        />
      </div>

      {/* Course number – רק ספרות + הודעת שגיאה */}
      <div>
        <InputField
          label="מספר קורס (לדוגמה: 1400)"
          type="text"
          value={courseNumber}
          valueColor="#000"
          labelBgColor="#ffffff"
          textBorderColor={courseNumberValid ? "#8bc4a3" : "#e06666"}
          width="100%"
          height="44px"
          textSize="16px"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setCourseNumber(e.target.value)
          }
        />
        {!courseNumberValid && (
          <span className={styles.errorText}>יש להזין ספרות בלבד.</span>
        )}
      </div>

      {/* Commanders – רק ספרות/רווחים/פסיקים + chips + שגיאה */}
      <div>
        <InputField
          label="מספרים אישיים של מפקדים (מופרדים בפסיק/רווח)"
          type="text"
          value={commandersRaw}
          valueColor="#000"
          labelBgColor="#ffffff"
          textBorderColor={commandersRawValid ? "#8bc4a3" : "#e06666"}
          width="100%"
          height="44px"
          textSize="16px"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setCommandersRaw(e.target.value)
          }
        />
        {!commandersRawValid && (
          <span className={styles.errorText}>
            מותר רק ספרות, פסיקים ורווחים.
          </span>
        )}

        {commanderPersonalNumbers.length > 0 && (
          <div className={styles.chipsRow}>
            {commanderPersonalNumbers.map((pn) => (
              <span key={pn} className={styles.chip}>
                {pn}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <InputField
          label='שם מחלקה (לדוגמה: ביסל"ט)'
          type="text"
          value={departmentName}
          valueColor="#000"
          labelBgColor="#ffffff"
          textBorderColor="#8bc4a3"
          width="100%"
          height="44px"
          textSize="16px"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setDepartmentName(e.target.value)
          }
        />
      </div>

      <div className={styles.divider} />

      <div className={styles.addTraineeSection}>
        <span className={styles.addLabel}>הוסף חניך:</span>

        <div className={styles.addControls}>
          <InputField
            label="מספר אישי"
            type="text"
            value={newTraineePersonalNumber}
            valueColor="#000"
            labelBgColor="#ffffff"
            textBorderColor={traineePnValid ? "#8bc4a3" : "#e06666"}
            width="240px"
            height="44px"
            textSize="16px"
            required={false}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewTraineePersonalNumber(e.target.value)
            }
          />
          <button
            type="button"
            className={styles.addButton}
            onClick={handleAddTrainee}
            aria-label="הוסף חניך"
          >
            +
          </button>
        </div>

        {!traineePnValid && (
          <span className={styles.errorText}>
            מספר אישי חייב להכיל ספרות בלבד.
          </span>
        )}
      </div>

      {/* Table (scrollable) */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: "120px" }}>מספר אישי</th>
              <th>שם</th>
              <th style={{ width: "120px" }}>פעולות</th>
            </tr>
          </thead>
        </table>

        <div className={styles.tableBodyScroll} aria-live="polite">
          <table className={styles.table}>
            <tbody>
              {traineeList.length === 0 ? (
                <tr>
                  <td colSpan={3} className={styles.emptyCell}>
                    אין חניכים בטבלה עדיין
                  </td>
                </tr>
              ) : (
                traineeList.map((t) => (
                  <tr key={t.id}>
                    <td className={styles.mono}>{t.personalNumber}</td>
                    <td className={styles.nameCell}>
                      {t.name || <span className={styles.placeholder}>—</span>}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => handleRemoveTrainee(t.id)}
                      >
                        הסר
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.primaryButton}>
          שמור קורס
        </button>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={handleResetForm}
        >
          אפס טופס
        </button>
      </div>
    </form>
  );
}
