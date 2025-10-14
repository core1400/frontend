export type Test = { name: string; grade: number };

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
  tests: Test[];
};