import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import commonEn from './locales/en/common.json';
import composerEn from './locales/en/composer.json';

// Merge all English translations
const en = {
  ...commonEn,
  ...composerEn,
};

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
