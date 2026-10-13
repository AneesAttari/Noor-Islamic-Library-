import React from 'react';
import { BookOpen, ShieldCheck, Search, Languages } from 'lucide-react';
import { AuthService } from '../services/auth';
import { useLanguage } from '../i18n/LanguageContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const isAdmin = AuthService.isAuthenticated();
  const { t, language, toggleLanguage, isUrdu } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 text-start group shrink-0 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-md bg-emerald-900 text-amber-100 flex items-center justify-center font-serif text-lg font-bold border border-amber-500/30 group-hover:bg-emerald-800 transition-colors shrink-0">
            ن
          </div>
          <div className="whitespace-nowrap">
            <span className="font-serif text-xl font-bold tracking-tight text-stone-900 group-hover:text-emerald-900 transition-colors">
              {t('brandName')}
            </span>
            <span className="hidden sm:inline-block ms-2 text-xs font-serif text-stone-500 tracking-wider">
              {t('brandTagline')}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => onNavigate('/')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-emerald-900 ${
              currentPath === '/' ? 'text-emerald-900 font-semibold' : ''
            }`}
          >
            {t('navHome')}
          </button>
          <button
            onClick={() => onNavigate('/library')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-emerald-900 ${
              currentPath.startsWith('/library') ? 'text-emerald-900 font-semibold' : ''
            }`}
          >
            {t('navCatalogue')}
          </button>
          <button
            onClick={() => onNavigate('/library?category=Hadith')}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-emerald-900"
          >
            {t('navHadith')}
          </button>
          <button
            onClick={() => onNavigate('/library?category=Aqeedah')}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-emerald-900"
          >
            {t('navAqeedah')}
          </button>
        </nav>

        {/* Zone 3: Primary Action & Language Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 hover:text-stone-900 transition-colors shrink-0 shadow-2xs"
            title={language === 'en' ? 'اردو میں دیکھیں' : 'Switch to English'}
          >
            <Languages className="w-3.5 h-3.5 text-emerald-800" />
            <span className={isUrdu ? 'font-sans' : 'font-arabic font-semibold'}>
              {t('switchLanguage')}
            </span>
          </button>

          <button
            onClick={() => onNavigate('/library')}
            className="p-2 text-stone-600 hover:text-emerald-900 transition-colors sm:hidden"
            title="Search Catalogue"
          >
            <Search className="w-5 h-5" />
          </button>

          {isAdmin ? (
            <button
              onClick={() => onNavigate('/admin')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                currentPath.startsWith('/admin')
                  ? 'bg-emerald-900 text-amber-100 border-emerald-900'
                  : 'bg-white text-emerald-900 border-emerald-800/40 hover:bg-emerald-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('navAdminPanel')}</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('/admin/login')}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-md hover:bg-stone-50 hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-500" />
              <span>{t('navAdminSignIn')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
