import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Clock, MapPin, MessageSquare, ShoppingCart } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { useUser } from '@/contexts/UserContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getServiceById, getCategoryById, createOrder } = useData();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [providerContactInfo, setProviderContactInfo] = useState<string | null>(null);
  
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
  
  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
    toast.success('Layanan ditambahkan ke keranjang');
  };
  
  const handleOrderSubmit = () => {
    createOrder(service.id, orderNotes, orderDate);
    setShowOrderForm(false);
    setShowConfirmation(true);
  };

  const handleConfirmOrder = () => {
    setProviderContactInfo(service.provider.phone);
    
    toast.success('Terima kasih telah memesan layanan di KlikJasa');
    
    setShowConfirmation(false);
    setOrderNotes('');
    setOrderDate('');
  };

  const handleSwitchToUser = () => {
    if (user) {
      toast.success('Beralih ke akun Pengguna Jasa');
      navigate('/');
    }
  };

  const handleGoToChat = () => {
    navigate(`/chat/${service.provider.id}`);
  };

  const formatPhoneForWhatsApp = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    
    if (digits.startsWith('0')) {
      return `62${digits.substring(1)}`;
    } else if (digits.startsWith('62')) {
      return digits;
    } else if (digits.startsWith('8')) {
      return `62${digits}`;
    }
    
    return digits;
  };

  const handleWhatsAppClick = () => {
    if (providerContactInfo) {
      const formattedPhone = formatPhoneForWhatsApp(providerContactInfo);
      const whatsappUrl = `https://wa.me/${formattedPhone}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="app-container pb-16">
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="p-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </Button>
          
          {user?.role === 'user' && (
            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/cart')}>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          )}
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
            {service.price ? `Mulai dari ${formatCurrency(service.price)}` : "Harga bervariasi"}
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
          <>
            {showOrderForm ? (
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold mb-4">Pesan Layanan</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Tanggal Layanan</label>
                    <Input 
                      type="date" 
                      value={orderDate} 
                      onChange={(e) => setOrderDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Catatan</label>
                    <Textarea
                      placeholder="Berikan detail tambahan untuk layanan ini"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowOrderForm(false)}
                      className="flex-1"
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={handleOrderSubmit}
                      className="flex-1 bg-primary"
                    >
                      Lanjutkan
                    </Button>
                  </div>
                </div>
              </div>
            ) : showConfirmation ? (
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold mb-2">Konfirmasi Pesanan</h3>
                <p className="text-gray-600 mb-4">
                  Dengan mengkonfirmasi pesanan ini, Anda menyetujui untuk membayar biaya platform sebesar 3% dari harga minimal layanan.
                </p>
                
                <div className="bg-gray-50 p-3 rounded-md mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Harga layanan:</span>
                    <span>{formatCurrency(service.price)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Biaya platform (3%):</span>
                    <span>{formatCurrency((service.price || 0) * 0.03)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total:</span>
                    <span>{formatCurrency((service.price || 0) * 1.03)}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleConfirmOrder}
                    className="flex-1 bg-primary"
                  >
                    Konfirmasi Pesanan
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {providerContactInfo ? (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                    <h3 className="font-semibold text-green-800 mb-2">Pesanan Berhasil!</h3>
                    <p className="text-green-700 mb-3">
                      Anda dapat menghubungi penyedia jasa melalui:
                    </p>
                    <div className="bg-white p-3 rounded border border-green-100">
                      <p className="font-medium mb-3">No. Telepon: {providerContactInfo}</p>
                      <Button 
                        onClick={handleWhatsAppClick}
                        className="w-full bg-green-500 hover:bg-green-600"
                      >
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                          alt="WhatsApp" 
                          className="w-5 h-5 mr-2"
                        />
                        Hubungi via WhatsApp
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 mb-4">
                      <p className="text-sm text-yellow-700">
                        Hubungi penyedia layanan terlebih dahulu untuk memastikan harga dan gambaran layanan yang Anda butuhkan
                      </p>
                    </div>
                    
                    <Button
                      className="w-full flex items-center justify-center mb-4 bg-green-500 hover:bg-green-600"
                      onClick={handleGoToChat}
                    >
                      <MessageSquare size={18} className="mr-2" />
                      <span>Chat dengan Penyedia</span>
                    </Button>
                    
                    <div className="flex space-x-3 mb-6">
                      <Button
                        onClick={() => setShowOrderForm(true)}
                        className="flex-1 bg-primary"
                      >
                        Pesan Layanan
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleAddToCart}
                        className="flex-1"
                      >
                        <ShoppingCart size={18} className="mr-2" />
                        Tambah ke Keranjang
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
        
        {user && user.role === 'provider' && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-4">
              Anda saat ini masuk sebagai Penyedia Jasa. 
              Beralih ke Pengguna Jasa untuk memesan layanan ini.
            </p>
            <Button
              className="w-full bg-primary"
              onClick={handleSwitchToUser}
            >
              Beralih ke Pengguna Jasa
            </Button>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ServiceDetail;
