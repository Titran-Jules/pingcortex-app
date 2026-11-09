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

export const formatDate = (value: string): string => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : DATE_FORMAT.format(date);
};

export const formatDateTime = (value: string): string => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : DATETIME_FORMAT.format(date);
};
