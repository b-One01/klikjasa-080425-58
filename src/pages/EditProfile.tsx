
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

const EditProfile = () => {
  const { user, updateProfile } = useUser();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setBusinessName(user.businessName || '');
      setBusinessDescription(user.businessDescription || '');
    }
  }, [user]);
  
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
    
    const updates = {
      name,
      phone,
      address,
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
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Masukkan alamat lengkap"
                rows={3}
              />
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
