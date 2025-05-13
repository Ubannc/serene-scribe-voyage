
import { useState, useEffect } from 'react';
import { deleteGalleryItem, fetchGalleryItems, GalleryItem } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { GalleryUploadForm } from './gallery/GalleryUploadForm';
import { GalleryItemList } from './gallery/GalleryItemList';

export function AdminGallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language, isRTL } = useLanguage();
  
  useEffect(() => {
    loadGallery();
  }, []);
  
  const loadGallery = async () => {
    setIsLoading(true);
    const items = await fetchGalleryItems();
    setGalleryItems(items);
    setIsLoading(false);
  };

  const handleItemAdded = (newItem: GalleryItem) => {
    setGalleryItems(prev => [newItem, ...prev]);
  };
  
  const handleDelete = async (id: string) => {
    const success = await deleteGalleryItem(id);
    
    if (success) {
      setGalleryItems(prev => prev.filter(item => item.id !== id));
      toast.success(language === 'en' ? 'Gallery item deleted successfully' : 'تم حذف العنصر بنجاح');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }
  
  return (
    <div className="mesomorphs-glass p-6 rounded-lg">
      <h2 className={`text-2xl mb-6 ${isRTL ? 'font-amiri text-right' : 'font-serif'}`}>
        {language === 'en' ? 'Gallery Management' : 'إدارة معرض الصور'}
      </h2>
      
      <GalleryUploadForm onItemAdded={handleItemAdded} />
      <GalleryItemList items={galleryItems} onDelete={handleDelete} />
    </div>
  );
}
