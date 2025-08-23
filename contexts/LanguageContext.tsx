import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

type Translations = { [key: string]: any };

const initialTranslations: { [key: string]: Translations } = {
  fr: {},
  en: {},
};

type Locale = 'fr' | 'en';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [translations, setTranslations] = useState(initialTranslations);
  const [loading, setLoading] = useState(true);

  const [locale, setLocaleState] = useState<Locale>(() => {
    const savedLocale = localStorage.getItem('locale');
    return (savedLocale === 'en' || savedLocale === 'fr') ? savedLocale : 'fr';
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const frPath = '/locales/fr.json';
        const enPath = '/locales/en.json';
        
        const [frResponse, enResponse] = await Promise.all([
          fetch(frPath),
          fetch(enPath)
        ]);

        if (!frResponse.ok || !enResponse.ok) {
            throw new Error(`Failed to fetch translation files: ${frResponse.statusText}, ${enResponse.statusText}`);
        }

        const frData = await frResponse.json();
        const enData = await enResponse.json();

        setTranslations({ fr: frData, en: enData });
      } catch (error) {
        console.error("Failed to load translation files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
  }, []);

  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);
  
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const t = useCallback((key: string, params: { [key: string]: string | number } = {}) => {
    if (loading) return key;

    const keys = key.split('.');
    
    const findTranslation = (localeToTry: Locale) => {
        let result: any = translations[localeToTry];
        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = result[k];
            } else {
                return null; // Not found
            }
        }
        return result;
    };

    let result = findTranslation(locale);

    if (result === null && locale !== 'en') {
        result = findTranslation('en');
    }

    if (result === null || typeof result !== 'string') {
        return key;
    }
    
    let translated = result;
    Object.keys(params).forEach(paramKey => {
      translated = translated.replace(`{{${paramKey}}}`, String(params[paramKey]));
    });

    return translated;
  }, [locale, translations, loading]);

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
