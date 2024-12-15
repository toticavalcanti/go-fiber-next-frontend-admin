'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/lib/store/configureStore';
import { api } from '@/app/lib/api/fetch';
import Nav from '@/app/components/common/Nav';
import Menu from '@/app/components/common/Menu';
import { loginSuccess, loginFailure } from '@/app/lib/store/actions/authActions';

interface LayoutProps {
  children: ReactNode;
}

interface UserResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data: UserResponse = await api.get<UserResponse>('/user'); // Define explicitamente o tipo esperado da resposta

        dispatch(
          loginSuccess({
            user: {
              id: data.id,
              first_name: data.first_name,
              last_name: data.last_name,
              email: data.email,
              role: data.role,
            },
            token: '', // Insira um token real, se necessário
          })
        );
      } catch (err) {
        console.error('Error fetching user:', err); // Loga o erro no console
        dispatch(loginFailure({ error: 'Authentication failed' })); // Corrige o tipo da action
        router.push('/auth/login');
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
      <Nav />
      <div className="row">
        <Menu />
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          {children}
        </main>
      </div>
    </div>
  );
}
