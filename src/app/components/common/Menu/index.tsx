// src/app/components/common/Menu/index.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/app/lib/store/configureStore';

export default function Menu() {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);

  // src/app/components/common/Menu/index.tsx

return (
  <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-gray-800 text-white overflow-y-auto">
    <nav className="py-4">
      <ul className="space-y-1 px-2">
        <li>
          <Link href="/dashboard" className={`block px-4 py-2 rounded hover:bg-gray-700 transition-colors
            ${pathname === '/dashboard' ? 'bg-gray-700' : ''}`}>
            Dashboard
          </Link>
        </li>

        {user?.role?.name === 'admin' && (
          <>
            {['Orders', 'Products', 'Users', 'Roles'].map((item) => (
              <li key={item.toLowerCase()}>
                <Link
                  href={`/dashboard/${item.toLowerCase()}`}
                  className={`block px-4 py-2 rounded hover:bg-gray-700 transition-colors
                    ${pathname?.includes(item.toLowerCase()) ? 'bg-gray-700' : ''}`}
                >
                  {item}
                </Link>
              </li>
            ))}
          </>
        )}
      </ul>
    </nav>
  </aside>
);
}