
'use client';

import type { Dispatch, ReactNode, SetStateAction} from 'react';
import React, { createContext, useContext, useEffect, useState }  from 'react';

// Define the shape of the context
interface LanguageContextType {
  language: 'en' | 'gu';
  setLanguage: Dispatch<SetStateAction<'en' | 'gu'>>;
  t: (key: string, replacements?: Record<string, string>) => string;
  translationsLoaded: boolean;
}

// Create the context with a default undefined value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define the props for the provider
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<'en' | 'gu'>(() => {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('appLanguage');
      if (storedLang === 'en' || storedLang === 'gu') {
        return storedLang;
      }
    }
    return 'en'; // Default language
  });
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [translationsLoaded, setTranslationsLoaded] = useState(false);

  useEffect(() => {
    const loadTranslations = async () => {
      setTranslationsLoaded(false);
      try {
        const langModule = await import(`@/locales/${language}.json`);
        setTranslations(langModule.default || langModule); // .default for JSON modules
        if (typeof window !== 'undefined') {
          localStorage.setItem('appLanguage', language);
        }
      } catch (error) {
        console.error(`Could not load translations for ${language}:`, error);
        // Fallback to English if the selected language fails to load and it's not already English
        if (language !== 'en') {
          try {
            const enLangModule = await import(`@/locales/en.json`);
            setTranslations(enLangModule.default || enLangModule);
          } catch (enError) {
            console.error('Could not load fallback English translations:', enError);
             setTranslations({}); // Set to empty if fallback also fails
          }
        } else if (Object.keys(translations).length === 0) { // If English failed on initial load
           setTranslations({});
        }
      } finally {
        setTranslationsLoaded(true);
      }
    };

    loadTranslations();
  }, [language]);

  const t = (key: string, replacements?: Record<string, string>): string => {
    let translation = translations[key] || key;
    if (replacements) {
      Object.keys(replacements).forEach(rKey => {
        translation = translation.replace(`{{${rKey}}}`, replacements[rKey]);
      });
    }
    return translation;
  };
  
  const setLanguage: Dispatch<SetStateAction<'en' | 'gu'>> = (newLangOrCallback) => {
    setLanguageState(prevLang => {
      const newLang = typeof newLangOrCallback === 'function' ? newLangOrCallback(prevLang) : newLangOrCallback;
      if (typeof window !== 'undefined') {
        localStorage.setItem('appLanguage', newLang);
      }
      return newLang;
    });
  };


  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translationsLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the LanguageContext
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
