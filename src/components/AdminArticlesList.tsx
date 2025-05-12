
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchArticles, deleteArticle } from '@/lib/articles';
import { Article } from '@/lib/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/sonner';

export function AdminArticlesList() {
  const { language, isRTL } = useLanguage();
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  
  const { 
    data: articles, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['articles', 'admin'],
    queryFn: () => fetchArticles(true),
  });
  
  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;
    
    try {
      const success = await deleteArticle(articleToDelete.id);
      if (success) {
        toast.success(language === 'en' ? 'Article deleted' : 'تم حذف المقالة');
        await refetch();
      } else {
        toast.error(language === 'en' ? 'Failed to delete article' : 'فشل حذف المقالة');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error(language === 'en' ? 'Failed to delete article' : 'فشل حذف المقالة');
    } finally {
      setArticleToDelete(null);
    }
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className={isRTL ? 'font-amiri' : 'font-serif'}>
          {language === 'en' ? 'Loading articles...' : 'جاري تحميل المقالات...'}
        </p>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="text-center py-8 text-red-600">
        <p className={isRTL ? 'font-amiri' : 'font-serif'}>
          {language === 'en' ? 'Failed to load articles' : 'فشل تحميل المقالات'}
        </p>
      </div>
    );
  }
  
  if (articles && articles.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className={`mb-4 ${isRTL ? 'font-amiri' : 'font-serif'}`}>
          {language === 'en' ? 'No articles found' : 'لم يتم العثور على مقالات'}
        </p>
        <Link to="/admin/new">
          <Button>
            {language === 'en' ? 'Create First Article' : 'إنشاء المقالة الأولى'}
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{language === 'en' ? 'Title' : 'العنوان'}</TableHead>
            <TableHead>{language === 'en' ? 'Date' : 'التاريخ'}</TableHead>
            <TableHead className="text-right">{language === 'en' ? 'Actions' : 'الإجراءات'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles && articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell className="font-medium">
                {language === 'en' ? article.title_en : article.title_ar}
              </TableCell>
              <TableCell>
                {format(new Date(article.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Link to={`/admin/edit/${article.id}`}>
                    <Button size="sm" variant="ghost">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setArticleToDelete(article)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {language === 'en' ? 'Are you sure?' : 'هل أنت متأكد؟'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {language === 'en' 
                            ? 'This action cannot be undone. This will permanently delete the article.'
                            : 'لا يمكن التراجع عن هذا الإجراء. سيؤدي إلى حذف المقالة بشكل نهائي.'}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {language === 'en' ? 'Cancel' : 'إلغاء'}
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-500 hover:bg-red-600"
                          onClick={handleDeleteArticle}
                        >
                          {language === 'en' ? 'Delete' : 'حذف'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
