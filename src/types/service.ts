
export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  subCategories: SubCategory[];
}

export interface ServiceFormData {
  title: string;
  description: string;
  categoryId: string;
  subCategoryId: string;
  price: number | undefined;
  location?: string;
  images?: File[];
}

export interface ServiceRequest {
  id?: string;
  description: string;
  categoryId: string;
  subCategoryId: string;
  userId: string;
  location?: string;
  images?: string[];
  offerDeadline: string;
  createdAt?: string;
  status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}
