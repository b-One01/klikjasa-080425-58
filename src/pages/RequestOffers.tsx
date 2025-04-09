
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock, ChevronRight, Star } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { ServiceRequest, ServiceOffer } from '@/types/service';

const RequestOffers = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [offers, setOffers] = useState<ServiceOffer[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // In a real app, fetch the specific request from an API
    const mockRequest: ServiceRequest = {
      id: id,
      description: 'Saya butuh renovasi dapur rumah',
      categoryId: 'c-2',
      subCategoryId: 'sc-3',
      userId: user.id,
      location: 'Jakarta Selatan',
      offerDeadline: '12 Jam',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      status: 'open'
    };
    
    // Mock offers for this request
    const mockOffers: ServiceOffer[] = [
      {
        id: 'offer-1',
        requestId: id!,
        providerId: 'provider-1',
        price: 750000,
        description: 'Saya dapat mengerjakan renovasi dapur Anda dengan material berkualitas. Pengalaman 5 tahun di bidang renovasi.',
        estimatedTime: '3 hari',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        status: 'pending'
      },
      {
        id: 'offer-2',
        requestId: id!,
        providerId: 'provider-2',
        price: 850000,
        description: 'Menggunakan material premium dan garansi hasil 1 tahun. Siap mengerjakan sesuai keinginan Anda.',
        estimatedTime: '4 hari',
        createdAt: new Date(Date.now() - 2700000).toISOString(),
        status: 'pending'
      }
    ];

    setRequest(mockRequest);
    setOffers(mockOffers);
  }, [id, user, navigate]);

  if (!user || !request) return null;

  return (
    <div className="app-container pb-16">
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="p-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold">Penawaran</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white p-4 rounded-lg border border-gray-100 mb-6">
          <h2 className="font-medium mb-2">Detail Permintaan</h2>
          <p className="text-sm mb-3">{request.description}</p>
          
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <MapPin size={12} className="mr-1" />
            <span>{request.location}</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <Clock size={12} className="mr-1" />
            <span>Dibuat {new Date(request.createdAt).toLocaleDateString('id-ID')}</span>
          </div>
        </div>

        <h2 className="font-medium mb-3">Penawaran dari Penyedia Jasa ({offers.length})</h2>
        
        {offers.length > 0 ? (
          <div className="space-y-4">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium text-sm">Penyedia Jasa {offer.providerId}</p>
                      <div className="flex items-center text-xs text-yellow-500">
                        <Star size={12} className="fill-yellow-500" />
                        <Star size={12} className="fill-yellow-500" />
                        <Star size={12} className="fill-yellow-500" />
                        <Star size={12} className="fill-yellow-500" />
                        <Star size={12} className="fill-yellow-500" />
                        <span className="ml-1 text-gray-500">5.0</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-primary font-semibold">
                    Rp{offer.price.toLocaleString('id')}
                  </span>
                </div>
                
                <p className="text-sm mb-3">{offer.description}</p>
                
                <div className="flex justify-between">
                  <div className="text-xs text-gray-500">
                    Estimasi pengerjaan: {offer.estimatedTime}
                  </div>
                  <Link to={`/chat/${offer.providerId}`}>
                    <Button size="sm" className="text-xs h-8 bg-primary">
                      Hubungi
                      <ChevronRight size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white p-4 rounded-lg border border-gray-100">
            <p className="text-gray-500">Belum ada penawaran untuk permintaan ini</p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default RequestOffers;
