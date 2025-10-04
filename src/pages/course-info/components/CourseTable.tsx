import React, { useMemo, useState } from 'react';
import shadow from 'react-shadow';

import { DataTable } from 'primereact/datatable';
import type { DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';

import { initialData, average, DATE_FORMAT } from '../../../utils/helper-functions/courseInfoHelpers';
import type { StudentRow as BaseStudentRow } from '../../../utils/helper-functions/courseInfoHelpers';

// 🔒 Inject our component's CSS into the Shadow DOM
const SHADOW_CSS = `
.ct-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.ct-rtl { direction: rtl; }
.ct-table :global(.p-datatable) { font-family: inherit; }
.ct-table :global(.p-datatable-wrapper) { height: 100%; }

/* Right-align headers and cells in RTL */
.ct-table :global(.p-datatable-thead > tr > th),
.ct-table :global(.p-datatable-tbody > tr > td) {
  text-align: right;
}

/* Filter inputs RTL + right aligned */
.ct-table :global(.p-column-filter .p-inputtext),
.ct-table :global(.p-column-filter .p-inputnumber-input),
.ct-table :global(.p-inputtext) {
  text-align: right;
  direction: rtl;
}

.ct-headerCell :global(.p-column-title) { white-space: nowrap; }
.ct-filterInput, .ct-filterNumber, .ct-numberInput { width: 100%; }
.ct-center { text-align: center !important; }

/* For numbers/phones: keep digits LTR but flush right */
.ct-ltrDigits { direction: ltr; text-align: right; }

/* Expansion panel styling */
.ct-expansion {
  padding: 1rem 0.75rem;
  display: grid;
  gap: 0.75rem;
  background: var(--surface-ground, transparent);
}

/* Mini table of tests inside expander */
.ct-testsTableWrapper { width: 100%; overflow-x: auto; }
.ct-testsTable {
  width: max-content;
  border-collapse: collapse;
  border: 1px solid var(--surface-border, #3a4955);
}
.ct-testsTable thead th,
.ct-testsTable tbody td {
  padding: 0.5rem 0.75rem;
  border-inline-start: 1px solid var(--surface-border, #3a4955);
  border-block-start: 1px solid var(--surface-border, #3a4955);
  white-space: nowrap;
  text-align: center;
}
.ct-testsTable thead th:first-child,
.ct-testsTable tbody td:first-child { border-inline-start: none; }
.ct-testsHeaderCell { font-weight: 600; }
.ct-testsBodyCell { font-variant-numeric: tabular-nums; }

.ct-avgRow { display: flex; gap: 0.5rem; align-items: baseline; }
.ct-avgLabel { font-weight: 600; }
.ct-avgValue { direction: ltr; }
`;

type StudentRow = BaseStudentRow & { testNames?: string[] };

export default function CourseTable() {
  const [rows, setRows] = useState<StudentRow[]>(initialData as StudentRow[]);
  const [expandedRows, setExpandedRows] = useState<any>(null);

  const tableClassName = useMemo(() => `ct-wrapper ct-rtl`, []);

  const getTestNames = (row: StudentRow) => {
    if (Array.isArray(row.testNames) && row.testNames.length === row.grades?.length) return row.testNames;
    const len = Array.isArray(row.grades) ? row.grades.length : 0;
    return Array.from({ length: len }, (_, i) => `מבחן ${i + 1}`);
  };

  const rowExpansionTemplate = (data: StudentRow) => {
    const names = getTestNames(data);
    const grades = data.grades ?? [];
    const avg = average(grades);

    return (
      <div className="ct-expansion">
        <div className="ct-testsTableWrapper">
          <table className="ct-testsTable">
            <thead>
              <tr>
                {names.map((n, idx) => (
                  <th key={`h-${idx}`} className="ct-testsHeaderCell">
                    {n}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {grades.map((g, idx) => (
                  <td key={`g-${idx}`} className="ct-testsBodyCell">
                    {g}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="ct-avgRow">
          <span className="ct-avgLabel">ממוצע מבחנים:</span>
          <span className="ct-avgValue">{avg || '—'}</span>
        </div>
      </div>
    );
  };

  const textEditor = (options: any) => (
    <InputText value={options.value ?? ''} onChange={(e) => options.editorCallback(e.target.value)} dir="rtl" />
  );

  const phoneEditor = (options: any) => (
    <InputText
      value={options.value ?? ''}
      onChange={(e) => options.editorCallback(e.target.value)}
      dir="rtl"
      placeholder="טלפון"
    />
  );

  const numberEditor = (options: any) => (
    <InputNumber
      value={options.value ?? 0}
      onValueChange={(e) => options.editorCallback(e.value)}
      inputClassName="ct-numberInput"
      showButtons
      buttonLayout="vertical"
    />
  );

  const dateEditor = (options: any) => (
    <Calendar
      value={options.value ? new Date(options.value) : null}
      onChange={(e) => options.editorCallback(e.value)}
      dateFormat={DATE_FORMAT}
      touchUI
      placeholder="יום הולדת"
      showIcon
      appendTo="self"   // stay inside shadow
    />
  );

  const textFilterElement = (options: any) => (
    <InputText
      value={options.value ?? ''}
      onChange={(e) => options.filterCallback(e.target.value, options.index)}
      placeholder="חיפוש..."
      dir="rtl"
      className="ct-filterInput"
    />
  );

  const numberFilterElement = (options: any) => (
    <InputNumber
      value={options.value ?? null}
      onValueChange={(e) => options.filterCallback(e.value, options.index)}
      placeholder="חיפוש מספרי"
      inputClassName="ct-numberInput"
      className="ct-filterNumber"
    />
  );

  const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
    const { newData, index } = e;
    const next = [...rows];
    next[index] = newData as StudentRow;
    setRows(next);
  };

  return (
    <shadow.div>
      {/* Load PrimeReact CSS ONLY inside the shadow */}
      <link rel="stylesheet" href="https://unpkg.com/primereact/resources/themes/vela-green/theme.css" />
      <link rel="stylesheet" href="https://unpkg.com/primereact/resources/primereact.min.css" />
      <link rel="stylesheet" href="https://unpkg.com/primeicons/primeicons.css" />

      {/* Inject our component CSS into the shadow */}
      <style>{SHADOW_CSS}</style>

      <div className={tableClassName} dir="rtl" style={{ minHeight: 0 }}>
        <DataTable
          value={rows}
          dataKey="id"
          className="ct-table"
          style={{ width: '100%' }}
          tableStyle={{ minWidth: '1200px' }}
          scrollable
          scrollHeight="flex"
          filterDisplay="row"
          editMode="row"
          onRowEditComplete={onRowEditComplete}
          resizableColumns
          columnResizeMode="expand"
          reorderableColumns
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          showGridlines
        >
          <Column expander header="" bodyClassName="ct-center" headerClassName="ct-center" style={{ width: '3rem' }} />

          <Column
            field="serialNumber"
            header="מספר סידורי"
            style={{ width: '10rem', minWidth: '10rem' }}
            filter
            filterElement={textFilterElement}
            sortable
            editor={textEditor}
            bodyClassName="ct-ltrDigits"
            headerClassName="ct-headerCell"
          />

          <Column
            field="firstName"
            header="שם פרטי"
            style={{ width: '10rem', minWidth: '10rem' }}
            filter
            filterElement={textFilterElement}
            sortable
            editor={textEditor}
            headerClassName="ct-headerCell"
          />

          <Column
            field="lastName"
            header="שם משפחה"
            style={{ width: '10rem', minWidth: '10rem' }}
            filter
            filterElement={textFilterElement}
            sortable
            editor={textEditor}
            headerClassName="ct-headerCell"
          />

          <Column
            field="personalNumber"
            header="מספר אישי"
            style={{ width: '10rem', minWidth: '10rem' }}
            filter
            filterElement={textFilterElement}
            sortable
            editor={textEditor}
            bodyClassName="ct-ltrDigits"
            headerClassName="ct-headerCell"
          />

          <Column
            field="phone"
            header="מספר טלפון"
            style={{ width: '12rem', minWidth: '12rem' }}
            filter
            filterElement={textFilterElement}
            sortable
            editor={phoneEditor}
            bodyClassName="ct-ltrDigits"
            headerClassName="ct-headerCell"
          />

          <Column
            field="birthday"
            header="יום הולדת"
            style={{ width: '12rem', minWidth: '12rem' }}
            body={(row: StudentRow) => (row.birthday ? new Date(row.birthday).toLocaleDateString('he-IL') : '—')}
            filter
            filterElement={textFilterElement}
            sortable
            editor={dateEditor}
            headerClassName="ct-headerCell"
          />

          <Column
            field="emergencyContact"
            header="איש קשר לחירום"
            style={{ width: '14rem', minWidth: '14rem' }}
            filter
            filterElement={textFilterElement}
            sortable
            editor={textEditor}
            headerClassName="ct-headerCell"
          />

          <Column
            field="emergencyPhone"
            header="טלפון איש קשר"
            style={{ width: '12rem', minWidth: '12rem' }}
            filter
            filterElement={textFilterElement}
            sortable
            editor={phoneEditor}
            bodyClassName="ct-ltrDigits"
            headerClassName="ct-headerCell"
          />

          <Column
            field="answersCount"
            header="מספר מענים"
            style={{ width: '10rem', minWidth: '10rem' }}
            body={(row: StudentRow) => row.answersCount ?? '—'}
            filter
            filterElement={numberFilterElement}
            sortable
            editor={numberEditor}
            headerClassName="ct-headerCell"
          />

          <Column rowEditor header="" bodyClassName="ct-center" headerClassName="ct-center" style={{ width: '8rem' }} />
        </DataTable>
      </div>
    </shadow.div>
  );
}
