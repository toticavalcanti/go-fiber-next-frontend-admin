// src/app/components/common/Menu/index.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/app/lib/store/configureStore';
import styles from './styles.module.css';

export default function Menu() {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <nav className={`${styles.sidebar} col-md-3 col-lg-2 d-md-block bg-light`}>
      <div className={styles.sidebarSticky}>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link
              href="/dashboard"
              className={`${styles.navLink} nav-link ${pathname === '/dashboard' ? styles.active : ''}`}
            >
              Dashboard
            </Link>
          </li>

          {user?.role?.name === 'admin' && (
            <>
              <li className="nav-item">
                <Link
                  href="/dashboard/orders"
                  className={`${styles.navLink} nav-link ${pathname?.includes('/orders') ? styles.active : ''}`}
                >
                  Orders
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  href="/dashboard/products"
                  className={`${styles.navLink} nav-link ${pathname?.includes('/products') ? styles.active : ''}`}
                >
                  Products
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  href="/dashboard/users"
                  className={`${styles.navLink} nav-link ${pathname?.includes('/users') ? styles.active : ''}`}
                >
                  Users
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  href="/dashboard/roles"
                  className={`${styles.navLink} nav-link ${pathname?.includes('/roles') ? styles.active : ''}`}
                >
                  Roles
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}