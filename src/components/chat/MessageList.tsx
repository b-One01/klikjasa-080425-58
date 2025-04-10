
import { useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/service';
import MessageGroup from './MessageGroup';

interface MessageListProps {
  messageGroups: { date: string; messages: ChatMessage[] }[];
  currentUserId: string;
  formatTime: (timestamp: string) => string;
}

const MessageList = ({ messageGroups, currentUserId, formatTime }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messageGroups]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 mb-4">
        <p className="text-sm text-yellow-700">
          <strong>Hubungi penyedia layanan</strong> untuk memastikan harga dan gambaran layanan yang Anda butuhkan. Informasi pribadi seperti nomor telepon, WhatsApp, dan informasi kontak lainnya akan disaring oleh sistem untuk memastikan keamanan.
        </p>
      </div>
      
      {messageGroups.map((group, groupIndex) => (
        <MessageGroup
          key={groupIndex}
          date={group.date}
          messages={group.messages}
          currentUserId={currentUserId}
          formatTime={formatTime}
        />
      ))}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
