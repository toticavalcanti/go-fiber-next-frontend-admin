'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/lib/store/configureStore';
import { api } from '@/app/lib/api/fetch';
import { loginSuccess, loginFailure } from '@/app/lib/store/actions/authActions';
import type { Role } from '@/app/types/role';
import Menu from '@/app/components/common/Menu';
import Nav from '@/app/components/common/Nav';

interface LayoutProps {
  children: ReactNode;
}

interface UserResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: Role;
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
            token: '',
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
    <div className="flex h-screen bg-gray-100">
      <Menu />
      <div className="flex-1 relative ml-48">
        <Nav />
        <main className="p-6 mt-16 overflow-auto h-[calc(100vh-5rem)] bg-gray-100">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
