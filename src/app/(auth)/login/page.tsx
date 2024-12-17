// src/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/lib/store/configureStore';
import { api } from '@/app/lib/api/fetch';
import type { LoginResponse } from '@/app/types/auth';
import styles from '@/app/styles/auth.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await api.post<LoginResponse, { email: string; password: string }>(
        '/login',
        { email, password }
      );
  
      console.log('Server Response:', response);
  
      // Garantir valores padrão para evitar falhas
      const token = response.token ?? null;
      const user = response.user ?? { id: 0, email: '', role_id: 0 };
  
      if (!token) {
        throw new Error('Missing token in response');
      }
  
      console.log('Token:', token);
      console.log('User (fallback applied):', user);
  
      // Disparar ação para o Redux/Store
      dispatch({
        type: 'auth/loginSuccess',
        payload: { token, user },
      });
  
      // Redirecionar para o dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Login Error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
   

  return (
    <div className={styles.container}>
      <form onSubmit={submit}>
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <input
          type="email"
          className={styles.formControl}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className={styles.formControl}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className={styles.button}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
