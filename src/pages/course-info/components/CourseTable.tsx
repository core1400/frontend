import { useMemo, useState, useCallback } from "react";
import { toast } from "react-toastify";
import styles from "./course-table.module.css";
import type { Row, UserRole, PersonRole, TableFilters } from "../types/course-table.types";
import { validateDraft } from "../../../utils/helpers-functions/courseTableHelpers";
import { ROLE_PRIORITY } from "../../../utils/helpers-functions/courseTableHelpers";
import { buildInitialRows } from "../../../utils/helpers-functions/courseTableHelpers";

import PasswordModal from "./TempPasswordModal";
import CourseTopBar from "./CourseTopBar";
import CourseFilterRow from "./CourseFilterRow";
import DraftRow from "./DraftRow";
import CourseRow from "./CourseRow";

export default function CourseTable() {
  const [filters, setFilters] = useState<TableFilters>({
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

  const [rows, setRows] = useState<Row[]>(() => buildInitialRows());
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Row | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hanterId, setHanterId] = useState<number | null>(null);
  const [classRepId, setclassRepId] = useState<number | null>(null);
  const [courseFilter, setCourseFilter] = useState<string>("");
  const [userRole, setUserRole] = useState<UserRole>("אדמין");
  const isManager = userRole === 'ממ"ק' || userRole === "אדמין";
  const [personRoles, setPersonRoles] = useState<Record<number, PersonRole>>(
    () => rows.reduce<Record<number, PersonRole>>((acc, r) => {
      acc[r.id] = "חניך";
      return acc;
    }, {})
  );

  const [creatingNew, setCreatingNew] = useState(false);
  const [draftRole, setDraftRole] = useState<PersonRole>("חניך");
  const [isPwdOpen, setIsPwdOpen] = useState(false);
  const [newUserPassword, setNewUserPassword] = useState("");

  const toggleHanter = (id: number) => setHanterId((prev) => (prev === id ? null : id));
  const toggleAkita = (id: number) => setclassRepId((prev) => (prev === id ? null : id));

  const onFilterChange = (key: keyof typeof filters, val: string) =>
    setFilters((f) => ({ ...f, [key]: val }));

  const filtered = useMemo(() => {
    const norm = (v: unknown) => String(v ?? "").toLowerCase();

    let base = rows.filter((r) => {
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

    if (userRole === "אדמין" && courseFilter.trim() !== "") {
      const q = courseFilter.trim();
      base = base.filter((r) => String(r.courseId).includes(q));
    }

    return [...base].sort((a, b) => {
      const ra = personRoles[a.id] ?? "חניך";
      const rb = personRoles[b.id] ?? "חניך";
      const pa = ROLE_PRIORITY[ra];
      const pb = ROLE_PRIORITY[rb];
      if (pa !== pb) return pa - pb;
      return a.id - b.id;
    });
  }, [rows, filters, personRoles, userRole, courseFilter]);

  const startEdit = (row: Row) => {
    setEditingRowId(row.id);
    setDraft({ ...row });
    setErrors({});
  };

  const cancelEdit = () => {
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
      setIsPwdOpen(true);
      return;
    }

    setRows((rs) =>
      sortByIdAsc(rs.map((r) => (r.id === editingRowId ? { ...r, ...draft } : r)))
    );
    toast.success("השינויים נשמרו בהצלחה");
    setEditingRowId(null);
    setDraft(null);
    setErrors({});
  };

  const finalizeCreateWithPassword = () => {
    if (!draft) return;
    setRows((rs) => sortByIdAsc([...rs, draft]));
    setPersonRoles((prev) => ({ ...prev, [draft.id]: draftRole }));
    toast.success("המשתמש נוצר בהצלחה");
    setIsPwdOpen(false);
    setNewUserPassword("");
    setCreatingNew(false);
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
      courseId: Number(courseFilter) || 0,
    };

    setDraft(newRow);
    setDraftRole("חניך");
    setEditingRowId(nextId);
    setErrors({});
    setCreatingNew(true);
  };

  const onDraftChange = <K extends keyof Row>(key: K, value: Row[K]) => {
    setDraft((d) => {
      if (!d) return d;
      const next = { ...d, [key]: value };
      setErrors(validateDraft(next));
      return next;
    });
  };

  const deleteRow = (id: number) => {
    setRows((rs) => rs.filter((r) => r.id !== id));
    setPersonRoles((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (hanterId === id) setHanterId(null);
    if (classRepId === id) setclassRepId(null);
    if (editingRowId === id) {
      setEditingRowId(null);
      setDraft(null);
      setErrors({});
    }
    toast.success(" משתמש נמחק בהצלחה!");
  };

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") cancelEdit();
  }, [saveEdit]);

  const canSave = useMemo(() => {
    if (editingRowId === null || !draft) return false;
    return Object.keys(validateDraft(draft)).length === 0;
  }, [editingRowId, draft]);

  return (
    <>
      <div className={styles.tableWrapper}>
        {rows.length === 0 ? (
          <div className={styles.emptyState}>its empty here</div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>לא נמצאו תוצאות</div>
        ) : null}

        <CourseTopBar
          userRole={userRole}
          courseFilter={courseFilter}
          onChangeCourseFilter={setCourseFilter}
          onAddRow={startAddRow}
        />

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
              {isManager && <th>תפקיד</th>}
              <th>פעולות</th>
            </tr>

            <CourseFilterRow
              filters={filters}
              onFilterChange={onFilterChange}
              isManager={isManager}
            />
          </thead>

          <tbody onKeyDown={handleKey}>
            {creatingNew && draft && (
              <DraftRow
                draft={draft}
                errors={errors}
                isManager={isManager}
                userRole={userRole}
                draftRole={draftRole}
                onDraftRoleChange={setDraftRole}
                onDraftChange={onDraftChange}
                onSave={saveEdit}
                onCancel={cancelEdit}
                canSave={canSave}
                rowNumber={1}
              />
            )}

            {filtered.map((item, idx) => {
              const isEditing = editingRowId === item.id;
              const rowValues = isEditing ? (draft as Row) : item;
              const displayIndex = idx + 1 + (creatingNew ? 1 : 0);

              return (
                <CourseRow
                  key={item.id}
                  item={item}
                  rowValues={rowValues}
                  displayIndex={displayIndex}
                  isEditing={isEditing}
                  errors={errors}
                  isManager={isManager}
                  userRole={userRole}
                  personRole={personRoles[item.id]}
                  setPersonRole={(role) =>
                    setPersonRoles((prev) => ({ ...prev, [item.id]: role }))
                  }
                  hanterId={hanterId}
                  classRepId={classRepId}
                  onToggleHanter={() => toggleHanter(item.id)}
                  onToggleAkita={() => toggleAkita(item.id)}
                  onDraftChange={onDraftChange}
                  onStartEdit={() => startEdit(item)}
                  onSave={saveEdit}
                  onCancel={cancelEdit}
                  onDelete={() => deleteRow(item.id)}
                  canSave={canSave}
                />
              );
            })}
          </tbody>
        </table>

        <PasswordModal
          isOpen={isPwdOpen}
          password={newUserPassword}
          onChangePassword={setNewUserPassword}
          onCreate={finalizeCreateWithPassword}
          onClose={() => setIsPwdOpen(false)}
        />
      </div>
    </>
  );
}
