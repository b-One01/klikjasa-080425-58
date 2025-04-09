
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import CategoryCarousel from "@/components/CategoryCarousel";
import ServiceCard from "@/components/ServiceCard";
import { ServiceRequest } from "@/types/service";

interface UserDashboardProps {
  categories: any[];
  services: any[];
  recommendedServices: any[];
}

const UserDashboard = ({ categories, services, recommendedServices }: UserDashboardProps) => {
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

export default UserDashboard;
