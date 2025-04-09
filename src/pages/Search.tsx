
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ServiceCard from '@/components/ServiceCard';
import BottomNavigation from '@/components/BottomNavigation';
import { Search as SearchIcon, Filter, ArrowLeft, X } from 'lucide-react';

const Search = () => {
  const { searchServices, filteredServices, categories } = useData();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    searchServices(query, selectedCategory);
  }, [query, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchServices(query, selectedCategory);
  };

  const handleClearSearch = () => {
    setQuery('');
    setSelectedCategory(null);
    searchServices('');
  };

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
    setIsFilterVisible(false);
  };

  return (
    <div className="app-container pb-16">
      <div className="bg-primary text-white p-4 sticky top-0 z-10">
        <div className="flex items-center mb-3">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-white hover:bg-primary-dark"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Pencarian</h1>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <Input
            className="pr-12 pl-10 py-2 text-black"
            placeholder="Cari layanan..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-gray-400" />
          </div>
          {query && (
            <button
              type="button"
              className="absolute inset-y-0 right-12 pr-2 flex items-center"
              onClick={handleClearSearch}
            >
              <X size={18} className="text-gray-400" />
            </button>
          )}
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setIsFilterVisible(!isFilterVisible)}
          >
            <Filter size={18} className="text-gray-400" />
          </button>
        </form>
      </div>

      {isFilterVisible && (
        <div className="p-4 border-b border-gray-100 dropdown-container">
          <h2 className="text-sm font-medium mb-2">Filter Kategori</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`text-xs px-3 py-1.5 rounded-full ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4">
        {selectedCategory && (
          <div className="mb-4 flex items-center">
            <span className="text-sm mr-2">Filter:</span>
            <button
              className="flex items-center text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
              onClick={() => setSelectedCategory(null)}
            >
              {categories.find((c) => c.id === selectedCategory)?.name}
              <X size={14} className="ml-1" />
            </button>
          </div>
        )}

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada layanan ditemukan</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleClearSearch}
            >
              Hapus filter
            </Button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Search;
