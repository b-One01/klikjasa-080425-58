
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, Shield, Globe, Key } from 'lucide-react';
import { toast } from 'sonner';
import BottomNavigation from '@/components/BottomNavigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Privacy = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChangePassword = () => {
    toast.info('Fitur ganti password akan segera tersedia');
  };

  const handleDownloadData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Data berhasil disiapkan. Silakan cek email Anda.');
    }, 1500);
  };

  return (
    <div className="app-container pb-16">
      <div className="bg-primary text-white p-4 sticky top-0 z-10">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-white hover:bg-primary-dark"
            onClick={() => navigate('/settings')}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Privasi & Keamanan</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <h3 className="px-4 py-3 bg-gray-50 font-medium">Keamanan Akun</h3>
          
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center px-4 py-6 h-auto border-b"
            onClick={handleChangePassword}
          >
            <div className="flex items-center">
              <Key size={20} className="mr-3 text-gray-500" />
              <div className="text-left">
                <span className="font-medium block">Ganti Kata Sandi</span>
                <span className="text-sm text-gray-500">Perbarui kata sandi untuk keamanan</span>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center px-4 py-6 h-auto border-b"
            onClick={() => {}}
          >
            <div className="flex items-center">
              <Lock size={20} className="mr-3 text-gray-500" />
              <div className="text-left">
                <span className="font-medium block">Verifikasi Dua Faktor</span>
                <span className="text-sm text-gray-500">Tingkatkan keamanan akun Anda</span>
              </div>
            </div>
            <span className="text-primary text-sm">Aktifkan</span>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center px-4 py-6 h-auto"
            onClick={() => {}}
          >
            <div className="flex items-center">
              <Shield size={20} className="mr-3 text-gray-500" />
              <div className="text-left">
                <span className="font-medium block">Tinjau Aktivitas Akun</span>
                <span className="text-sm text-gray-500">Periksa riwayat masuk</span>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <h3 className="px-4 py-3 bg-gray-50 font-medium">Pengaturan Privasi</h3>
          
          <Button
            variant="ghost"
            className="w-full flex justify-between items-center px-4 py-6 h-auto border-b"
            onClick={handleDownloadData}
            disabled={loading}
          >
            <div className="flex items-center">
              <Globe size={20} className="mr-3 text-gray-500" />
              <div className="text-left">
                <span className="font-medium block">Unduh Data Saya</span>
                <span className="text-sm text-gray-500">Lihat data yang kami simpan tentang Anda</span>
              </div>
            </div>
            {loading ? (
              <span className="text-primary text-sm">Memproses...</span>
            ) : (
              <span className="text-gray-400">→</span>
            )}
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <h3 className="px-4 py-3 bg-gray-50 font-medium">Informasi Privasi</h3>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                <span className="font-medium">Kebijakan Privasi</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 text-sm text-gray-600">
                <p>KlikJasa berkomitmen melindungi privasi pengguna. Kami hanya mengumpulkan informasi yang diperlukan untuk menyediakan layanan dan tidak akan membagikannya kepada pihak ketiga tanpa persetujuan Anda.</p>
                <p className="mt-2">Kami menggunakan teknologi enkripsi canggih untuk melindungi informasi pribadi dan pembayaran Anda.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                <span className="font-medium">Penggunaan Data</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 text-sm text-gray-600">
                <p>Data yang kami kumpulkan digunakan untuk:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Memproses pesanan dan pembayaran</li>
                  <li>Menghubungkan pengguna dengan penyedia jasa</li>
                  <li>Meningkatkan kualitas layanan</li>
                  <li>Mengirim pemberitahuan terkait transaksi</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                <span className="font-medium">Hak-Hak Pengguna</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 text-sm text-gray-600">
                <p>Sebagai pengguna KlikJasa, Anda memiliki hak untuk:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Mengakses data pribadi Anda</li>
                  <li>Meminta koreksi data yang tidak akurat</li>
                  <li>Meminta penghapusan data Anda</li>
                  <li>Membatasi penggunaan data Anda</li>
                  <li>Mendapatkan salinan data Anda</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Privacy;
