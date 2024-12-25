import { initializeLanguageSelector } from './ui/languageSelector.js';
import { initializeCryptoSelector } from './ui/cryptoSelector.js';
import { i18nService } from './i18n/i18nService.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize i18n first
    initializeLanguageSelector();
    
    // Initialize other UI components
    initializeCryptoSelector();
});