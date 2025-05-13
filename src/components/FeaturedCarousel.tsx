
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="bg-white/50 backdrop-blur-sm p-12 rounded-lg overflow-hidden relative mb-12 w-full max-w-4xl mx-auto"
    >
      <div className="flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentArticle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-amiri mb-3 leading-tight" dir="rtl">
              {currentArticle.title_ar}
            </h2>
            <p className="text-lg md:text-xl font-serif text-gray-600 mb-8">
              {currentArticle.title_en}
            </p>
            <Link to={`/article/${currentArticle.id}`}>
              <Button className="glass-button group">
                Read More 
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-center mt-8 gap-2">
          {articles.slice(0, 5).map((_, index) => (
            <button 
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index ? 'bg-black/60 scale-125' : 'bg-black/20'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
