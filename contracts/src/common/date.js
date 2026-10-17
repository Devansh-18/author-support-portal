/**
 * Validates whether a date string is formatted as YYYY-MM-DD.
 *
 * @param {string} str
 * @returns {boolean}
 */
export function isValidDateString(str) {
  if (typeof str !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(str)) return false;

  const [year, month, day] = str.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * Parses a date string (YYYY-MM-DD or ISO 8601) into a strict UTC Date object.
 * Avoids any local timezone skew by explicitly setting UTC components.
 *
 * @param {string | Date | null | undefined} dateInput
 * @returns {Date | null}
 */
export function parseDateStringToUTC(dateInput) {
  if (dateInput === null || dateInput === undefined || dateInput === '') {
    return null;
  }

  if (dateInput instanceof Date) {
    if (isNaN(dateInput.getTime())) {
      throw new Error(`Invalid Date instance provided`);
    }
    return dateInput;
  }

  if (typeof dateInput !== 'string') {
    throw new Error(`Date input must be a string or Date instance. Received: ${typeof dateInput}`);
  }

  const trimmed = dateInput.trim();

  // Handle YYYY-MM-DD format strictly in UTC midnight
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    if (!isValidDateString(trimmed)) {
      throw new Error(`Invalid calendar date string provided: ${trimmed}`);
    }
    const [year, month, day] = trimmed.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  }

  // Handle ISO 8601 format
  const parsedTimestamp = Date.parse(trimmed);
  if (isNaN(parsedTimestamp)) {
    throw new Error(`Invalid date format. Expected YYYY-MM-DD or ISO-8601 string. Received: ${trimmed}`);
  }

  return new Date(parsedTimestamp);
}

/**
 * Formats a Date object into a YYYY-MM-DD string using UTC components.
 * Prevents local timezone day shifting.
 *
 * @param {Date | null | undefined} date
 * @returns {string | null}
 */
export function formatDateToUTCString(date) {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid Date provided for formatting');
  }

  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Formats a Date object into an ISO 8601 UTC string.
 *
 * @param {Date | null | undefined} date
 * @returns {string | null}
 */
export function formatDateToISOString(date) {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid Date provided for formatting');
  }
  return d.toISOString();
}
