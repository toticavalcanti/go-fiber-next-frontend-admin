import { createReducer } from '@reduxjs/toolkit';
import { loginRequest, loginSuccess, loginFailure, logout } from '../actions/authActions';
import { User } from '@/app/types/user';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: User | null; // Adiciona o campo user
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null, // Inicializa como null
};

const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loginRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginSuccess, (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload.user; // Atualiza o usuário no login
    })
    .addCase(loginFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    })
    .addCase(logout, (state) => {
      state.isAuthenticated = false;
      state.user = null; // Limpa o usuário ao deslogar
    });
});

export default authReducer;
