import { useMemo, useState, useCallback } from "react";
import styles from "./course-table.module.css";
import { FaPen } from "react-icons/fa";

type Test = { name: string; grade: number };

type Row = {
  id: number;
  firstName: string;
  lastName: string;
  personalId: string;
  phone: string;
  birthday: string;
  emergencyContact: string;
  emergencyPhone: string;
  answersCount: number;
  tests: Test[];
};

function makeTests(seed: number): Test[] {
  const base = (n: number) => ((seed * 17 + n * 29) % 41) + 60;
  return [
    { name: "מבחן 1", grade: base(1) },
    { name: "מבחן 2", grade: base(2) },
    { name: "מבחן 3", grade: base(3) },
  ];
}

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
      phone: "050-123456" + i,
      birthday: "01/01/199" + (i % 10),
      emergencyContact: "איש קשר " + (i + 1),
      emergencyPhone: "052-654321" + i,
      answersCount: i % 5,
      tests: makeTests(i + 1),
    }))
  );

  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<Row> | null>(null);

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

  const startEdit = (row: Row) => {
    setEditingRowId(row.id);
    setDraft({ ...row, tests: row.tests.map((t) => ({ ...t })) });
    setExpanded((e) => ({ ...e, [row.id]: true }));
  };

  const cancelEdit = () => {
    setEditingRowId(null);
    setDraft(null);
  };

  const saveEdit = () => {
    if (!draft || editingRowId == null) return;

    const phoneOk = (p: string) => /^\d[\d\- ]{5,}$/.test(p || "");
    const gradesOk =
      (draft.tests ?? []).every((t) => Number(t.grade) >= 0 && Number(t.grade) <= 100);

    if (!phoneOk(String(draft.phone)) || !phoneOk(String(draft.emergencyPhone))) {
      alert("מספר טלפון לא תקין");
      return;
    }
    if (!gradesOk) {
      alert("ציונים חייבים להיות בין 0 ל-100");
      return;
    }

    setRows((rs) =>
      rs.map((r) => (r.id === editingRowId ? { ...(r as Row), ...(draft as Row) } : r))
    );
    setEditingRowId(null);
    setDraft(null);
  };

  const onDraftChange = <K extends keyof Row>(key: K, value: Row[K]) => {
    setDraft((d) => ({ ...(d as Row), [key]: value }));
  };

  const onDraftTestChange = (index: number, patch: Partial<Test>) => {
    setDraft((d) => {
      const tests = (d?.tests ?? []).map((t, i) => (i === index ? { ...t, ...patch } : t));
      return { ...(d as Row), tests };
    });
  };

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") saveEdit();
      if (e.key === "Escape") cancelEdit();
    },
    [saveEdit]
  );

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
                  {/* ID cell — now plain like any other td */}
                  <td>{item.id}</td>

                  {/* editable cells */}
                  <td>
                    {isEditing ? (
                      <input
                        className={styles.editInput}
                        value={row.firstName}
                        onChange={(e) => onDraftChange("firstName", e.target.value)}
                        autoFocus
                      />
                    ) : (
                      row.firstName
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        className={styles.editInput}
                        value={row.lastName}
                        onChange={(e) => onDraftChange("lastName", e.target.value)}
                      />
                    ) : (
                      row.lastName
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        className={styles.editInput}
                        value={row.personalId}
                        onChange={(e) => onDraftChange("personalId", e.target.value)}
                        inputMode="numeric"
                      />
                    ) : (
                      row.personalId
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        className={styles.editInput}
                        value={row.phone}
                        onChange={(e) => onDraftChange("phone", e.target.value)}
                        inputMode="tel"
                      />
                    ) : (
                      row.phone
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        className={styles.editInput}
                        value={row.birthday}
                        onChange={(e) => onDraftChange("birthday", e.target.value)}
                      />
                    ) : (
                      row.birthday
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        className={styles.editInput}
                        value={row.emergencyContact}
                        onChange={(e) => onDraftChange("emergencyContact", e.target.value)}
                      />
                    ) : (
                      row.emergencyContact
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        className={styles.editInput}
                        value={row.emergencyPhone}
                        onChange={(e) => onDraftChange("emergencyPhone", e.target.value)}
                        inputMode="tel"
                      />
                    ) : (
                      row.emergencyPhone
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        className={styles.editInput}
                        value={String(row.answersCount)}
                        onChange={(e) =>
                          onDraftChange("answersCount", Number(e.target.value) || 0)
                        }
                        inputMode="numeric"
                      />
                    ) : (
                      row.answersCount
                    )}
                  </td>

                  {/* actions (expander moved here) */}
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
                          <button type="button" className={styles.saveBtn} onClick={saveEdit}>
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
                                    className={styles.editInput}
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
