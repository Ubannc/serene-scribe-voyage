import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchArticleById, Article, createOrUpdateArticle } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

// Mock rich text editor component (in a real app, you'd use a proper editor like TinyMCE or Quill)
const RichTextEditor = ({ value, onChange, dir = 'ltr' }: { value: string, onChange: (value: string) => void, dir?: string }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full min-h-[400px] p-4 border rounded-md font-serif"
      dir={dir}
      style={{ lineHeight: 1.8 }}
    />
  );
};

const ArticleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isNewArticle = id === 'new';
  const [article, setArticle] = useState<Partial<Article>>({
    title_en: '',
    title_ar: '',
    content_en: '',
    content_ar: '',
  });
  const [isLoading, setIsLoading] = useState(!isNewArticle);
  const [isSaving, setIsSaving] = useState(false);
  const { language, isRTL } = useLanguage();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    const loadArticle = async () => {
      if (isNewArticle) return;
      
      if (!id) return;
      
      setIsLoading(true);
      const data = await fetchArticleById(id);
      if (data) {
        setArticle(data);
      } else {
        toast.error(language === 'en' ? 'Article not found' : 'لم يتم العثور على المقال');
        navigate('/admin');
      }
      setIsLoading(false);
    };
    
    loadArticle();
  }, [id, isAdmin, isNewArticle, navigate, language]);
  
  const handleSave = async () => {
    if (!article.title_en || !article.title_ar) {
      toast.error(language === 'en' ? 'Please enter both titles' : 'يرجى إدخال كلا العنوانين');
      return;
    }
    
    setIsSaving(true);
    const savedArticle = await createOrUpdateArticle({
      ...article,
      id: isNewArticle ? undefined : id,
    });
    setIsSaving(false);
    
    if (savedArticle) {
      if (isNewArticle) {
        navigate(`/admin/edit/${savedArticle.id}`);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className={isRTL ? 'font-amiri' : 'font-serif'}>
          {language === 'en' ? 'Loading article...' : 'جاري تحميل المقال...'}
        </p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full py-4 px-6 bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center text-sm hover:text-primary transition-colors">
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
              <span className={isRTL ? 'font-amiri' : 'font-serif'}>
                {language === 'en' ? 'Back to Dashboard' : 'العودة للوحة التحكم'}
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-1" />
              {isSaving 
                ? (language === 'en' ? 'Saving...' : 'جاري الحفظ...') 
                : (language === 'en' ? 'Save' : 'حفظ')}
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <Label htmlFor="title_en" className="mb-2 block">English Title</Label>
              <Input
                id="title_en"
                value={article.title_en}
                onChange={(e) => setArticle({ ...article, title_en: e.target.value })}
                placeholder="Enter English title"
                className="font-serif"
              />
            </div>
            <div>
              <Label htmlFor="title_ar" className="mb-2 block text-right">العنوان بالعربية</Label>
              <Input
                id="title_ar"
                value={article.title_ar}
                onChange={(e) => setArticle({ ...article, title_ar: e.target.value })}
                placeholder="أدخل العنوان بالعربية"
                className="text-right font-amiri"
                dir="rtl"
              />
            </div>
          </div>
          
          <Tabs defaultValue="english" className="mt-6">
            <TabsList className="mb-4">
              <TabsTrigger value="english">English Content</TabsTrigger>
              <TabsTrigger value="arabic">المحتوى العربي</TabsTrigger>
            </TabsList>
            <TabsContent value="english">
              <div className="space-y-4">
                <Label htmlFor="content_en" className="block">English Content</Label>
                <RichTextEditor
                  value={article.content_en || ''}
                  onChange={(value) => setArticle({ ...article, content_en: value })}
                />
              </div>
            </TabsContent>
            <TabsContent value="arabic">
              <div className="space-y-4">
                <Label htmlFor="content_ar" className="block text-right">المحتوى العربي</Label>
                <RichTextEditor
                  value={article.content_ar || ''}
                  onChange={(value) => setArticle({ ...article, content_ar: value })}
                  dir="rtl"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ArticleEditor;
