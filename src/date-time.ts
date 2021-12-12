export const formatDateTime = (dateObj: Date): string => dateObj.toISOString();

export const formatDate = (dateObj: Date): string => {
    const year = String(dateObj.getUTCFullYear());
    const month = String(dateObj.getUTCMonth() + 1);
    const date = String(dateObj.getUTCDate());
    return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${date.padStart(
        2,
        "0"
    )}`;
};
