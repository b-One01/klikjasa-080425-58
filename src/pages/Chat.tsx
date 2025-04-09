
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, SendHorizonal, Image, Paperclip, X } from 'lucide-react';
import { ChatMessage } from '@/types/service';

// Mock function to get user info
const getMockUserInfo = (userId: string) => {
  const userMap: Record<string, { name: string; image?: string }> = {
    'provider-1': { name: 'Budi Santoso', image: '/placeholder.svg' },
    'provider-2': { name: 'Siti Rahayu' },
    'user-1': { name: 'Ahmad' },
    'user-2': { name: 'Lisa' },
  };
  
  return userMap[userId] || { name: 'Unknown User' };
};

// Mock messages
const generateMockMessages = (currentUserId: string, otherUserId: string): ChatMessage[] => {
  return [
    {
      id: '1',
      senderId: currentUserId,
      receiverId: otherUserId,
      content: 'Halo, saya tertarik dengan layanan Anda',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true
    },
    {
      id: '2',
      senderId: otherUserId,
      receiverId: currentUserId,
      content: 'Terima kasih atas ketertarikan Anda. Ada yang bisa saya bantu?',
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      read: true
    },
    {
      id: '3',
      senderId: currentUserId,
      receiverId: otherUserId,
      content: 'Saya ingin tahu lebih detail tentang harga layanan pembersihan rumah',
      timestamp: new Date(Date.now() - 3400000).toISOString(),
      read: true
    },
    {
      id: '4',
      senderId: otherUserId,
      receiverId: currentUserId,
      content: 'Untuk pembersihan rumah standar, harganya mulai dari Rp 200.000 tergantung luas rumah dan tingkat kebersihan yang diinginkan. Bisa saya tahu berapa ukuran rumah Anda?',
      timestamp: new Date(Date.now() - 3300000).toISOString(),
      read: true
    }
  ];
};

const Chat = () => {
  const { id: otherUserId } = useParams<{ id: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<{ name: string; image?: string }>({ name: '' });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (user && otherUserId) {
      // In a real app, this would fetch messages from the database
      setMessages(generateMockMessages(user.id, otherUserId));
      setOtherUser(getMockUserInfo(otherUserId));
    }
  }, [user, otherUserId]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !user || !otherUserId) return;
    
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      receiverId: otherUserId,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // In a real app, this would send the message to the server
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hari ini';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Kemarin';
    } else {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  };
  
  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { date: string; messages: ChatMessage[] }[] = [];
    let currentDate = '';
    let currentGroup: ChatMessage[] = [];
    
    messages.forEach(message => {
      const messageDate = formatMessageDate(message.timestamp);
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });
    
    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }
    
    return groups;
  };
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  return (
    <div className="app-container flex flex-col h-screen">
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="p-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => navigate('/chats')}
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
      
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 mb-4">
          <p className="text-sm text-yellow-700">
            Informasi pribadi seperti nomor telepon, WhatsApp, dan informasi kontak lainnya akan disaringkan oleh sistem untuk memastikan keamanan. Gunakan fitur chat ini untuk komunikasi.
          </p>
        </div>
        
        {groupMessagesByDate().map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-3">
            <div className="flex justify-center">
              <span className="text-xs bg-gray-200 text-gray-500 rounded-full px-2 py-1">
                {group.date}
              </span>
            </div>
            
            {group.messages.map((message) => {
              const isSender = message.senderId === user.id;
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                >
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
            })}
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>
      
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
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="pr-10"
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
            variant={newMessage.trim() ? "default" : "ghost"}
            size="icon"
            className={newMessage.trim() ? "bg-primary text-white" : "text-gray-400"}
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <SendHorizonal size={20} />
          </Button>
        </div>
        
        <div className="text-xs text-center mt-2 text-gray-400">
          Pesan yang Anda kirim akan dimoderasi oleh sistem untuk mencegah pertukaran informasi kontak pribadi
        </div>
      </div>
    </div>
  );
};

export default Chat;
