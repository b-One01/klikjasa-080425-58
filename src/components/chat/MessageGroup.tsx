
import { ChatMessage as ChatMessageType } from '@/types/service';
import ChatMessage from './ChatMessage';

interface MessageGroupProps {
  date: string;
  messages: ChatMessageType[];
  currentUserId: string;
  formatTime: (timestamp: string) => string;
}

const MessageGroup = ({ date, messages, currentUserId, formatTime }: MessageGroupProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-center">
        <span className="text-xs bg-gray-200 text-gray-500 rounded-full px-2 py-1">
          {date}
        </span>
      </div>
      
      {messages.map((message) => {
        const isSender = message.senderId === currentUserId;
        
        return (
          <ChatMessage 
            key={message.id} 
            message={message} 
            isSender={isSender} 
            formatTime={formatTime} 
          />
        );
      })}
    </div>
  );
};

export default MessageGroup;
