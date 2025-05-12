
import { useState } from 'react';
import { Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AdminLoginDialog } from './AdminLoginDialog';

export function Footer() {
  const { language } = useLanguage();
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6 mt-10">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 md:px-8">
        <p className={`text-sm text-gray-500 ${language === 'ar' ? 'font-amiri' : 'font-serif'}`}>
          {language === 'en' 
            ? `© ${currentYear} M-thoughts` 
            : `© ${currentYear} أفكار-م`}
        </p>
        
        <button 
          onClick={() => setIsAdminLoginOpen(true)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Admin settings"
        >
          <Settings className="h-5 w-5 text-gray-400" />
        </button>
      </div>
      
      <AdminLoginDialog open={isAdminLoginOpen} onOpenChange={setIsAdminLoginOpen} />
    </footer>
  );
}
