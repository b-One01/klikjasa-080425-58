
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Trash2, MessageSquare } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Service } from '@/contexts/DataContext';
import BottomNavigation from '@/components/BottomNavigation';
import { toast } from 'sonner';

// Mock data for cart items
const mockCartItems: Service[] = [
  // Add mock services here if needed for demonstration
];

const Cart = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState<Service[]>(mockCartItems);
  
  const formatCurrency = (amount?: number) => {
    if (!amount) return "Harga bervariasi";
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const removeFromCart = (serviceId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== serviceId));
    toast.success('Layanan dihapus dari keranjang');
  };
  
  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0);
  };
  
  const getPlatformFee = () => {
    return getSubtotal() * 0.03;
  };
  
  const getTotal = () => {
    return getSubtotal() + getPlatformFee();
  };
  
  const handleCheckout = () => {
    toast.success('Pesanan berhasil dibuat!');
    setCartItems([]);
    navigate('/orders');
  };
  
  const handleChatWithProvider = (providerId: string) => {
    navigate(`/chat/${providerId}`);
  };
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
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
          <h1 className="text-xl font-semibold">Keranjang</h1>
        </div>
      </div>
      
      <div className="p-4">
        {cartItems.length > 0 ? (
          <div className="space-y-6">
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 mb-4">
              <p className="text-sm text-yellow-700">
                Hubungi penyedia layanan terlebih dahulu untuk memastikan harga dan gambaran layanan yang Anda butuhkan sebelum melakukan checkout
              </p>
            </div>
            
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="flex">
                    <div className="h-20 w-20 bg-gray-200">
                      {item.images && item.images.length > 0 ? (
                        <img 
                          src={item.images[0]} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingCart size={20} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 p-3">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-base line-clamp-1">{item.title}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-red-500"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-2">{item.provider.businessName || item.provider.name}</p>
                      
                      <div className="flex justify-between items-center">
                        <Button 
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary-dark p-0 h-auto text-xs"
                          onClick={() => handleChatWithProvider(item.provider.id)}
                        >
                          <MessageSquare size={12} className="mr-1" />
                          Chat dengan Penyedia
                        </Button>
                        
                        <div className="font-medium text-primary">
                          {formatCurrency(item.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium mb-3">Ringkasan Pesanan</h3>
              
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatCurrency(getSubtotal())}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Biaya Platform (3%)</span>
                  <span>{formatCurrency(getPlatformFee())}</span>
                </div>
              </div>
              
              <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(getTotal())}</span>
              </div>
            </div>
            
            <Button 
              onClick={handleCheckout}
              className="w-full bg-primary"
            >
              Checkout
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <ShoppingCart size={48} className="text-gray-300 mb-4" />
            <h2 className="text-xl font-medium mb-2">Keranjang Kosong</h2>
            <p className="text-gray-500 text-center mb-6">Anda belum menambahkan layanan ke keranjang</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-primary"
            >
              Cari Layanan
            </Button>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Cart;
