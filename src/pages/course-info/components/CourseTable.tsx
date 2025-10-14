import { useMemo, useState, useCallback, useRef } from "react";
import styles from "./course-table.module.css";
import { FaPen, FaCalendarAlt, FaPlus, FaMinus } from "react-icons/fa";
import type { Row, Test } from "../types/course-table.types";
import { makeTests, onlyDigits,formatPhone,validateDraft } from "../../../utils/helpers/courseTableHelpers"


export default function CourseTable() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [filters, setFilters] = useState({
    id: "",
    firstName: "",
    lastName: "",
    personalId: "",
    phone: "",
    birthday: "",
    emergencyContact: "",
    emergencyPhone: "",
    answersCount: "",
  });

  const [rows, setRows] = useState<Row[]>(
    Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      firstName: "שם " + (i + 1),
      lastName: "משפחה " + (i + 1),
      personalId: "12345" + i,
      phone: "050-123456" + i, // (we'll let the mask fix when editing)
      birthday: "199" + (i % 10) + "-01-01",
      emergencyContact: "איש קשר " + (i + 1),
      emergencyPhone: "052-654321" + i,
      answersCount: i % 5,
      tests: makeTests(i + 1),
    }))
  );

  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<Row> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggle = (id: number) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const onFilterChange = (key: keyof typeof filters, val: string) =>
    setFilters((f) => ({ ...f, [key]: val }));

  const filtered = useMemo(() => {
    const norm = (v: unknown) => String(v ?? "").toLowerCase();
    return rows.filter((r) => {
      const checks = [
        norm(r.id).includes(filters.id.toLowerCase()),
        norm(r.firstName).includes(filters.firstName.toLowerCase()),
        norm(r.lastName).includes(filters.lastName.toLowerCase()),
        norm(r.personalId).includes(filters.personalId.toLowerCase()),
        norm(r.phone).includes(filters.phone.toLowerCase()),
        norm(r.birthday).includes(filters.birthday.toLowerCase()),
        norm(r.emergencyContact).includes(filters.emergencyContact.toLowerCase()),
        norm(r.emergencyPhone).includes(filters.emergencyPhone.toLowerCase()),
        norm(r.answersCount).includes(filters.answersCount.toLowerCase()),
      ];
      return checks.every(Boolean);
    });
  }, [rows, filters]);

  /* ---------- edit helpers ---------- */
  const startEdit = (row: Row) => {
    setEditingRowId(row.id);
    setDraft({ ...row, tests: row.tests.map((t) => ({ ...t })) });
    setExpanded((e) => ({ ...e, [row.id]: true }));
    setErrors({});
  };

  const cancelEdit = () => {
    setEditingRowId(null);
    setDraft(null);
    setErrors({});
  };

  const saveEdit = () => {
    if (!draft || editingRowId == null) return;
    const e = validateDraft(draft);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setRows((rs) =>
      rs.map((r) => (r.id === editingRowId ? { ...(r as Row), ...(draft as Row) } : r))
    );
    setEditingRowId(null);
    setDraft(null);
    setErrors({});
  };

  const onDraftChange = <K extends keyof Row>(key: K, value: Row[K]) => {
    setDraft((d) => {
      const next = { ...(d as Row), [key]: value };
      setErrors(validateDraft(next));
      return next;
    });
  };

  const onDraftTestChange = (index: number, patch: Partial<Test>) => {
    setDraft((d) => {
      const tests = (d?.tests ?? []).map((t, i) => (i === index ? { ...t, ...patch } : t));
      const next = { ...(d as Row), tests };
      setErrors(validateDraft(next));
      return next;
    });
  };

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") saveEdit();
      if (e.key === "Escape") cancelEdit();
    },
    [saveEdit]
  );

  // Refs for date pickers (one per row while editing)
  const dateInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const setDateRef = useCallback(
    (rowId: number) => (el: HTMLInputElement | null) => {
      dateInputRefs.current[rowId] = el; // no return
    },
    []
  );

  const showDatePicker = (rowId: number) => {
    const el = dateInputRefs.current[rowId];
    if (!el) return;

    const prevRO = el.readOnly;
    el.readOnly = false; // temporarily allow picker to open

    try {
      // @ts-ignore
      if (typeof el.showPicker === "function") {
        // @ts-ignore
        el.showPicker();
      } else {
        el.focus();
        el.click();
      }
    } finally {
      // restore readonly on the next tick so selection still works
      setTimeout(() => {
        if (dateInputRefs.current[rowId]) {
          dateInputRefs.current[rowId]!.readOnly = prevRO;
        }
      }, 0);
    }
  };

  const canSave = Object.keys(errors).length === 0 && editingRowId !== null;

  return (
    <div className={styles.tableWrapper}>
      {filtered.length === 0 && <div className={styles.emptyState}>לא נמצאו תוצאות</div>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>שם פרטי</th>
            <th>שם משפחה</th>
            <th>מספר אישי</th>
            <th>מספר טלפון</th>
            <th>יום הולדת</th>
            <th>איש קשר לחירום</th>
            <th>מספר טלפון איש קשר</th>
            <th>מספר מענים</th>
            <th>פעולות</th>
          </tr>

          {/* filter row */}
          <tr className={styles.filterRow}>
            <th><input className={styles.filterInput} placeholder="חיפוש" value={filters.id} onChange={(e)=>onFilterChange("id", e.target.value)} inputMode="numeric" /></th>
            <th><input className={styles.filterInput} placeholder="חיפוש" value={filters.firstName} onChange={(e)=>onFilterChange("firstName", e.target.value)} /></th>
            <th><input className={styles.filterInput} placeholder="חיפוש" value={filters.lastName} onChange={(e)=>onFilterChange("lastName", e.target.value)} /></th>
            <th><input className={styles.filterInput} placeholder="חיפוש" value={filters.personalId} onChange={(e)=>onFilterChange("personalId", e.target.value)} inputMode="numeric" /></th>
            <th><input className={styles.filterInput} placeholder="חיפוש" value={filters.phone} onChange={(e)=>onFilterChange("phone", e.target.value)} inputMode="tel" /></th>
            <th><input className={styles.filterInput} placeholder="חיפוש" value={filters.birthday} onChange={(e)=>onFilterChange("birthday", e.target.value)} /></th>
            <th><input className={styles.filterInput} placeholder="חיפוש" value={filters.emergencyContact} onChange={(e)=>onFilterChange("emergencyContact", e.target.value)} /></th>
            <th><input className={styles.filterInput} placeholder="חיפוש" value={filters.emergencyPhone} onChange={(e)=>onFilterChange("emergencyPhone", e.target.value)} inputMode="tel" /></th>
            <th><input className={styles.filterInput} placeholder="חיפוש" value={filters.answersCount} onChange={(e)=>onFilterChange("answersCount", e.target.value)} inputMode="numeric" /></th>
            <th></th>
          </tr>
        </thead>

        <tbody onKeyDown={handleKey}>
          {filtered.map((item) => {
            const isEditing = editingRowId === item.id;
            const row = isEditing ? (draft as Row) : item;

            const avg =
              Math.round(
                (row.tests.reduce((s, t) => s + Number(t.grade || 0), 0) / row.tests.length) * 10
              ) / 10;

            return (
              <>
                <tr key={item.id}>
                  {/* plain id */}
                  <td>{item.id}</td>

                  {/* editable cells */}
                  <td>
                    {isEditing ? (
                      <>
                        <input
                          className={`${styles.editInput} ${errors.firstName ? styles.invalid : ""}`}
                          value={row.firstName}
                          onChange={(e) => onDraftChange("firstName", e.target.value)}
                          autoFocus
                        />
                        {errors.firstName && <div className={styles.errorText}>{errors.firstName}</div>}
                      </>
                    ) : (
                      row.firstName
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <>
                        <input
                          className={`${styles.editInput} ${errors.lastName ? styles.invalid : ""}`}
                          value={row.lastName}
                          onChange={(e) => onDraftChange("lastName", e.target.value)}
                        />
                        {errors.lastName && <div className={styles.errorText}>{errors.lastName}</div>}
                      </>
                    ) : (
                      row.lastName
                    )}
                  </td>

                  {/* personalId: digits only */}
                  <td>
                    {isEditing ? (
                      <>
                        <input
                          className={`${styles.editInput} ${errors.personalId ? styles.invalid : ""}`}
                          value={row.personalId}
                          onChange={(e) => onDraftChange("personalId", onlyDigits(e.target.value))}
                          inputMode="numeric"
                        />
                        {errors.personalId && (
                          <div className={styles.errorText}>{errors.personalId}</div>
                        )}
                      </>
                    ) : (
                      row.personalId
                    )}
                  </td>

                  {/* phone: xxx-xxxxxxx mask */}
                  <td>
                    {isEditing ? (
                      <>
                        <input
                          className={`${styles.editInput} ${errors.phone ? styles.invalid : ""}`}
                          value={row.phone}
                          onChange={(e) => onDraftChange("phone", formatPhone(e.target.value))}
                          inputMode="tel"
                          placeholder="050-1234567"
                        />
                        {errors.phone && <div className={styles.errorText}>{errors.phone}</div>}
                      </>
                    ) : (
                      row.phone
                    )}
                  </td>

                  {/* birthday: readOnly input + calendar button */}
                  <td>
                    {isEditing ? (
                      <div className={styles.inputWithButton}>
                        <input
                          ref={setDateRef(item.id)}
                          className={`${styles.editInput} ${errors.birthday ? styles.invalid : ""}`}
                          type="date"
                          value={row.birthday}
                          onChange={(e) => onDraftChange("birthday", e.target.value as Row["birthday"])}
                          readOnly
                          onKeyDown={(e) => e.preventDefault()}
                        />
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() => showDatePicker(item.id)}
                          title="בחר תאריך"
                          aria-label="בחר תאריך"
                        >
                          <FaCalendarAlt />
                        </button>
                        {errors.birthday && (
                          <div className={styles.errorText}>{errors.birthday}</div>
                        )}
                      </div>
                    ) : (
                      row.birthday
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <>
                        <input
                          className={`${styles.editInput} ${errors.emergencyContact ? styles.invalid : ""}`}
                          value={row.emergencyContact}
                          onChange={(e) => onDraftChange("emergencyContact", e.target.value)}
                        />
                        {errors.emergencyContact && (
                          <div className={styles.errorText}>{errors.emergencyContact}</div>
                        )}
                      </>
                    ) : (
                      row.emergencyContact
                    )}
                  </td>

                  {/* emergency phone: mask */}
                  <td>
                    {isEditing ? (
                      <>
                        <input
                          className={`${styles.editInput} ${errors.emergencyPhone ? styles.invalid : ""}`}
                          value={row.emergencyPhone}
                          onChange={(e) =>
                            onDraftChange("emergencyPhone", formatPhone(e.target.value))
                          }
                          inputMode="tel"
                          placeholder="050-1234567"
                        />
                        {errors.emergencyPhone && (
                          <div className={styles.errorText}>{errors.emergencyPhone}</div>
                        )}
                      </>
                    ) : (
                      row.emergencyPhone
                    )}
                  </td>

                  {/* answersCount: stepper only */}
                  <td>
                    {isEditing ? (
                      <div className={styles.stepper}>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() =>
                            onDraftChange("answersCount", Math.max(0, (row.answersCount ?? 0) - 1))
                          }
                          title="הפחת אחד"
                          aria-label="הפחת אחד"
                        >
                          <FaMinus />
                        </button>
                        <div className={styles.stepperValue}>
                          {row.answersCount ?? 0}
                        </div>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() =>
                            onDraftChange("answersCount", (row.answersCount ?? 0) + 1)
                          }
                          title="הוסף אחד"
                          aria-label="הוסף אחד"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    ) : (
                      row.answersCount
                    )}
                  </td>

                  {/* actions */}
                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.expanderButton}
                        onClick={() => toggle(item.id)}
                        aria-expanded={!!expanded[item.id]}
                        title={expanded[item.id] ? "סגור פרטים" : "פתח פרטים"}
                      >
                        {expanded[item.id] ? "−" : "+"}
                      </button>

                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            className={styles.saveBtn}
                            onClick={saveEdit}
                            disabled={!canSave}
                            title={canSave ? "שמירה" : "תקן שדות שגויים"}
                          >
                            שמירה
                          </button>
                          <button type="button" className={styles.cancelBtn} onClick={cancelEdit}>
                            ביטול
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => startEdit(item)}
                          title="עריכה"
                          aria-label="עריכה"
                        >
                          <FaPen />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

                {/* expanded tests (editable while editing) */}
                {expanded[item.id] && (
                  <tr className={styles.expandedRow}>
                    <td colSpan={10}>
                      <div className={styles.expandedContent}>
                        <div className={styles.testsList}>
                          {row.tests.map((t, idx) => (
                            <div key={idx} className={styles.testItem}>
                              {isEditing ? (
                                <>
                                  <input
                                    className={`${styles.editInput} ${errors.testsName ? styles.invalid : ""}`}
                                    value={t.name}
                                    onChange={(e) =>
                                      onDraftTestChange(idx, { name: e.target.value })
                                    }
                                  />
                                  <input
                                    className={styles.editInput}
                                    value={String(t.grade)}
                                    onChange={(e) =>
                                      onDraftTestChange(idx, {
                                        grade: Math.max(
                                          0,
                                          Math.min(100, Number(e.target.value) || 0)
                                        ),
                                      })
                                    }
                                    inputMode="numeric"
                                  />
                                </>
                              ) : (
                                <>
                                  <span className={styles.testName}>{t.name}</span>
                                  <span className={styles.testGrade}>{t.grade}</span>
                                </>
                              )}
                            </div>
                          ))}
                          {isEditing && (errors.testsName || errors.tests) && (
                            <div className={styles.errorText}>
                              {errors.testsName || errors.tests}
                            </div>
                          )}
                        </div>
                        <div className={styles.testsAvg}>
                          <span>ממוצע:</span>
                          <strong>{avg}</strong>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
