import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import en from '../locales/en';
import es from '../locales/es';

type Language = 'en' | 'es';
type Translations = typeof en;

const locales: Record<Language, Translations> = { en, es };

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  // FIX: Update the signature of `t` to accept an optional `replacements` object for interpolation.
  t: (key: keyof Translations, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language>('language', 'en');

  // FIX: Implement interpolation logic in the `t` function.
  const t = (key: keyof Translations, replacements?: Record<string, string | number>): string => {
    let translation = locales[language][key] || locales['en'][key];

    if (translation && replacements) {
        Object.keys(replacements).forEach(replaceKey => {
            const regex = new RegExp(`\\{${replaceKey}\\}`, 'g');
            translation = translation.replace(regex, String(replacements[replaceKey]));
        });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
