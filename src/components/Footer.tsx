
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { language } = useLanguage();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6 mt-10">
      <div className="max-w-5xl mx-auto flex items-center justify-center px-4 md:px-8">
        <p className={`text-sm text-gray-500 ${language === 'ar' ? 'font-amiri' : 'font-serif'}`}>
          {language === 'en' 
            ? `© ${currentYear} M-thoughts` 
            : `© ${currentYear} أفكار-م`}
        </p>
      </div>
    </footer>
  );
}
