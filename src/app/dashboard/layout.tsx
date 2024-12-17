'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/lib/store/configureStore';
import { api } from '@/app/lib/api/fetch';
import { loginSuccess, loginFailure } from '@/app/lib/store/actions/authActions';
import type { Role } from '@/app/types/role';

interface LayoutProps {
  children: ReactNode;
}

interface UserResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: Role; // Agora recebe o objeto completo
}

export default function DashboardLayout({ children }: LayoutProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get<{ data: UserResponse }>('/user');
        const userData = response.data;
    
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
              role: userData.role,
            },
            token: '', // O token já deve estar armazenado do login
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
    return null; // Evita renderização prematura
  }

  return (
    <div className="container-fluid">

      <div className="row">
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          {children}
        </main>
      </div>
    </div>
  );
}
