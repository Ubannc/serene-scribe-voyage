import { Link } from 'react-router-dom';
import { Article } from '@/lib/types';
import { motion } from 'framer-motion';

interface ArticleCardProps {
  article: Article;
  index: number;
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/article/${article.id}`} className="block group">
        <article className="bg-white/60 backdrop-blur-sm p-6 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md">
          <h2 className="text-2xl mb-2 group-hover:text-primary transition-colors font-amiri text-right" dir="rtl">
            {article.title_ar}
          </h2>
          
          <h3 className="text-lg mb-3 group-hover:text-primary/80 transition-colors font-serif">
            {article.title_en}
          </h3>
        </article>
      </Link>
    </motion.div>
  );
}