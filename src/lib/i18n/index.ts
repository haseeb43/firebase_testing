import type { Locale } from '@/lib/types';
import en from './locales/en.json';
import is from './locales/is.json';
import es from './locales/es.json';
import pl from './locales/pl.json';

export const locales: Locale = {
  en,
  is,
  es,
  pl,
};

export const languages = {
  en: { name: 'English', flag: '🇬🇧' },
  is: { name: 'Íslenska', flag: '🇮🇸' },
  es: { name: 'Español', flag: '🇪🇸' },
  pl: { name: 'Polski', flag: '🇵🇱' },
};
