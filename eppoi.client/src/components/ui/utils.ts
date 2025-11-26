import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface JwtPayload {
  Name: string;
  Email: string;
  UserName: string;
  exp?: number;
  iss?: string;
}

/**
 * Decode a JWT token and extracts the payload
 * @param token Token
 * @returns Object with Name, Email, UserName claims
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Token JWT non valido: deve contenere 3 parti');
      return null;
    }

    const payload = parts[1];

    // Replace base64 URL-safe characters
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));

    const parsedPayload = JSON.parse(decoded) as JwtPayload;
    return parsedPayload;
  } catch (error) {
    console.error('Errore nella decodifica del JWT:', error);
    return null;
  }
}
