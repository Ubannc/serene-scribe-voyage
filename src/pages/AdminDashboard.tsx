
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { fetchArticles, Article, deleteArticle } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, 
  LogOut, 
  ChevronDown, 
  Eye, 
  Edit, 
  Trash2, 
  AlertCircle 
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AdminDashboard = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const { language, isRTL } = useLanguage();
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    const loadArticles = async () => {
      setIsLoading(true);
      const data = await fetchArticles(false);
      setArticles(data);
      setIsLoading(false);
    };
    
    loadArticles();
  }, [isAdmin, navigate]);
  
  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;
    
    const success = await deleteArticle(articleToDelete);
    if (success) {
      setArticles(articles.filter(article => article.id !== articleToDelete));
    }
    
    setArticleToDelete(null);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success(language === 'en' ? 'Logged out successfully' : 'تم تسجيل الخروج بنجاح');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full py-4 px-6 bg-white border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-medium mr-6">
              M-thoughts
            </Link>
            <h1 className={`text-lg ${isRTL ? 'font-amiri' : 'font-serif'}`}>
              {language === 'en' ? 'Admin Dashboard' : 'لوحة التحكم'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link to="/admin/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-1" />
                {language === 'en' ? 'New Article' : 'مقال جديد'}
              </Button>
            </Link>
            
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              {language === 'en' ? 'Logout' : 'خروج'}
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className={`text-xl mb-6 ${isRTL ? 'font-amiri' : 'font-serif'}`}>
            {language === 'en' ? 'Published Articles' : 'المقالات المنشورة'}
          </h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p>{language === 'en' ? 'Loading articles...' : 'جاري تحميل المقالات...'}</p>
            </div>
          ) : articles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium text-gray-500 ${isRTL ? 'font-amiri' : 'font-serif'}`}>
                      {language === 'en' ? 'Title' : 'العنوان'}
                    </th>
                    <th className={`px-4 py-3 text-left text-sm font-medium text-gray-500 ${isRTL ? 'font-amiri' : 'font-serif'}`}>
                      {language === 'en' ? 'Status' : 'الحالة'}
                    </th>
                    <th className={`px-4 py-3 text-left text-sm font-medium text-gray-500 ${isRTL ? 'font-amiri' : 'font-serif'}`}>
                      {language === 'en' ? 'Date' : 'التاريخ'}
                    </th>
                    <th className="px-4 py-3 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id} className="border-t">
                      <td className={`px-4 py-4 text-sm ${isRTL ? 'font-amiri' : 'font-serif'}`}>
                        {language === 'en' ? article.title_en : article.title_ar}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                          article.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {article.published 
                            ? (language === 'en' ? 'Published' : 'منشور') 
                            : (language === 'en' ? 'Draft' : 'مسودة')}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {new Date(article.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <span className="sr-only">Actions</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem asChild>
                              <Link to={`/article/${article.id}`} className="flex items-center">
                                <Eye className="h-4 w-4 mr-2" />
                                <span>{language === 'en' ? 'View' : 'عرض'}</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/edit/${article.id}`} className="flex items-center">
                                <Edit className="h-4 w-4 mr-2" />
                                <span>{language === 'en' ? 'Edit' : 'تعديل'}</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onSelect={() => setArticleToDelete(article.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span>{language === 'en' ? 'Delete' : 'حذف'}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <div className="mx-auto flex flex-col items-center">
                <AlertCircle className="h-12 w-12 text-gray-400" />
                <h3 className={`mt-2 text-lg ${isRTL ? 'font-amiri' : 'font-serif'}`}>
                  {language === 'en' ? 'No articles yet' : 'لا توجد مقالات بعد'}
                </h3>
                <p className={`mt-1 text-sm text-gray-500 ${isRTL ? 'font-amiri' : ''}`}>
                  {language === 'en' 
                    ? 'Start by creating your first article.' 
                    : 'ابدأ بإنشاء مقالك الأول.'}
                </p>
                <div className="mt-6">
                  <Link to="/admin/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-1" />
                      {language === 'en' ? 'New Article' : 'مقال جديد'}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <AlertDialog open={!!articleToDelete} onOpenChange={(open) => !open && setArticleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={isRTL ? 'font-amiri' : 'font-serif'}>
              {language === 'en' ? 'Are you sure?' : 'هل أنت متأكد؟'}
            </AlertDialogTitle>
            <AlertDialogDescription className={isRTL ? 'font-amiri' : ''}>
              {language === 'en' 
                ? 'This action cannot be undone. This will permanently delete the article.' 
                : 'لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف المقال نهائيًا.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={isRTL ? 'font-amiri' : ''}>
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteArticle}
            >
              {language === 'en' ? 'Delete' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
