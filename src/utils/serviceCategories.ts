
import { ServiceCategory } from "@/types/service";

// Helper function to generate unique IDs
const generateId = (prefix: string, index: number): string => `${prefix}-${index + 1}`;

// Function to create subcategories with proper IDs
const createSubcategories = (categoryId: string, names: string[]): { id: string; name: string; categoryId: string }[] => {
  return names.map((name, index) => ({
    id: `${categoryId}-sub-${index + 1}`,
    name,
    categoryId
  }));
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'cat-1',
    name: 'Kebersihan',
    icon: 'trash',
    subCategories: createSubcategories('cat-1', [
      'Kebersihan Rumah', 
      'Pembersihan Rutin', 
      'Pembersihan Mendalam (Deep Cleaning)', 
      'Pembersihan Setelah Renovasi',
      'Pembersihan Pindahan Rumah',
      'Pembersihan Apartemen',
      'Pembersihan Kos',
      'Pembersihan Kamar Mandi',
      'Pembersihan Dapur',
      'Pembersihan Jendela',
      'Kebersihan Kantor',
      'Pembersihan Rutin Kantor',
      'Pembersihan Total Kantor',
      'Cuci Mobil Biasa',
      'Cuci Mobil Detailing',
      'Cuci Motor Biasa',
      'Cuci Motor Detailing',
      'Laundry Kiloan',
      'Laundry Satuan',
      'Dry Cleaning',
      'Setrika Saja',
      'Pembasmi Kecoa',
      'Pembasmi Tikus',
      'Pembasmi Nyamuk',
      'Pembasmi Rayap',
      'Pembasmi Semut'
    ])
  },
  {
    id: 'cat-2',
    name: 'Perbaikan Rumah',
    icon: 'wrench',
    subCategories: createSubcategories('cat-2', [
      'Instalasi Listrik Baru',
      'Perbaikan Instalasi Listrik',
      'Pemasangan Lampu',
      'Pemasangan Stop Kontak',
      'Perbaikan Korsleting',
      'Perbaikan Keran Bocor',
      'Perbaikan Pipa Bocor',
      'Pemasangan Sanitary (WC, Wastafel)',
      'Perbaikan Saluran Mampet',
      'Perbaikan Furniture Rusak',
      'Perakitan Furniture Baru',
      'Pembuatan Furniture Custom',
      'Perbaikan Pagar Besi',
      'Pembuatan Pagar Besi',
      'Perbaikan Teralis',
      'Pengecatan Interior',
      'Pengecatan Eksterior',
      'Cuci AC',
      'Isi Freon AC',
      'Perbaikan AC Rusak',
      'Pemasangan AC Baru',
      'Perbaikan Genteng Pecah',
      'Perbaikan Saluran Air Hujan'
    ])
  },
  {
    id: 'cat-3',
    name: 'Kecantikan & Kesehatan',
    icon: 'scissors',
    subCategories: createSubcategories('cat-3', [
      'Potong Rambut Pria',
      'Potong Rambut Wanita',
      'Creambath',
      'Masker Rambut',
      'Rambut Coloring',
      'Smoothing/Rebonding',
      'Facial',
      'Totok Wajah',
      'Makeup Harian',
      'Makeup Pesta',
      'Makeup Wisuda',
      'Tradisional Pijat',
      'Pijat Refleksi',
      'Lulur',
      'Manicure & Pedicure',
      'Perawat Lansia',
      'Terapi Fisik',
      'Konsultasi Dokter Umum (Telemedicine)',
      'Konsultasi Dokter Spesialis (Telemedicine)'
    ])
  },
  {
    id: 'cat-4',
    name: 'Transportasi',
    icon: 'car',
    subCategories: createSubcategories('cat-4', [
      'Ojek Online',
      'Taksi Online',
      'Sewa Mobil dengan Sopir',
      'Sewa Mobil tanpa Sopir',
      'Jasa Pindahan Rumah/Kantor',
      'Pengiriman Barang (Kurir Lokal)'
    ])
  },
  {
    id: 'cat-5',
    name: 'Pendidikan & Pelatihan',
    icon: 'book-open',
    subCategories: createSubcategories('cat-5', [
      'Guru Privat Matematika',
      'Guru Privat Bahasa Inggris',
      'Guru Privat IPA',
      'Les Musik Gitar',
      'Les Musik Piano',
      'Les Musik Vokal',
      'Pelatihan Komputer',
      'Pelatihan Bahasa Asing',
      'Pelatihan Memasak',
      'Tutor untuk Anak Berkebutuhan Khusus'
    ])
  },
  {
    id: 'cat-6',
    name: 'Acara',
    icon: 'calendar',
    subCategories: createSubcategories('cat-6', [
      'Catering',
      'Dekorasi Acara',
      'Fotografer Acara',
      'Videografer Acara',
      'Hiburan Musik',
      'MC',
      'Wedding Planner',
      'Event Organizer'
    ])
  },
  {
    id: 'cat-7',
    name: 'Perawatan Hewan',
    icon: 'cat',
    subCategories: createSubcategories('cat-7', [
      'Grooming Hewan',
      'Penitipan Hewan',
      'Pelatihan Hewan',
      'Dokter Hewan (Konsultasi Online)'
    ])
  },
  {
    id: 'cat-8',
    name: 'Bantuan Pribadi',
    icon: 'helping-hand',
    subCategories: createSubcategories('cat-8', [
      'Asisten Rumah Tangga (ART) Harian',
      'Asisten Rumah Tangga (ART) Mingguan',
      'Asisten Rumah Tangga (ART) Bulanan',
      'Jasa Setrika Pakaian',
      'Jasa Belanja Pribadi',
      'Jasa Antar Jemput Anak Sekolah'
    ])
  },
  {
    id: 'cat-9',
    name: 'Desain & Kreatif',
    icon: 'palette',
    subCategories: createSubcategories('cat-9', [
      'Desain Logo',
      'Desain Poster',
      'Desain Banner',
      'Desain Website',
      'Desain Interior',
      'Produk Fotografi',
      'Videografi Produk'
    ])
  },
  {
    id: 'cat-10',
    name: 'Perbaikan Elektronik',
    icon: 'smartphone',
    subCategories: createSubcategories('cat-10', [
      'Perbaikan Handphone',
      'Perbaikan Laptop',
      'Perbaikan Televisi',
      'Perbaikan Kulkas',
      'Perbaikan Mesin Cuci'
    ])
  },
  {
    id: 'cat-11',
    name: 'Otomotif',
    icon: 'car',
    subCategories: createSubcategories('cat-11', [
      'Servis Mobil',
      'Servis Motor',
      'Ganti Ban',
      'Tune Up',
      'Body Repair'
    ])
  },
  {
    id: 'cat-12',
    name: 'Lain-lain',
    icon: 'more-horizontal',
    subCategories: createSubcategories('cat-12', [
      'Jasa Pijat Panggilan',
      'Jasa Jahit',
      'Jasa Penerjemah',
      'Jasa Notaris (Konsultasi Online)'
    ])
  }
];
