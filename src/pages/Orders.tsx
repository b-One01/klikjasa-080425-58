
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useData } from '@/contexts/DataContext';
import BottomNavigation from '@/components/BottomNavigation';
import { ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { orders, getOrdersByProviderId, updateOrderStatus } = useData();
  
  // Force redirect if user is not a provider
  if (!user || user.role !== 'provider') {
    navigate('/');
    return null;
  }
  
  // Get provider orders
  const providerOrders = getOrdersByProviderId('provider-1'); // In a real app, use the logged-in provider ID
  
  const pendingOrders = providerOrders.filter(order => order.status === 'pending');
  const activeOrders = providerOrders.filter(order => order.status === 'accepted');
  const completedOrders = providerOrders.filter(order => 
    order.status === 'completed' || order.status === 'rejected'
  );
  
  // Handle order acceptance
  const handleAcceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'accepted');
    toast.success('Pesanan berhasil diterima');
  };
  
  // Handle order rejection
  const handleRejectOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'rejected');
    toast.error('Pesanan ditolak');
  };
  
  // Handle order completion
  const handleCompleteOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'completed');
    toast.success('Pesanan telah diselesaikan');
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: id });
    } catch (e) {
      return dateString;
    }
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
          <h1 className="text-xl font-bold">Pesanan</h1>
        </div>
      </div>
      
      <div className="p-4">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="pending">
              Menunggu ({pendingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Berjalan ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Selesai ({completedOrders.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            {pendingOrders.length > 0 ? (
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{order.service.title}</h3>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Menunggu
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-2">
                      Dipesan pada: {formatDate(order.createdAt)}
                    </p>
                    
                    {order.scheduledDate && (
                      <p className="text-sm text-gray-500 mb-2">
                        Dijadwalkan: {formatDate(order.scheduledDate)}
                      </p>
                    )}
                    
                    {order.notes && (
                      <p className="text-sm border-l-2 border-gray-200 pl-2 mb-3">
                        "{order.notes}"
                      </p>
                    )}
                    
                    <div className="flex space-x-2 mt-3">
                      <Button 
                        onClick={() => handleAcceptOrder(order.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Terima
                      </Button>
                      <Button 
                        onClick={() => handleRejectOrder(order.id)}
                        variant="outline" 
                        className="flex-1 text-red-500 border-red-200"
                      >
                        <XCircle size={16} className="mr-2" />
                        Tolak
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <p className="text-gray-500">Belum ada pesanan yang menunggu</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active">
            {activeOrders.length > 0 ? (
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{order.service.title}</h3>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Berjalan
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-2">
                      Diterima pada: {formatDate(order.createdAt)}
                    </p>
                    
                    <Button 
                      onClick={() => handleCompleteOrder(order.id)}
                      className="w-full mt-3 bg-primary"
                    >
                      Selesaikan Pesanan
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <p className="text-gray-500">Belum ada pesanan yang sedang berjalan</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {completedOrders.length > 0 ? (
              <div className="space-y-4">
                {completedOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{order.service.title}</h3>
                      <span className={`${
                        order.status === 'completed' 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-red-100 text-red-800"
                      } text-xs px-2 py-1 rounded-full`}>
                        {order.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      {order.status === 'completed' 
                        ? 'Diselesaikan pada: ' 
                        : 'Dibatalkan pada: '
                      }
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <p className="text-gray-500">Belum ada pesanan yang selesai</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Orders;
