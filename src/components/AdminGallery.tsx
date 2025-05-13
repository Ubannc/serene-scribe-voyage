
import { useState, useEffect, useRef } from 'react';
import { createGalleryItem, deleteGalleryItem, fetchGalleryItems, GalleryItem, uploadImage } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Upload, Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/sonner';

export function AdminGallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { language, isRTL } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    loadGallery();
  }, []);
  
  const loadGallery = async () => {
    setIsLoading(true);
    const items = await fetchGalleryItems();
    setGalleryItems(items);
    setIsLoading(false);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      // Auto-set title from filename if empty
      if (!title.trim()) {
        const fileName = e.target.files[0].name.split('.')[0];
        setTitle(fileName);
      }
    }
  };

  const handleDirectUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title.trim()) {
      toast.error(language === 'en' ? 'Please provide both title and image' : 'يرجى توفير العنوان والصورة');
      return;
    }
    
    setIsUploading(true);
    
    try {
      const imageUrl = await uploadImage(file, 'gallery');
      
      if (imageUrl) {
        const newItem = await createGalleryItem(title, imageUrl);
        if (newItem) {
          setGalleryItems(prev => [newItem, ...prev]);
          setTitle('');
          setFile(null);
          toast.success(language === 'en' ? 'Gallery item added successfully' : 'تمت إضافة العنصر بنجاح');
          
          // Clear the file input
          const fileInput = document.getElementById('gallery-file') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
        }
      }
    } catch (error) {
      console.error('Error uploading to gallery:', error);
      toast.error(language === 'en' ? 'Failed to upload image' : 'فشل في رفع الصورة');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    const success = await deleteGalleryItem(id);
    
    if (success) {
      setGalleryItems(prev => prev.filter(item => item.id !== id));
      toast.success(language === 'en' ? 'Gallery item deleted successfully' : 'تم حذف العنصر بنجاح');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }
  
  return (
    <div className="mesomorphs-glass p-6 rounded-lg">
      <h2 className={`text-2xl mb-6 ${isRTL ? 'font-amiri text-right' : 'font-serif'}`}>
        {language === 'en' ? 'Gallery Management' : 'إدارة معرض الصور'}
      </h2>
      
      <div className="mesomorphs-glass p-6 rounded-lg mb-8">
        <h3 className={`text-xl mb-4 ${isRTL ? 'font-amiri text-right' : 'font-serif'}`}>
          {language === 'en' ? 'Add New Image' : 'إضافة صورة جديدة'}
        </h3>
        
        <div className="flex justify-center mb-4">
          <Button 
            onClick={handleDirectUpload}
            className="glass-button flex gap-2 items-center"
          >
            <Upload className="h-4 w-4" />
            {language === 'en' ? 'Quick Upload' : 'رفع سريع'}
          </Button>
          <input 
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block mb-1 text-sm ${isRTL ? 'font-amiri text-right' : ''}`}>
              {language === 'en' ? 'Title' : 'العنوان'}
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={isRTL ? 'text-right font-amiri' : ''}
              dir={isRTL ? 'rtl' : 'ltr'}
              placeholder={language === 'en' ? 'Enter image title' : 'أدخل عنوان الصورة'}
            />
          </div>
          
          <div>
            <label className={`block mb-1 text-sm ${isRTL ? 'font-amiri text-right' : ''}`}>
              {language === 'en' ? 'Image' : 'الصورة'}
            </label>
            <Input
              id="gallery-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="py-2"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isUploading || !file || !title.trim()}
            className="flex items-center"
          >
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading 
              ? (language === 'en' ? 'Uploading...' : 'جاري الرفع...') 
              : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Upload Image' : 'رفع الصورة'}
                </>
              )
            }
          </Button>
        </form>
      </div>
      
      <div>
        <h3 className={`text-xl mb-4 ${isRTL ? 'font-amiri text-right' : 'font-serif'}`}>
          {language === 'en' ? 'Existing Images' : 'الصور الموجودة'}
        </h3>
        
        {galleryItems.length === 0 ? (
          <div className={`text-center py-8 opacity-70 ${isRTL ? 'font-amiri' : ''}`}>
            {language === 'en' ? 'No images yet. Upload some!' : 'لا توجد صور بعد. قم بتحميل بعضها!'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {galleryItems.map(item => (
              <div key={item.id} className="mesomorphs-glass p-4 rounded-lg flex items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className={`flex-grow px-4 ${isRTL ? 'text-right' : ''}`}>
                  <h4 className={isRTL ? 'font-amiri' : 'font-serif'}>{item.title}</h4>
                  {/* Removed date display as requested */}
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
                        onClick={() => handleDelete(item.id)}
                        className={isRTL ? 'font-amiri' : ''}
                      >
                        {language === 'en' ? 'Delete' : 'حذف'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
