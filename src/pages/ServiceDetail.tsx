
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Clock, MapPin } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import ServiceContactCard from '@/components/ServiceContactCard';
import { useUser } from '@/contexts/UserContext';

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getServiceById, getCategoryById } = useData();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const service = getServiceById(id || '');
  
  if (!service) {
    return (
      <div className="app-container p-4 flex flex-col items-center justify-center">
        <p>Layanan tidak ditemukan</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Kembali
        </Button>
      </div>
    );
  }
  
  const category = getCategoryById(service.categoryId);
  
  const formatCurrency = (amount?: number) => {
    if (!amount) return "Harga bervariasi";
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="app-container pb-16">
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </Button>
        </div>
      </div>
      
      <div className="h-64 bg-gray-200">
        {service.images && service.images.length > 0 ? (
          <img 
            src={service.images[0]} 
            alt={service.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      
      <div className="p-4">
        {category && (
          <div className="mb-2">
            <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1">
              {category.name}
            </span>
          </div>
        )}
        
        <h1 className="text-xl font-bold mb-1">{service.title}</h1>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {service.provider.rating && (
              <div className="flex items-center mr-4">
                <Star size={16} className="fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">{service.provider.rating.toFixed(1)}</span>
              </div>
            )}
            
            {service.provider.businessName && (
              <div className="text-sm text-gray-500">
                {service.provider.businessName}
              </div>
            )}
          </div>
          
          <div className="text-lg font-semibold text-primary">
            {formatCurrency(service.price)}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-6">
          {service.location && (
            <div className="flex items-center mr-4">
              <MapPin size={14} className="mr-1" />
              {service.location}
            </div>
          )}
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            Tersedia
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Deskripsi</h2>
          <p className="text-gray-700">{service.description}</p>
        </div>
        
        {user && user.role === 'user' && (
          <ServiceContactCard service={service} />
        )}
        
        {user && user.role === 'provider' && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">
              Anda saat ini masuk sebagai Penyedia Jasa. 
              Alih ke Pengguna Jasa untuk menghubungi Penyedia Jasa ini.
            </p>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ServiceDetail;
