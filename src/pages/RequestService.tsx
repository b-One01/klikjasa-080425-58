
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';
import BottomNavigation from '@/components/BottomNavigation';
import { serviceCategories } from '@/utils/serviceCategories';
import { suggestCategoryFromTitle } from '@/utils/aiCategorySuggestion';

const RequestService = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [offerDeadline, setOfferDeadline] = useState('3 Jam');
  
  // For AI suggestions
  const [aiSuggested, setAiSuggested] = useState(false);
  
  useEffect(() => {
    if (description.length > 10 && !aiSuggested) {
      const suggestion = suggestCategoryFromTitle(description);
      
      if (suggestion?.category) {
        setCategoryId(suggestion.category.id);
        if (suggestion.subcategory) {
          setSubCategoryId(suggestion.subcategory.id);
        }
        setAiSuggested(true);
        toast.success('Kategori layanan ditentukan secara otomatis berdasarkan deskripsi Anda');
      }
    }
  }, [description]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Maximum 5 images
      const allFiles = [...images, ...newFiles].slice(0, 5);
      setImages(allFiles);
      
      // Create preview URLs
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviewUrls([...imagePreviewUrls, ...newPreviews].slice(0, 5));
    }
  };
  
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...imagePreviewUrls];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviewUrls(newPreviews);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !categoryId) {
      toast.error('Mohon lengkapi deskripsi dan kategori layanan');
      return;
    }
    
    // Here would be the code to submit the request to the server
    toast.success('Permintaan layanan berhasil dikirim!');
    navigate('/');
  };
  
  const selectedCategory = serviceCategories.find(cat => cat.id === categoryId);
  
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
          <h1 className="text-xl font-semibold">Input Kebutuhan Jasa Anda</h1>
        </div>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="description" className="text-sm font-medium block mb-1">
              Jelaskan Kebutuhan Jasa Anda
            </label>
            <Textarea
              id="description"
              placeholder="Contoh: Saya butuh tukang untuk perbaikan kursi/sofa."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-32"
            />
            <p className="text-xs text-gray-500 mt-1">
              Sistem akan menyarankan kategori yang sesuai berdasarkan deskripsi Anda
            </p>
          </div>
          
          <div>
            <label htmlFor="category" className="text-sm font-medium block mb-1">
              Pilih Kategori Layanan
            </label>
            <Select
              value={categoryId}
              onValueChange={(value) => {
                setCategoryId(value);
                setSubCategoryId(''); // Reset subcategory when category changes
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {serviceCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {categoryId && (
            <div>
              <label htmlFor="subcategory" className="text-sm font-medium block mb-1">
                Pilih Subkategori Layanan
              </label>
              <Select
                value={subCategoryId}
                onValueChange={setSubCategoryId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih subkategori" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory?.subCategories.map((subCategory) => (
                    <SelectItem key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <label htmlFor="location" className="text-sm font-medium block mb-1">
              Lokasi Spesifik (Opsional)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                id="location"
                placeholder="Masukkan alamat lengkap"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Penting untuk layanan yang membutuhkan kehadiran fisik
            </p>
          </div>
          
          <div>
            <label htmlFor="deadline" className="text-sm font-medium block mb-1">
              Berapa Lama Anda Ingin Menerima Tawaran?
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Select
                value={offerDeadline}
                onValueChange={setOfferDeadline}
              >
                <SelectTrigger className="pl-9 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 Jam">1 Jam</SelectItem>
                  <SelectItem value="3 Jam">3 Jam</SelectItem>
                  <SelectItem value="6 Jam">6 Jam</SelectItem>
                  <SelectItem value="12 Jam">12 Jam</SelectItem>
                  <SelectItem value="24 Jam">24 Jam</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">
              Foto Pendukung (Opsional)
            </label>
            
            <div className="grid grid-cols-4 gap-2 mb-2">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative h-20 bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={url} 
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-5 w-5 rounded-full p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X size={12} />
                  </Button>
                </div>
              ))}
              
              {imagePreviewUrls.length < 5 && (
                <label className="h-20 flex items-center justify-center bg-gray-100 rounded-md cursor-pointer border-2 border-dashed border-gray-300">
                  <div className="flex flex-col items-center text-gray-400">
                    <Upload size={18} />
                    <span className="text-xs mt-1">Upload</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <p className="text-xs text-gray-500">
              Unggah foto yang relevan dengan kebutuhan jasa Anda (maks. 5 foto)
            </p>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-primary"
          >
            Ajukan Permintaan Jasa
          </Button>
        </form>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default RequestService;
