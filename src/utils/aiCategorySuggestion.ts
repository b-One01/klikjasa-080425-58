
import { serviceCategories } from "./serviceCategories";

// Function to suggest category and subcategory based on service title
export const suggestCategoryFromTitle = (title: string) => {
  if (!title || title.length < 3) return null;
  
  const titleLower = title.toLowerCase();
  let bestCategoryMatch = null;
  let bestSubcategoryMatch = null;
  let highestCategoryScore = -1;
  let highestSubcategoryScore = -1;
  
  // Keywords for each category
  const categoryKeywords: Record<string, string[]> = {
    'cat-1': ['bersih', 'clean', 'cuci', 'laundry', 'sampah', 'kecoa', 'hama', 'rayap', 'tikus', 'nyamuk', 'semut'],
    'cat-2': ['perbaik', 'renov', 'bangun', 'listrik', 'pipa', 'cat', 'kayu', 'atap', 'bocor', 'AC', 'lampu', 'furniture', 'pagar'],
    'cat-3': ['cantik', 'rambut', 'wajah', 'makeup', 'potong', 'pijat', 'kesehatan', 'dokter', 'facial', 'creambath', 'coloring'],
    'cat-4': ['transport', 'antar', 'jemput', 'sewa', 'mobil', 'motor', 'ojek', 'taksi', 'kurir', 'pindah'],
    'cat-5': ['pendidik', 'ajar', 'guru', 'les', 'privat', 'musik', 'gitar', 'piano', 'pelatih', 'tutor', 'kursus'],
    'cat-6': ['acara', 'event', 'pesta', 'dekor', 'foto', 'video', 'catering', 'wedding', 'nikah', 'mc'],
    'cat-7': ['hewan', 'pet', 'kucing', 'anjing', 'grooming', 'dokter', 'penitip', 'latih'],
    'cat-8': ['bantu', 'asisten', 'art', 'pembantu', 'setrika', 'belanja', 'antar', 'jemput'],
    'cat-9': ['desain', 'design', 'grafis', 'logo', 'web', 'foto', 'video', 'kreatif', 'interior'],
    'cat-10': ['elektronik', 'hp', 'laptop', 'tv', 'kulkas', 'mesin', 'cuci', 'gadget', 'handphone', 'komputer'],
    'cat-11': ['otomotif', 'mobil', 'motor', 'servis', 'ganti', 'tune', 'body', 'repair', 'mesin', 'bengkel'],
    'cat-12': ['pijat', 'jahit', 'terjemah', 'notaris']
  };

  // Helper to calculate matching score
  const calculateMatchScore = (text: string, keywords: string[]) => {
    let score = 0;
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += keyword.length; // Longer keyword matches get higher scores
      }
    });
    return score;
  };

  // First, find the best category match
  for (const category of serviceCategories) {
    const keywords = categoryKeywords[category.id] || [];
    const score = calculateMatchScore(titleLower, keywords);
    
    if (score > highestCategoryScore) {
      highestCategoryScore = score;
      bestCategoryMatch = category;
    }
  }

  // Then, if we have a category match, find the best subcategory
  if (bestCategoryMatch) {
    for (const subcategory of bestCategoryMatch.subCategories) {
      const subNameLower = subcategory.name.toLowerCase();
      // Direct match with subcategory name
      let score = calculateMatchScore(titleLower, [subNameLower]);
      
      // Also check individual words in the subcategory name
      subNameLower.split(' ').forEach(word => {
        if (word.length > 3) { // Only check meaningful words
          score += calculateMatchScore(titleLower, [word]) * 0.7; // Lower weight for individual words
        }
      });
      
      if (score > highestSubcategoryScore) {
        highestSubcategoryScore = score;
        bestSubcategoryMatch = subcategory;
      }
    }
  }

  return {
    category: highestCategoryScore > 0 ? bestCategoryMatch : null,
    subcategory: highestSubcategoryScore > 0 ? bestSubcategoryMatch : null
  };
};
