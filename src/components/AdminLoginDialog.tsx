
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';

interface AdminLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminLoginDialog({ open, onOpenChange }: AdminLoginDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const handleLogin = async () => {
    if (!email.trim()) {
      toast.error(language === 'en' ? 'Please enter an email address' : 'يرجى إدخال عنوان البريد الإلكتروني');
      return;
    }
    
    if (!password.trim()) {
      toast.error(language === 'en' ? 'Please enter a password' : 'يرجى إدخال كلمة المرور');
      return;
    }
    
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    
    if (success) {
      toast.success(language === 'en' ? 'Login successful' : 'تم تسجيل الدخول بنجاح');
      onOpenChange(false);
      navigate('/admin');
    } else {
      toast.error(language === 'en' ? 'Invalid credentials' : 'بيانات الاعتماد غير صالحة');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-dark">
        <DialogHeader>
          <DialogTitle className={`text-center text-2xl ${language === 'ar' ? 'font-amiri' : 'font-serif'}`}>
            {language === 'en' ? 'Admin Access' : 'وصول المسؤول'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className={`block text-sm ${language === 'ar' ? 'font-amiri text-right' : 'font-serif'}`}>
              {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
            </Label>
            <Input
              type="email"
              placeholder={language === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`bg-white/50 ${language === 'ar' ? 'text-right font-amiri' : ''}`}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>
          
          <div className="space-y-2">
            <Label className={`block text-sm ${language === 'ar' ? 'font-amiri text-right' : 'font-serif'}`}>
              {language === 'en' ? 'Password' : 'كلمة المرور'}
            </Label>
            <Input
              type="password"
              placeholder={language === 'en' ? 'Enter your password' : 'أدخل كلمة المرور'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`bg-white/50 ${language === 'ar' ? 'text-right font-amiri' : ''}`}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className={`${language === 'ar' ? 'order-2 mr-2' : ''}`}
            >
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button 
              onClick={handleLogin} 
              disabled={isLoading}
              className={`${language === 'ar' ? 'order-1' : ''} bg-primary hover:bg-primary/90`}
            >
              {isLoading 
                ? (language === 'en' ? 'Logging in...' : 'جاري تسجيل الدخول...') 
                : (language === 'en' ? 'Login' : 'تسجيل الدخول')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
