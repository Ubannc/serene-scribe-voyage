
import { useLanguage } from '@/contexts/LanguageContext';
import { Article } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ArticleCardProps {
  article: Article;
  index: number;
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  const { language, isRTL } = useLanguage();
  
  // Use the title based on the current language
  const title = language === 'en' ? article.title_en : article.title_ar;
  const secondaryTitle = language === 'en' ? article.title_ar : article.title_en;
  
  // Format the date based on the language
  const formattedDate = new Date(article.created_at).toLocaleDateString(
    language === 'en' ? 'en-US' : 'ar-SA',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/article/${article.id}`} className="block group">
        <article className={`glass p-6 rounded-lg transition-all duration-300 hover:shadow-md ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="mb-3 opacity-60 text-sm">
            <time className={isRTL ? 'font-amiri' : 'font-serif'}>
              {formattedDate}
            </time>
          </div>
          
          <h2 className={`text-2xl mb-2 group-hover:text-primary transition-colors ${isRTL ? 'font-amiri' : 'font-serif'}`}>
            {title}
          </h2>
          
          <p className={`text-sm opacity-70 ${isRTL ? 'font-amiri' : 'font-sans'}`}>
            {secondaryTitle}
          </p>
        </article>
      </Link>
    </motion.div>
  );
}
