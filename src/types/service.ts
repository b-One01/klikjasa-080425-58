
export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  subCategories: SubCategory[];
}

export interface ServiceFormData {
  title: string;
  description: string;
  categoryId: string;
  subCategoryId: string;
  price?: number;
  location?: string;
  images?: File[];
}
