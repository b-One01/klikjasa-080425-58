
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, Shield, Bell, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/hooks/useAuth';
import BottomNavigation from '@/components/BottomNavigation';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const navigate = useNavigate();
  const { user: contextUser } = useUser();
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    notifications: true,
    chatNotifications: true,
    orderNotifications: true,
    marketingEmails: false,
    darkMode: false,
  });

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
    toast.success(`Pengaturan ${setting} berhasil diperbarui`);
  };

  const handleChangePassword = () => {
    // In a real app, this would open a modal or navigate to a password reset page
    toast.info('Fitur ganti password akan segera tersedia');
  };

  const handleDeleteAccount = () => {
    toast.error('Fitur hapus akun akan segera tersedia');
  };

  return (
    <div className="app-container pb-16">
      <div className="bg-primary text-white p-4 sticky top-0 z-10">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-white hover:bg-primary-dark"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Pengaturan</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <h3 className="px-4 py-3 bg-gray-50 font-medium">Notifikasi</h3>
          
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <p className="font-medium">Notifikasi Aplikasi</p>
              <p className="text-sm text-gray-500">Aktifkan notifikasi dalam aplikasi</p>
            </div>
            <Switch 
              checked={settings.notifications} 
              onCheckedChange={() => handleToggle('notifications')} 
            />
          </div>
          
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <p className="font-medium">Notifikasi Pesan</p>
              <p className="text-sm text-gray-500">Dapatkan notifikasi untuk pesan baru</p>
            </div>
            <Switch 
              checked={settings.chatNotifications} 
              onCheckedChange={() => handleToggle('chatNotifications')} 
            />
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Notifikasi Pesanan</p>
              <p className="text-sm text-gray-500">Dapatkan notifikasi untuk pembaruan pesanan</p>
            </div>
            <Switch 
              checked={settings.orderNotifications} 
              onCheckedChange={() => handleToggle('orderNotifications')} 
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <h3 className="px-4 py-3 bg-gray-50 font-medium">Keamanan</h3>
          
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center px-4 py-6 h-auto border-b"
            onClick={handleChangePassword}
          >
            <div className="flex items-center">
              <Lock size={20} className="mr-3 text-gray-500" />
              <div className="text-left">
                <span className="font-medium block">Ganti Kata Sandi</span>
                <span className="text-sm text-gray-500">Perbarui kata sandi akun Anda</span>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center px-4 py-6 h-auto"
            onClick={() => navigate('/privacy')}
          >
            <div className="flex items-center">
              <Shield size={20} className="mr-3 text-gray-500" />
              <div className="text-left">
                <span className="font-medium block">Privasi & Keamanan</span>
                <span className="text-sm text-gray-500">Kelola pengaturan privasi</span>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </Button>
        </div>
        
        <Button
          variant="outline"
          className="w-full flex items-center justify-center mt-8 text-red-500 border-red-200"
          onClick={handleDeleteAccount}
        >
          <Trash2 size={18} className="mr-2" />
          <span>Hapus Akun</span>
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Settings;
