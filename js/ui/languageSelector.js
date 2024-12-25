import { i18nService } from '../i18n/i18nService.js';

export function initializeLanguageSelector() {
    const languageSelect = document.getElementById('languageSelect');
    if (!languageSelect) return;

    languageSelect.addEventListener('change', (e) => {
        i18nService.setLanguage(e.target.value);
    });

    // Set initial language
    const userLang = navigator.language || navigator.userLanguage;
    const initialLang = i18nService.translations[userLang] ? userLang : 'zh';
    languageSelect.value = initialLang;
    i18nService.setLanguage(initialLang);
}