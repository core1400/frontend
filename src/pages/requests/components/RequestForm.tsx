import React, { useMemo, useState } from 'react';
import styles from './request-form.module.css';
import type { RequestItem, RequestType } from '../types/requests.types';

const REQUEST_TYPES: RequestType[] = ['בקש"צ', 'חופ"ל', 'ת"ש', 'קפ"ס'];

interface Props {
  // description becomes optional (only for בקש"צ)
  onSubmit: (draft: Pick<RequestItem, 'type' | 'date' | 'name' | 'serial'> & { description?: string }) => void;
  isSubmitting?: boolean;
}

const RequestForm: React.FC<Props> = ({ onSubmit, isSubmitting }) => {
  const [type, setType] = useState<RequestType | ''>('');
  const [description, setDescription] = useState('');
  const [signature, setSignature] = useState('');

  const isBaksz = type === 'בקש"צ';
  const canSubmit = useMemo(() => {
    if (!type) return false;
    if (isBaksz) return description.trim().length > 1 && signature.trim().length > 1;
    return true; // other types require only type
  }, [type, isBaksz, description, signature]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !type) return;
    onSubmit({
      type,
      date: new Date().toISOString(),
      name: '',   // derive from auth later
      serial: '', // derive from auth later
      ...(isBaksz ? { description } : {}),
    });
    setDescription('');
    setSignature('');
    setType('');
  };

  return (
    <section className={`${styles.column} ${styles.formColumn}`}>
      <h2 className={styles.columnTitle}>מילוי בקשה</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.selectWrapper}>
          <span className={styles.selectLabel}>בחר בקשה</span>
          <select
            className={styles.select}
            value={type}
            onChange={(e) => setType(e.target.value as RequestType)}
          >
            <option value="">בחר בקשה</option>
            {REQUEST_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        {isBaksz && (
          <>
            <label className={styles.label}>
              תיאור הבקשה
              <textarea
                className={styles.textarea}
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='פרט את הבקשה שלך...'
              />
            </label>

            <label className={styles.label}>
              חתימת החניך
              <input
                className={styles.input}
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder='הקלד את שמך המלא לאישור'
              />
            </label>
          </>
        )}

        <button className={styles.submitBtn} type="submit" disabled={!canSubmit || isSubmitting}>
          שלח בקשה
        </button>
      </form>
    </section>
  );
};

export default RequestForm;