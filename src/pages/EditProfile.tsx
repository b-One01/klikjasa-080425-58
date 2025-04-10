
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'sonner';
import BottomNavigation from '@/components/BottomNavigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock location data
const provinces = [
  { id: 'p1', name: 'DKI Jakarta' },
  { id: 'p2', name: 'Jawa Barat' },
  { id: 'p3', name: 'Jawa Tengah' },
  { id: 'p4', name: 'Jawa Timur' },
  { id: 'p5', name: 'Bali' },
];

const getCities = (provinceId: string) => {
  const citiesMap: Record<string, Array<{id: string, name: string}>> = {
    'p1': [
      { id: 'c1', name: 'Jakarta Selatan' },
      { id: 'c2', name: 'Jakarta Utara' },
      { id: 'c3', name: 'Jakarta Timur' },
      { id: 'c4', name: 'Jakarta Barat' },
      { id: 'c5', name: 'Jakarta Pusat' },
    ],
    'p2': [
      { id: 'c6', name: 'Bandung' },
      { id: 'c7', name: 'Bogor' },
      { id: 'c8', name: 'Bekasi' },
      { id: 'c9', name: 'Depok' },
    ],
    'p3': [
      { id: 'c10', name: 'Semarang' },
      { id: 'c11', name: 'Yogyakarta' },
      { id: 'c12', name: 'Solo' },
    ],
    'p4': [
      { id: 'c13', name: 'Surabaya' },
      { id: 'c14', name: 'Malang' },
      { id: 'c15', name: 'Sidoarjo' },
    ],
    'p5': [
      { id: 'c16', name: 'Denpasar' },
      { id: 'c17', name: 'Badung' },
      { id: 'c18', name: 'Gianyar' },
    ],
  };
  
  return citiesMap[provinceId] || [];
};

const getDistricts = (cityId: string) => {
  // Mock districts for a few cities
  const districtsMap: Record<string, Array<{id: string, name: string}>> = {
    'c1': [
      { id: 'd1', name: 'Kebayoran Baru' },
      { id: 'd2', name: 'Pancoran' },
      { id: 'd3', name: 'Cilandak' },
    ],
    'c6': [
      { id: 'd4', name: 'Bandung Wetan' },
      { id: 'd5', name: 'Cicendo' },
      { id: 'd6', name: 'Coblong' },
    ],
    'c10': [
      { id: 'd7', name: 'Candisari' },
      { id: 'd8', name: 'Gayamsari' },
      { id: 'd9', name: 'Banyumanik' },
    ],
  };
  
  return districtsMap[cityId] || [];
};

const getVillages = (districtId: string) => {
  // Mock villages for a few districts
  const villagesMap: Record<string, Array<{id: string, name: string}>> = {
    'd1': [
      { id: 'v1', name: 'Gandaria Utara' },
      { id: 'v2', name: 'Kebayoran Baru' },
      { id: 'v3', name: 'Gandaria Selatan' },
    ],
    'd4': [
      { id: 'v4', name: 'Citarum' },
      { id: 'v5', name: 'Tamansari' },
    ],
    'd7': [
      { id: 'v6', name: 'Kaliwiru' },
      { id: 'v7', name: 'Wonotingal' },
    ],
  };
  
  return villagesMap[districtId] || [];
};

const EditProfile = () => {
  const { user, updateProfile } = useUser();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Location state
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [cities, setCities] = useState<Array<{id: string, name: string}>>([]);
  const [districts, setDistricts] = useState<Array<{id: string, name: string}>>([]);
  const [villages, setVillages] = useState<Array<{id: string, name: string}>>([]);
  
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddressDetail(user.address || '');
      setBusinessName(user.businessName || '');
      setBusinessDescription(user.businessDescription || '');
      
      // Parse address if it exists
      if (user.address) {
        // In a real app, you would parse the address from the database
        // For now we'll just initialize with empty values
      }
    }
  }, [user]);
  
  // Update cities when province changes
  useEffect(() => {
    if (selectedProvince) {
      setCities(getCities(selectedProvince));
      setSelectedCity('');
      setSelectedDistrict('');
      setSelectedVillage('');
    } else {
      setCities([]);
    }
  }, [selectedProvince]);
  
  // Update districts when city changes
  useEffect(() => {
    if (selectedCity) {
      setDistricts(getDistricts(selectedCity));
      setSelectedDistrict('');
      setSelectedVillage('');
    } else {
      setDistricts([]);
    }
  }, [selectedCity]);
  
  // Update villages when district changes
  useEffect(() => {
    if (selectedDistrict) {
      setVillages(getVillages(selectedDistrict));
      setSelectedVillage('');
    } else {
      setVillages([]);
    }
  }, [selectedDistrict]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Construct the full address
    let fullAddress = addressDetail;
    
    const provinceName = provinces.find(p => p.id === selectedProvince)?.name;
    const cityName = cities.find(c => c.id === selectedCity)?.name;
    const districtName = districts.find(d => d.id === selectedDistrict)?.name;
    const villageName = villages.find(v => v.id === selectedVillage)?.name;
    
    if (villageName) fullAddress += `, ${villageName}`;
    if (districtName) fullAddress += `, ${districtName}`;
    if (cityName) fullAddress += `, ${cityName}`;
    if (provinceName) fullAddress += `, ${provinceName}`;
    
    const updates = {
      name,
      phone,
      address: fullAddress,
      ...(user.role === 'provider' ? {
        businessName,
        businessDescription
      } : {})
    };
    
    updateProfile(updates);
    toast.success('Profil berhasil diperbarui');
    navigate('/profile');
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
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold">Edit Profil</h1>
        </div>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 relative mb-2">
              {previewUrl ? (
                <img 
                  src={previewUrl}
                  alt="Profile Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              
              <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1">
                <Upload size={14} />
              </div>
            </div>
            
            <label className="text-primary text-sm cursor-pointer">
              Ubah Foto
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Masukkan nomor telepon"
              />
            </div>
            
            <div>
              <Label htmlFor="addressDetail">Detail Alamat</Label>
              <Textarea
                id="addressDetail"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                placeholder="Masukkan detail alamat (jalan, nomor rumah, RT/RW)"
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="province">Provinsi</Label>
              <Select
                value={selectedProvince}
                onValueChange={setSelectedProvince}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Provinsi" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {provinces.map((province) => (
                    <SelectItem key={province.id} value={province.id}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="city">Kota/Kabupaten</Label>
              <Select
                value={selectedCity}
                onValueChange={setSelectedCity}
                disabled={!selectedProvince}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Kota/Kabupaten" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="district">Kecamatan</Label>
              <Select
                value={selectedDistrict}
                onValueChange={setSelectedDistrict}
                disabled={!selectedCity}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Kecamatan" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.id}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="village">Desa/Kelurahan</Label>
              <Select
                value={selectedVillage}
                onValueChange={setSelectedVillage}
                disabled={!selectedDistrict}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Desa/Kelurahan" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {villages.map((village) => (
                    <SelectItem key={village.id} value={village.id}>
                      {village.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {user.role === 'provider' && (
              <>
                <div>
                  <Label htmlFor="businessName">Nama Bisnis/Usaha</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Masukkan nama bisnis/usaha"
                  />
                </div>
                
                <div>
                  <Label htmlFor="businessDescription">Deskripsi Bisnis/Usaha</Label>
                  <Textarea
                    id="businessDescription"
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    placeholder="Jelaskan bisnis/usaha Anda"
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>
          
          <Button type="submit" className="w-full bg-primary">
            Simpan Perubahan
          </Button>
        </form>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default EditProfile;
