
import { Service } from "@/contexts/DataContext";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const formatCurrency = (amount?: number) => {
    if (!amount) return "Harga bervariasi";
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Link to={`/service/${service.id}`} className="service-card">
      <div className="h-40 bg-gray-200 w-full rounded-t-md overflow-hidden">
        {service.images && service.images.length > 0 ? (
          <img 
            src={service.images[0]} 
            alt={service.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="p-3 border border-t-0 border-gray-200 rounded-b-md">
        <h3 className="font-medium text-base line-clamp-1">{service.title}</h3>
        <p className="text-sm text-gray-500 mb-1 line-clamp-1">
          {service.provider.businessName || service.provider.name}
        </p>
        
        {service.provider.rating && (
          <div className="flex items-center text-sm mb-2">
            <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
            <span>{service.provider.rating.toFixed(1)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">{service.location}</div>
          <div className="font-medium text-primary">
            {service.price ? `Mulai dari ${formatCurrency(service.price)}` : "Harga bervariasi"}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
