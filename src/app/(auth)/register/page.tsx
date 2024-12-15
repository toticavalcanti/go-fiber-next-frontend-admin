'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/auth.module.css';

export default function Register() {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';

    try {
      console.log('Sending request to:', `${apiUrl}/api/register`);
      const response = await fetch(`${apiUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          password,
          password_confirm,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Registration failed. Please try again.');
      }

      console.log('Request successful. Redirecting to login...');
      router.push('/login');
    } catch (err) {
      console.error('Error during fetch:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={submit}>
        <h1 className="h3 mb-3 fw-normal">Please register</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <input
          className={styles.formControl}
          placeholder="First Name"
          required
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className={styles.formControl}
          placeholder="Last Name"
          required
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="email"
          className={styles.formControl}
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className={styles.formControl}
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          className={styles.formControl}
          placeholder="Password Confirm"
          required
          value={password_confirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <button
          className={styles.button}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
