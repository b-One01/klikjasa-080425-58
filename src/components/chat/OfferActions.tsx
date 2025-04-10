
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface OfferActionsProps {
  offerStatus: 'pending' | 'accepted' | 'rejected';
  onAccept: () => void;
  onReject: () => void;
}

const OfferActions = ({ offerStatus, onAccept, onReject }: OfferActionsProps) => {
  if (offerStatus !== 'pending') {
    return null;
  }

  return (
    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          className="flex-1 border-red-300 text-red-500 hover:bg-red-50"
          onClick={onReject}
        >
          Tolak Penawaran
        </Button>
        <Button 
          className="flex-1 bg-green-500 hover:bg-green-600"
          onClick={onAccept}
        >
          Konfirmasi Penawaran
        </Button>
      </div>
    </div>
  );
};

export default OfferActions;
