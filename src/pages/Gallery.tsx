import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { fetchGalleryItems, GalleryItem } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadGallery = async () => {
      setIsLoading(true);
      const items = await fetchGalleryItems();
      setGalleryItems(items);
      setIsLoading(false);
    };
    
    loadGallery();
  }, []);
  
  const handleDownload = (imageUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="min-h-screen en bg-white">
      <AnimatedBackground />
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl mb-12 font-bold text-center font-serif"
        >
          Image Gallery
        </motion.h1>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg opacity-70 font-serif">
              No images in the gallery yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden group hover:scale-102 transition duration-300"
              >
                <div className="relative">
                  <AspectRatio ratio={1} className="bg-gray-100">
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                    <Button 
                      size="sm"
                      variant="secondary"
                      className="backdrop-blur-sm bg-white/80 hover:bg-white/90"
                      onClick={() => handleDownload(item.url, item.title)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="font-serif text-white text-center">
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