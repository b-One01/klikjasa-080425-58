
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import BottomNavigation from '@/components/BottomNavigation';
import { supabase } from '@/integrations/supabase/client';

interface ChatPreview {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserImage?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

// Mock data for chat previews
const mockChatPreviews: ChatPreview[] = [
  {
    id: 'chat-1',
    otherUserId: 'user-1',
    otherUserName: 'Budi Santoso',
    otherUserImage: '/placeholder.svg',
    lastMessage: 'Baik, saya akan datang jam 3 sore besok.',
    timestamp: '10:30',
    unreadCount: 0
  },
  {
    id: 'chat-2',
    otherUserId: 'user-2',
    otherUserName: 'Siti Rahayu',
    lastMessage: 'Harga layanannya berapa ya?',
    timestamp: 'Kemarin',
    unreadCount: 2
  },
];

const ChatList = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [chatPreviews, setChatPreviews] = useState<ChatPreview[]>(mockChatPreviews);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredChats = chatPreviews.filter(chat =>
    chat.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatTime = (timestamp: string) => {
    // For mock data we'll just return the timestamp as is
    // In a real app, this would parse and format a real timestamp
    return timestamp;
  };
  
  const handleChatSelect = (chatId: string, otherUserId: string) => {
    navigate(`/chat/${otherUserId}`);
  };
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  return (
    <div className="app-container pb-16">
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="p-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold">Pesan</h1>
        </div>
        
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Cari pesan"
              className="pl-9 pr-4 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleChatSelect(chat.id, chat.otherUserId)}
            >
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                  {chat.otherUserImage ? (
                    <img
                      src={chat.otherUserImage}
                      alt={chat.otherUserName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 font-medium">
                      {chat.otherUserName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{chat.otherUserName}</span>
                    <span className="text-xs text-gray-500">{formatTime(chat.timestamp)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 line-clamp-1">{chat.lastMessage}</p>
                    
                    {chat.unreadCount > 0 && (
                      <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            {searchQuery ? 'Tidak ada chat yang sesuai dengan pencarian' : 'Belum ada pesan'}
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ChatList;
