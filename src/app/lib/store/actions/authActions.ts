import { createAction } from '@reduxjs/toolkit';
import { User } from '@/app/types/user';

interface AuthResponse {
  user: User;
  token?: string; // Torne opcional, caso o token não seja sempre necessário
}

interface LoginPayload {
  email: string;
  password: string;
}

// Auth actions
export const loginRequest = createAction<LoginPayload>('auth/loginRequest');
export const loginSuccess = createAction<AuthResponse>('auth/loginSuccess');
export const loginFailure = createAction<{ error: string }>('auth/loginFailure'); // Atualizado para incluir um objeto com `error`
export const logout = createAction('auth/logout');

// User profile actions
export const updateUserRequest = createAction<{
  first_name: string;
  last_name: string;
  email: string;
}>('user/updateRequest');

export const updateUserSuccess = createAction<{
  user: User;
}>('user/updateSuccess');

export const updateUserFailure = createAction<{
  error: string;
}>('user/updateFailure');

export const updatePasswordRequest = createAction<{
  password: string;
  confirm_password: string;
}>('user/passwordRequest');

export const updatePasswordSuccess = createAction<{
  user: User;
}>('user/passwordSuccess');

export const updatePasswordFailure = createAction<{
  error: string;
}>('user/passwordFailure');
