
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { fetchGalleryItems, GalleryItem } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language, isRTL } = useLanguage();
  
  useEffect(() => {
    const loadGallery = async () => {
      setIsLoading(true);
      const items = await fetchGalleryItems();
      setGalleryItems(items);
      setIsLoading(false);
    };
    
    loadGallery();
  }, []);
  
  return (
    <div className={`min-h-screen ${isRTL ? 'ar' : 'en'}`}>
      <AnimatedBackground />
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-4xl mb-8 font-bold text-center ${isRTL ? 'font-amiri' : 'font-serif'}`}
        >
          {language === 'en' ? 'Image Gallery' : 'معرض الصور'}
        </motion.h1>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="text-center py-16">
            <p className={`text-lg opacity-70 ${isRTL ? 'font-amiri' : 'font-serif'}`}>
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
                className="glass rounded-lg overflow-hidden hover:scale-105 transition-transform"
              >
                <div className="relative">
                  <AspectRatio ratio={16/9} className="bg-gray-100">
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                </div>
                <div className="p-4">
                  <h3 className={`${isRTL ? 'font-amiri text-right' : 'font-serif'} text-xl`}>
                    {item.title}
                  </h3>
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
