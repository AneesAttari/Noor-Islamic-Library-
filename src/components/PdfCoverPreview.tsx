import React, { useEffect, useState } from 'react';
import { extractFirstPageThumbnail } from '../utils/pdfThumbnail';
import { Book } from '../types/library';

interface PdfCoverPreviewProps {
  book: Book;
  className?: string;
  onThumbnailGenerated?: (dataUrl: string) => void;
}

export const PdfCoverPreview: React.FC<PdfCoverPreviewProps> = ({
  book,
  className = 'w-full h-full object-cover',
  onThumbnailGenerated,
}) => {
  const [renderedUrl, setRenderedUrl] = useState<string | null>(book.coverUrl || null);
  const [loading, setLoading] = useState<boolean>(!book.coverUrl && Boolean(book.pdfUrl));
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    // If coverUrl is provided and valid, use it
    if (book.coverUrl && !book.coverUrl.startsWith('blob:null')) {
      setRenderedUrl(book.coverUrl);
      setLoading(false);
      setHasError(false);
      return;
    }

    // If no coverUrl, but pdfUrl exists, extract page 1 thumbnail
    if (book.pdfUrl) {
      let isMounted = true;
      setLoading(true);
      setHasError(false);

      extractFirstPageThumbnail(book.pdfUrl, `book_${book.id}_cover`)
        .then((result) => {
          if (!isMounted) return;
          setRenderedUrl(result.dataUrl);
          setLoading(false);
          if (onThumbnailGenerated) {
            onThumbnailGenerated(result.dataUrl);
          }
        })
        .catch((err) => {
          if (!isMounted) return;
          console.warn('Could not extract PDF first page thumbnail for book:', book.id, err);
          setHasError(true);
          setLoading(false);
        });

      return () => {
        isMounted = false;
      };
    } else {
      setLoading(false);
      setHasError(true);
    }
  }, [book.id, book.coverUrl, book.pdfUrl, onThumbnailGenerated]);

  if (renderedUrl && !hasError) {
    return (
      <img
        src={renderedUrl}
        alt={`Cover of ${book.title}`}
        className={className}
        loading="lazy"
        onError={() => {
          // If image fails, retry extracting from PDF once
          if (book.pdfUrl && renderedUrl !== book.coverUrl) {
            setHasError(true);
          } else if (book.pdfUrl) {
            setLoading(true);
            extractFirstPageThumbnail(book.pdfUrl, `book_${book.id}_retry`)
              .then((res) => {
                setRenderedUrl(res.dataUrl);
                setLoading(false);
              })
              .catch(() => {
                setHasError(true);
                setLoading(false);
              });
          } else {
            setHasError(true);
          }
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full bg-[#F5F2EB] flex flex-col items-center justify-center p-4 border border-stone-200 animate-pulse">
        <div className="w-12 h-16 bg-stone-300/60 rounded shadow-xs mb-3" />
        <div className="w-24 h-2.5 bg-stone-300/80 rounded mb-1.5" />
        <div className="w-16 h-2 bg-stone-200/80 rounded" />
        <span className="text-[10px] text-stone-500 font-serif mt-3 tracking-wide">
          Rendering First Page...
        </span>
      </div>
    );
  }

  // Fallback / Standby presentation: Luxury Islamic leatherbound hardcover with gold ornaments
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'Tafsir':
        return { bg: 'bg-[#08281E]', border: 'border-amber-400/40', text: 'text-amber-100', accent: 'text-amber-300' };
      case 'Hadith':
        return { bg: 'bg-[#0A2136]', border: 'border-amber-400/40', text: 'text-amber-100', accent: 'text-amber-300' };
      case 'Aqeedah':
        return { bg: 'bg-[#141732]', border: 'border-amber-400/40', text: 'text-amber-100', accent: 'text-amber-300' };
      case 'Fiqh':
        return { bg: 'bg-[#370E16]', border: 'border-amber-400/40', text: 'text-amber-100', accent: 'text-amber-300' };
      case 'Usul al-Fiqh':
        return { bg: 'bg-[#0F2F23]', border: 'border-amber-400/40', text: 'text-amber-100', accent: 'text-amber-300' };
      case 'Arabic Language':
        return { bg: 'bg-[#0B2936]', border: 'border-amber-400/40', text: 'text-amber-100', accent: 'text-amber-300' };
      case 'Seerah':
        return { bg: 'bg-[#361D0C]', border: 'border-amber-400/40', text: 'text-amber-100', accent: 'text-amber-300' };
      case 'Islamic History':
        return { bg: 'bg-[#2E1520]', border: 'border-amber-400/40', text: 'text-amber-100', accent: 'text-amber-300' };
      case 'Ethics & Tazkiyah':
      default:
        return { bg: 'bg-[#0F2C2C]', border: 'border-amber-400/40', text: 'text-amber-100', accent: 'text-amber-300' };
    }
  };

  const theme = getCategoryTheme(book.category);

  return (
    <div
      className={`w-full h-full p-4 flex flex-col justify-between ${theme.bg} select-none relative shadow-inner overflow-hidden text-amber-50`}
      dir="ltr"
    >
      {/* Outer & inner gold fillet borders */}
      <div className={`absolute inset-2 border ${theme.border} pointer-events-none rounded-xs`} />
      <div className={`absolute inset-3 border border-amber-300/20 pointer-events-none`} />

      {/* Top Header & Noor Seal */}
      <div className="relative z-10 text-center pt-2">
        <span className="font-arabic text-[12px] text-amber-300 font-bold block">
          نُور - المَكْتَبَةُ الإِسْلَامِيَّة
        </span>
        <span className="font-serif text-[9px] uppercase tracking-widest text-amber-200/80 font-semibold block mt-0.5">
          {book.category}
        </span>
        <div className="w-8 h-px bg-amber-400/30 mx-auto mt-1.5" />
      </div>

      {/* Center Illuminated Title Medallion */}
      <div className="relative z-10 text-center my-auto py-2 px-1">
        <div className="py-3 px-2 border border-amber-400/30 rounded bg-black/20 backdrop-blur-xs">
          {book.originalTitle && (
            <p
              dir="rtl"
              className="font-arabic text-base sm:text-lg font-bold text-amber-200 leading-relaxed line-clamp-2 mb-1 drop-shadow-xs"
            >
              {book.originalTitle}
            </p>
          )}
          <h3 className="font-serif text-xs sm:text-sm font-semibold text-white leading-snug line-clamp-2">
            {book.title}
          </h3>
        </div>
      </div>

      {/* Author & Footer */}
      <div className="relative z-10 text-center pb-2 border-t border-amber-400/25 pt-2">
        <p className="text-[11px] text-amber-200/90 font-medium line-clamp-1">{book.author}</p>
        <p className="text-[9px] text-amber-300/60 mt-0.5 font-serif uppercase tracking-wider">
          NOOR ARCHIVE · WAQF
        </p>
      </div>
    </div>
  );
};
