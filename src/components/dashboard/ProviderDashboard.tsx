
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { ServiceRequest } from "@/types/service";

interface ProviderDashboardProps {
  services: any[];
  serviceRequests: ServiceRequest[];
}

const ProviderDashboard = ({ services, serviceRequests }: ProviderDashboardProps) => {
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

export default ProviderDashboard;
