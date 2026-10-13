import React, { useEffect, useState } from 'react';
import { Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { Book, BookCategory } from '../types/library';
import { LibraryDatabase } from '../services/database';
import { BookCard } from '../components/BookCard';
import { useLanguage } from '../i18n/LanguageContext';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t, isUrdu } = useLanguage();
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const categoriesConfig: { name: BookCategory; labelKey: any; descKey: any; arabicScript: string }[] = [
    {
      name: 'Hadith',
      labelKey: 'catHadith',
      descKey: 'catHadithDesc',
      arabicScript: 'الحديث الشريف',
    },
    {
      name: 'Aqeedah',
      labelKey: 'catAqeedah',
      descKey: 'catAqeedahDesc',
      arabicScript: 'العقيدة والتوحيد',
    },
    {
      name: 'Fiqh',
      labelKey: 'catFiqh',
      descKey: 'catFiqhDesc',
      arabicScript: 'الفقه الإسلامي',
    },
    {
      name: 'Tafsir',
      labelKey: 'catTafsir',
      descKey: 'catTafsirDesc',
      arabicScript: 'التفسير وعلوم القرآن',
    },
    {
      name: 'Arabic Language',
      labelKey: 'catArabicLanguage',
      descKey: 'catArabicDesc',
      arabicScript: 'علوم اللغة العربية',
    },
    {
      name: 'Ethics & Tazkiyah',
      labelKey: 'catEthics',
      descKey: 'catEthicsDesc',
      arabicScript: 'الآداب والتزكية',
    },
    {
      name: 'Usul al-Fiqh',
      labelKey: 'catUsul',
      descKey: 'catUsulDesc',
      arabicScript: 'أصول الفقه',
    },
    {
      name: 'Seerah',
      labelKey: 'catSeerah',
      descKey: 'catSeerahDesc',
      arabicScript: 'السيرة النبوية',
    },
  ];

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const books = await LibraryDatabase.getPublishedBooks();
        setFeaturedBooks(books.slice(0, 3));
        setRecentBooks(books.length > 3 ? books.slice(3, 7) : books);
      } catch (err) {
        console.error('Failed to load books for home:', err);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/library?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      onNavigate('/library');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Editorial Academic Header & Search */}
      <section className="pt-8 sm:pt-14 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Curatorial Kicker */}
          <div className="flex items-center gap-2 text-xs font-serif text-emerald-900 tracking-widest uppercase mb-3">
            <span>{t('homeArchiveKicker')}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-stone-900 tracking-tight leading-[1.2] text-balance">
            {t('homeHeroTitle')}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed font-sans max-w-2xl">
            {t('homeHeroDesc')}
          </p>

          {/* Prominent Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-8 flex items-stretch gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute start-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full ps-11 pe-4 py-3 bg-white border border-stone-300 rounded-md text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 transition-all shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-emerald-900 hover:bg-emerald-800 text-amber-50 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              {t('searchArchiveBtn')}
            </button>
          </form>

          {/* Quick subject suggestions */}
          <div className="mt-3 flex items-center flex-wrap gap-2 text-xs text-stone-500">
            <span className="font-medium text-stone-700">{t('quickExplore')}</span>
            <button
              onClick={() => onNavigate('/library?category=Hadith')}
              className="hover:text-emerald-900 underline underline-offset-2"
            >
              {t('catHadith')}
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('/library?category=Aqeedah')}
              className="hover:text-emerald-900 underline underline-offset-2"
            >
              {t('catAqeedah')}
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('/library?category=Arabic Language')}
              className="hover:text-emerald-900 underline underline-offset-2"
            >
              {t('catArabicLanguage')}
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('/library?category=Ethics & Tazkiyah')}
              className="hover:text-emerald-900 underline underline-offset-2"
            >
              {t('catEthics')}
            </button>
          </div>
        </div>
      </section>

      {/* Featured Scholarly Editions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-stone-300 pb-3 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-serif text-emerald-900 font-semibold">
              {t('homeFeaturedKicker')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 mt-1">
              {t('homeFeaturedTitle')}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/library')}
            className="text-xs font-semibold text-emerald-900 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            <span>{t('homeBrowseFull')}</span>
            {isUrdu ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-stone-200/60 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onSelect={(id) => onNavigate(`/books/${id}`)}
                onRead={(id) => onNavigate(`/read/${id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Category Disciplines Grid */}
      <section className="bg-[#F4EFE6] border-y border-stone-300/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="text-xs uppercase tracking-widest font-serif text-emerald-900 font-semibold">
              {t('homeClassificationKicker')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 mt-1">
              {t('homeClassificationTitle')}
            </h2>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              {t('homeClassificationDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoriesConfig.map((cat) => (
              <div
                key={cat.name}
                onClick={() => onNavigate(`/library?category=${encodeURIComponent(cat.name)}`)}
                className="group cursor-pointer bg-[#FBF9F5] p-5 rounded-md border border-stone-300/80 hover:border-emerald-800/60 hover:shadow-sm transition-all text-start"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-serif text-base font-semibold text-stone-900 group-hover:text-emerald-900 transition-colors">
                    {t(cat.labelKey)}
                  </h3>
                  <span dir="rtl" className="font-arabic text-sm text-stone-500 group-hover:text-emerald-800 transition-colors">
                    {cat.arabicScript}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">{t(cat.descKey)}</p>
                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 group-hover:text-emerald-900">
                  <span>{cat.name}</span>
                  {isUrdu ? (
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                  ) : (
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Catalogued Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-stone-300 pb-3 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-serif text-emerald-900 font-semibold">
              {t('homeRecentKicker')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 mt-1">
              {t('homeRecentTitle')}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/library')}
            className="text-xs font-semibold text-emerald-900 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            <span>{t('homeViewAll')}</span>
            {isUrdu ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recentBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onSelect={(id) => onNavigate(`/books/${id}`)}
              onRead={(id) => onNavigate(`/read/${id}`)}
            />
          ))}
        </div>
      </section>

      {/* Preservation Philosophy & Archival Standards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-stone-100 rounded-lg p-8 sm:p-12 relative overflow-hidden border border-stone-800">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="text-xs uppercase tracking-widest font-serif text-amber-400 font-semibold">
              {t('homeCharterKicker')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-100">
              {t('homeCharterTitle')}
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              {t('homeCharterDesc')}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-stone-400 font-serif">
              <span>· Zero Paywalls</span>
              <span>· Authentic Manuscripts</span>
              <span>· W3C Compliant Access</span>
              <span>· Academic PDF.js Engine</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
