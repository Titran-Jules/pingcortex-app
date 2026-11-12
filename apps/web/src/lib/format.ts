const DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
});

const DATETIME_FORMAT = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
});

const DAY_DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
});

const NUMBER_FORMAT = new Intl.NumberFormat('fr-FR');

export const formatNumber = (value: number): string => NUMBER_FORMAT.format(value);

export const formatDate = (value: string): string => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : DATE_FORMAT.format(date);
};

export const formatDateTime = (value: string): string => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : DATETIME_FORMAT.format(date);
};

export const formatDayDate = (value: string): string => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : DAY_DATE_FORMAT.format(date);
};
