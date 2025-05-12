import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { ArticleCard } from '@/components/ArticleCard';
import { fetchArticles, Article } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search } from 'lucide-react';

const Index = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { language, isRTL } = useLanguage();
  
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container max-w-5xl mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-12 text-center">
          <h1 className={`text-4xl font-medium mb-3 ${isRTL ? 'font-amiri' : 'font-serif'}`}>
            {language === 'en' ? 'Articles' : 'المقالات'}
          </h1>
          
          <div className="relative max-w-md mx-auto mt-8">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`} />
            <Input
              type="text"
              placeholder={language === 'en' ? 'Search articles...' : 'البحث في المقالات...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 glass ${isRTL ? 'text-right font-amiri' : ''}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-20">
            <p className={isRTL ? 'font-amiri' : 'font-serif'}>
              {language === 'en' ? 'Loading articles...' : 'جاري تحميل المقالات...'}
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
            <p className={`text-lg ${isRTL ? 'font-amiri' : 'font-serif'}`}>
              {language === 'en' 
                ? 'No articles found matching your search.' 
                : 'لم يتم العثور على مقالات تطابق بحثك.'}
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
