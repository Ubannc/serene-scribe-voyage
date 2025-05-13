
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { ArticleCard } from '@/components/ArticleCard';
import { fetchArticles, Article } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { motion } from 'framer-motion';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';

const Index = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();
  
  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      const data = await fetchArticles();
      setArticles(data);
      setFilteredArticles(data);
      setIsLoading(false);
    };
    
    loadArticles();
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredArticles(articles);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = articles.filter(article => {
      return (
        article.title_en.toLowerCase().includes(query) ||
        article.title_ar.toLowerCase().includes(query)
      );
    });
    
    setFilteredArticles(filtered);
  }, [searchQuery, articles]);
  
  return (
    <div className="min-h-screen flex flex-col relative bg-white">
      <AnimatedBackground />
      
      <Header />
      
      <main className="flex-grow container max-w-5xl mx-auto px-4 py-12 animate-fade-in relative z-10">
        {/* Featured Article Carousel */}
        {articles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <FeaturedCarousel articles={articles} />
          </motion.div>
        )}
        
        <div className="mb-12 text-center mt-16">
          <h1 className="text-4xl font-medium mb-6 font-serif">
            Articles
          </h1>
          
          <div className="relative max-w-md mx-auto mt-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 backdrop-blur-sm bg-white/60 border border-gray-200"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-20">
            <p className="font-serif">
              Loading articles...
            </p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg font-serif">
              No articles found matching your search.
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default Index;
