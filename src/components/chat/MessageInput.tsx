
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizonal, Image, Paperclip } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  filterContactInfo: (message: string) => { filteredMessage: string, containedContact: boolean };
}

const MessageInput = ({ onSendMessage, filterContactInfo }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [hasContactInfo, setHasContactInfo] = useState(false);

  useEffect(() => {
    if (newMessage.trim()) {
      const { containedContact } = filterContactInfo(newMessage);
      setHasContactInfo(containedContact);
    } else {
      setHasContactInfo(false);
    }
  }, [newMessage, filterContactInfo]);

  const handleSend = () => {
    if (!newMessage.trim() || hasContactInfo) return;
    onSendMessage(newMessage);
    setNewMessage('');
    setHasContactInfo(false);
  };

  return (
    <div className="bg-white border-t border-gray-200 p-3">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400"
          disabled
        >
          <Paperclip size={20} />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            placeholder="Ketik pesan..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !hasContactInfo && handleSend()}
            className={`pr-10 ${hasContactInfo ? 'border-red-300 focus-visible:ring-red-300' : ''}`}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400"
            disabled
          >
            <Image size={18} />
          </Button>
        </div>
        
        <Button
          variant={newMessage.trim() && !hasContactInfo ? "default" : "ghost"}
          size="icon"
          className={newMessage.trim() && !hasContactInfo ? "bg-primary text-white" : "text-gray-400"}
          onClick={handleSend}
          disabled={!newMessage.trim() || hasContactInfo}
        >
          <SendHorizonal size={20} />
        </Button>
      </div>
      
      {hasContactInfo ? (
        <div className="text-xs text-center mt-2 text-red-500 font-medium">
          Informasi kontak terdeteksi dan akan difilter. Jangan berbagi kontak pribadi sebelum deal demi menjaga privasi anda pada oknum tak bertanggungjawab.
        </div>
      ) : (
        <div className="text-xs text-center mt-2 text-gray-400">
          Pesan yang Anda kirim akan dimoderasi oleh sistem untuk mencegah pertukaran informasi kontak pribadi
        </div>
      )}
    </div>
  );
};

export default MessageInput;
