import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/translation.json';
import ruTranslation from './locales/ru/translation.json';
import itTranslation from './locales/it/translation.json';

const resources = {
    en: {
        translation: enTranslation,
    },
    ru: {
        translation: ruTranslation,
    },
    it: {
        translation: itTranslation,
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'it', // default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already does escaping
        },
    });

export default i18n;
