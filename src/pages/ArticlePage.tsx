import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { fetchArticleById, Article } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/sonner';

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isRTL } = useLanguage();
  
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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container max-w-3xl mx-auto px-4 py-16 flex items-center justify-center">
          <p className="font-serif">Loading article...</p>
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
          <h1 className="text-2xl mb-4 font-serif">Article not found</h1>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to articles
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow container max-w-3xl mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-white/70 backdrop-blur-sm p-8 md:p-12 rounded-lg"
        >
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-sm mb-4 hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="font-serif">Back to articles</span>
            </Link>
          </div>
          
          <h1 className={`text-4xl lg:text-5xl mb-8 leading-tight ${isRTL ? 'font-amiri text-right' : 'font-serif'}`}>
            {article.title_ar}
          </h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="select-none"
          >
            <div 
              className="prose max-w-none ar"
              style={{
                lineHeight: '1.8',
                fontSize: '1.125rem',
                textAlign: 'right',
                direction: 'rtl',
                fontFamily: 'Amiri, serif',
              }}
              dangerouslySetInnerHTML={{ __html: article.content_ar }}
            />
          </motion.div>

          <div className="mt-8 flex justify-center">
            <Button onClick={handleShare} className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share Article
            </Button>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}

export default ArticlePage;