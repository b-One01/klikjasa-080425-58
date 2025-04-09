
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/contexts/UserContext";

interface GuestWelcomeProps {
  onGuestLogin: () => void;
}

const GuestWelcome = ({ onGuestLogin }: GuestWelcomeProps) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-primary mb-2">KlikJasa</h1>
        <p className="text-gray-600">Temukan layanan yang Anda butuhkan dengan mudah</p>
      </div>
      
      <div className="space-y-4 w-full max-w-xs">
        <Button asChild className="w-full bg-primary">
          <Link to="/login">Masuk</Link>
        </Button>
        <Button asChild variant="outline" className="w-full border-primary text-primary">
          <Link to="/register">Daftar</Link>
        </Button>
        <button 
          onClick={onGuestLogin}
          className="w-full text-sm text-gray-500 underline mt-4"
        >
          Lanjutkan sebagai tamu
        </button>
      </div>
    </div>
  );
};

export default GuestWelcome;
