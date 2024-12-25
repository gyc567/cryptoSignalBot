import translations from './translations/index.js';

class I18nService {
    constructor() {
        this.currentLanguage = 'zh';
        this.translations = translations;
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            document.documentElement.lang = lang;
            this.updateTranslations();
            this.updateDynamicContent();
        }
    }

    translate(key) {
        return this.translations[this.currentLanguage]?.[key] || key;
    }

    updateTranslations() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[this.currentLanguage]?.[key]) {
                element.textContent = this.translate(key);
            }
        });
    }

    updateDynamicContent() {
        // Update placeholders
        const customSymbol = document.getElementById('customSymbol');
        if (customSymbol) {
            customSymbol.placeholder = this.translate('custom_input_placeholder');
        }

        // Update chart labels
        const chart = document.getElementById('priceChart');
        if (chart && chart.chart) {
            chart.chart.options.scales.y.title.text = this.translate('price');
            chart.chart.update();
        }
    }
}

export const i18nService = new I18nService();