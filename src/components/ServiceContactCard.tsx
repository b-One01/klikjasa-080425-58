
import { Button } from "@/components/ui/button"; 
import { Service } from "@/contexts/DataContext";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
import { toast } from "sonner";

interface ServiceContactCardProps {
  service: Service;
}

const ServiceContactCard = ({ service }: ServiceContactCardProps) => {
  const { user, updateBalance } = useUser();
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState<number>(50000);
  
  const contactFee = 10000; // 10,000 IDR to view contact
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleViewContact = () => {
    if (!user || user.balance < contactFee) {
      setIsTopupModalOpen(true);
      return;
    }
    
    updateBalance(-contactFee);
    setIsContactVisible(true);
    toast.success("Informasi kontak berhasil dibuka");
  };

  const handleTopup = () => {
    updateBalance(topupAmount);
    setIsTopupModalOpen(false);
    toast.success(`Berhasil menambah saldo ${formatCurrency(topupAmount)}`);
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="text-lg font-semibold mb-4">Informasi Kontak Penyedia Jasa</h3>
      
      {isContactVisible ? (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Nomor Telepon</p>
            <p className="font-medium">{service.provider.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{service.provider.email}</p>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button asChild className="flex-1 bg-accent hover:bg-accent/90">
              <a href={`tel:${service.provider.phone}`}>Telepon</a>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <a href={`mailto:${service.provider.email}`}>Email</a>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm">
            Untuk melihat informasi kontak penyedia jasa, Anda harus membayar biaya{" "}
            <span className="font-semibold">{formatCurrency(contactFee)}</span>
          </p>
          <div className="flex items-center justify-between">
            <p className="text-sm">
              Saldo Anda: <span className="font-semibold">{formatCurrency(user.balance)}</span>
            </p>
            <Button 
              onClick={handleViewContact} 
              className="bg-primary hover:bg-primary/90"
              disabled={!user.isLoggedIn}
            >
              {user.balance < contactFee ? "Top Up & Lihat Kontak" : "Lihat Kontak"}
            </Button>
          </div>
          
          {!user.isLoggedIn && (
            <p className="text-sm text-red-500">
              Silakan login terlebih dahulu untuk melihat kontak penyedia jasa.
            </p>
          )}
        </div>
      )}
      
      {isTopupModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Top Up Saldo</h3>
            <div className="space-y-4 mb-6">
              <p className="text-sm text-gray-500">Pilih jumlah top up:</p>
              <div className="grid grid-cols-3 gap-2">
                {[50000, 100000, 250000, 500000, 1000000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTopupAmount(amount)}
                    className={`p-2 rounded-md border ${
                      amount === topupAmount
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-200"
                    }`}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setIsTopupModalOpen(false)} variant="outline" className="flex-1">
                Batal
              </Button>
              <Button onClick={handleTopup} className="flex-1 bg-primary">
                Konfirmasi Top Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceContactCard;
