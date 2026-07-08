import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a Google Drive share URL into a direct embeddable image URL.
 * Supports formats like:
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * 
 * Returns the original URL if it doesn't match Google Drive patterns.
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return url;
  
  // Extract file ID from various Google Drive URL formats
  let fileId: string | null = null;
  
  // Format: https://drive.google.com/file/d/FILE_ID/view
  const filePattern = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const fileMatch = url.match(filePattern);
  if (fileMatch) {
    fileId = fileMatch[1];
  }
  
  // Format: https://drive.google.com/open?id=FILE_ID
  if (!fileId) {
    const openPattern = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;
    const openMatch = url.match(openPattern);
    if (openMatch) {
      fileId = openMatch[1];
    }
  }
  
  // Format: https://drive.google.com/uc?id=FILE_ID
  if (!fileId) {
    const ucPattern = /drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/;
    const ucMatch = url.match(ucPattern);
    if (ucMatch) {
      fileId = ucMatch[1];
    }
  }
  
  if (fileId) {
    // Use the direct image serving URL
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  return url;
}
