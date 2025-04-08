
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
      'Pembersihan Rumah', 
      'Pembersihan Kantor',
      'Cuci Mobil',
      'Laundry & Dry Cleaning',
      'Pembersihan AC',
      'Desinfeksi & Sanitasi',
      'Jasa Pembantu Rumah Tangga (PRT)',
      'Tukang Kebun'
    ])
  },
  {
    id: 'cat-2',
    name: 'Perbaikan Rumah',
    icon: 'wrench',
    subCategories: createSubcategories('cat-2', [
      'Tukang Listrik',
      'Tukang Ledeng',
      'Tukang Kayu',
      'Tukang Las',
      'Tukang Cat',
      'Perbaikan Atap',
      'Perbaikan Pintu & Jendela',
      'Instalasi Peralatan Rumah Tangga'
    ])
  },
  {
    id: 'cat-3',
    name: 'Kecantikan & Kesehatan',
    icon: 'scissors',
    subCategories: createSubcategories('cat-3', [
      'Potong Rambut & Styling',
      'Perawatan Wajah',
      'Pijat & Spa',
      'Make Up Artist (MUA)',
      'Nail Art',
      'Personal Trainer',
      'Yoga & Pilates',
      'Konsultasi Gizi'
    ])
  },
  {
    id: 'cat-4',
    name: 'Transportasi',
    icon: 'car',
    subCategories: createSubcategories('cat-4', [
      'Ojek Online',
      'Taksi Online',
      'Sewa Mobil',
      'Jasa Pindahan',
      'Kurir & Pengiriman',
      'Sopir Pribadi'
    ])
  },
  {
    id: 'cat-5',
    name: 'Pendidikan & Pelatihan',
    icon: 'book-open',
    subCategories: createSubcategories('cat-5', [
      'Tutor Privat (Matematika)',
      'Tutor Privat (Fisika)',
      'Tutor Privat (Kimia)',
      'Tutor Privat (Bahasa Inggris)',
      'Kursus Musik',
      'Kursus Bahasa',
      'Pelatihan Komputer',
      'Pelatihan Keterampilan'
    ])
  },
  {
    id: 'cat-6',
    name: 'Acara',
    icon: 'calendar',
    subCategories: createSubcategories('cat-6', [
      'Fotografer & Videografer Acara',
      'Catering',
      'Dekorasi Acara',
      'Hiburan (Musik, MC)',
      'Perencanaan Acara',
      'Sewa Peralatan Acara'
    ])
  },
  {
    id: 'cat-7',
    name: 'Perawatan Hewan',
    icon: 'cat',
    subCategories: createSubcategories('cat-7', [
      'Grooming Hewan Peliharaan',
      'Penitipan Hewan Peliharaan',
      'Pelatihan Hewan Peliharaan',
      'Dokter Hewan (Konsultasi)',
      'Jasa Jalan-jalan Hewan Peliharaan'
    ])
  },
  {
    id: 'cat-8',
    name: 'Bantuan Pribadi',
    icon: 'helping-hand',
    subCategories: createSubcategories('cat-8', [
      'Asisten Virtual',
      'Jasa Penulis & Penerjemah',
      'Jasa Kurir Pribadi',
      'Jasa Belanja Pribadi',
      'Pengasuh Anak (Baby Sitter)',
      'Perawatan Lansia'
    ])
  },
  {
    id: 'cat-9',
    name: 'Desain & Kreatif',
    icon: 'palette',
    subCategories: createSubcategories('cat-9', [
      'Desain Grafis',
      'Desain Web',
      'Desain Interior',
      'Fotografi Produk',
      'Videografi',
      'Ilustrasi'
    ])
  },
  {
    id: 'cat-10',
    name: 'Perbaikan Elektronik',
    icon: 'smartphone',
    subCategories: createSubcategories('cat-10', [
      'Perbaikan Handphone',
      'Perbaikan Laptop & Komputer',
      'Perbaikan TV',
      'Perbaikan Kulkas & Mesin Cuci',
      'Perbaikan AC'
    ])
  },
  {
    id: 'cat-11',
    name: 'Otomotif',
    icon: 'car',
    subCategories: createSubcategories('cat-11', [
      'Perbaikan Mobil',
      'Perbaikan Motor',
      'Cuci Mobil & Motor (Panggilan)',
      'Derek Mobil',
      'Layanan Darurat Kendaraan'
    ])
  },
  {
    id: 'cat-12',
    name: 'Lain-lain',
    icon: 'more-horizontal',
    subCategories: createSubcategories('cat-12', [
      'Jasa Pengecatan',
      'Jasa Instalasi',
      'Jasa Jahit',
      'Jasa Pijat Refleksi',
      'Lainnya'
    ])
  }
];
