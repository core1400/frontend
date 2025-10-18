import React, { useState } from 'react';
import styles from '../requests.module.css';
import type { RequestItem, UserRole } from '../types/requests.types';
import { isApprover } from '../types/requests.types';

interface Props {
  title: string;
  items: RequestItem[];
  role: UserRole;
  onDecision?: (id: string, decision: 'approved' | 'rejected') => void;
  isInProgressList?: boolean;
  onHandled?: (id: string) => void;
  className?: string;
}

const RequestsList: React.FC<Props> = ({
  title,
  items,
  role,
  onDecision,
  isInProgressList,
  onHandled,
  className,
}) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const canAct = isApprover(role);
  const isCommander = role === 'מפקד';

  return (
    <section className={`${styles.column} ${className ?? ''}`}>
      <h2 className={styles.columnTitle}>{title}</h2>

      <div className={styles.list}>
        {items.length === 0 ? (
          <div className={styles.empty}>אין נתונים</div>
        ) : (
          items.map((r) => {
            const isBaksz = r.type === 'בקש"צ';
            const canExpand = role === 'מפקד' || isBaksz;
            const expanded = canExpand && openId === r.id;
            const approverState = canAct ? r.approvals[role as 'מפקד' | 'ממ"ק'] : 'pending';
            const canDecide =
              canAct && isBaksz && r.status === 'in_progress' && approverState === 'pending';
            const canMarkHandled =
              isCommander && isInProgressList && !isBaksz && r.status === 'in_progress';

            const combinedDecision =
              isBaksz ? getCombinedDecision(r) : null;
            const typeChipClass = `${styles.typeChip} ${
              role === 'חניך' && combinedDecision
                ? styles[`typeChip_${combinedDecision}`]
                : ''
            }`;

            return (
              <div key={r.id} className={styles.row}>
                <button
                  className={styles.rowHeader}
                  onClick={() => {
                    if (!canExpand) return;
                    setOpenId(expanded ? null : r.id);
                  }}
                  aria-expanded={canExpand ? expanded : undefined}
                  aria-disabled={!canExpand}
                  disabled={!canExpand}
                >
                  {canExpand && (
                    <span className={styles.caret} aria-hidden>
                      ▾
                    </span>
                  )}
                  <span className={typeChipClass}>{r.type}</span>
                  <span className={styles.meta}>
                    {new Date(r.date).toLocaleDateString('he-IL')}
                    {isApprover(role) ? ` • ${r.name}` : ''}
                  </span>
                </button>

                {expanded && (
                  <div className={styles.rowDetails}>
                    {isApprover(role) && (
                      <>
                        <div className={styles.detailLine}>
                          <span className={styles.detailLabel}>שם החניך:</span>
                          <span>{r.name}</span>
                        </div>
                        <div className={styles.detailLine}>
                          <span className={styles.detailLabel}>מספר אישי:</span>
                          <span>{r.serial || '-'}</span>
                        </div>
                      </>
                    )}

                    {isBaksz && r.description && (
                      <div className={styles.detailBlock}>
                        <span className={styles.detailLabel}>תיאור הבקשה:</span>
                        <p className={styles.description}>{r.description}</p>
                      </div>
                    )}

                    {isBaksz && (
                      <div className={styles.approvals}>
                        <span className={`${styles.badge} ${styles[`state_${r.approvals['מפקד']}`]}`}>
                          מפקד: {badgeText(r.approvals['מפקד'])}
                        </span>
                        <span className={`${styles.badge} ${styles[`state_${r.approvals['ממ"ק']}`]}`}>
                          ממ"ק: {badgeText(r.approvals['ממ"ק'])}
                        </span>
                      </div>
                    )}

                    {canDecide && (
                      <div className={styles.actions}>
                        <button
                          className={`${styles.actionBtn} ${styles.approveBtn}`}
                          onClick={() => onDecision?.(r.id, 'approved')}
                        >
                          אישור
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.rejectBtn}`}
                          onClick={() => onDecision?.(r.id, 'rejected')}
                        >
                          סירוב
                        </button>
                      </div>
                    )}

                    {canMarkHandled && (
                      <div className={styles.actions}>
                        <button
                          className={`${styles.actionBtn} ${styles.approveBtn}`}
                          onClick={() => onHandled?.(r.id)}
                        >
                          טופל
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

function badgeText(state: 'pending' | 'approved' | 'rejected') {
  switch (state) {
    case 'approved':
      return 'אושר';
    case 'rejected':
      return 'נדחה';
    default:
      return 'ממתין';
  }
}

function getCombinedDecision(
  r: RequestItem
): 'approved' | 'rejected' | null {
  const commander = r.approvals['מפקד'];
  const mmk = r.approvals['ממ"ק'];

  if (commander === 'rejected' || mmk === 'rejected') return 'rejected';
  if (commander === 'approved' && mmk === 'approved') return 'approved';
  return null;
}

export default RequestsList;