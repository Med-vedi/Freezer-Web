import { format, differenceInDays, isBefore, startOfDay } from 'date-fns';
import { ExpiryStatus } from '../types/product';

export const formatDate = (date: string | Date, formatString: string = 'dd.MM.yyyy') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatString);
};

export const formatDateTime = (date: string | Date) => {
    return formatDate(date, 'dd.MM.yyyy HH:mm');
};

export const getExpiryStatus = (expiryDate: string | null | undefined): ExpiryStatus => {
    if (!expiryDate) return 'good';

    const today = startOfDay(new Date());
    const expiry = startOfDay(new Date(expiryDate));
    const daysUntilExpiry = differenceInDays(expiry, today);

    if (daysUntilExpiry < 0) return 'danger';
    if (daysUntilExpiry <= 3) return 'danger';
    if (daysUntilExpiry <= 7) return 'warning';
    return 'good';
};

export const getDaysUntilExpiry = (expiryDate: string | null | undefined): number => {
    if (!expiryDate) return 999;

    const today = startOfDay(new Date());
    const expiry = startOfDay(new Date(expiryDate));
    return differenceInDays(expiry, today);
};

export const isExpired = (expiryDate: string | null | undefined): boolean => {
    if (!expiryDate) return false;
    return isBefore(new Date(expiryDate), new Date());
};

export const isExpiringSoon = (expiryDate: string | null | undefined, days: number = 7): boolean => {
    if (!expiryDate) return false;
    const today = startOfDay(new Date());
    const expiry = startOfDay(new Date(expiryDate));
    const daysUntilExpiry = differenceInDays(expiry, today);
    return daysUntilExpiry >= 0 && daysUntilExpiry <= days;
};

export const getExpiryText = (expiryDate: string | null | undefined): string => {
    if (!expiryDate) return 'No expiry date';

    const days = getDaysUntilExpiry(expiryDate);

    if (days < 0) return 'Expired';
    if (days === 0) return 'Expires today';
    if (days === 1) return 'Expires tomorrow';
    return `${days} days`;
};
