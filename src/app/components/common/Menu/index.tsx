// src/app/components/common/Menu/index.tsx
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart2,
  Megaphone,
  BoxesIcon,
  UserCog,
  ShieldCheck,
  Settings
} from "lucide-react";
import Link from "next/link";

interface MenuItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
}

const MenuItem = ({ href, icon, text, isActive }: MenuItemProps) => (
  <Link
    href={href}
    className={`px-4 py-2.5 text-sm rounded-lg transition-colors flex items-center gap-3
      ${isActive 
        ? 'bg-gray-700 text-white' 
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default function Menu() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard", icon: <LayoutDashboard size={20} />, text: "Dashboard" },
    { href: "/dashboard/orders", icon: <ShoppingCart size={20} />, text: "Orders" },
    { href: "/dashboard/products", icon: <Package size={20} />, text: "Products" },
    { href: "/dashboard/customers", icon: <Users size={20} />, text: "Customers" },
    { href: "/dashboard/analytics", icon: <BarChart2 size={20} />, text: "Analytics" },
    { href: "/dashboard/marketing", icon: <Megaphone size={20} />, text: "Marketing" },
    { href: "/dashboard/inventory", icon: <BoxesIcon size={20} />, text: "Inventory" },
  ];

  const settingsItems = [
    { href: "/dashboard/settings/users", icon: <UserCog size={20} />, text: "Users" },
    { href: "/dashboard/settings/roles", icon: <ShieldCheck size={20} />, text: "Roles" },
  ];

  return (
    <nav className="fixed left-0 top-16 w-48 h-[calc(100vh-4rem)] bg-gray-800 text-white overflow-y-auto">
      <div className="py-4">
        {/* Menu Principal */}
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.text.toLowerCase()}>
              <MenuItem
                href={item.href}
                icon={item.icon}
                text={item.text}
                isActive={pathname === item.href}
              />
            </li>
          ))}
          
          {/* Separador */}
          <li className="py-2">
            <div className="flex items-center px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase gap-2">
              <Settings size={14} />
              <span>Settings</span>
            </div>
          </li>

          {/* Itens de Configuração */}
          {settingsItems.map((item) => (
            <li key={item.text.toLowerCase()}>
              <MenuItem
                href={item.href}
                icon={item.icon}
                text={item.text}
                isActive={pathname === item.href}
              />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}