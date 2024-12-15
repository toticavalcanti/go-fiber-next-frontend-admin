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
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: Role; // Certifique-se de que `role` está bem definido
}

export default function DashboardLayout({ children }: LayoutProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data: UserResponse = await api.get('/user'); // Define o tipo da resposta diretamente

        dispatch(
          loginSuccess({
            user: {
              id: data.id,
              first_name: data.first_name,
              last_name: data.last_name,
              email: data.email,
              role: { id: data.role.id, name: data.role.name },
            },
            token: 'your-token-here', // Substitua por lógica real, se necessário
          })
        );
      } catch (err) {
        console.error('Error fetching user:', err); // Log do erro no console
        dispatch(loginFailure({ error: 'Authentication failed' })); // Corrige a chamada da action
        router.push('/auth/login');
      }
    };

    getUser();
  }, [dispatch, router]);

  if (!isAuthenticated) {
    return null; // Retorna null enquanto a autenticação não é confirmada
  }

  return (
    <>
      <Nav />
      <div className="container-fluid">
        <div className="row">
          <Menu />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">{children}</main>
        </div>
      </div>
    </>
  );
}
