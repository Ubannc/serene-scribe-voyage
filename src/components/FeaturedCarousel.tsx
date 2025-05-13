
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Article } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface FeaturedCarouselProps {
  articles: Article[];
}

export function FeaturedCarousel({ articles }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const interval = useRef<number | null>(null);
  
  // Auto-rotate every 4 seconds
  useEffect(() => {
    if (articles.length > 1) {
      interval.current = window.setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
      }, 4000);
    }
    
    return () => {
      if (interval.current !== null) {
        clearInterval(interval.current);
      }
    };
  }, [articles.length]);
  
  if (articles.length === 0) return null;
  
  const currentArticle = articles[currentIndex];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mesomorphs-glass p-8 md:p-10 rounded-2xl overflow-hidden relative mb-12"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-300 to-purple-400">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
        />
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentArticle.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4 leading-tight">
                {currentArticle.title_en}
              </h2>
              <p className="text-lg opacity-80 mb-6 line-clamp-2">
                {currentArticle.content_en.replace(/<[^>]*>/g, '').substring(0, 100)}...
              </p>
              <Link to={`/article/${currentArticle.id}`}>
                <Button className="glass-button group">
                  Read More 
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="w-full md:w-1/2 relative h-[200px] md:h-[300px] overflow-hidden rounded-lg">
          <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/20 to-transparent z-10" />
          <div className="absolute flex gap-2 bottom-4 right-4 z-20">
            {articles.slice(0, 5).map((_, index) => (
              <button 
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === index ? 'bg-white scale-125' : 'bg-white/40'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentArticle.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full"
            >
              {/* Placeholder image - you can replace with actual article thumbnail if available */}
              <div className="w-full h-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 flex items-center justify-center">
                <span className="text-4xl font-serif text-white/80">
                  {currentArticle.title_en.charAt(0)}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <div className="flex justify-center mt-6 gap-1.5">
        {articles.slice(0, 5).map((_, index) => (
          <button 
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index ? 'bg-primary scale-125' : 'bg-primary/30'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </motion.div>
  );
}
