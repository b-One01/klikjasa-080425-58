
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

interface BalanceCardProps {
  showTopUpButton?: boolean;
}

const BalanceCard = ({ showTopUpButton = true }: BalanceCardProps) => {
  const { user, updateBalance } = useUser();
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState<number>(50000);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleTopup = () => {
    updateBalance(topupAmount);
    setIsTopupModalOpen(false);
    toast.success(`Berhasil menambah saldo ${formatCurrency(topupAmount)}`);
  };

  const handleCancelTopup = () => {
    setIsTopupModalOpen(false);
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Saldo Anda</p>
          <p className="text-xl font-bold">{formatCurrency(user.balance)}</p>
        </div>
        {showTopUpButton && (
          <Button onClick={() => setIsTopupModalOpen(true)} variant="outline" className="bg-accent text-white hover:bg-accent/90">
            Top Up Saldo
          </Button>
        )}
      </div>
      
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
              <Button onClick={handleCancelTopup} variant="outline" className="flex-1">
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

export default BalanceCard;
