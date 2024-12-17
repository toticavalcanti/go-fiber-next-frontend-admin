import { useAppSelector } from "@/app/lib/store/configureStore";
import Link from "next/link";
import { usePathname } from "next/navigation";

// src/app/components/common/Menu/index.tsx
export default function Menu() {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);

  console.log('Current user role:', user?.role); // Para debug do role

  return (
    <nav className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-gray-800 text-white overflow-y-auto">
      <div className="py-4">
        <ul className="space-y-1">
          {/* Dashboard - sempre visível */}
          <li>
            <Link
              href="/dashboard"
              className={`block px-4 py-2.5 text-sm rounded-lg transition-colors
                ${pathname === '/dashboard' 
                  ? 'bg-gray-700 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              Dashboard
            </Link>
          </li>

          {/* Removemos a condição que estava restringindo e adicionamos o log para debug */}
          {['Orders', 'Products', 'Users', 'Roles'].map((item) => (
            <li key={item.toLowerCase()}>
              <Link
                href={`/dashboard/${item.toLowerCase()}`}
                className={`block px-4 py-2.5 text-sm rounded-lg transition-colors
                  ${pathname?.includes(item.toLowerCase())
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}