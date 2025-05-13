
import { useState, useRef } from 'react';
import { uploadImage, createGalleryItem } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2, Image } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

interface GalleryUploadFormProps {
  onItemAdded: (newItem: any) => void;
}

export function GalleryUploadForm({ onItemAdded }: GalleryUploadFormProps) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { language, isRTL } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          onItemAdded(newItem);
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

  return (
    <div className="mesomorphs-glass p-6 rounded-lg mb-8">
      <h3 className={cn(
        "text-xl mb-4",
        isRTL ? "font-amiri text-right" : "font-serif"
      )}>
        {language === 'en' ? 'Add New Image' : 'إضافة صورة جديدة'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={cn(
            "block mb-1 text-sm",
            isRTL ? "font-amiri text-right" : ""
          )}>
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
          <label className={cn(
            "block mb-1 text-sm",
            isRTL ? "font-amiri text-right" : ""
          )}>
            {language === 'en' ? 'Image' : 'الصورة'}
          </label>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex-1 flex items-center justify-center py-8 border-dashed",
                file ? "bg-blue-50" : ""
              )}
            >
              {file ? (
                <div className="text-center">
                  <Image className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-gray-500">{file.name}</p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm">
                    {language === 'en' ? 'Click to select image' : 'انقر لاختيار الصورة'}
                  </p>
                </div>
              )}
            </Button>
            <input
              ref={fileInputRef}
              id="gallery-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={isUploading || !file || !title.trim()}
          className="w-full flex items-center justify-center py-6"
        >
          {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUploading 
            ? (language === 'en' ? 'Uploading...' : 'جاري الرفع...') 
            : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Upload to Gallery' : 'رفع إلى معرض الصور'}
              </>
            )
          }
        </Button>
      </form>
    </div>
  );
}
