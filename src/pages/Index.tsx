
import { Button } from "@/components/ui/button";
import { useUser, UserProfile } from "@/contexts/UserContext";
import { useData } from "@/contexts/DataContext";
import { Link } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import ServiceCard from "@/components/ServiceCard";
import { Search } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const { user, login } = useUser();
  const { categories, services } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleGuestLogin = () => {
    // Sample user data for guest login
    const sampleUser: UserProfile = {
      id: 'user-1',
      name: 'Tamu',
      email: 'tamu@example.com',
      phone: '+628123456789',
      role: 'user',
      balance: 50000,
      isLoggedIn: true,
    };
    
    login(sampleUser);
  };
  
  // If user is not logged in, show welcome screen
  if (!user?.isLoggedIn) {
    return (
      <div className="app-container p-4">
        <div className="min-h-screen flex flex-col justify-center items-center">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-primary mb-2">KlikJasa</h1>
            <p className="text-gray-600">Temukan layanan yang Anda butuhkan dengan mudah</p>
          </div>
          
          <div className="space-y-4 w-full max-w-xs">
            <Button asChild className="w-full bg-primary">
              <Link to="/login">Masuk</Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-primary text-primary">
              <Link to="/register">Daftar</Link>
            </Button>
            <button 
              onClick={handleGuestLogin}
              className="w-full text-sm text-gray-500 underline mt-4"
            >
              Lanjutkan sebagai tamu
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // User is logged in, show appropriate dashboard based on role
  return (
    <div className="app-container pb-16">
      <div className="p-4 bg-primary text-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">KlikJasa</h1>
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
      
      {user.role === 'user' ? (
        <UserDashboard categories={categories} services={services} />
      ) : (
        <ProviderDashboard />
      )}
      
      <BottomNavigation />
    </div>
  );
};

const UserDashboard = ({ categories, services }) => {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Kategori Layanan</h2>
        <div className="grid grid-cols-3 gap-3">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="category-card"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 text-primary">
                {category.icon && (
                  <span className="text-xl">{category.icon === 'house' ? '🏠' : 
                    category.icon === 'settings' ? '🔧' : 
                    category.icon === 'heart' ? '💆‍♀️' :
                    category.icon === 'car' ? '🚗' :
                    category.icon === 'briefcase' ? '📚' :
                    category.icon === 'calendar' ? '🎉' : '⭐'}</span>
                )}
              </div>
              <span className="text-xs text-center line-clamp-2">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Layanan Populer</h2>
          <Link to="/search" className="text-sm text-primary">
            Lihat Semua
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {services.slice(0, 4).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Tips Menggunakan KlikJasa</h2>
        <ul className="text-sm space-y-2 text-gray-600">
          <li>• Isi saldo untuk melihat kontak penyedia jasa</li>
          <li>• Buat permintaan layanan sesuai kebutuhan Anda</li>
          <li>• Cek profil penyedia jasa sebelum memesan</li>
        </ul>
      </div>
    </div>
  );
};

const ProviderDashboard = () => {
  const { user } = useUser();
  
  return (
    <div className="p-4">
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Akun Penyedia Jasa</h2>
        <p className="text-sm text-gray-600 mb-4">
          Selamat datang di dashboard Penyedia Jasa. Kelola layanan Anda dan terima pesanan dari pengguna.
        </p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Saldo</p>
            <p className="font-semibold">Rp{user?.balance.toLocaleString('id')}</p>
          </div>
          <Button asChild className="bg-primary">
            <Link to="/my-services">Kelola Layanan</Link>
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Pesanan Terbaru</h2>
        <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
          <p className="text-gray-500">Belum ada pesanan baru</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Statistik</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500">Total Layanan</p>
            <p className="text-xl font-semibold">0</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500">Total Pesanan</p>
            <p className="text-xl font-semibold">0</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-100">
        <h2 className="text-lg font-semibold mb-2">Tips untuk Penyedia Jasa</h2>
        <ul className="text-sm space-y-2 text-gray-600">
          <li>• Lengkapi profil bisnis Anda</li>
          <li>• Tambahkan detail lengkap untuk setiap layanan</li>
          <li>• Unggah foto portofolio untuk meningkatkan kepercayaan</li>
          <li>• Jaga saldo akun untuk menerima pesanan</li>
        </ul>
        
        <Button asChild className="w-full mt-4 bg-accent">
          <Link to="/add-service">Tambah Layanan Baru</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
