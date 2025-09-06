import i18n from 'i18next';

export const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
};

export const getCurrentLanguage = () => {
    return i18n.language;
};

export const getAvailableLanguages = () => {
    return [
        { code: 'en', name: 'English' },
        { code: 'ru', name: 'Русский' },
        { code: 'it', name: 'Italiano' },
    ];
};

export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(getCurrentLanguage(), options);
};

export const formatDateTime = (date: string | Date) => {
    return formatDate(date, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
