
import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { fetchGalleryItems, GalleryItem } from '@/lib/supabase';
import { createGalleryItem } from '@/lib/gallery';
import { uploadImage } from '@/lib/storage';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { language, isRTL } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const loadGallery = async () => {
      setIsLoading(true);
      const items = await fetchGalleryItems();
      setGalleryItems(items);
      setIsLoading(false);
    };
    
    loadGallery();
  }, []);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const defaultTitle = file.name.split('.')[0] || (language === 'en' ? 'Uploaded Image' : 'صورة مرفوعة');
      
      setIsUploading(true);
      
      try {
        const imageUrl = await uploadImage(file, 'gallery');
        
        if (imageUrl) {
          const newItem = await createGalleryItem(defaultTitle, imageUrl);
          if (newItem) {
            setGalleryItems(prev => [newItem, ...prev]);
            toast.success(language === 'en' ? 'Image uploaded successfully!' : 'تم رفع الصورة بنجاح!');
          }
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error(language === 'en' ? 'Failed to upload image' : 'فشل في رفع الصورة');
      } finally {
        setIsUploading(false);
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };
  
  return (
    <div className={`min-h-screen ${isRTL ? 'ar' : 'en'} bg-mesh-gradient`}>
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl mb-8 font-bold text-center"
        >
          {language === 'en' ? 'Image Gallery' : 'معرض الصور'}
        </motion.h1>
        
        <div className="flex justify-center mb-10">
          <Button 
            onClick={handleUploadClick} 
            disabled={isUploading}
            className="glass-button flex gap-2 items-center py-6 px-8 rounded-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin" />
                {language === 'en' ? 'Uploading...' : 'جاري الرفع...'}
              </>
            ) : (
              <>
                <Upload />
                {language === 'en' ? 'Upload Image' : 'رفع صورة'}
              </>
            )}
          </Button>
          <input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg opacity-70">
              {language === 'en' ? 'No images in the gallery yet.' : 'لا توجد صور في المعرض بعد.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mesomorphs-glass rounded-lg overflow-hidden hover:scale-105 transition-transform"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className={isRTL ? 'font-amiri text-right text-xl' : 'font-serif text-xl'}>
                    {item.title}
                  </h3>
                  {/* Removed date display as requested */}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
