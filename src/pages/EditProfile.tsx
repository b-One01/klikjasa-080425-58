
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/hooks/useAuth';
import BottomNavigation from '@/components/BottomNavigation';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user: contextUser, updateProfile } = useUser();
  const { user: authUser, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: contextUser?.name || '',
    email: contextUser?.email || '',
    phone: contextUser?.phone || '',
    businessName: contextUser?.businessName || '',
    businessDescription: contextUser?.businessDescription || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authUser) {
        // Update in Supabase
        await updateUserProfile({
          name: formData.name,
          phone: formData.phone,
          businessName: formData.businessName,
          businessDescription: formData.businessDescription,
        });
      }
      
      // Always update in context as well for demo purposes
      updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        businessName: formData.businessName,
        businessDescription: formData.businessDescription,
      });
      
      toast.success('Profil berhasil diperbarui');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container pb-16">
      <div className="bg-primary text-white p-4 sticky top-0 z-10">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-white hover:bg-primary-dark"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Edit Profil</h1>
        </div>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Nama lengkap Anda"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email Anda"
              disabled={!!authUser} // Disable email editing if using Supabase auth
              className={authUser ? "bg-gray-100" : ""}
            />
            {authUser && (
              <p className="text-xs text-gray-500 mt-1">
                Email tidak dapat diubah karena terkait dengan akun Anda
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Telepon
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nomor telepon Anda"
            />
          </div>

          {contextUser?.role === 'provider' && (
            <>
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Bisnis
                </label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Nama bisnis Anda"
                />
              </div>

              <div>
                <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Bisnis
                </label>
                <Textarea
                  id="businessDescription"
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Deskripsi bisnis Anda"
                />
              </div>
            </>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </Button>
          </div>
        </form>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default EditProfile;
