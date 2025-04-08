import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUser } from "@/contexts/UserContext";
import { useData } from "@/contexts/DataContext";
import BottomNavigation from "@/components/BottomNavigation";
import { serviceCategories } from "@/utils/serviceCategories";
import { ServiceFormData } from "@/types/service";

// Form validation schema - update price type
const serviceFormSchema = z.object({
  title: z.string()
    .min(5, "Judul layanan minimal 5 karakter")
    .max(100, "Judul layanan maksimal 100 karakter"),
  description: z.string()
    .min(20, "Deskripsi minimal 20 karakter")
    .max(1000, "Deskripsi maksimal 1000 karakter"),
  categoryId: z.string({
    required_error: "Pilih kategori layanan",
  }),
  subCategoryId: z.string({
    required_error: "Pilih sub-kategori layanan",
  }),
  price: z.coerce.number()
    .min(0, "Harga tidak boleh negatif")
    .optional(),
  location: z.string().optional(),
});

const EditService = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const { getServiceById, updateService } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  
  const service = getServiceById(id || '');
  
  // Force redirect if user is not a provider or service doesn't exist
  if (!user || user.role !== 'provider' || !service) {
    navigate('/my-services');
    return null;
  }

  // Initialize form with validation
  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: service.title,
      description: service.description,
      categoryId: service.categoryId,
      subCategoryId: service.subCategoryId,
      price: service.price,
      location: service.location || "",
    },
  });

  // Set selected category
  useEffect(() => {
    setSelectedCategory(service.categoryId);
  }, [service]);

  // Get subcategories for the selected category
  const getSubCategories = () => {
    if (!selectedCategory) return [];
    return serviceCategories.find(cat => cat.id === selectedCategory)?.subCategories || [];
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = images.length + newFiles.length;
      
      if (totalFiles > 5) {
        toast.error("Maksimal 5 gambar yang diperbolehkan");
        return;
      }
      
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Form submission
  const onSubmit = (data: z.infer<typeof serviceFormSchema>) => {
    // Create service data object
    const serviceData: Partial<ServiceFormData> = {
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      subCategoryId: data.subCategoryId,
      price: data.price,
      location: data.location,
    };
    
    // Only add images if they've been changed
    if (images.length > 0) {
      serviceData.images = images;
    }

    // Update the service
    updateService(service.id, serviceData);
    
    // Show success message
    toast.success("Layanan berhasil diperbarui");
    
    // Navigate back to services
    navigate("/my-services");
  };

  return (
    <div className="app-container pb-16">
      <div className="bg-primary text-white p-4 sticky top-0 z-10">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-white hover:bg-primary-dark"
            onClick={() => navigate('/my-services')}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Edit Layanan</h1>
        </div>
      </div>

      <div className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Layanan</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Jasa Pembersihan Rumah Harian" {...field} />
                  </FormControl>
                  <FormDescription>
                    Berikan judul yang jelas tentang layanan yang anda tawarkan
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCategory(value);
                      // Reset subcategory when category changes
                      form.setValue("subCategoryId", "");
                    }} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori layanan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subcategory - only shown if category is selected */}
            {selectedCategory && (
              <FormField
                control={form.control}
                name="subCategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subkategori</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih subkategori layanan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getSubCategories().map((subCategory) => (
                          <SelectItem key={subCategory.id} value={subCategory.id}>
                            {subCategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi Layanan</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Jelaskan detail layanan yang anda tawarkan, termasuk pengalaman anda, peralatan yang digunakan, prosedur kerja, dll." 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Jelaskan layanan anda selengkap mungkin agar pelanggan memahami keunggulan anda
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Layanan (Rp)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Contoh: 100000" 
                      {...field} 
                      onChange={(e) => {
                        // Allow only numbers
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Masukkan harga tanpa titik atau koma
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokasi Layanan</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Jakarta Selatan" {...field} />
                  </FormControl>
                  <FormDescription>
                    Area dimana anda menawarkan layanan ini
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image upload */}
            <div className="space-y-2">
              <FormLabel>Foto Layanan (Maks. 5 foto)</FormLabel>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <label className="cursor-pointer block w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    multiple
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center py-4">
                    <ImagePlus className="h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Klik untuk {service.images && service.images.length > 0 ? 'mengganti' : 'menambahkan'} foto layanan
                    </p>
                  </div>
                </label>
              </div>
              
              {/* Preview existing images */}
              {service.images && service.images.length > 0 && images.length === 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Foto Saat Ini:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {service.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Service ${index}`}
                          className="h-24 w-full object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Preview new images */}
              {images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Foto Baru:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index}`}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit button */}
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </Form>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default EditService;
