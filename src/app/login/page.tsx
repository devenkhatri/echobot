
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { login, isAuthenticated } from '@/lib/auth';
import { Loader2, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t, language, translationsLoaded } = useLanguage(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    if (translationsLoaded) {
      if (isAuthenticated()) {
        router.replace('/chat');
      } else {
        setPageReady(true);
      }
    }
  }, [translationsLoaded, router]);
  
  useEffect(() => {
    // Potentially force re-render if language changes while on page,
    // though typically user is redirected before this matters much.
  }, [language]);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username.trim() && password.trim()) {
      login(); 
      toast({
        title: t('loginPage.toast.loginSuccessTitle'),
        description: t('loginPage.toast.loginSuccessDesc'),
      });
      router.replace('/chat');
    } else {
      toast({
        variant: 'destructive',
        title: t('loginPage.toast.loginFailedTitle'),
        description: t('loginPage.toast.loginFailedDesc'),
      });
      setIsLoading(false);
    }
  };
  
  if (!pageReady) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <LogIn className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-headline">{t('loginPage.title')}</CardTitle>
          <CardDescription>{t('loginPage.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">{t('loginPage.usernameLabel')}</Label>
              <Input
                id="username"
                type="text"
                placeholder={t('loginPage.usernamePlaceholder')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('loginPage.passwordLabel')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('loginPage.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="text-base"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t('loginPage.signInButtonLoading')}
                </>
              ) : (
                t('loginPage.signInButton')
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-muted-foreground">
            {t('loginPage.demoNotice')}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
