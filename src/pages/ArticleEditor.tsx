
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchArticleById, createOrUpdateArticle } from '@/lib/articles';
import { Article } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Calendar, Save, Check } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import RichTextEditor from '@/components/RichTextEditor';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';

const ArticleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isNewArticle = id === 'new';
  const [article, setArticle] = useState<Partial<Article>>({
    title_en: '',
    title_ar: '',
    content_en: '',
    content_ar: '',
  });
  const [publishDate, setPublishDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false); // Changed initial state to false
  const [isSaving, setIsSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const { language, isRTL } = useLanguage();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Debugging
    console.log("ArticleEditor mounting, isNewArticle:", isNewArticle, "id:", id);
    
    // Redirect if not admin
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    const loadArticle = async () => {
      if (isNewArticle) {
        // Ensure loading state is false for new articles
        console.log("New article: Setting loading state to false");
        setIsLoading(false);
        return;
      }
      
      if (!id) return;
      
      setIsLoading(true);
      console.log("Fetching article with id:", id);
      
      try {
        const data = await fetchArticleById(id);
        if (data) {
          console.log("Article fetched successfully:", data);
          setArticle(data);
          // You would set the publish date here if it exists in your data model
          // setPublishDate(data.publish_date ? new Date(data.publish_date) : undefined);
          // setIsPublished(!!data.is_published);
        } else {
          console.error("Article not found for ID:", id);
          toast.error(language === 'en' ? 'Article not found' : 'لم يتم العثور على المقال');
          navigate('/admin');
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        toast.error(language === 'en' ? 'Error loading article' : 'خطأ في تحميل المقال');
        navigate('/admin');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticle();
  }, [id, isAdmin, isNewArticle, navigate, language]);
  
  const handleSave = async () => {
    if (!article.title_en || !article.title_ar) {
      toast.error(language === 'en' ? 'Please enter both titles' : 'يرجى إدخال كلا العنوانين');
      return;
    }
    
    setIsSaving(true);
    console.log("Saving article:", article);
    
    try {
      const savedArticle = await createOrUpdateArticle({
        ...article,
        id: isNewArticle ? undefined : id,
        // Add publish date and published status when your backend supports it
        // publish_date: publishDate?.toISOString(),
        // is_published: isPublished
      });
      
      if (savedArticle) {
        console.log("Article saved successfully:", savedArticle);
        toast.success(language === 'en' ? 'Article saved successfully' : 'تم حفظ المقال بنجاح');
        if (isNewArticle) {
          navigate(`/admin/edit/${savedArticle.id}`);
        }
      } else {
        console.error("Failed to save article, no response returned");
        toast.error(language === 'en' ? 'Failed to save article' : 'فشل حفظ المقال');
      }
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error(language === 'en' ? 'Error saving article' : 'خطأ في حفظ المقال');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className={isRTL ? 'font-amiri' : 'font-serif'}>
            {language === 'en' ? 'Loading article...' : 'جاري تحميل المقال...'}
          </p>
        </div>
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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {publishDate ? format(publishDate, 'PPP') : language === 'en' ? 'Pick a date' : 'اختر تاريخاً'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={publishDate}
                  onSelect={setPublishDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <div className="flex items-center gap-2">
              <Switch
                id="published"
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
              <Label htmlFor="published">
                {language === 'en' ? 'Publish' : 'نشر'}
              </Label>
            </div>
            
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90"
            >
              {isSaving 
                ? (language === 'en' ? 'Saving...' : 'جاري الحفظ...') 
                : (isPublished 
                  ? (language === 'en' ? 'Publish' : 'نشر')
                  : (language === 'en' ? 'Save Draft' : 'حفظ مسودة'))}
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
                  dir="ltr"
                  placeholder="Write your article content here..."
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
                  placeholder="اكتب محتوى مقالتك هنا..."
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
