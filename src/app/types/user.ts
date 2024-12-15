// src/app/types/user.ts
import { Role } from './role';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: Role;
}

// função utilitária
export const getUserFullName = (user: User): string => {
  return `${user.first_name} ${user.last_name}`;
};