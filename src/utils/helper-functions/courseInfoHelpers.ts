// Shared types and helpers for CourseInfo

export type StudentRow = {
  id: number;
  serialNumber: string;
  firstName: string;
  lastName: string;
  personalNumber: string;
  phone: string;
  birthday: Date | string | null;
  emergencyContact: string;
  emergencyPhone: string;
  answersCount: number;
  grades: number[];
};

export const DATE_FORMAT = 'dd/mm/yy';

export function average(nums: number[] = []): number {
  if (!nums.length) return 0;
  const sum = nums.reduce((acc, n) => acc + (Number(n) || 0), 0);
  return Math.round((sum / nums.length) * 10) / 10;
}

export const initialData: StudentRow[] = [
  {
    id: 1,
    serialNumber: '0001',
    firstName: 'דנה',
    lastName: 'כהן',
    personalNumber: 'A12345',
    phone: '050-111-2222',
    birthday: new Date(1998, 6, 12),
    emergencyContact: 'אמא - רונית',
    emergencyPhone: '052-333-4444',
    answersCount: 27,
    grades: [88, 92, 79],
  },
  {
    id: 2,
    serialNumber: '0002',
    firstName: 'יובל',
    lastName: 'לוי',
    personalNumber: 'B67890',
    phone: '052-555-6666',
    birthday: new Date(1997, 10, 3),
    emergencyContact: 'אבא - דני',
    emergencyPhone: '054-777-8888',
    answersCount: 30,
    grades: [95, 81, 87, 91],
  },
];
