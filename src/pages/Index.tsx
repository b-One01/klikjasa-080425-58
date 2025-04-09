import { Button } from "@/components/ui/button";
import { useUser, UserProfile } from "@/contexts/UserContext";
import { useData } from "@/contexts/DataContext";
import { Link } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import ServiceCard from "@/components/ServiceCard";
import { Search, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import CategoryCarousel from "@/components/CategoryCarousel";
import { ServiceRequest } from "@/types/service";

const Index = () => {
  const { user, login } = useUser();
  const { categories, services } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendedServices, setRecommendedServices] = useState(services);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  
  useEffect(() => {
    if (user?.role === 'provider') {
      const mockRequests: ServiceRequest[] = [
        {
          id: 'req-1',
          description: 'Saya membutuhkan jasa pembersihan rumah untuk rumah dengan 3 kamar tidur',
          categoryId: 'c-1',
          subCategoryId: 'sc-1',
          userId: 'user-1',
          location: 'Jakarta Selatan',
          offerDeadline: '3 Jam',
          createdAt: new Date().toISOString(),
          status: 'open'
        },
        {
          id: 'req-2',
          description: 'Butuh tukang ledeng untuk perbaikan keran yang bocor',
          categoryId: 'c-2',
          subCategoryId: 'sc-5',
          userId: 'user-2',
          location: 'Jakarta Pusat',
          offerDeadline: '6 Jam',
          createdAt: new Date().toISOString(),
          status: 'open'
        }
      ];
      setServiceRequests(mockRequests);
    }
  }, [user?.role]);
  
  useEffect(() => {
    if (services.length > 0) {
      if (user?.role === 'user') {
        const sortedServices = [...services].sort(() => Math.random() - 0.5);
        setRecommendedServices(sortedServices);
      }
    }
  }, [services, user]);
  
  const handleGuestLogin = () => {
    const sampleUser: UserProfile = {
      id: 'user-1',
      name: 'Tamu',
      email: 'tamu@example.com',
      phone: '+628123456789',
      role: 'user',
      balance: 50000,
      isLoggedIn: true,
      address: 'Jakarta, Indonesia',
    };
    
    login(sampleUser);
  };
  
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
        <UserDashboard 
          categories={categories} 
          services={services}
          recommendedServices={recommendedServices}
        />
      ) : (
        <ProviderDashboard 
          services={services} 
          serviceRequests={serviceRequests}
        />
      )}
      
      <BottomNavigation />
    </div>
  );
};

const UserDashboard = ({ categories, services, recommendedServices }) => {
  const { user } = useUser();
  const [userRequests, setUserRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    if (!user) return;

    const mockUserRequests: ServiceRequest[] = [
      {
        id: 'req-user-1',
        description: 'Saya butuh renovasi dapur rumah',
        categoryId: 'c-2',
        subCategoryId: 'sc-3',
        userId: user.id,
        location: 'Jakarta Selatan',
        offerDeadline: '12 Jam',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        status: 'open'
      },
      {
        id: 'req-user-2',
        description: 'Saya butuh jasa desain interior untuk ruang tamu',
        categoryId: 'c-9', 
        subCategoryId: 'sc-20',
        userId: user.id,
        location: 'Jakarta Barat',
        offerDeadline: '24 Jam',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        status: 'open'
      }
    ];
    
    setUserRequests(mockUserRequests);
  }, [user]);

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Kategori Layanan</h2>
        <CategoryCarousel categories={categories} />
      </div>
      
      {userRequests.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Permintaan Layanan Saya</h2>
            <Link to="/request-list" className="text-sm text-primary">
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-3">
            {userRequests.map((request) => (
              <div key={request.id} className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
                    {request.offerDeadline} tersisa
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p className="text-sm font-medium mb-1">{request.description}</p>
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <MapPin size={12} className="mr-1" />
                  <span>{request.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">
                    {request.status === 'open' ? 'Menunggu Penawaran' : 'Tertutup'}
                  </span>
                  <Link to={`/request-offers/${request.id}`}>
                    <Button size="sm" variant="outline" className="text-xs h-8">
                      Lihat Penawaran
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Layanan yang Direkomendasikan</h2>
          <Link to="/search" className="text-sm text-primary">
            Lihat Semua
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {recommendedServices.slice(0, 4).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <Link to="/request-service" className="block bg-primary/10 p-4 rounded-lg text-center mb-4">
          <h3 className="font-medium text-primary mb-1">Punya kebutuhan jasa spesifik?</h3>
          <p className="text-sm text-gray-600 mb-2">Buat permintaan dan dapatkan penawaran dari penyedia jasa</p>
          <Button className="bg-primary w-full">Buat Permintaan Jasa</Button>
        </Link>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Tips Menggunakan KlikJasa</h2>
        <ul className="text-sm space-y-2 text-gray-600">
          <li>• Isi saldo untuk melihat detail penyedia jasa</li>
          <li>• Buat permintaan layanan sesuai kebutuhan Anda</li>
          <li>• Cek profil penyedia jasa sebelum memesan</li>
        </ul>
      </div>
    </div>
  );
};

const ProviderDashboard = ({ services, serviceRequests }) => {
  const { user } = useUser();
  const allServices = services || [];
  const otherServices = allServices.filter(service => service.provider.id !== 'provider-1');
  
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
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Permintaan Jasa Terbaru</h2>
          <Link to="/search" className="text-sm text-primary">
            Lihat Semua
          </Link>
        </div>
        
        {serviceRequests.length > 0 ? (
          <div className="space-y-3">
            {serviceRequests.map(request => (
              <div key={request.id} className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
                    {request.offerDeadline} tersisa
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p className="text-sm font-medium mb-1">{request.description}</p>
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <MapPin size={12} className="mr-1" />
                  <span>{request.location}</span>
                </div>
                <Button className="w-full bg-primary text-white text-sm">
                  Ajukan Penawaran
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg border border-gray-100 text-center">
            <p className="text-gray-500">Belum ada permintaan jasa baru</p>
          </div>
        )}
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
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Layanan Lainnya</h2>
          <Link to="/search" className="text-sm text-primary">
            Lihat Semua
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {otherServices.slice(0, 4).map((service) => (
            <div key={service.id} className="relative">
              <ServiceCard service={service} />
              <Button 
                className="absolute top-2 right-2 bg-primary text-white text-xs py-1 px-2 h-auto"
                onClick={() => { /* Add switch role functionality here */ }}
              >
                Pesan
              </Button>
            </div>
          ))}
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
