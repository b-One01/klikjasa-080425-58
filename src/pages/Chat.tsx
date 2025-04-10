
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { ChatMessage } from '@/types/service';
import { useToast } from '@/hooks/use-toast';

import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import OfferActions from '@/components/chat/OfferActions';
import { 
  filterContactInfo, 
  getMockUserInfo, 
  generateMockMessages, 
  formatTime, 
  formatMessageDate, 
  groupMessagesByDate 
} from '@/utils/chatHelpers';

const Chat = () => {
  const { id: otherUserId } = useParams<{ id: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [otherUser, setOtherUser] = useState<{ name: string; image?: string }>({ name: '' });
  const [offerStatus, setOfferStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending');
  
  useEffect(() => {
    if (user && otherUserId) {
      setMessages(generateMockMessages(user.id, otherUserId));
      setOtherUser(getMockUserInfo(otherUserId));
    }
  }, [user, otherUserId]);
  
  const handleSendMessage = (newMessage: string) => {
    if (!user || !otherUserId) return;
    
    const { filteredMessage } = filterContactInfo(newMessage);
    
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      receiverId: otherUserId,
      content: filteredMessage,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setMessages([...messages, newMsg]);
  };
  
  const handleAcceptOffer = () => {
    setOfferStatus('accepted');
    toast({
      title: "Penawaran diterima",
      description: "Anda telah menerima penawaran",
    });
  };
  
  const handleRejectOffer = () => {
    setOfferStatus('rejected');
    toast({
      title: "Penawaran ditolak",
      description: "Anda telah menolak penawaran",
      variant: "destructive",
    });
  };
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const messageGroups = groupMessagesByDate(messages);
  
  return (
    <div className="app-container flex flex-col h-screen">
      <ChatHeader otherUser={otherUser} />
      
      <MessageList 
        messageGroups={messageGroups} 
        currentUserId={user.id} 
        formatTime={formatTime}
      />
      
      <OfferActions 
        offerStatus={offerStatus} 
        onAccept={handleAcceptOffer} 
        onReject={handleRejectOffer} 
      />
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        filterContactInfo={filterContactInfo} 
      />
    </div>
  );
};

export default Chat;
