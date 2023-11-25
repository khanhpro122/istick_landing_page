import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en/translation.json';
import vi from '../locales/vi/translation.json';
import { convertLanguageJsonToObject } from './translations';

const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};
convertLanguageJsonToObject(en);

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    lng: 'en', // Ngôn ngữ mặc định
    fallbackLng: 'en', // Ngôn ngữ dự phòng nếu ngôn ngữ hiện tại không có bản dịch
    interpolation: {
      escapeValue: false, // Cho phép chèn giá trị của biến trong các chuỗi dịch
    },
  });

export default i18n;
