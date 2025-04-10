
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
  otherUser: {
    name: string;
    image?: string;
  };
}

const ChatHeader = ({ otherUser }: ChatHeaderProps) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
      <div className="p-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={handleBack}
        >
          <ArrowLeft size={20} />
        </Button>
        
        <div className="flex items-center flex-1">
          <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
            {otherUser.image ? (
              <img 
                src={otherUser.image}
                alt={otherUser.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 font-medium">
                {otherUser.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="ml-2">
            <h1 className="font-semibold">{otherUser.name}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
