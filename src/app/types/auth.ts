// src/app/types/auth.ts
import type { User } from './user';

export interface LoginResponse {
  status: string;
  token: string;
  user: {
    email: string;
    id: number;
    role_id: number;
  };
}


export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}