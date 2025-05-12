
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { fetchArticleById, Article } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { language, isRTL } = useLanguage();
  const { isAdmin } = useAuth();
  
  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;
      
      setIsLoading(true);
      const data = await fetchArticleById(id);
      setArticle(data);
      setIsLoading(false);
    };
    
    loadArticle();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container max-w-3xl mx-auto px-4 py-16 flex items-center justify-center">
          <p className={isRTL ? 'font-amiri' : 'font-serif'}>
            {language === 'en' ? 'Loading article...' : 'جاري تحميل المقال...'}
          </p>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container max-w-3xl mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <h1 className={`text-2xl mb-4 ${isRTL ? 'font-amiri' : 'font-serif'}`}>
            {language === 'en' ? 'Article not found' : 'لم يتم العثور على المقال'}
          </h1>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Back to articles' : 'العودة إلى المقالات'}
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }
  
  const content = language === 'en' ? article.content_en : article.content_ar;
  const title = language === 'en' ? article.title_en : article.title_ar;
  
  // Format the date based on the language
  const formattedDate = new Date(article.published_at || article.created_at).toLocaleDateString(
    language === 'en' ? 'en-US' : 'ar-SA',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container max-w-3xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Link to="/" className="inline-flex items-center text-sm mb-8 hover:text-primary transition-colors">
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
            <span className={isRTL ? 'font-amiri' : 'font-serif'}>
              {language === 'en' ? 'Back to articles' : 'العودة إلى المقالات'}
            </span>
          </Link>
          
          {isAdmin && (
            <Link to={`/admin/edit/${article.id}`} className="float-right">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                {language === 'en' ? 'Edit' : 'تعديل'}
              </Button>
            </Link>
          )}
          
          <div className="mb-2 text-sm text-gray-500">
            <time className={isRTL ? 'font-amiri' : 'font-serif'}>
              {formattedDate}
            </time>
          </div>
          
          <h1 className={`text-4xl lg:text-5xl mb-8 ${isRTL ? 'font-amiri' : 'font-serif'}`}>
            {title}
          </h1>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div 
            className={`prose ${language === 'en' ? 'en' : 'ar'}`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticlePage;
