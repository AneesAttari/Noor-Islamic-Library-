import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Language, Translations, translations } from './translations';

interface LanguageContextType {
  language: Language;
  dir: 'ltr' | 'rtl';
  isUrdu: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof Translations, params?: Record<string, string | number>) => string;
}

const STORAGE_LANG_KEY = 'maktaba_language_preference';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_LANG_KEY);
      if (saved === 'ur' || saved === 'en') {
        return saved;
      }
    }
    return 'en';
  });

  const dir = language === 'ur' ? 'rtl' : 'ltr';
  const isUrdu = language === 'ur';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_LANG_KEY, language);
    }
  }, [language, dir]);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'ur' : 'en'));
  };

  const t = useMemo(() => {
    return (key: keyof Translations, params?: Record<string, string | number>): string => {
      const dict = translations[language] || translations.en;
      let text = dict[key];

      if (Array.isArray(text)) {
        return text.join('\n');
      }

      if (typeof text !== 'string') {
        return '';
      }

      if (params) {
        Object.entries(params).forEach(([paramKey, val]) => {
          text = (text as string).replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
        });
      }

      return text;
    };
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        dir,
        isUrdu,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
