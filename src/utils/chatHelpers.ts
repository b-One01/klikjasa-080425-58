
export const filterContactInfo = (message: string): { filteredMessage: string, containedContact: boolean } => {
  const phonePatterns = [
    /(\+62|62|0)8[1-9][0-9]{6,10}/g,  
    /(\+62|62|0)\s*8[1-9][\s\d]{6,14}/g,  
    /(\+62|62|0)[\s-]*8[1-9][\s-\d]{6,20}/g,  
    /(\+62|62|0)[.\s-]*8[1-9][.\s-\d]{6,20}/g
  ];
  
  const waPattern = /\b(whatsapp|wa|WA|Whatsapp|whtsapp|w\.a|w\sa)\b/gi;
  
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  
  const socialPattern = /\b(instagram|ig|telegram|facebook|fb|twitter|line|tiktok)\b/gi;
  
  let containsPhone = false;
  for (const pattern of phonePatterns) {
    if (pattern.test(message)) {
      containsPhone = true;
      break;
    }
  }
  
  const containsWA = waPattern.test(message);
  const containsEmail = emailPattern.test(message);
  const containsSocial = socialPattern.test(message);
  
  const containedContact = containsPhone || containsWA || containsEmail || containsSocial;
  
  let filteredMessage = message;
  
  if (containsPhone) {
    for (const pattern of phonePatterns) {
      filteredMessage = filteredMessage.replace(pattern, "*** nomor telepon disensor ***");
    }
  }
  
  if (containsWA) {
    filteredMessage = filteredMessage.replace(waPattern, "*** platform chat disensor ***");
  }
  
  if (containsEmail) {
    filteredMessage = filteredMessage.replace(emailPattern, "*** email disensor ***");
  }
  
  if (containsSocial) {
    filteredMessage = filteredMessage.replace(socialPattern, "*** sosial media disensor ***");
  }
  
  return { filteredMessage, containedContact };
};

export const getMockUserInfo = (userId: string) => {
  const userMap: Record<string, { name: string; image?: string }> = {
    'provider-1': { name: 'Budi Santoso', image: '/placeholder.svg' },
    'provider-2': { name: 'Siti Rahayu' },
    'user-1': { name: 'Ahmad' },
    'user-2': { name: 'Lisa' },
  };
  
  return userMap[userId] || { name: 'Unknown User' };
};

export const generateMockMessages = (currentUserId: string, otherUserId: string) => {
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

export const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export const formatMessageDate = (timestamp: string) => {
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

export const groupMessagesByDate = (messages: any[]) => {
  const groups: { date: string; messages: any[] }[] = [];
  let currentDate = '';
  let currentGroup: any[] = [];
  
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
