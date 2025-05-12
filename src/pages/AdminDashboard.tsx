
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, LogOut, FileText, ImageIcon } from 'lucide-react';
import { AdminGallery } from '@/components/AdminGallery';
import { AdminArticlesList } from '@/components/AdminArticlesList';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'articles' | 'gallery'>('articles');
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  return (
    <div className={isRTL ? 'ar' : 'en'}>
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className={`text-3xl mb-4 md:mb-0 ${isRTL ? 'font-amiri' : 'font-serif'}`}>
            {language === 'en' ? 'Admin Dashboard' : 'لوحة الإدارة'}
          </h1>
          
          <div className="flex items-center space-x-3">
            <Button onClick={handleLogout} variant="outline" className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Logout' : 'تسجيل الخروج'}
            </Button>
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="border-b">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('articles')}
                className={`py-2 px-4 ${activeTab === 'articles' 
                  ? 'border-b-2 border-primary font-medium' 
                  : 'text-gray-500 hover:text-gray-700'
                } flex items-center`}
              >
                <FileText className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Articles' : 'المقالات'}
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`py-2 px-4 ${activeTab === 'gallery' 
                  ? 'border-b-2 border-primary font-medium' 
                  : 'text-gray-500 hover:text-gray-700'
                } flex items-center`}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Gallery' : 'معرض الصور'}
              </button>
            </div>
          </div>
          
          {activeTab === 'articles' ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl ${isRTL ? 'font-amiri' : 'font-serif'}`}>
                  {language === 'en' ? 'Article Management' : 'إدارة المقالات'}
                </h2>
                
                <Link to="/admin/new">
                  <Button className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {language === 'en' ? 'New Article' : 'مقالة جديدة'}
                  </Button>
                </Link>
              </div>
              
              <AdminArticlesList />
            </div>
          ) : (
            <AdminGallery />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
