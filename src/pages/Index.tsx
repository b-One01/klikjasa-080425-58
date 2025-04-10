
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useData } from "@/contexts/DataContext";
import BottomNavigation from "@/components/BottomNavigation";
import { ServiceRequest } from "@/types/service";
import GuestWelcome from "@/components/dashboard/GuestWelcome";
import AppHeader from "@/components/dashboard/AppHeader";
import UserDashboard from "@/components/dashboard/UserDashboard";
import ProviderDashboard from "@/components/dashboard/ProviderDashboard";

const Index = () => {
  const { user, login } = useUser();
  const { categories, services } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendedServices, setRecommendedServices] = useState(services);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  
  useEffect(() => {
    if (user?.role === 'provider') {
      const mockRequests: ServiceRequest[] = [
        {
          id: 'req-1',
          description: 'Saya membutuhkan jasa pembersihan rumah untuk rumah dengan 3 kamar tidur',
          categoryId: 'c-1',
          subCategoryId: 'sc-1',
          userId: 'user-1',
          location: 'Jakarta Selatan',
          offerDeadline: '3 Jam',
          createdAt: new Date().toISOString(),
          status: 'open'
        },
        {
          id: 'req-2',
          description: 'Butuh tukang ledeng untuk perbaikan keran yang bocor',
          categoryId: 'c-2',
          subCategoryId: 'sc-5',
          userId: 'user-2',
          location: 'Jakarta Pusat',
          offerDeadline: '6 Jam',
          createdAt: new Date().toISOString(),
          status: 'open'
        }
      ];
      setServiceRequests(mockRequests);
    }
  }, [user?.role]);
  
  useEffect(() => {
    if (services.length > 0) {
      if (user?.role === 'user') {
        const sortedServices = [...services].sort(() => Math.random() - 0.5);
        setRecommendedServices(sortedServices);
      }
    }
  }, [services, user]);
  
  const handleGuestLogin = () => {
    const sampleUser = {
      id: 'user-1',
      name: 'Tamu',
      email: 'tamu@example.com',
      phone: '+628123456789',
      role: 'user' as const, // TypeScript fix: explicitly type as 'user' literal
      balance: 50000,
      isLoggedIn: true,
      address: 'Jakarta, Indonesia',
    };
    
    login(sampleUser);
  };
  
  if (!user?.isLoggedIn) {
    return <GuestWelcome onGuestLogin={handleGuestLogin} />;
  }
  
  return (
    <div className="app-container pb-16">
      <AppHeader user={user} />
      
      {user.role === 'user' ? (
        <UserDashboard 
          categories={categories} 
          services={services}
          recommendedServices={recommendedServices}
        />
      ) : (
        <ProviderDashboard 
          services={services} 
          serviceRequests={serviceRequests}
        />
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
