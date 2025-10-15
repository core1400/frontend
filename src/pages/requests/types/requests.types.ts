export type RequestType = 'בקש"צ' | 'חופ"ל' | 'ת"ש' | 'קפ"ס';
export type RequestStatus = 'in_progress' | 'approved' | 'rejected';
export type Decision = 'pending' | 'approved' | 'rejected';
export type UserRole = 'חניך' | 'מפקד' | 'ממ"ק';

export interface Approvals {
  'מפקד': Decision;
  'ממ"ק': Decision;
}

export interface RequestItem {
  id: string;
  type: RequestType;
  date: string;         
  name: string;         
  serial: string;
  description?: string;
  approvals: Approvals;
  status: RequestStatus;
}

export const computeStatus = (a: Approvals): RequestStatus => {
  if (a['מפקד'] === 'rejected' || a['ממ"ק'] === 'rejected') return 'rejected';
  if (a['מפקד'] === 'approved' && a['ממ"ק'] === 'approved') return 'approved';
  return 'in_progress';
};

export const isApprover = (r: UserRole) => r === 'מפקד' || r === 'ממ"ק';