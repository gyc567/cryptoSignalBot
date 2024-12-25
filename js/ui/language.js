import { translations } from '../translations.js';

export function initializeLanguage() {
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        setLanguage('zh');
        languageSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }
}

function setLanguage(lang) {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang]?.[key]) {
            element.textContent = translations[lang][key];
        }
    });
    document.documentElement.lang = lang;
}