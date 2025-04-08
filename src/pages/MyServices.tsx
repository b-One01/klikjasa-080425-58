
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useData } from '@/contexts/DataContext';
import BottomNavigation from '@/components/BottomNavigation';
import BalanceCard from '@/components/BalanceCard';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const MyServices = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { services } = useData();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  
  // Mock provider's services (in a real app, this would be filtered from backend)
  const providerServices = services.filter(service => service.provider.id === 'provider-1');
  
  if (!user || user.role !== 'provider') {
    navigate('/');
    return null;
  }
  
  const handleDeleteClick = (serviceId: string) => {
    setServiceToDelete(serviceId);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = () => {
    // In a real app, this would make an API call to delete the service
    toast.success("Layanan berhasil dihapus");
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="app-container pb-16">
      <div className="bg-primary text-white p-4 sticky top-0 z-10">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-white hover:bg-primary-dark"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Layanan Saya</h1>
        </div>
      </div>
      
      <div className="p-4">
        <BalanceCard />
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Daftar Layanan</h2>
          <Button 
            className="bg-accent hover:bg-accent/90"
            onClick={() => navigate('/add-service')}
          >
            <Plus size={18} className="mr-2" />
            Tambah
          </Button>
        </div>
        
        {providerServices.length > 0 ? (
          <div className="space-y-4">
            {providerServices.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <div className="flex items-start">
                  <div className="h-16 w-16 bg-gray-200 rounded mr-3">
                    {service.images && service.images.length > 0 ? (
                      <img 
                        src={service.images[0]} 
                        alt={service.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium line-clamp-1">{service.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{service.description}</p>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-primary font-medium">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0
                        }).format(service.price || 0)}
                      </span>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="h-8 px-2">
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2 text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => handleDeleteClick(service.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500 mb-4">
              Anda belum memiliki layanan yang ditawarkan
            </p>
            <Button
              className="bg-primary"
              onClick={() => navigate('/add-service')}
            >
              Tambah Layanan Baru
            </Button>
          </div>
        )}
      </div>
      
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Hapus Layanan</h3>
            <p className="mb-6">
              Anda yakin ingin menghapus layanan ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsDeleteModalOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Batal
              </Button>
              <Button 
                onClick={handleConfirmDelete} 
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                Ya, Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default MyServices;
