
import { ChatMessage as ChatMessageType } from '@/types/service';

interface ChatMessageProps {
  message: ChatMessageType;
  isSender: boolean;
  formatTime: (timestamp: string) => string;
}

const ChatMessage = ({ message, isSender, formatTime }: ChatMessageProps) => {
  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] rounded-lg p-3 ${
        isSender ? 'bg-primary text-white' : 'bg-white border border-gray-200'
      }`}>
        <p className="text-sm">{message.content}</p>
        <div className={`text-right mt-1 ${
          isSender ? 'text-primary-foreground/70' : 'text-gray-400'
        } text-xs`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
