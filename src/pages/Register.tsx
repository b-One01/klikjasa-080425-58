
import { useState } from 'react';
import { useUser, UserProfile } from '@/contexts/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const Register = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'user' | 'provider'>('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [isBusinessAccount, setIsBusinessAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const { login } = useUser();
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole: 'user' | 'provider') => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/');
    }
  };

  // Show map after user enters address
  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(e.target.value);
    if (e.target.value.length > 5) {
      setShowMap(true);
    } else {
      setShowMap(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }
    
    setIsLoading(true);

    // Simulate registration
    setTimeout(() => {
      // Create user data
      const userData: UserProfile = {
        id: `${role}-${Date.now()}`,
        name,
        email,
        phone,
        address,
        role,
        balance: 0,
        isLoggedIn: true,
        businessName: role === 'provider' ? businessName : undefined,
        businessDescription: role === 'provider' ? businessDescription : undefined,
        isBusinessAccount: role === 'provider' ? isBusinessAccount : undefined,
      };
      
      login(userData);
      toast.success("Pendaftaran berhasil!");
      navigate('/');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="app-container p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={handleBack}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold">Daftar</h1>
      </div>

      {step === 1 ? (
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-center">Daftar sebagai</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleRoleSelect('user')}
              className="p-6 border rounded-lg text-center hover:border-primary flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="font-medium">Pengguna Jasa</h3>
              <p className="text-xs text-gray-500 mt-1">Temukan layanan yang Anda butuhkan</p>
            </button>
            
            <button
              onClick={() => handleRoleSelect('provider')}
              className="p-6 border rounded-lg text-center hover:border-primary flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="font-medium">Penyedia Jasa</h3>
              <p className="text-xs text-gray-500 mt-1">Tawarkan layanan Anda</p>
            </button>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Sudah memiliki akun?{" "}
              <Link to="/login" className="text-primary font-medium">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nama Lengkap
            </label>
            <Input
              id="name"
              placeholder="Nama lengkap anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Email anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Nomor Telepon
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="Nomor telepon anda"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">
              Alamat Lengkap
            </label>
            <Textarea
              id="address"
              placeholder="Alamat lengkap anda"
              value={address}
              onChange={handleAddressChange}
              required
            />
          </div>

          {showMap && (
            <div className="mt-2">
              <div className="w-full h-[150px] bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                <p>Map View (berdasarkan alamat yang diinput)</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Geser pin untuk menyesuaikan lokasi alamat Anda
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Kata Sandi
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Konfirmasi Kata Sandi
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Konfirmasi kata sandi"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {role === 'provider' && (
            <>
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-3">Informasi Bisnis</h3>
                
                <div className="space-y-4">
                  <RadioGroup defaultValue={isBusinessAccount ? "business" : "individual"} onValueChange={(v) => setIsBusinessAccount(v === "business")}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual">Individu</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="business" id="business" />
                      <Label htmlFor="business">Bisnis</Label>
                    </div>
                  </RadioGroup>
                  
                  <div className="space-y-2">
                    <label htmlFor="businessName" className="text-sm font-medium">
                      {isBusinessAccount ? "Nama Bisnis" : "Nama Panggilan Profesional"}
                    </label>
                    <Input
                      id="businessName"
                      placeholder={isBusinessAccount ? "Nama bisnis anda" : "Nama panggilan profesional anda"}
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="businessDesc" className="text-sm font-medium">
                      Deskripsi Singkat
                    </label>
                    <Input
                      id="businessDesc"
                      placeholder="Deskripsi singkat tentang bisnis/profesi anda"
                      value={businessDescription}
                      onChange={(e) => setBusinessDescription(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full mt-4 bg-primary"
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Daftar"}
          </Button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Sudah memiliki akun?{" "}
              <Link to="/login" className="text-primary font-medium">
                Masuk
              </Link>
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default Register;
