// src/app/components/common/Nav/index.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/lib/store/configureStore';
import { api } from '@/app/lib/api/fetch';
import { logout } from '@/app/lib/store/actions/authActions';

export default function Nav() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await api.post<void, null>('/logout', null);
      dispatch(logout());
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-800 shadow-lg z-50">
    <div className="flex items-center justify-between h-full px-6">
      <Link href="/dashboard" className="text-white text-xl font-semibold">
        Company name
      </Link>

      <div className="flex items-center space-x-4">
        {user && (
          <>
            <span className="text-gray-200">{user.first_name} {user.last_name}</span>
            <button onClick={handleLogout} className="px-4 py-2 text-sm text-white hover:bg-gray-700 rounded">
              Sign out
            </button>
          </>
        )}
      </div>
    </div>
  </nav>
  );
}