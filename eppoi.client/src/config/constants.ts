/**
 * Application constants and configuration
 */

/** Base URL for the Eppoi API and media resources */
export const EPPOI_BASE_URL = 'https://eppoi.io';

/**
 * Builds a full URL for media resources
 * @param path - The media path (should start with /)
 * @returns Full media URL
 */
export const getMediaUrl = (path: string): string => {
  if (!path) return '';
  // If path already contains the full URL, return it as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${EPPOI_BASE_URL}${normalizedPath}`;
};