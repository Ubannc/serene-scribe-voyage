
import { Pen, Image } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

export function Header() {
  const { language, toggleLanguage, isRTL } = useLanguage();
  
  return (
    <header className="w-full py-6 px-4 md:px-8 glass animate-fade-in">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Pen className="h-6 w-6" />
          <span className={`text-xl font-medium ${isRTL ? 'mr-2 font-amiri' : 'ml-2 font-serif'}`}>
            M - thoughts
          </span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/gallery">
            <Button 
              variant="ghost" 
              className="text-sm font-medium hover:bg-black/5 flex items-center"
            >
              <Image className="h-4 w-4 mr-1" />
              {language === 'en' ? 'Gallery' : 'معرض الصور'}
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            onClick={toggleLanguage} 
            className="text-sm font-medium hover:bg-black/5"
          >
            {language === 'en' ? 'العربية' : 'English'}
          </Button>
        </div>
      </div>
    </header>
  );
}
