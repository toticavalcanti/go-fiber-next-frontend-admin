import { createReducer } from '@reduxjs/toolkit';
import { User } from '@/app/types/user'; // Importa o tipo User
import { 
  updateUserRequest, 
  updateUserSuccess, 
  updateUserFailure,
  updatePasswordSuccess 
} from '../actions/authActions';

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(updateUserRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateUserSuccess, (state, action) => {
      state.user = action.payload.user; // Atualiza o campo user
      state.loading = false;
    })
    .addCase(updateUserFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    })
    .addCase(updatePasswordSuccess, (state, action) => {
      state.user = action.payload.user; // Atualiza o user ao mudar a senha
    });
});

export default userReducer;
