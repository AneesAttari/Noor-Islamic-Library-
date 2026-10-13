/**
 * Core domain types for Maktaba Islamic Digital Library
 */

export type BookCategory =
  | 'Aqeedah'
  | 'Fiqh'
  | 'Hadith'
  | 'Tafsir'
  | 'Seerah'
  | 'Arabic Language'
  | 'Islamic History'
  | 'Usul al-Fiqh'
  | 'Ethics & Tazkiyah';

export type BookLanguage =
  | 'Arabic'
  | 'English'
  | 'Arabic / English'
  | 'Urdu';

export interface Book {
  id: string;
  title: string;
  originalTitle?: string; // Arabic script title (e.g. رياض الصالحين)
  author: string;
  originalAuthor?: string; // Arabic script author (e.g. الإمام يحيى بن شرف النووي)
  description: string;
  category: BookCategory;
  language: BookLanguage;
  coverUrl?: string; // Custom cover URL, Data URL, or Object URL
  coverStorageKey?: string; // Persistent IndexedDB key for cover image
  pdfUrl: string; // PDF link or Object URL
  pdfStorageKey?: string; // Persistent IndexedDB key for PDF binary blob
  fileSize: number; // in bytes
  pageCount?: number;
  published: boolean; // draft vs published
  allowDownload: boolean;
  eraOrYear?: string; // e.g. "676 AH / 1277 CE"
  publisherOrManuscriptSource?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  isSampleData?: boolean;
}

export interface LibraryStats {
  totalBooks: number;
  publishedBooks: number;
  draftBooks: number;
  totalCategories: number;
  totalVolumeBytes: number;
}

export interface FilterOptions {
  searchQuery?: string;
  category?: BookCategory | 'All';
  language?: BookLanguage | 'All';
  sortBy?: 'newest' | 'title' | 'author' | 'era';
  status?: 'all' | 'published' | 'draft';
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'super_admin' | 'librarian';
  lastLogin: string;
}
