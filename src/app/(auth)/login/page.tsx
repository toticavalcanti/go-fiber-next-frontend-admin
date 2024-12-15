// src/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/lib/store/configureStore';
import { api } from '@/app/lib/api/fetch';
import styles from '@/app/styles/auth.module.css';

interface LoginResponse {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role_id: number;
  };
  token: string;
}

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
      const response = await api.post<LoginResponse>('/login', {
        email,
        password
      });

      console.log('Login successful:', response);
      
      // Dispatcha a ação de login bem-sucedido
      dispatch({
        type: 'auth/loginSuccess',
        payload: response
      });

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
      <div className="text-center mt-3">
        <span>Don&apos;t have an account? </span>
        <a href="/register" className="text-blue-500 hover:underline">
          Register here
        </a>
      </div>
    </div>
  );
}