
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trash2 } from 'lucide-react';

interface GalleryItemProps {
  id: string;
  url: string;
  title: string;
  onDelete: (id: string) => Promise<void>;
}

export function GalleryItemComponent({ id, url, title, onDelete }: GalleryItemProps) {
  const { language, isRTL } = useLanguage();
  
  return (
    <div className="mesomorphs-glass p-4 rounded-lg flex items-center">
      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
        <img src={url} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className={`flex-grow px-4 ${isRTL ? 'text-right' : ''}`}>
        <h4 className={isRTL ? 'font-amiri' : 'font-serif'}>{title}</h4>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={isRTL ? 'font-amiri text-right' : ''}>
              {language === 'en' ? 'Delete Image' : 'حذف الصورة'}
            </AlertDialogTitle>
            <AlertDialogDescription className={isRTL ? 'font-amiri text-right' : ''}>
              {language === 'en' 
                ? 'Are you sure you want to delete this image?' 
                : 'هل أنت متأكد أنك تريد حذف هذه الصورة؟'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={isRTL ? 'font-amiri' : ''}>
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => onDelete(id)}
              className={isRTL ? 'font-amiri' : ''}
            >
              {language === 'en' ? 'Delete' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
