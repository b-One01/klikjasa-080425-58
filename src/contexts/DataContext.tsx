import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ServiceFormData } from '@/types/service';

// Types
export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  businessName?: string;
  profileImage?: string;
  rating?: number;
  phone: string;
  email: string;
  balance: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  subCategoryId: string;
  providerId: string;
  price?: number;
  location?: string;
  images?: string[];
  provider: ServiceProvider;
}

export interface Order {
  id: string;
  serviceId: string;
  userId: string;
  providerId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  scheduledDate?: string;
  notes?: string;
  service: Service;
}

interface DataContextType {
  categories: ServiceCategory[];
  services: Service[];
  filteredServices: Service[];
  orders: Order[];
  searchServices: (query: string, categoryId?: string, subCategoryId?: string) => void;
  getServiceById: (id: string) => Service | undefined;
  getCategoryById: (id: string) => ServiceCategory | undefined;
  addService: (serviceData: ServiceFormData) => void;
  updateService: (id: string, serviceData: Partial<ServiceFormData>) => void;
  deleteService: (id: string) => void;
  createOrder: (serviceId: string, notes?: string, scheduledDate?: string) => void;
  getOrdersByUserId: (userId: string) => Order[];
  getOrdersByProviderId: (providerId: string) => Order[];
  updateOrderStatus: (orderId: string, status: 'accepted' | 'rejected' | 'completed') => void;
}

// Sample data
const sampleCategories: ServiceCategory[] = [
  {
    id: 'cat-1',
    name: 'Kebersihan',
    icon: 'house',
    subCategories: [
      { id: 'sub-1', name: 'Pembersihan Rumah', categoryId: 'cat-1' },
      { id: 'sub-2', name: 'Pembersihan Kantor', categoryId: 'cat-1' }
    ]
  },
  {
    id: 'cat-2',
    name: 'Perbaikan Rumah',
    icon: 'settings',
    subCategories: [
      { id: 'sub-3', name: 'Perbaikan Atap', categoryId: 'cat-2' },
      { id: 'sub-4', name: 'Perbaikan AC', categoryId: 'cat-2' }
    ]
  },
  {
    id: 'cat-3',
    name: 'Kecantikan & Kesehatan',
    icon: 'heart',
    subCategories: [
      { id: 'sub-5', name: 'Salon', categoryId: 'cat-3' },
      { id: 'sub-6', name: 'Massage', categoryId: 'cat-3' }
    ]
  },
  {
    id: 'cat-4',
    name: 'Transportasi',
    icon: 'car',
    subCategories: [
      { id: 'sub-7', name: 'Antar Jemput', categoryId: 'cat-4' },
      { id: 'sub-8', name: 'Rental Mobil', categoryId: 'cat-4' }
    ]
  },
  {
    id: 'cat-5',
    name: 'Pendidikan & Pelatihan',
    icon: 'briefcase',
    subCategories: [
      { id: 'sub-9', name: 'Les Privat', categoryId: 'cat-5' },
      { id: 'sub-10', name: 'Kursus Online', categoryId: 'cat-5' }
    ]
  },
  {
    id: 'cat-6',
    name: 'Acara',
    icon: 'calendar',
    subCategories: [
      { id: 'sub-11', name: 'Dekorasi', categoryId: 'cat-6' },
      { id: 'sub-12', name: 'Katering', categoryId: 'cat-6' }
    ]
  }
];

const sampleProviders: ServiceProvider[] = [
  {
    id: 'provider-1',
    name: 'Budi Santoso',
    businessName: 'Budi Cleaning Services',
    profileImage: '/placeholder.svg',
    rating: 4.5,
    phone: '+6281234567890',
    email: 'budi@example.com',
    balance: 100000,
  },
  {
    id: 'provider-2',
    name: 'Siti Rahayu',
    businessName: 'Siti Salon',
    profileImage: '/placeholder.svg',
    rating: 4.8,
    phone: '+6289876543210',
    email: 'siti@example.com',
    balance: 250000,
  },
  {
    id: 'provider-3',
    name: 'Ahmad Wijaya',
    businessName: 'Wijaya Home Repair',
    profileImage: '/placeholder.svg', 
    rating: 4.2,
    phone: '+6287654321098',
    email: 'ahmad@example.com',
    balance: 0, // Empty balance
  }
];

const sampleServices: Service[] = [
  {
    id: 'service-1',
    title: 'Pembersihan Rumah Harian',
    description: 'Layanan pembersihan rumah setiap hari dengan peralatan lengkap. Kami akan membersihkan seluruh bagian rumah anda dengan teliti.',
    categoryId: 'cat-1',
    subCategoryId: 'sub-1',
    providerId: 'provider-1',
    price: 200000,
    location: 'Jakarta Selatan',
    images: ['/placeholder.svg'],
    provider: sampleProviders[0],
  },
  {
    id: 'service-2',
    title: 'Pembersihan Kantor Mingguan',
    description: 'Layanan pembersihan kantor mingguan untuk ruangan hingga 200m².',
    categoryId: 'cat-1',
    subCategoryId: 'sub-2',
    providerId: 'provider-1',
    price: 500000,
    location: 'Jakarta Pusat',
    images: ['/placeholder.svg'],
    provider: sampleProviders[0],
  },
  {
    id: 'service-3',
    title: 'Potong Rambut & Styling',
    description: 'Potong rambut profesional dan styling dengan produk berkualitas premium.',
    categoryId: 'cat-3',
    subCategoryId: 'sub-5',
    providerId: 'provider-2',
    price: 150000,
    location: 'Jakarta Barat',
    images: ['/placeholder.svg'],
    provider: sampleProviders[1],
  },
  {
    id: 'service-4',
    title: 'Perbaikan Atap Bocor',
    description: 'Perbaikan atap bocor dengan garansi 1 tahun. Teknisi berpengalaman.',
    categoryId: 'cat-2',
    subCategoryId: 'sub-3',
    providerId: 'provider-3',
    price: 350000,
    location: 'Jakarta Timur',
    images: ['/placeholder.svg'],
    provider: sampleProviders[2],
  }
];

const sampleOrders: Order[] = [];

const DataContext = createContext<DataContextType>({
  categories: [],
  services: [],
  filteredServices: [],
  orders: [],
  searchServices: () => {},
  getServiceById: () => undefined,
  getCategoryById: () => undefined,
  addService: () => {},
  updateService: () => {},
  deleteService: () => {},
  createOrder: () => {},
  getOrdersByUserId: () => [],
  getOrdersByProviderId: () => [],
  updateOrderStatus: () => {},
});

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories] = useState<ServiceCategory[]>(sampleCategories);
  const [services, setServices] = useState<Service[]>(sampleServices);
  const [filteredServices, setFilteredServices] = useState<Service[]>(sampleServices);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);

  const searchServices = (
    query: string = '',
    categoryId?: string,
    subCategoryId?: string
  ) => {
    let results = [...services];
    
    if (query.trim()) {
      const lowercasedQuery = query.toLowerCase();
      results = results.filter(service => 
        service.title.toLowerCase().includes(lowercasedQuery) ||
        service.description.toLowerCase().includes(lowercasedQuery) ||
        service.provider.name.toLowerCase().includes(lowercasedQuery) ||
        (service.provider.businessName && 
          service.provider.businessName.toLowerCase().includes(lowercasedQuery))
      );
    }
    
    if (categoryId) {
      results = results.filter(service => service.categoryId === categoryId);
    }
    
    if (subCategoryId) {
      results = results.filter(service => service.subCategoryId === subCategoryId);
    }
    
    setFilteredServices(results);
  };
  
  const getServiceById = (id: string) => {
    return services.find(service => service.id === id);
  };

  const getCategoryById = (id: string) => {
    return categories.find(category => category.id === id);
  };
  
  const addService = (serviceData: ServiceFormData) => {
    const newService: Service = {
      id: `service-${services.length + 1}`,
      title: serviceData.title,
      description: serviceData.description,
      categoryId: serviceData.categoryId,
      subCategoryId: serviceData.subCategoryId,
      providerId: 'provider-1',
      price: serviceData.price,
      location: serviceData.location,
      images: serviceData.images 
        ? Array.from(serviceData.images).map(file => URL.createObjectURL(file))
        : undefined,
      provider: sampleProviders[0]
    };
    
    setServices(prev => [...prev, newService]);
    setFilteredServices(prev => [...prev, newService]);
  };
  
  const updateService = (id: string, serviceData: Partial<ServiceFormData>) => {
    setServices(prev => 
      prev.map(service => 
        service.id === id
          ? {
              ...service,
              ...serviceData,
              images: serviceData.images 
                ? Array.from(serviceData.images).map(file => URL.createObjectURL(file))
                : service.images
            }
          : service
      )
    );
    
    if (filteredServices.some(s => s.id === id)) {
      setFilteredServices(prev => 
        prev.map(service => 
          service.id === id
            ? {
                ...service,
                ...serviceData,
                images: serviceData.images 
                  ? Array.from(serviceData.images).map(file => URL.createObjectURL(file))
                  : service.images
              }
            : service
        )
      );
    }
  };
  
  const deleteService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
    setFilteredServices(prev => prev.filter(service => service.id !== id));
  };
  
  const createOrder = (serviceId: string, notes?: string, scheduledDate?: string) => {
    const service = getServiceById(serviceId);
    if (!service) return;
    
    const newOrder: Order = {
      id: `order-${orders.length + 1}`,
      serviceId,
      userId: 'user-1',
      providerId: service.providerId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes,
      scheduledDate,
      service
    };
    
    setOrders(prev => [...prev, newOrder]);
  };
  
  const getOrdersByUserId = (userId: string) => {
    return orders.filter(order => order.userId === userId);
  };
  
  const getOrdersByProviderId = (providerId: string) => {
    return orders.filter(order => order.providerId === providerId);
  };
  
  const updateOrderStatus = (orderId: string, status: 'accepted' | 'rejected' | 'completed') => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId
          ? { ...order, status }
          : order
      )
    );
  };

  return (
    <DataContext.Provider value={{ 
      categories, 
      services, 
      filteredServices, 
      orders,
      searchServices, 
      getServiceById,
      getCategoryById,
      addService,
      updateService,
      deleteService,
      createOrder,
      getOrdersByUserId,
      getOrdersByProviderId,
      updateOrderStatus
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
