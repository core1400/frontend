import { useMemo, useState } from 'react';
import styles from './requests.module.css';
import RequestsList from './components/RequestsList';
import RequestForm from './components/RequestForm';
import type { RequestItem, UserRole } from './types/requests.types';
import { computeStatus, isApprover } from './types/requests.types';

export const mock: RequestItem[] = [
  {
    id: '1',
    type: 'בקש"צ',
    date: new Date().toISOString(),
    name: 'ישראל ישראלי',
    serial: '1234567',
    description: 'דוגמה לבקש"צ שאושר.',
    approvals: { 'מפקד': 'approved', 'ממ"ק': 'approved' },
    status: 'approved',
  },
  {
    id: '2',
    type: 'ת"ש',
    date: new Date().toISOString(),
    name: 'דוד כהן',
    serial: '7654321',
    approvals: { 'מפקד': 'pending', 'ממ"ק': 'pending' },
    status: 'in_progress',
  },
];

export default function Requests({ role: userRole }: { role?: UserRole }) {
  const role: UserRole = userRole ?? 'חניך'; // default role for demo
  const [items, setItems] = useState<RequestItem[]>(mock);

  // Role-based visibility:
  // - ממ"ק: see only בקש"צ
  // - מפקד: see all
  // - חניך: see all
  const filterByRole = (arr: RequestItem[]) => {
    if (role === 'ממ"ק') return arr.filter((i) => i.type === 'בקש"צ');
    return arr;
  };

  const previous = useMemo(() => {
    const base = items.filter((i) => i.status === 'approved' || i.status === 'rejected');
    return filterByRole(base);
  }, [items, role]);

  const inProgress = useMemo(() => {
    const base = items.filter((i) => i.status === 'in_progress');
    return filterByRole(base);
  }, [items, role]);

  const handleSubmit = (
    draft: Pick<RequestItem, 'type' | 'date' | 'name' | 'serial'> & { description?: string }
  ) => {
    const approvals = { 'מפקד': 'pending' as const, 'ממ"ק': 'pending' as const };
    const newItem: RequestItem = {
      ...draft,
      id: crypto.randomUUID(),
      approvals,
      status: 'in_progress',
    };
    setItems((prev) => [newItem, ...prev]);
  };

  // AND approval flow for בקש"צ
  const handleDecision = (id: string, decision: 'approved' | 'rejected') => {
    if (!isApprover(role)) return;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextApprovals = { ...item.approvals, [role]: decision };
        const nextStatus = computeStatus(nextApprovals);
        return { ...item, approvals: nextApprovals, status: nextStatus };
      })
    );
  };

  // "טופל" for non-בקש"צ in In-Progress (מפקד only) -> move to previous
  const handleHandled = (id: string) => {
    if (role !== 'מפקד') return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
  };

  return (
    <div className={styles.container}>
      {role === 'מפקד' || role === 'ממ"ק' ? (
        <div className={styles.columnsTwo}>
          <RequestsList
            title="בקשות לטיפול"
            items={inProgress}
            role={role}
            onDecision={handleDecision}
            isInProgressList
            onHandled={handleHandled}
          />
          <RequestsList title="בקשות קודמות" items={previous} role={role} />
        </div>
      ) : (
        <div className={styles.columnsThree}>
          <RequestForm onSubmit={handleSubmit} />
          <RequestsList title="בקשות בטיפול" items={inProgress} role={role} />
          <RequestsList title="בקשות קודמות" items={previous} role={role} />
        </div>
      )}
    </div>
  );
}
