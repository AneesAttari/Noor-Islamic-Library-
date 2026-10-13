import React, { useEffect, useState, useMemo } from 'react';
import { Search, RotateCcw, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Book, BookCategory, BookLanguage } from '../types/library';
import { LibraryDatabase } from '../services/database';
import { BookCard } from '../components/BookCard';
import { useLanguage } from '../i18n/LanguageContext';

interface LibraryPageProps {
  initialCategory?: string;
  initialSearch?: string;
  onNavigate: (path: string) => void;
}

const CATEGORY_KEYS: { name: BookCategory | 'All'; key: string }[] = [
  { name: 'All', key: 'catAll' },
  { name: 'Hadith', key: 'catHadith' },
  { name: 'Aqeedah', key: 'catAqeedah' },
  { name: 'Fiqh', key: 'catFiqh' },
  { name: 'Tafsir', key: 'catTafsir' },
  { name: 'Arabic Language', key: 'catArabicLanguage' },
  { name: 'Ethics & Tazkiyah', key: 'catEthics' },
  { name: 'Usul al-Fiqh', key: 'catUsul' },
  { name: 'Seerah', key: 'catSeerah' },
];

const LANGUAGE_OPTIONS: (BookLanguage | 'All')[] = [
  'All',
  'Arabic',
  'English',
  'Arabic / English',
  'Urdu',
];

const ITEMS_PER_PAGE = 12;

export const LibraryPage: React.FC<LibraryPageProps> = ({
  initialCategory,
  initialSearch,
  onNavigate,
}) => {
  const { t, isUrdu } = useLanguage();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'All'>(
    (initialCategory as BookCategory) || 'All'
  );
  const [selectedLanguage, setSelectedLanguage] = useState<BookLanguage | 'All'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'title' | 'author' | 'era'>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Sync props when user navigates with query parameters
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory as BookCategory);
    }
    if (initialSearch !== undefined) {
      setSearchQuery(initialSearch);
    }
  }, [initialCategory, initialSearch]);

  // Load books
  useEffect(() => {
    const fetchCatalogue = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await LibraryDatabase.getPublishedBooks({
          searchQuery,
          category: selectedCategory,
          language: selectedLanguage,
          sortBy,
        });
        setBooks(data);
        setCurrentPage(1); // Reset to page 1 on filter changes
      } catch (err: any) {
        console.error('Failed to fetch catalogue:', err);
        setError('Unable to load catalogue records. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogue();
  }, [searchQuery, selectedCategory, selectedLanguage, sortBy]);

  // Pagination calculations
  const totalItems = books.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return books.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [books, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLanguage('All');
    setSortBy('newest');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Scope */}
      <div className="border-b border-stone-300 pb-6">
        <span className="text-xs uppercase tracking-widest font-serif text-emerald-900 font-semibold">
          {t('catalogueKicker')}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 mt-1">
          {t('catalogueTitle')}
        </h1>
        <p className="text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
          {t('catalogueDesc')}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#FAF7F2] p-5 rounded-lg border border-stone-300 space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute start-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full ps-11 pe-4 py-2.5 bg-white border border-stone-300 rounded-md text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
          />
        </div>

        {/* Category Segmented Buttons */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            {t('filterDiscipline')}
          </div>
          <div className="flex items-center flex-wrap gap-1.5">
            {CATEGORY_KEYS.map((cat) => {
              const active = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-emerald-900 text-amber-50 shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  {t(cat.key as any)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filters: Language and Sorting */}
        <div className="pt-3 border-t border-stone-300/70 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Language filter */}
            <div className="flex items-center gap-2">
              <span className="text-stone-600 font-medium">{t('filterLanguage')}</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as any)}
                className="bg-white border border-stone-300 rounded px-2.5 py-1 text-stone-800 focus:outline-none focus:border-emerald-800 text-xs"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang === 'All' ? t('catAll') : lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <span className="text-stone-600 font-medium">{t('filterSortBy')}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-stone-300 rounded px-2.5 py-1 text-stone-800 focus:outline-none focus:border-emerald-800 text-xs"
              >
                <option value="newest">{t('sortNewest')}</option>
                <option value="title">{t('sortTitle')}</option>
                <option value="author">{t('sortAuthor')}</option>
                <option value="era">{t('sortEra')}</option>
              </select>
            </div>
          </div>

          {/* Reset Filters */}
          {(searchQuery || selectedCategory !== 'All' || selectedLanguage !== 'All' || sortBy !== 'newest') && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-stone-600 hover:text-stone-900 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('filterReset')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Result Count Status */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <div>
          {t('resultsShowing')}{' '}
          <span className="font-mono tabular-nums font-semibold text-stone-800">{totalItems}</span>
          {selectedCategory !== 'All' && <span> {t('resultsIn')} <strong className="text-emerald-900">{selectedCategory}</strong></span>}
          {searchQuery && <span> {t('resultsMatching')} &ldquo;{searchQuery}&rdquo;</span>}
        </div>
        {totalPages > 1 && (
          <div className="font-mono tabular-nums" dir="ltr">
            {currentPage} / {totalPages}
          </div>
        )}
      </div>

      {/* Books Grid / Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 bg-stone-200/60 rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50/60 border border-red-200 rounded-lg text-center text-red-800 space-y-2">
          <p className="font-serif text-base">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs underline text-red-900 hover:text-red-700"
          >
            Retry Loading Catalogue
          </button>
        </div>
      ) : paginatedBooks.length === 0 ? (
        <div className="py-20 px-6 bg-[#FAF7F2] border border-stone-300 rounded-lg text-center max-w-lg mx-auto space-y-4">
          <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-serif text-lg font-semibold text-stone-800">
            {t('noBooksFound')}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {t('noBooksFoundDesc')}
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-900 text-amber-50 rounded text-xs font-medium hover:bg-emerald-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('filterReset')}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onSelect={(id) => onNavigate(`/books/${id}`)}
              onRead={(id) => onNavigate(`/read/${id}`)}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-8 border-t border-stone-300 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded border border-stone-300 bg-white text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
          >
            {isUrdu ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            <span>{t('paginationPrev')}</span>
          </button>

          <div className="flex items-center gap-1" dir="ltr">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded text-xs font-medium font-mono tabular-nums transition-colors ${
                  currentPage === pageNum
                    ? 'bg-emerald-900 text-amber-50'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded border border-stone-300 bg-white text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
          >
            <span>{t('paginationNext')}</span>
            {isUrdu ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
};
