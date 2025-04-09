
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, MapPin, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import BottomNavigation from '@/components/BottomNavigation';
import { ServiceRequest } from '@/types/service';

const RequestList = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [userRequests, setUserRequests] = useState<ServiceRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Mock data - in a real app, this would be fetched from an API
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
      },
      {
        id: 'req-user-3',
        description: 'Butuh jasa tukang untuk perbaikan atap yang bocor',
        categoryId: 'c-2',
        subCategoryId: 'sc-4',
        userId: user.id,
        location: 'Jakarta Timur',
        offerDeadline: '6 Jam',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'open'
      }
    ];

    setUserRequests(mockUserRequests);
    setFilteredRequests(mockUserRequests);
  }, [user, navigate]);

  // Filter requests when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRequests(userRequests);
      return;
    }

    const filteredResults = userRequests.filter((request) =>
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredRequests(filteredResults);
  }, [searchQuery, userRequests]);

  if (!user) return null;

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
          <h1 className="text-xl font-semibold">Permintaan Layanan Saya</h1>
        </div>

        <div className="px-4 pb-3 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Cari permintaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter size={16} />
          </Button>
        </div>
      </div>

      <div className="p-4">
        {filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
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
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Belum ada permintaan layanan</p>
            <Button 
              onClick={() => navigate('/request-service')}
              className="bg-primary"
            >
              <Plus size={16} className="mr-2" />
              Buat Permintaan Baru
            </Button>
          </div>
        )}

        <Button
          onClick={() => navigate('/request-service')}
          className="bg-primary fixed bottom-20 right-4 rounded-full shadow-lg"
          size="icon"
        >
          <Plus size={24} />
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default RequestList;
