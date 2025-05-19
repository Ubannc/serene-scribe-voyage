import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type LanguageType = 'en' | 'ar';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageType>('en');
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as LanguageType;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage);
    } else {
      setLanguageState('en');
      localStorage.setItem('preferred-language', 'en');
    }
  }, []);
  
  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);
  };
  
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
  };
  
  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        toggleLanguage,
        isRTL: language === 'ar'
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};