import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Download,
  Share2,
  Shield,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Book } from '../types/library';
import { LibraryDatabase } from '../services/database';
import { useLanguage } from '../i18n/LanguageContext';
import { PdfCoverPreview } from '../components/PdfCoverPreview';

interface BookDetailsPageProps {
  bookId: string;
  onNavigate: (path: string) => void;
}

export const BookDetailsPage: React.FC<BookDetailsPageProps> = ({ bookId, onNavigate }) => {
  const { t, isUrdu } = useLanguage();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScan, setShowScan] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await LibraryDatabase.getBookById(bookId, false);
        if (!data) {
          setError('The requested manuscript record is either unavailable or has not been published in the public catalogue.');
        } else {
          setBook(data);
        }
      } catch (err: any) {
        console.error('Error fetching book:', err);
        setError('An unexpected error occurred while retrieving manuscript metadata.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    if (!book || !book.allowDownload) return;
    const a = document.createElement('a');
    a.href = book.pdfUrl;
    a.download = `${book.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${Math.round(bytes / 1024)} KB`;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-stone-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="h-96 bg-stone-200 rounded-lg" />
          <div className="md:col-span-2 space-y-4">
            <div className="h-10 bg-stone-200 rounded w-3/4" />
            <div className="h-6 bg-stone-200 rounded w-1/2" />
            <div className="h-32 bg-stone-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-stone-400 mx-auto" />
        <h1 className="font-serif text-2xl font-semibold text-stone-800">
          {t('detailsUnavailable')}
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">{error}</p>
        <div className="pt-4">
          <button
            onClick={() => onNavigate('/library')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-900 text-amber-50 rounded text-xs font-medium hover:bg-emerald-800 transition-colors"
          >
            {isUrdu ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{t('detailsBack')}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back navigation */}
      <button
        onClick={() => onNavigate('/library')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-emerald-900 transition-colors"
      >
        {isUrdu ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span>{t('detailsBack')}</span>
      </button>

      {/* Main Bibliographic Presentation */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Left Column: Cover Presentation & Actions */}
        <div className="md:col-span-5 lg:col-span-4 space-y-6">
          <div className="aspect-[3/4] bg-[#F5F2EB] rounded-lg overflow-hidden border border-stone-300 shadow-sm relative">
            <PdfCoverPreview
              book={book}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5">
            <button
              onClick={() => onNavigate(`/read/${book.id}`)}
              className="w-full py-3 px-4 bg-emerald-900 hover:bg-emerald-800 text-amber-50 font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('detailsReadOnline')}</span>
            </button>

            {book.allowDownload ? (
              <button
                onClick={handleDownload}
                className="w-full py-2.5 px-4 bg-white hover:bg-stone-100 text-stone-800 font-medium text-xs rounded-md border border-stone-300 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('detailsDownloadPdf')} ({formatFileSize(book.fileSize)})</span>
              </button>
            ) : (
              <div className="p-2.5 bg-stone-100 rounded text-center text-[11px] text-stone-500 font-serif">
                {t('detailsDownloadRestricted')}
              </div>
            )}

            <button
              onClick={handleShare}
              className="w-full py-2 px-4 text-stone-600 hover:text-stone-900 text-xs rounded transition-colors flex items-center justify-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-emerald-700 font-medium">{t('detailsLinkCopied')}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{t('detailsShareLink')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Full Bibliographic Record */}
        <div className="md:col-span-7 lg:col-span-8 space-y-8 text-start">
          {/* Header & Titles */}
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
              <span className="font-semibold text-emerald-900">{book.category}</span>
              <span aria-hidden="true">·</span>
              <span>{book.language}</span>
              {book.eraOrYear && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{book.eraOrYear}</span>
                </>
              )}
            </div>

            {book.originalTitle && (
              <h2 dir="rtl" className="font-arabic text-2xl sm:text-3xl text-stone-900 font-bold mb-2">
                {book.originalTitle}
              </h2>
            )}

            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900">
              {book.title}
            </h1>

            <div className="mt-3 text-sm text-stone-700">
              <span className="font-medium">{t('detailsAuthor')}</span> {book.author}
              {book.originalAuthor && (
                <span dir="rtl" className="font-arabic text-stone-500 mx-2">
                  ({book.originalAuthor})
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="pt-6 border-t border-stone-300">
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900 mb-3">
              {t('detailsSynopsis')}
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed font-sans max-w-prose whitespace-pre-line">
              {book.description}
            </p>
          </div>

          {/* Accession Details Table (Definition List) */}
          <div className="pt-6 border-t border-stone-300">
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900 mb-4">
              {t('detailsTechnicalMetadata')}
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
              <div className="border-b border-stone-200 pb-2">
                <dt className="text-stone-500">{t('detailsAccessionId')}</dt>
                <dd className="font-mono tabular-nums text-stone-800 font-medium mt-0.5" dir="ltr">
                  MAK-{book.id.toUpperCase()}
                </dd>
              </div>

              <div className="border-b border-stone-200 pb-2">
                <dt className="text-stone-500">{t('detailsFormat')}</dt>
                <dd className="text-stone-800 font-medium mt-0.5">
                  Portable Document Format (PDF / A)
                </dd>
              </div>

              <div className="border-b border-stone-200 pb-2">
                <dt className="text-stone-500">{t('detailsVolumeSize')}</dt>
                <dd className="font-mono tabular-nums text-stone-800 font-medium mt-0.5" dir="ltr">
                  {formatFileSize(book.fileSize)}
                </dd>
              </div>

              <div className="border-b border-stone-200 pb-2">
                <dt className="text-stone-500">{t('detailsCataloguedPages')}</dt>
                <dd className="font-mono tabular-nums text-stone-800 font-medium mt-0.5" dir="ltr">
                  {book.pageCount ? `${book.pageCount} ${t('cardPages')}` : 'Complete Treatise'}
                </dd>
              </div>

              <div className="border-b border-stone-200 pb-2">
                <dt className="text-stone-500">{t('detailsProvenance')}</dt>
                <dd className="text-stone-800 font-medium mt-0.5">
                  {book.publisherOrManuscriptSource || 'Noor Historical Archive'}
                </dd>
              </div>

              <div className="border-b border-stone-200 pb-2">
                <dt className="text-stone-500">{t('detailsAccessProtocol')}</dt>
                <dd className="text-emerald-900 font-medium mt-0.5">
                  {t('detailsOpenAccessNotice')}
                </dd>
              </div>
            </dl>
          </div>

          {/* Archival Integrity Assurance */}
          <div className="p-4 bg-[#F4EFE6] border border-stone-300 rounded-md flex items-start gap-3 text-xs text-stone-600">
            <Shield className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <p>
              {t('detailsIntegrityNotice')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
