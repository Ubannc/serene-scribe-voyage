
import { Pen, Image, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { AdminLoginDialog } from './AdminLoginDialog';
import { VisitorCounter } from './VisitorCounter';

export function Header() {
  const { language } = useLanguage();
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  
  return (
    <header className="w-full py-6 px-4 md:px-8 backdrop-blur-sm bg-white/30 border-b border-white/10 animate-fade-in z-20 sticky top-0">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Pen className="h-6 w-6" />
          <span className="text-xl font-medium ml-2 font-serif">
            M - thoughts
          </span>
        </Link>
        
        {/* Added visitor counter in the middle */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <VisitorCounter />
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/gallery">
            <Button 
              variant="ghost" 
              className="text-sm font-medium hover:bg-black/5 flex items-center"
            >
              <Image className="h-4 w-4 mr-1" />
              Gallery
            </Button>
          </Link>
          
          <Button 
            variant="ghost"
            onClick={() => setIsAdminLoginOpen(true)}
            className="text-sm font-medium hover:bg-black/5 flex items-center"
            aria-label="Admin settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <AdminLoginDialog open={isAdminLoginOpen} onOpenChange={setIsAdminLoginOpen} />
    </header>
  );
}
