const translations = {
    zh: {
        brand: 'CryptoSignals Pro',
        nav_features: '功能',
        nav_how: '工作原理',
        nav_pricing: '价格',
        nav_faq: '常见问题',
        get_started: '立即开始',
        hero_title: '专业的加密货币交易信号',
        hero_subtitle: '利用先进的算法和实时市场数据，为您提供准确的交易信号',
        try_now: '立即体验',
        learn_more: '了解更多',
        // ... 其他中文翻译
    },
    'zh-TW': {
        brand: 'CryptoSignals Pro',
        nav_features: '功能',
        nav_how: '工作原理',
        nav_pricing: '價格',
        nav_faq: '常見問題',
        get_started: '立即開始',
        hero_title: '專業的加密貨幣交易信號',
        hero_subtitle: '利用先進的算法和即時市場數據，為您提供準確的交易信號',
        try_now: '立即體驗',
        learn_more: '了解更多',
        // ... 其他繁體中文翻譯
    },
    en: {
        brand: 'CryptoSignals Pro',
        nav_features: 'Features',
        nav_how: 'How It Works',
        nav_pricing: 'Pricing',
        nav_faq: 'FAQ',
        get_started: 'Get Started',
        hero_title: 'Professional Crypto Trading Signals',
        hero_subtitle: 'Leverage advanced algorithms and real-time market data for accurate trading signals',
        try_now: 'Try Now',
        learn_more: 'Learn More',
        // ... other English translations
    },
    es: {
        brand: 'CryptoSignals Pro',
        nav_features: 'Características',
        nav_how: 'Cómo Funciona',
        nav_pricing: 'Precios',
        nav_faq: 'Preguntas Frecuentes',
        get_started: 'Comenzar',
        hero_title: 'Señales Profesionales de Trading de Criptomonedas',
        hero_subtitle: 'Utilice algoritmos avanzados y datos de mercado en tiempo real para obtener señales precisas',
        try_now: 'Pruébalo Ahora',
        learn_more: 'Más Información',
        // ... otras traducciones al español
    },
    fr: {
        brand: 'CryptoSignals Pro',
        nav_features: 'Fonctionnalités',
        nav_how: 'Comment ça marche',
        nav_pricing: 'Tarifs',
        nav_faq: 'FAQ',
        get_started: 'Commencer',
        hero_title: 'Signaux Professionnels de Trading Crypto',
        hero_subtitle: 'Utilisez des algorithmes avancés et des données de marché en temps réel pour des signaux précis',
        try_now: 'Essayer Maintenant',
        learn_more: 'En Savoir Plus',
        // ... autres traductions françaises
    },
    ja: {
        brand: 'CryptoSignals Pro',
        nav_features: '機能',
        nav_how: '使い方',
        nav_pricing: '料金',
        nav_faq: 'よくある質問',
        get_started: '始める',
        hero_title: 'プロフェッショナルな暗号資産取引シグナル',
        hero_subtitle: '高度なアルゴリズムとリアルタイム市場データを活用した正確な取引シグナル',
        try_now: '今すぐ試す',
        learn_more: '詳細を見る',
        // ... その他の日本語訳
    },
    ko: {
        brand: 'CryptoSignals Pro',
        nav_features: '기능',
        nav_how: '이용 방법',
        nav_pricing: '가격',
        nav_faq: '자주 묻는 질문',
        get_started: '시작하기',
        hero_title: '전문적인 암호화폐 거래 신호',
        hero_subtitle: '고급 알고리즘과 실시간 시장 데이터를 활용한 정확한 거래 신호',
        try_now: '지금 시작하기',
        learn_more: '자세히 알아보기',
        // ... 기타 한국어 번역
    }
};

// 语言切换功能
function setLanguage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    document.documentElement.lang = lang;
}

// 导出函数和翻译数据
export { setLanguage, translations };