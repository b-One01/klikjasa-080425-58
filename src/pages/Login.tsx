
import { useState } from 'react';
import { useUser, UserProfile } from '@/contexts/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      // Sample user data for user login
      const userData: UserProfile = {
        id: 'user-1',
        name: 'John Doe',
        email: email,
        phone: '+628123456789',
        role: 'user',
        balance: 100000,
        isLoggedIn: true,
      };
      
      login(userData);
      toast.success("Login berhasil!");
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
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold">Masuk</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Kata Sandi
            </label>
            <Link to="/forgot-password" className="text-sm text-primary">
              Lupa kata sandi?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Kata sandi anda"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-primary"
          disabled={isLoading}
        >
          {isLoading ? "Memproses..." : "Masuk"}
        </Button>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Belum memiliki akun?{" "}
            <Link to="/register" className="text-primary font-medium">
              Daftar
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
