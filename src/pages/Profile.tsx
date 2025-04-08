import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '@/components/BottomNavigation';
import BalanceCard from '@/components/BalanceCard';
import { toast } from 'sonner';
import { ArrowLeft, User, Settings, LogOut, UserCog } from 'lucide-react';

const Profile = () => {
  const { user, logout, switchRole } = useUser();
  const navigate = useNavigate();
  const [isConfirmingSwitch, setIsConfirmingSwitch] = useState(false);
  const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);
  const [previousRole, setPreviousRole] = useState<string | null>(null);

  useEffect(() => {
    if (previousRole && previousRole !== user?.role) {
      navigate('/');
    }
    
    if (user?.role) {
      setPreviousRole(user.role);
    }
  }, [user?.role, previousRole, navigate]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSwitchRole = () => {
    setIsConfirmingSwitch(true);
  };

  const confirmSwitchRole = () => {
    setPreviousRole(user.role);
    switchRole();
    setIsConfirmingSwitch(false);
    toast.success(`Beralih ke peran ${user.role === 'user' ? 'Penyedia Jasa' : 'Pengguna Jasa'}`);
  };

  const handleLogout = () => {
    setIsConfirmingLogout(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/');
    toast.success('Berhasil keluar');
  };

  return (
    <div className="app-container pb-16">
      <div className="bg-primary text-white p-4 sticky top-0 z-10">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-white hover:bg-primary-dark"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Profil</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
            <User size={24} className="text-gray-400" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="mt-1 inline-block py-0.5 px-2 bg-primary/10 text-primary rounded text-xs">
              {user.role === 'user' ? 'Pengguna Jasa' : 'Penyedia Jasa'}
            </div>
          </div>
        </div>

        <BalanceCard />

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center px-4 py-6 h-auto border-b"
            onClick={() => navigate('/edit-profile')}
          >
            <div className="flex items-center">
              <UserCog size={20} className="mr-3 text-gray-500" />
              <span className="font-medium">Edit Profil</span>
            </div>
            <span className="text-gray-400">→</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full flex justify-between items-center px-4 py-6 h-auto border-b"
            onClick={() => navigate('/settings')}
          >
            <div className="flex items-center">
              <Settings size={20} className="mr-3 text-gray-500" />
              <span className="font-medium">Pengaturan</span>
            </div>
            <span className="text-gray-400">→</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full flex justify-between items-center px-4 py-6 h-auto"
            onClick={handleSwitchRole}
          >
            <div className="flex items-center">
              <User size={20} className="mr-3 text-gray-500" />
              <span className="font-medium">
                Beralih ke {user.role === 'user' ? 'Penyedia Jasa' : 'Pengguna Jasa'}
              </span>
            </div>
            <span className="text-gray-400">→</span>
          </Button>
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center mt-8 text-red-500 border-red-200"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          <span>Keluar</span>
        </Button>
      </div>

      {isConfirmingSwitch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Beralih Peran</h3>
            <p className="mb-6">
              Apakah Anda yakin ingin beralih ke{' '}
              {user.role === 'user' ? 'Penyedia Jasa' : 'Pengguna Jasa'}?
            </p>
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsConfirmingSwitch(false)}
                variant="outline"
                className="flex-1"
              >
                Batal
              </Button>
              <Button onClick={confirmSwitchRole} className="flex-1 bg-primary">
                Ya, Beralih
              </Button>
            </div>
          </div>
        </div>
      )}

      {isConfirmingLogout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Keluar</h3>
            <p className="mb-6">Apakah Anda yakin ingin keluar?</p>
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsConfirmingLogout(false)}
                variant="outline"
                className="flex-1"
              >
                Batal
              </Button>
              <Button onClick={confirmLogout} className="flex-1 bg-red-500 hover:bg-red-600">
                Ya, Keluar
              </Button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Profile;
