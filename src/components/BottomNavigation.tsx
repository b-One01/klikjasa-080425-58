
import { House, User, Search, MessageSquare, MenuSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roleSpecific?: 'user' | 'provider';
}

const BottomNavigation = () => {
  const location = useLocation();
  const { user } = useUser();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems: NavItem[] = [
    {
      label: 'Beranda',
      path: '/',
      icon: <House size={20} />,
    },
    {
      label: 'Cari',
      path: '/search',
      icon: <Search size={20} />,
    },
    {
      label: 'Pesanan',
      path: '/orders',
      icon: <MessageSquare size={20} />,
      roleSpecific: 'provider',
    },
    {
      label: 'Layanan',
      path: '/my-services',
      icon: <MenuSquare size={20} />,
      roleSpecific: 'provider',
    },
    {
      label: 'Profil',
      path: '/profile',
      icon: <User size={20} />,
    },
  ];

  // Filter items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (!item.roleSpecific) return true;
    return user?.role === item.roleSpecific;
  });

  return (
    <nav className="bottom-nav">
      {filteredNavItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
        >
          <div className="mb-1">{item.icon}</div>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNavigation;
