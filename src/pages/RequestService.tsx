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
import { ArrowLeft, Upload, MapPin, Clock, X } from 'lucide-react';
import { toast } from 'sonner';
import BottomNavigation from '@/components/BottomNavigation';
import { serviceCategories } from '@/utils/serviceCategories';
import { suggestCategoryFromTitle } from '@/utils/aiCategorySuggestion';
import LocationMap from '@/components/LocationMap';

const locations = {
  provinces: [
    { id: 'p-1', name: 'DKI Jakarta' },
    { id: 'p-2', name: 'Jawa Barat' },
    { id: 'p-3', name: 'Jawa Tengah' },
    { id: 'p-4', name: 'Jawa Timur' },
    { id: 'p-5', name: 'Bali' },
  ],
  cities: {
    'p-1': [
      { id: 'c-1', name: 'Jakarta Pusat' },
      { id: 'c-2', name: 'Jakarta Utara' },
      { id: 'c-3', name: 'Jakarta Barat' },
      { id: 'c-4', name: 'Jakarta Selatan' },
      { id: 'c-5', name: 'Jakarta Timur' },
    ],
    'p-2': [
      { id: 'c-6', name: 'Bandung' },
      { id: 'c-7', name: 'Bogor' },
      { id: 'c-8', name: 'Depok' },
      { id: 'c-9', name: 'Bekasi' },
    ],
  },
  districts: {
    'c-1': [
      { id: 'd-1', name: 'Tanah Abang' },
      { id: 'd-2', name: 'Menteng' },
    ],
    'c-4': [
      { id: 'd-3', name: 'Kebayoran Baru' },
      { id: 'd-4', name: 'Pancoran' },
    ],
  },
  villages: {
    'd-1': [
      { id: 'v-1', name: 'Kebon Melati' },
      { id: 'v-2', name: 'Kebon Kacang' },
    ],
    'd-3': [
      { id: 'v-3', name: 'Gandaria Utara' },
      { id: 'v-4', name: 'Cipete Utara' },
    ],
  }
};

const RequestService = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  
  const [streetAddress, setStreetAddress] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [cityId, setCityId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [villageId, setVillageId] = useState('');
  
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [offerDeadline, setOfferDeadline] = useState('3 Jam');
  const [showMap, setShowMap] = useState(false);
  
  const [availableCities, setAvailableCities] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableVillages, setAvailableVillages] = useState([]);
  
  const [aiSuggested, setAiSuggested] = useState(false);
  
  useEffect(() => {
    if (provinceId) {
      setAvailableCities(locations.cities[provinceId] || []);
      setCityId('');
      setDistrictId('');
      setVillageId('');
    } else {
      setAvailableCities([]);
    }
  }, [provinceId]);
  
  useEffect(() => {
    if (cityId) {
      setAvailableDistricts(locations.districts[cityId] || []);
      setDistrictId('');
      setVillageId('');
    } else {
      setAvailableDistricts([]);
    }
  }, [cityId]);
  
  useEffect(() => {
    if (districtId) {
      setAvailableVillages(locations.villages[districtId] || []);
      setVillageId('');
    } else {
      setAvailableVillages([]);
    }
  }, [districtId]);
  
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
  
  useEffect(() => {
    if (streetAddress && provinceId && cityId) {
      setShowMap(true);
    }
  }, [streetAddress, provinceId, cityId]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      const allFiles = [...images, ...newFiles].slice(0, 5);
      setImages(allFiles);
      
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
  
  const getFullAddress = () => {
    const province = locations.provinces.find(p => p.id === provinceId)?.name || '';
    const city = availableCities.find(c => c.id === cityId)?.name || '';
    const district = availableDistricts.find(d => d.id === districtId)?.name || '';
    const village = availableVillages.find(v => v.id === villageId)?.name || '';
    
    return [streetAddress, village, district, city, province].filter(Boolean).join(', ');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !categoryId) {
      toast.error('Mohon lengkapi deskripsi dan kategori layanan');
      return;
    }
    
    if (!streetAddress || !provinceId || !cityId) {
      toast.error('Mohon lengkapi alamat dengan minimal nama jalan, provinsi dan kota');
      return;
    }
    
    toast.success('Permintaan layanan berhasil dikirim!');
    navigate('/request-list');
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="text-sm font-medium block mb-1">
                Pilih Kategori Layanan
              </label>
              <Select
                value={categoryId}
                onValueChange={(value) => {
                  setCategoryId(value);
                  setSubCategoryId('');
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
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Lokasi Detail</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="street" className="text-sm font-medium block mb-1">
                  Alamat Jalan
                </label>
                <Input
                  id="street"
                  placeholder="Masukkan alamat jalan dan nomor"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="province" className="text-sm font-medium block mb-1">
                    Provinsi
                  </label>
                  <Select
                    value={provinceId}
                    onValueChange={setProvinceId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih provinsi" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.provinces.map((province) => (
                        <SelectItem key={province.id} value={province.id}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="city" className="text-sm font-medium block mb-1">
                    Kota/Kabupaten
                  </label>
                  <Select
                    value={cityId}
                    onValueChange={setCityId}
                    disabled={!provinceId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih kota/kabupaten" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="district" className="text-sm font-medium block mb-1">
                    Kecamatan
                  </label>
                  <Select
                    value={districtId}
                    onValueChange={setDistrictId}
                    disabled={!cityId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih kecamatan" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDistricts.map((district) => (
                        <SelectItem key={district.id} value={district.id}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="village" className="text-sm font-medium block mb-1">
                    Desa/Kelurahan
                  </label>
                  <Select
                    value={villageId}
                    onValueChange={setVillageId}
                    disabled={!districtId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih desa/kelurahan" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVillages.map((village) => (
                        <SelectItem key={village.id} value={village.id}>
                          {village.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          {showMap && (
            <div>
              <label className="text-sm font-medium block mb-1">
                Konfirmasi Lokasi di Peta
              </label>
              <LocationMap 
                height="250px"
                onLocationSelect={(location) => {
                  console.log("Selected location:", location);
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Pastikan lokasi pada peta sudah sesuai dengan alamat Anda
              </p>
            </div>
          )}
          
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
