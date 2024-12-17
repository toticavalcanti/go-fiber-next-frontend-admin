'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/lib/store/configureStore';
import { api } from '@/app/lib/api/fetch';
import Nav from '@/app/components/common/Nav';
import Menu from '../Menu';
import { loginSuccess, loginFailure } from '@/app/lib/store/actions/authActions';
import type { Role } from '@/app/types/role';

interface LayoutProps {
  children: ReactNode;
}

interface UserResponse {
  data: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: Role;
  };
}

export default function DashboardLayout({ children }: LayoutProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get<UserResponse>('/user');
        const userData = response.data; // Acessa os dados dentro de data

        if (!userData || !userData.id) {
          throw new Error('Invalid user data');
        }

        dispatch(
          loginSuccess({
            user: {
              id: userData.id,
              first_name: userData.first_name,
              last_name: userData.last_name,
              email: userData.email,
              role: { id: userData.role.id, name: userData.role.name },
            },
            token: localStorage.getItem('token') || '', // Pega o token do localStorage
          })
        );
      } catch (err) {
        console.error('Error fetching user:', err);
        dispatch(loginFailure({ error: 'Authentication failed' }));
        router.push('/login');
      }
    };

    if (!isAuthenticated) {
      getUser();
    }
  }, [dispatch, router, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav /> {/* Navbar no topo */}
      
      <div className="flex">
        <Menu /> Menu lateral
        
        <main className="flex-1 ml-64 pt-16 px-8 py-6"> {/* Conteúdo principal */}
          {children}
        </main>
      </div>
    </div>
  );
}