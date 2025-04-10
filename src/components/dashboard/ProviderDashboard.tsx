import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ServiceRequest, Service } from "@/types/service";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { useUser } from "@/contexts/UserContext";
import { useData } from "@/contexts/DataContext";

interface ProviderDashboardProps {
  services: Service[];
  serviceRequests: ServiceRequest[];
}

const ProviderDashboard = ({ services, serviceRequests }: ProviderDashboardProps) => {
  const { user } = useUser();
  const { categories } = useData();
  const navigate = useNavigate();
  
  // Sort service requests to show relevant ones first
  const [relevantRequests, otherRequests] = sortRequestsByRelevance(serviceRequests, services);
  
  // Sort service requests by relevance to the provider's services
  function sortRequestsByRelevance(requests: ServiceRequest[], providerServices: Service[]) {
    // If the provider has no services, all requests are "other"
    if (!providerServices.length || !providerServices.some(s => s.provider.id === user?.id)) {
      return [[], requests];
    }
    
    // Get the categories and subcategories of the provider's services
    const providerCategories = new Set(
      providerServices
        .filter(service => service.provider.id === user?.id)
        .map(service => service.categoryId)
    );
    
    const providerSubCategories = new Set(
      providerServices
        .filter(service => service.provider.id === user?.id)
        .map(service => service.subCategoryId)
        .filter(Boolean)
    );
    
    // Sort requests into relevant and other
    const relevant: ServiceRequest[] = [];
    const other: ServiceRequest[] = [];
    
    requests.forEach(request => {
      // Request is relevant if it matches provider's categories or subcategories
      if (
        providerCategories.has(request.categoryId) ||
        (request.subCategoryId && providerSubCategories.has(request.subCategoryId))
      ) {
        relevant.push(request);
      } else {
        other.push(request);
      }
    });
    
    return [relevant, other];
  }
  
  const myServices = services.filter(service => service.provider.id === user?.id);
  
  return (
    <div className="p-4 space-y-6">
      {/* My Services section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Layanan Saya</h2>
          <Link to="/my-services" className="text-xs text-primary">
            Lihat Semua
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {myServices.length > 0 ? (
            myServices.slice(0, 2).map(service => (
              <ServiceCard key={service.id} service={service} />
            ))
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-500 mb-3">
                Anda belum memiliki layanan
              </p>
              <Button 
                onClick={() => navigate('/add-service')}
                className="inline-flex items-center bg-primary"
              >
                <PlusCircle size={16} className="mr-2" />
                Tambah Layanan
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Relevant Service Requests section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Permintaan Layanan Relevan</h2>
          <Link to="/request-list" className="text-xs text-primary">
            Lihat Semua
          </Link>
        </div>
        
        <div className="space-y-3">
          {relevantRequests.length > 0 ? (
            relevantRequests.slice(0, 3).map(request => (
              <div 
                key={request.id} 
                className="border border-gray-200 rounded-lg p-4"
                onClick={() => navigate(`/request-offers/${request.id}`)}
              >
                <div className="flex justify-between mb-1">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {categories.find(c => c.id === request.categoryId)?.name || 'Kategori'}
                  </span>
                  <span className="text-xs text-gray-500">{request.offerDeadline}</span>
                </div>
                <p className="text-sm line-clamp-2 mb-2">{request.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{request.location}</span>
                  </div>
                  <Button variant="ghost" className="text-xs text-primary h-7 px-2">
                    Lihat Penawaran
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-500">
                Tidak ada permintaan layanan relevan saat ini
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Other Service Requests section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Permintaan Layanan Lainnya</h2>
          <Link to="/request-list" className="text-xs text-primary">
            Lihat Semua
          </Link>
        </div>
        
        <div className="space-y-3">
          {otherRequests.length > 0 ? (
            otherRequests.slice(0, 3).map(request => (
              <div 
                key={request.id} 
                className="border border-gray-200 rounded-lg p-4"
                onClick={() => navigate(`/request-offers/${request.id}`)}
              >
                <div className="flex justify-between mb-1">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {categories.find(c => c.id === request.categoryId)?.name || 'Kategori'}
                  </span>
                  <span className="text-xs text-gray-500">{request.offerDeadline}</span>
                </div>
                <p className="text-sm line-clamp-2 mb-2">{request.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{request.location}</span>
                  </div>
                  <Button variant="ghost" className="text-xs text-primary h-7 px-2">
                    Lihat Penawaran
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-500">
                Tidak ada permintaan layanan lainnya saat ini
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
