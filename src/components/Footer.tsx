import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#F4EFE6] border-t border-stone-300 text-stone-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-stone-900">
                {t('brandName')}
              </span>
              <span className="text-xs font-serif text-stone-500">· {t('brandTagline')}</span>
            </div>
            <p className="text-sm text-stone-600 max-w-md leading-relaxed">
              {t('footerAboutText')}
            </p>
            <div className="text-xs text-stone-500 pt-1 font-serif">
              <span>Al-Qur’an · Al-Hadith · Al-Fiqh · Al-Aqeedah · Al-Lughah</span>
            </div>
          </div>

          {/* Core Sections */}
          <div>
            <h4 className="font-serif text-xs font-semibold uppercase tracking-widest text-stone-900 mb-3">
              {t('footerCatalogueKicker')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/library')}
                  className="hover:text-emerald-900 transition-colors"
                >
                  {t('homeBrowseFull')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/library?category=Hadith')}
                  className="hover:text-emerald-900 transition-colors"
                >
                  {t('catHadith')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/library?category=Aqeedah')}
                  className="hover:text-emerald-900 transition-colors"
                >
                  {t('catAqeedah')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/library?category=Ethics & Tazkiyah')}
                  className="hover:text-emerald-900 transition-colors"
                >
                  {t('catEthics')}
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional Governance */}
          <div>
            <h4 className="font-serif text-xs font-semibold uppercase tracking-widest text-stone-900 mb-3">
              {t('footerAdminKicker')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/admin/login')}
                  className="hover:text-emerald-900 transition-colors"
                >
                  {t('adminLoginTitle')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="hover:text-emerald-900 transition-colors"
                >
                  {t('navAdminPanel')}
                </button>
              </li>
              <li className="pt-2 text-xs text-stone-500">
                <span>{t('detailsOpenAccessNotice')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom hairline & copyright */}
        <div className="pt-6 border-t border-stone-300/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} {t('footerCopyright')}</p>
          <div className="flex items-center gap-4">
            <span>{t('footerStandardsNotice')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
