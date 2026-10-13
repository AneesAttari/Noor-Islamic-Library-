/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/LibraryPage';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { ReaderPage } from './pages/ReaderPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminBookForm } from './pages/AdminBookForm';
import { AuthService } from './services/auth';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';

function AppContent() {
  const { t, isUrdu, dir } = useLanguage();

  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search;
    }
    return '/';
  });

  // Keep state synchronized with browser back/forward and pushState
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', to);
      setCurrentPath(to);
      window.scrollTo(0, 0);
    }
  };

  // Route parser
  const route = useMemo(() => {
    const [pathPart, queryPart] = currentPath.split('?');
    const searchParams = new URLSearchParams(queryPart || '');

    // 1. Home
    if (pathPart === '' || pathPart === '/') {
      return { type: 'home' as const };
    }

    // 2. Library
    if (pathPart === '/library') {
      return {
        type: 'library' as const,
        category: searchParams.get('category') || undefined,
        search: searchParams.get('q') || undefined,
      };
    }

    // 3. Reader: /read/:bookId
    const readMatch = pathPart.match(/^\/read\/([^/]+)$/);
    if (readMatch) {
      return {
        type: 'read' as const,
        bookId: readMatch[1],
      };
    }

    // 4. Book Details: /books/:bookId
    const bookMatch = pathPart.match(/^\/books\/([^/]+)$/);
    if (bookMatch) {
      return {
        type: 'book-details' as const,
        bookId: bookMatch[1],
      };
    }

    // 5. Admin Login: /admin/login
    if (pathPart === '/admin/login') {
      return { type: 'admin-login' as const };
    }

    // 6. Admin Add Book: /admin/books/new
    if (pathPart === '/admin/books/new') {
      return { type: 'admin-book-new' as const };
    }

    // 7. Admin Edit Book: /admin/books/:bookId/edit
    const editMatch = pathPart.match(/^\/admin\/books\/([^/]+)\/edit$/);
    if (editMatch) {
      return {
        type: 'admin-book-edit' as const,
        bookId: editMatch[1],
      };
    }

    // 8. Admin Dashboard: /admin
    if (pathPart === '/admin') {
      return { type: 'admin-dashboard' as const };
    }

    // 9. 404 Not Found
    return { type: 'not-found' as const, path: pathPart };
  }, [currentPath]);

  // Auth guard helper
  const renderProtectedRoute = (component: React.ReactNode) => {
    if (!AuthService.isAuthenticated()) {
      return (
        <AdminLoginPage
          onSuccess={() => navigate('/admin')}
          onNavigate={navigate}
        />
      );
    }
    return component;
  };

  // Dedicated full-screen reader view
  if (route.type === 'read') {
    return <ReaderPage bookId={route.bookId} onNavigate={navigate} />;
  }

  return (
    <div
      dir={dir}
      className={`min-h-screen flex flex-col bg-[#FBF9F5] text-stone-900 selection:bg-emerald-900 selection:text-amber-100 ${
        isUrdu ? 'font-urdu' : 'font-sans'
      }`}
    >
      <Navbar currentPath={currentPath} onNavigate={navigate} />

      <main className="flex-1">
        {route.type === 'home' && <HomePage onNavigate={navigate} />}

        {route.type === 'library' && (
          <LibraryPage
            initialCategory={route.category}
            initialSearch={route.search}
            onNavigate={navigate}
          />
        )}

        {route.type === 'book-details' && (
          <BookDetailsPage bookId={route.bookId} onNavigate={navigate} />
        )}

        {route.type === 'admin-login' && (
          <AdminLoginPage
            onSuccess={() => navigate('/admin')}
            onNavigate={navigate}
          />
        )}

        {route.type === 'admin-dashboard' &&
          renderProtectedRoute(
            <AdminDashboard
              onNavigate={navigate}
              onLogout={() => {
                AuthService.logout();
                navigate('/');
              }}
            />
          )}

        {route.type === 'admin-book-new' &&
          renderProtectedRoute(<AdminBookForm onNavigate={navigate} />)}

        {route.type === 'admin-book-edit' &&
          renderProtectedRoute(
            <AdminBookForm bookId={route.bookId} onNavigate={navigate} />
          )}

        {route.type === 'not-found' && (
          <div className="max-w-md mx-auto px-4 py-28 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-stone-400 mx-auto" />
            <h1 className="font-serif text-2xl font-semibold text-stone-800">
              Page Not Found
            </h1>
            <p className="text-xs text-stone-600 leading-relaxed">
              The requested catalog route could not be resolved. Please verify the URL or return to the main catalogue.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/library')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-900 text-amber-50 rounded text-xs font-medium hover:bg-emerald-800 transition-colors"
              >
                {isUrdu ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                <span>{t('detailsBack')}</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
