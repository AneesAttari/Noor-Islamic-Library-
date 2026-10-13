import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';
import { Book } from '../types/library';
import { LibraryDatabase } from '../services/database';
import { AuthService } from '../services/auth';
import { PdfReader } from '../components/PdfReader';
import { useLanguage } from '../i18n/LanguageContext';

interface ReaderPageProps {
  bookId: string;
  onNavigate: (path: string) => void;
}

export const ReaderPage: React.FC<ReaderPageProps> = ({ bookId, onNavigate }) => {
  const { t, isUrdu } = useLanguage();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRestrictedDraft, setIsRestrictedDraft] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      setIsRestrictedDraft(false);

      try {
        const isAdmin = AuthService.isAuthenticated();
        // Allow drafts only if admin
        const data = await LibraryDatabase.getBookById(bookId, isAdmin);

        if (!active) return;

        if (!data) {
          // Check if it exists as an unpublished draft
          const allBooks = await LibraryDatabase.getAllBooksAdmin();
          const draftMatch = allBooks.find((b) => b.id === bookId);

          if (draftMatch && !draftMatch.published && !isAdmin) {
            setIsRestrictedDraft(true);
            setError(t('readerRestrictedDraft'));
          } else {
            setError(t('detailsUnavailable'));
          }
        } else {
          setBook(data);
        }
      } catch (err: any) {
        if (!active) return;
        setError(err.message || 'Failed to retrieve manuscript document.');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchBook();
    return () => {
      active = false;
    };
  }, [bookId, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center text-stone-300 space-y-3 font-serif">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">{t('readerLoading')}</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-950 border border-stone-800 rounded-lg p-8 text-center space-y-4">
          {isRestrictedDraft ? (
            <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
          ) : (
            <AlertCircle className="w-12 h-12 text-stone-500 mx-auto" />
          )}

          <h2 className="font-serif text-xl font-bold text-stone-100">
            {isRestrictedDraft ? t('readerRestrictedTitle') : t('detailsUnavailable')}
          </h2>

          <p className="text-xs text-stone-400 leading-relaxed">{error}</p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              onClick={() => onNavigate('/library')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-stone-100 text-xs font-medium rounded transition-colors"
            >
              {isUrdu ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{t('readerReturnCatalogue')}</span>
            </button>

            {isRestrictedDraft && (
              <button
                onClick={() => onNavigate('/admin/login')}
                className="w-full sm:w-auto px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded transition-colors"
              >
                {t('readerSignInAdmin')}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <PdfReader book={book} onBack={() => onNavigate(`/books/${book.id}`)} />;
};
