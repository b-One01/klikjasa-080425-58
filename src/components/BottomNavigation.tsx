
import { useLocation, Link } from 'react-router-dom';
import { Home, Search, PlusCircle, MessageCircle, User } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const BottomNavigation = () => {
  const { user } = useUser();
  const location = useLocation();
  
  // Define navigation items based on user role
  const navItems = [
    {
      path: '/',
      label: 'Beranda',
      icon: <Home size={20} />,
      showFor: ['user', 'provider', null],
    },
    {
      path: '/search',
      label: 'Cari',
      icon: <Search size={20} />,
      showFor: ['user', 'provider', null],
    },
    {
      path: user?.role === 'provider' ? '/add-service' : '/request-service',
      label: user?.role === 'provider' ? 'Buat Layanan' : 'Request',
      icon: <PlusCircle size={24} />,
      showFor: ['user', 'provider'],
    },
    {
      path: '/chats',
      label: 'Chat',
      icon: <MessageCircle size={20} />,
      showFor: ['user', 'provider'],
    },
    {
      path: '/profile',
      label: 'Profil',
      icon: <User size={20} />,
      showFor: ['user', 'provider', null],
    },
  ];
  
  const filteredNavItems = navItems.filter(item => 
    item.showFor.includes(user?.role || null)
  );
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 shadow-md">
      <div className="flex justify-around items-center h-16">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <div className={`${item.path.includes('add-service') || item.path.includes('request-service') ? '-mt-6' : ''}`}>
                {item.icon}
              </div>
              <span className={`text-xs mt-1 ${item.path.includes('add-service') || item.path.includes('request-service') ? 'hidden' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
