
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { UserProfile } from "@/contexts/UserContext";

interface AppHeaderProps {
  user: UserProfile;
}

const AppHeader = ({ user }: AppHeaderProps) => {
  return (
    <div className="p-4 bg-primary text-white sticky top-0 z-10">
      <div className="flex items-center justify-between mb-3">
        <Link to="/">
          <h1 className="text-xl font-bold">KlikJasa</h1>
        </Link>
        <div className="flex items-center space-x-2">
          {user.role === 'user' ? (
            <Link to="/profile" className="text-sm">
              Saldo: Rp{user.balance.toLocaleString('id')}
            </Link>
          ) : (
            <Link to="/my-services" className="text-sm">
              Layanan Saya
            </Link>
          )}
        </div>
      </div>
      
      <div className="relative">
        <Link to="/search" className="block">
          <div className="flex items-center bg-white text-gray-400 rounded-md py-2 px-3">
            <Search size={18} className="mr-2" />
            <span>Cari layanan...</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AppHeader;
