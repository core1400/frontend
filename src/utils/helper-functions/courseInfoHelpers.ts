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
  /** Map of test name -> score */
  testsScores: Record<string, number>;
};

export const DATE_FORMAT = 'dd/mm/yy';

// Works with either an array of numbers OR a {name: score} record
export function average(input: number[] | Record<string, number> = []): number {
  const values = Array.isArray(input) ? input : Object.values(input ?? {});
  if (!values.length) return 0;
  const sum = values.reduce((acc, n) => acc + (Number(n) || 0), 0);
  return Math.round((sum / values.length) * 10) / 10;
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
    testsScores: {
      'בוחן 1': 88,
      'מבחן אמצע': 92,
      'מבחן סוף': 79,
    },
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
    testsScores: {
      'בוחן פתע': 95,
      'תרגיל מסכם': 81,
      'מבחן אמצע': 87,
      'מבחן סוף': 91,
    },
  },
  {
    id: 3,
    serialNumber: '0003',
    firstName: 'ליאור',
    lastName: 'בזר',
    personalNumber: '8347438473',
    phone: '052-055-6666',
    birthday: new Date(1997, 10, 3),
    emergencyContact: 'אבא - דני',
    emergencyPhone: '054-777-8888',
    answersCount: 30,
    testsScores: {
      'מטלה 1': 95,
      'בוחן 2': 81,
      'פרויקט ביניים': 87,
      'מבחן מסכם': 91,
      'תרגיל 5': 95,
      'תרגיל 6': 81,
      'תרגיל 7': 87,
      'תרגיל 8': 91,
    },
  },
  {
    id: 4,
    serialNumber: '0004',
    firstName: 'יובל',
    lastName: 'לוי',
    personalNumber: 'B67890',
    phone: '052-555-6666',
    birthday: new Date(1997, 10, 3),
    emergencyContact: 'אבא - דני',
    emergencyPhone: '054-777-8888',
    answersCount: 30,
    testsScores: {
      'בוחן 1': 95,
      'בוחן 2': 81,
      'מבחן אמצע': 87,
      'מבחן סוף': 91,
    },
  },
  {
    id: 5,
    serialNumber: '0005',
    firstName: 'יובל',
    lastName: 'לוי',
    personalNumber: 'B67890',
    phone: '052-555-6666',
    birthday: new Date(1997, 10, 3),
    emergencyContact: 'אבא - דני',
    emergencyPhone: '054-777-8888',
    answersCount: 30,
    testsScores: {
      'בוחן 1': 95,
      'בוחן 2': 81,
      'מבחן אמצע': 87,
      'מבחן סוף': 91,
    },
  },
  {
    id: 6,
    serialNumber: '0006',
    firstName: 'יובל',
    lastName: 'לוי',
    personalNumber: 'B67890',
    phone: '052-555-6666',
    birthday: new Date(1997, 10, 3),
    emergencyContact: 'אבא - דני',
    emergencyPhone: '054-777-8888',
    answersCount: 30,
    testsScores: {
      'בוחן 1': 95,
      'בוחן 2': 81,
      'מבחן אמצע': 87,
      'מבחן סוף': 91,
    },
  },
  {
    id: 7,
    serialNumber: '0007',
    firstName: 'יובל',
    lastName: 'לוי',
    personalNumber: 'B67890',
    phone: '052-555-6666',
    birthday: new Date(1997, 10, 3),
    emergencyContact: 'אבא - דני',
    emergencyPhone: '054-777-8888',
    answersCount: 30,
    testsScores: {
      'בוחן 1': 95,
      'בוחן 2': 81,
      'מבחן אמצע': 87,
      'מבחן סוף': 91,
    },
  },
  {
    id: 8,
    serialNumber: '0008',
    firstName: 'יועד',
    lastName: 'מוטווסל',
    personalNumber: '983672837',
    phone: '052-566-5674',
    birthday: new Date(2003, 10, 3),
    emergencyContact: 'אבא - עדי',
    emergencyPhone: '054-777-8888',
    answersCount: 30,
    testsScores: {
      'בוחן פתיחה': 95,
      'פרויקט': 81,
      'מבחן אמצע': 87,
      'מבחן סוף': 91,
    },
  },
];
