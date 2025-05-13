
import { useLanguage } from '@/contexts/LanguageContext';
import { GalleryItem } from '@/lib/supabase';
import { GalleryItemComponent } from './GalleryItem';

interface GalleryItemListProps {
  items: GalleryItem[];
  onDelete: (id: string) => Promise<void>;
}

export function GalleryItemList({ items, onDelete }: GalleryItemListProps) {
  const { language, isRTL } = useLanguage();
  
  return (
    <div>
      <h3 className={`text-xl mb-4 ${isRTL ? 'font-amiri text-right' : 'font-serif'}`}>
        {language === 'en' ? 'Existing Images' : 'الصور الموجودة'}
      </h3>
      
      {items.length === 0 ? (
        <div className={`text-center py-8 opacity-70 ${isRTL ? 'font-amiri' : ''}`}>
          {language === 'en' ? 'No images yet. Upload some!' : 'لا توجد صور بعد. قم بتحميل بعضها!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map(item => (
            <GalleryItemComponent 
              key={item.id} 
              id={item.id} 
              url={item.url} 
              title={item.title} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
