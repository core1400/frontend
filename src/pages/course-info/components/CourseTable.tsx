import { useMemo, useState, useCallback, useRef } from "react";
import styles from "./course-table.module.css";
import { FaPen, FaCalendarAlt, FaPlus, FaMinus } from "react-icons/fa";
import type { Row, Test } from "../types/course-table.types";
import { makeTests, onlyDigits,formatPhone,validateDraft } from "../../../utils/helpers-functions/courseTableHelpers"


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
  const [draft, setDraft] = useState<Row| null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hanterId, setHanterId] = useState<number | null>(null);   // חנת"ר
  const [classRepId, setclassRepId] = useState<number | null>(null);
  type UserRole = "ממ\"ק" | "מפקד";
  const [userRole, setUserRole] = useState<UserRole>("ממ\"ק");
  type PersonRole = "מפקד" | "חניך";
  const [personRoles, setPersonRoles] = useState<Record<number, PersonRole>>(
    () =>
      rows.reduce<Record<number, PersonRole>>((acc, r) => {
        acc[r.id] = "חניך";
        return acc;
      }, {})
  );
  const [creatingNew, setCreatingNew] = useState(false);
  /** role for the draft row while creating */
  const [draftRole, setDraftRole] = useState<PersonRole>("חניך");

  const toggleHanter = (id: number) =>
    setHanterId((prev) => (prev === id ? null : id));

  const toggleAkita = (id: number) =>
    setclassRepId((prev) => (prev === id ? null : id));

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
    // if we were creating, nothing was inserted — just drop the draft
    if (creatingNew) setCreatingNew(false);

    setEditingRowId(null);
    setDraft(null);
    setErrors({});
  };

  const saveEdit = () => {
    if (!draft || editingRowId == null) return;
    const e = validateDraft(draft);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    if (creatingNew) {
      // add to rows now, and persist its role
      setRows((rs) => sortByIdAsc([...rs, draft]));
      setPersonRoles((prev) => ({ ...prev, [draft.id]: draftRole }));
      setCreatingNew(false);
    } else {
      // update existing row
      setRows((rs) =>
        sortByIdAsc(
          rs.map((r) => (r.id === editingRowId ? { ...r, ...draft } : r))
        )
      );
      // role for existing rows is edited via the תפקיד cell (see below)
    }

    setEditingRowId(null);
    setDraft(null);
    setErrors({});
  };

  const sortByIdAsc = (arr: typeof rows) => [...arr].sort((a, b) => a.id - b.id);

  const startAddRow = () => {
    const nextId = rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1;

    const newRow: Row = {
      id: nextId,
      firstName: "",
      lastName: "",
      personalId: "",
      phone: "",
      birthday: "",
      emergencyContact: "",
      emergencyPhone: "",
      answersCount: 0,
      tests: makeTests(nextId),
    };

    // DO NOT insert into rows yet — only prepare a draft
    setDraft(newRow);
    setDraftRole("חניך"); // default selection
    setEditingRowId(nextId);
    setExpanded((e) => ({ ...e, [nextId]: true }));
    setErrors({});
    setCreatingNew(true);
  };





  const onDraftChange = <K extends keyof Row>(key: K, value: Row[K]) => {
    setDraft((d) => {
      if (!d) return d;
      const next = { ...d, [key]: value };
      setErrors(validateDraft(next));   // <— keep errors in sync live
      return next;
    });
  };


  const onDraftTestChange = (index: number, patch: Partial<Test>) => {
    setDraft((d) => {
      if (!d) return d;
      const tests = (d.tests ?? []).map((t, i) => (i === index ? { ...t, ...patch } : t));
      const next: Row = { ...d, tests };
      setErrors(validateDraft(next)); // validateDraft accepts Row just fine
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

  const canSave = useMemo(() => {
    if (editingRowId === null || !draft) return false;
    return Object.keys(validateDraft(draft)).length === 0;
  }, [editingRowId, draft]);

  return (
    <div className={styles.tableWrapper}>
      {rows.length === 0 ? (
        <div className={styles.emptyState}>its empty here</div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>לא נמצאו תוצאות</div>
      ) : null}

      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => startAddRow()}
        >
          {userRole === "ממ\"ק" ? "הוסף חניך / מפקד" : "הוסף חניך"}
        </button>
      </div>

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
            {userRole === "ממ\"ק" && <th>תפקיד</th>}
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
            {userRole === "ממ\"ק" && <th></th>}
            <th></th>
          </tr>
        </thead>

        <tbody onKeyDown={handleKey}>
          {creatingNew && draft && (
  <>
    <tr className={`${hanterId === draft.id ? styles.hanterRow : ""} ${classRepId === draft.id ? styles.akitaRow : ""}`}>
      <td>{draft.id}</td>

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
        <div className={styles.inputWithButton}>
          <input
            ref={setDateRef(draft.id)}
            className={`${styles.editInput} ${errors.birthday ? styles.invalid : ""}`}
            type="date"
            value={draft.birthday ?? ""}
            onChange={(e) => onDraftChange("birthday", e.target.value as Row["birthday"])}
            readOnly
            onKeyDown={(e) => e.preventDefault()}
          />
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => showDatePicker(draft.id)}
            title="בחר תאריך"
            aria-label="בחר תאריך"
          >
            <FaCalendarAlt />
          </button>
          {errors.birthday && <div className={styles.errorText}>{errors.birthday}</div>}
        </div>
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
        <div className={styles.stepper}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() =>
              onDraftChange("answersCount", Math.max(0, (draft.answersCount ?? 0) - 1) as Row["answersCount"])
            }
            title="הפחת אחד"
            aria-label="הפחת אחד"
          >
            <FaMinus />
          </button>
          <div className={styles.stepperValue}>{draft.answersCount ?? 0}</div>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() =>
              onDraftChange("answersCount", ((draft.answersCount ?? 0) + 1) as Row["answersCount"])
            }
            title="הוסף אחד"
            aria-label="הוסף אחד"
          >
            <FaPlus />
          </button>
        </div>
      </td>

      {userRole === "ממ\"ק" && (
        <td>
          <select
            className={styles.roleSelect}
            value={draftRole}
            onChange={(e) => setDraftRole(e.target.value as PersonRole)}
          >
            <option value="חניך">חניך</option>
            <option value="מפקד">מפקד</option>
          </select>
        </td>
      )}

      <td>
        <div className={styles.actions}>
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
        </div>
      </td>
    </tr>

              {expanded[draft.id] && (
                <tr className={styles.expandedRow}>
                  <td colSpan={userRole === "ממ\"ק" ? 11 : 10}>
                    <div className={styles.expandedContent}>
                      <div className={styles.testsList}>
                        {draft.tests.map((t, idx) => (
                          <div key={idx} className={styles.testItem}>
                            <input
                              className={`${styles.editInput} ${errors.testsName ? styles.invalid : ""}`}
                              value={t.name}
                              onChange={(e) => onDraftTestChange(idx, { name: e.target.value })}
                            />
                            <input
                              className={styles.editInput}
                              value={String(t.grade)}
                              onChange={(e) =>
                                onDraftTestChange(idx, {
                                  grade: Math.max(0, Math.min(100, Number(e.target.value) || 0)),
                                })
                              }
                              inputMode="numeric"
                            />
                          </div>
                        ))}
                        {errors.testsName && <div className={styles.errorText}>{errors.testsName}</div>}
                      </div>
                      <div className={styles.testsAvg}>
                        <span>ממוצע:</span>
                        <strong>
                          {Math.round(
                            (draft.tests.reduce((s, t) => s + Number(t.grade || 0), 0) / draft.tests.length) * 10
                          ) / 10}
                        </strong>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          )}

          {filtered.map((item) => {
            const isEditing = editingRowId === item.id;
            const row = isEditing ? (draft as Row) : item;

            const avg =
              Math.round(
                (row.tests.reduce((s, t) => s + Number(t.grade || 0), 0) / row.tests.length) * 10
              ) / 10;

            return (
              <>
                <tr key={item.id} className={`${hanterId === item.id ? styles.hanterRow : ""} ${classRepId === item.id ? styles.akitaRow : ""}`}>
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
                      <>
                        {row.firstName}
                        {hanterId === item.id && (
                          <span className={`${styles.roleBadge} ${styles.roleHanter}`}>חנת״ר</span>
                        )}
                        {classRepId === item.id && (
                          <span className={`${styles.roleBadge} ${styles.roleAkita}`}>א' כיתה</span>
                        )}
                      </>
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

                  {userRole === "ממ\"ק" && (
                    <td>
                      {isEditing ? (
                        <select
                          className={styles.roleSelect}
                          value={personRoles[item.id] ?? "חניך"}
                          onChange={(e) =>
                            setPersonRoles((prev) => ({ ...prev, [item.id]: e.target.value as PersonRole }))
                          }
                        >
                          <option value="חניך">חניך</option>
                          <option value="מפקד">מפקד</option>
                        </select>
                      ) : (
                        personRoles[item.id] ?? "חניך"
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
                            onClick={saveEdit}
                            disabled={!canSave}
                            title={canSave ? "שמירה" : "תקן שדות שגויים"}
                          >
                            שמירה
                          </button>
                          <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={cancelEdit}
                          >
                            ביטול
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className={styles.expanderButton}
                            onClick={() => toggle(item.id)}
                            aria-expanded={!!expanded[item.id]}
                            title={expanded[item.id] ? "סגור פרטים" : "פתח פרטים"}
                          >
                            {expanded[item.id] ? "−" : "+"}
                          </button>

                          <button
                            type="button"
                            className={`${styles.roleBtn} ${styles.roleHanterBtn} ${hanterId === item.id ? styles.activeRoleBtn : ""}`}
                            onClick={() => toggleHanter(item.id)}
                            title={hanterId === item.id ? "בטל חנת״ר" : "קבע חנת״ר"}
                            aria-pressed={hanterId === item.id}
                          >
                            חנת״ר
                          </button>

                          <button
                            type="button"
                            className={`${styles.roleBtn} ${styles.roleAkitaBtn} ${classRepId === item.id ? styles.activeRoleBtn : ""}`}
                            onClick={() => toggleAkita(item.id)}
                            title={classRepId === item.id ? "בטל א כיתה" : "קבע א כיתה"}
                            aria-pressed={classRepId === item.id}
                          >
                            א' כיתה
                          </button>

                          <button
                            type="button"
                            className={styles.editBtn}
                            onClick={() => startEdit(item)}
                            title="עריכה"
                            aria-label="עריכה"
                          >
                            <FaPen />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>

                {/* expanded tests (editable while editing) */}
                {expanded[item.id] && (
                  <tr className={styles.expandedRow}>
                    <td colSpan={userRole === "ממ\"ק" ? 11 : 10}>
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
