import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Book } from '../types/library';
import { useLanguage } from '../i18n/LanguageContext';

import { PdfCoverPreview } from './PdfCoverPreview';

interface BookCardProps {
  book: Book;
  onSelect: (bookId: string) => void;
  onRead: (bookId: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onSelect, onRead }) => {
  const { t } = useLanguage();

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${Math.round(bytes / 1024)} KB`;
  };

  return (
    <article className="group bg-[#FAF7F2] rounded-lg border border-stone-200/90 hover:border-emerald-800/40 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Cover presentation - Authentically showing the PDF hardcover presentation */}
      <div
        onClick={() => onSelect(book.id)}
        className="cursor-pointer relative aspect-[3/4] bg-[#0E2820] overflow-hidden border-b border-stone-200/90 shadow-inner"
      >
        <PdfCoverPreview
          book={book}
          className="w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-300"
        />

        {/* Realistic Hardcover Spine Groove & Shadow on Left */}
        <div className="absolute inset-y-0 start-0 w-3.5 bg-gradient-to-r from-black/45 via-black/15 to-transparent pointer-events-none" />
        {/* Right Outer Book Edge Highlight */}
        <div className="absolute inset-y-0 end-0 w-1 bg-gradient-to-l from-black/25 to-transparent pointer-events-none" />

        {/* Quick Read Overlay Icon on Hover */}
        <div className="absolute inset-0 bg-emerald-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-emerald-900 text-xs font-semibold px-3 py-1.5 rounded shadow-md flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> {t('cardReadOnline')}
          </span>
        </div>
      </div>

      {/* Content description */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Zero-Pill Clean Metadata with Typographic Separators */}
          <div className="flex items-center flex-wrap gap-1 text-xs text-stone-500 mb-2">
            <span className="font-medium text-emerald-800">{book.category}</span>
            <span aria-hidden="true">·</span>
            <span>{book.language}</span>
            {book.pageCount && (
              <>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{book.pageCount} {t('cardPages')}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h2
            onClick={() => onSelect(book.id)}
            className="font-serif text-lg font-bold text-stone-900 group-hover:text-emerald-900 transition-colors line-clamp-2 cursor-pointer"
          >
            {book.title}
          </h2>

          {/* Author */}
          <p className="text-xs text-stone-600 mt-1 font-medium line-clamp-1">
            {book.author}
          </p>

          {/* Description snippet */}
          <p className="text-xs text-stone-600/90 mt-2.5 line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        </div>

        {/* Action ribbon */}
        <div className="pt-4 mt-4 border-t border-stone-200/80 flex items-center justify-between gap-2">
          <span className="text-[11px] text-stone-500 tabular-nums">
            {formatFileSize(book.fileSize)}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelect(book.id)}
              className="text-xs font-medium text-stone-700 hover:text-stone-900 px-2 py-1 transition-colors"
            >
              {t('cardDetails')}
            </button>
            <button
              onClick={() => onRead(book.id)}
              className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-900 text-amber-50 hover:bg-emerald-800 px-3 py-1.5 rounded transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('cardRead')}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
