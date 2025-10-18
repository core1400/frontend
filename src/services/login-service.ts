import axios from 'axios';

export interface User {
  personalNumber: string;
  firstName: string;
  password: string;
  lastName: string;
  birthDate: string; // ISO date string
  misbehaviorCount: number;
  courseNumber: number | null;
  role: number; // looks like an enum (e.g., 4 = Admin)
  isFirstConnection: boolean;
  id: string;
}

export interface SignInResponse {
  user: User;
  token: string;
  isFirstConnection: boolean;
}

export interface LoginCredentials  {
    personalNumber: string;
    password: string;
}

