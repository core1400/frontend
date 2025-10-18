// Row data model
export type Row = {
  id: number;
  firstName: string;
  lastName: string;
  personalId: string;
  phone: string;
  birthday: string;
  emergencyContact: string;
  emergencyPhone: string;
  answersCount: number;
  courseId: number;
};

// Page-level roles (for permissions / UI)
export type UserRole = 'אדמין' | 'ממ"ק' | 'מפקד';

// Per-person role inside the table
export type PersonRole = 'ממ"ק' | 'מפקד' | 'חניך';

// Filters row structure
export type TableFilters = {
  id: string;
  firstName: string;
  lastName: string;
  personalId: string;
  phone: string;
  birthday: string;
  emergencyContact: string;
  emergencyPhone: string;
  answersCount: string;
};

// Shared callback for editing draft fields
export type OnDraftChange = <K extends keyof Row>(key: K, value: Row[K]) => void;

// CourseTopBar
export type CourseTopBarProps = {
  userRole: UserRole;
  courseFilter: string;
  onChangeCourseFilter: (v: string) => void;
  onAddRow: () => void;
};

// CourseFilterRow
export type CourseFilterRowProps = {
  filters: TableFilters;
  onFilterChange: (key: keyof TableFilters, val: string) => void;
  isManager: boolean;
};

// Stepper
export type StepperProps = {
  value: number;
  onChange: (next: number) => void;
};

// DatePickerCell
export type DatePickerCellProps = {
  value: string;
  error?: string;
  onChange: (val: string) => void;
};

// DraftRow (creation row)
export type DraftRowProps = {
  draft: Row;
  errors: Record<string, string>;
  isManager: boolean;
  userRole: UserRole;
  draftRole: PersonRole;
  onDraftRoleChange: (role: PersonRole) => void;
  onDraftChange: OnDraftChange;
  onSave: () => void;
  onCancel: () => void;
  canSave: boolean;
  rowNumber: number;
};

// CourseRow
export type CourseRowProps = {
  item: Row;
  rowValues: Row;
  displayIndex: number;
  isEditing: boolean;
  errors: Record<string, string>;
  isManager: boolean;
  userRole: UserRole;

  personRole: PersonRole | undefined;
  setPersonRole: (role: PersonRole) => void;

  hanterId: number | null;
  classRepId: number | null;
  onToggleHanter: () => void;
  onToggleAkita: () => void;

  onDraftChange: OnDraftChange;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  canSave: boolean;
};

export type PasswordModalProps = {
  isOpen: boolean;
  password: string;
  onChangePassword: (next: string) => void;
  onCreate: () => void;
  onClose: () => void;
};