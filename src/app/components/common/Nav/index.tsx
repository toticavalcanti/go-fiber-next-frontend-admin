// src/app/components/common/Nav/index.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/lib/store/configureStore';
import { api } from '@/app/lib/api/fetch';
import { logout } from '@/app/lib/store/actions/authActions';
import styles from './styles.module.css';

export default function Nav() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await api.post<void, null>('/logout', null);
      dispatch(logout());
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className={`${styles.nav} navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow`}>
      <Link 
        href="/dashboard" 
        className={`${styles.brand} navbar-brand col-md-3 col-lg-2 mr-0 px-3`}
      >
        Company name
      </Link>

      <ul className={`${styles.userMenu} my-2 my-md-0 mr-md-3`}>
        {user && (
          <>
            <Link
              href="/dashboard/profile"
              className={`${styles.userLink} p-2 text-white text-decoration-none`}
            >
              {`${user.first_name} ${user.last_name}`}
            </Link>
            <button
              onClick={handleLogout}
              className={`${styles.logoutButton} p-2 text-white text-decoration-none bg-transparent border-0`}
            >
              Sign out
            </button>
          </>
        )}
      </ul>
    </header>
  );
}