'use client';

import { locales } from '@/lib/i18n';
import type { Language, Translations } from '@/lib/types';
import React, { createContext, useCallback, useMemo, useState } from 'react';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback(
    (key: keyof Translations): string => {
      const val = locales[language][key];
      if (val !== undefined && val !== null) return String(val);
      const fallback = locales.en[key];
      if (fallback !== undefined && fallback !== null) return String(fallback);
      return String(key);
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
