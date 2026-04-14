import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: string | Date) =>
  new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));

export const formatShortDate = (date: string | Date) =>
  new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).format(new Date(date));

export const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max)}...` : text;

export const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
