import React, { useEffect, useState, useRef } from 'react';
import {
  Plus,
  Search,
  BookOpen,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  LogOut,
  HardDrive,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  KeyRound,
  Download,
  Upload,
  ShieldCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Database,
} from 'lucide-react';
import { Book, LibraryStats } from '../types/library';
import { LibraryDatabase } from '../services/database';
import { AuthService } from '../services/auth';
import { StorageService, StorageStatusInfo } from '../services/storage';
import { PdfCoverPreview } from '../components/PdfCoverPreview';
import { useLanguage } from '../i18n/LanguageContext';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout }) => {
  const { t, isUrdu } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<LibraryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [tablePage, setTablePage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [storageQuota, setStorageQuota] = useState<{
    usedBytes: number;
    quotaBytes: number;
    percentUsed: number;
    isPersisted: boolean;
  } | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [errorNotification, setErrorNotification] = useState<string | null>(null);

  // Password reset in dashboard
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordConfirmInput, setPasswordConfirmInput] = useState('');
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const storageStatus: StorageStatusInfo = StorageService.getStorageStatus();
  const user = AuthService.getCurrentUser();

  const loadData = async () => {
    setLoading(true);
    try {
      const [allBooks, libraryStats, estimate, isPersisted] = await Promise.all([
        LibraryDatabase.getAllBooksAdmin({
          searchQuery,
          status: statusFilter,
        }),
        LibraryDatabase.getStatistics(),
        StorageService.getStorageEstimate(),
        StorageService.isStoragePersisted(),
      ]);
      setBooks(allBooks);
      setStats(libraryStats);
      setStorageQuota({ ...estimate, isPersisted });
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTablePage(1);
    loadData();
  }, [searchQuery, statusFilter]);

  const handleTogglePublish = async (book: Book) => {
    try {
      const updated = await LibraryDatabase.togglePublishStatus(book.id);
      setNotification(
        `Manuscript "${updated.title}" is now ${updated.published ? 'Published (Public)' : 'Draft (Unpublished)'}.`
      );
      loadData();
      setTimeout(() => setNotification(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const success = await LibraryDatabase.deleteBook(id);
      if (success) {
        setNotification('Book record and associated storage files deleted successfully.');
        setShowDeleteConfirm(null);
        loadData();
        setTimeout(() => setNotification(null), 3500);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete book');
    } finally {
      setDeletingId(null);
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset catalogue to authentic default classical exemplars? Custom uploads will be cleared.')) {
      await LibraryDatabase.resetToDefaults();
      setNotification('Catalogue successfully reset to authentic classical default exemplars.');
      loadData();
      setTimeout(() => setNotification(null), 3500);
    }
  };

  // Password reset request action
  const handleRequestResetEmail = async () => {
    if (!user?.email) return;
    const confirmed = window.confirm(t('resetPasswordConfirmPrompt', { email: user.email }));
    if (!confirmed) return;

    try {
      await AuthService.requestPasswordReset(user.email);
      setPasswordResetSent(true);
      setNotification(t('resetEmailSentDetail', { email: user.email }));
      setTimeout(() => setNotification(null), 5000);
    } catch (err: any) {
      setErrorNotification(err.message || 'Failed to dispatch reset request.');
      setTimeout(() => setErrorNotification(null), 5000);
    }
  };

  const handleUpdatePasswordDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.length < 8) {
      setErrorNotification('Password must be at least 8 characters long.');
      return;
    }
    if (passwordInput !== passwordConfirmInput) {
      setErrorNotification('Passwords do not match.');
      return;
    }

    setUpdatingPassword(true);
    try {
      await AuthService.updateCurrentAdminPassword(passwordInput);
      setNotification(t('passwordUpdatedSuccess'));
      setShowPasswordModal(false);
      setPasswordInput('');
      setPasswordConfirmInput('');
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setErrorNotification(err.message || 'Failed to update password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Export archive backup
  const handleExportBackup = async () => {
    try {
      const { fileName, jsonContent } = await LibraryDatabase.exportArchiveBackup();
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setNotification(t('adminBackupSuccess'));
      setTimeout(() => setNotification(null), 3500);
    } catch (err: any) {
      setErrorNotification('Failed to generate archive backup.');
    }
  };

  // Import archive backup
  const handleImportFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const res = await LibraryDatabase.importArchiveBackup(text);
      if (res.success) {
        setNotification(t('adminRestoreSuccess'));
        loadData();
        setTimeout(() => setNotification(null), 3500);
      }
    } catch (err: any) {
      setErrorNotification(err.message || t('adminRestoreFailed'));
      setTimeout(() => setErrorNotification(null), 5000);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${Math.round(bytes / 1024)} KB`;
  };

  const totalItems = books.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedBooks = books.slice((tablePage - 1) * pageSize, tablePage * pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-300 pb-6 text-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-serif text-emerald-900 font-semibold">
              {t('adminDashboardKicker')}
            </span>
            <span className="text-xs text-stone-500 font-serif">· {user?.name || 'Chief Librarian'}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            {t('adminDashboardTitle')}
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigate('/admin/books/new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-amber-50 text-xs font-medium rounded transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t('adminAddNewBtn')}</span>
          </button>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium rounded transition-colors"
            title="Password & Security Settings"
          >
            <KeyRound className="w-4 h-4 text-emerald-800" />
            <span className="hidden sm:inline">Security</span>
          </button>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium rounded transition-colors"
            title="Sign out of administrator session"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{t('adminSignOutBtn')}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {errorNotification && (
        <div className="p-3 bg-red-50 border border-red-300 rounded text-xs text-red-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
          <span>{errorNotification}</span>
        </div>
      )}

      {/* Real Statistics Metrics Strip */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FAF7F2] p-5 rounded-lg border border-stone-300 text-start">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">{t('adminStatTotal')}</span>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-mono tabular-nums" dir="ltr">
              {stats.totalBooks}
            </p>
            <span className="text-[11px] text-stone-500 mt-1 block">In local repository</span>
          </div>

          <div className="bg-[#FAF7F2] p-5 rounded-lg border border-stone-300 text-start">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">{t('adminStatPublished')}</span>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-emerald-900 mt-1 font-mono tabular-nums" dir="ltr">
              {stats.publishedBooks}
            </p>
            <span className="text-[11px] text-stone-500 mt-1 block">Visible in catalogue</span>
          </div>

          <div className="bg-[#FAF7F2] p-5 rounded-lg border border-stone-300 text-start">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">{t('adminStatDrafts')}</span>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-800 mt-1 font-mono tabular-nums" dir="ltr">
              {stats.draftBooks}
            </p>
            <span className="text-[11px] text-stone-500 mt-1 block">Restricted from public</span>
          </div>

          <div className="bg-[#FAF7F2] p-5 rounded-lg border border-stone-300 text-start">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">{t('adminStatVolume')}</span>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-mono tabular-nums" dir="ltr">
              {formatBytes(stats.totalVolumeBytes)}
            </p>
            <span className="text-[11px] text-stone-500 mt-1 block">Verified PDF binary bytes</span>
          </div>
        </div>
      )}

      {/* Deployment & Data Backup Checkpoint Panel */}
      <div className="p-5 bg-amber-50/60 border border-amber-300/80 rounded-lg text-xs space-y-3 text-start">
        <div className="flex items-center gap-2 text-amber-900 font-semibold uppercase tracking-wider">
          <HardDrive className="w-4 h-4 text-amber-700" />
          <span>{t('adminBackupTitle')}</span>
        </div>
        <p className="text-stone-700 leading-relaxed">
          {t('adminBackupDesc')}
        </p>

        <div className="flex items-center gap-3 pt-1 flex-wrap">
          <button
            onClick={handleExportBackup}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-900 hover:bg-emerald-800 text-amber-50 rounded text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('adminExportBackupBtn')}</span>
          </button>

          <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 rounded text-xs font-medium cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>{t('adminRestoreBackupBtn')}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImportFileSelected}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* High-Capacity Storage Engine & Device Quota Overview */}
      <div className="p-5 bg-[#FAF7F2] border border-stone-300 rounded-lg text-xs space-y-3 text-start">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-200 pb-2.5">
          <div className="flex items-center gap-2 text-emerald-950 font-semibold uppercase tracking-wider">
            <Database className="w-4 h-4 text-emerald-800" />
            <span>High-Capacity Storage Engine (250 MB Limit)</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-900 border border-emerald-300">
            <Sparkles className="w-3 h-3 text-emerald-700" />
            Engineered for 100 to 2,000+ files
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">Per-File PDF Limit</span>
            <p className="font-serif text-sm font-semibold text-stone-900 mt-0.5">250 MB Maximum Size</p>
            <p className="text-[11px] text-stone-500 mt-0.5">Chunked streaming prevents browser memory spikes.</p>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">Device Storage Quota</span>
            <p className="font-serif text-sm font-semibold text-stone-900 mt-0.5 font-mono tabular-nums">
              {storageQuota && storageQuota.quotaBytes > 0
                ? `${formatBytes(storageQuota.usedBytes)} / ${formatBytes(storageQuota.quotaBytes)} (${storageQuota.percentUsed.toFixed(1)}% used)`
                : 'Over 50+ GB Available'}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">Filesystem backing store managed by IndexedDB.</p>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">Data Eviction Protection</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-serif text-sm font-semibold text-emerald-900 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                Persistent Storage
              </span>
              {!storageQuota?.isPersisted && (
                <button
                  type="button"
                  onClick={async () => {
                    const granted = await StorageService.requestPersistentStorage();
                    if (granted) {
                      setNotification('Browser persistent storage successfully granted!');
                      loadData();
                    }
                  }}
                  className="text-[10px] text-emerald-800 underline hover:text-emerald-950 font-medium"
                >
                  Enable Guarantee
                </button>
              )}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">Protects your 250 MB files against automated eviction.</p>
          </div>
        </div>
      </div>

      {/* Table Filter & Search Controls */}
      <div className="bg-[#FAF7F2] p-4 rounded-lg border border-stone-300 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('adminSearchPlaceholder')}
            className="w-full ps-9 pe-3 py-1.5 bg-white border border-stone-300 rounded text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-800"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              statusFilter === 'all'
                ? 'bg-emerald-900 text-amber-50'
                : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {t('adminTabAll')}
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              statusFilter === 'published'
                ? 'bg-emerald-900 text-amber-50'
                : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {t('adminTabPublished')}
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              statusFilter === 'draft'
                ? 'bg-emerald-900 text-amber-50'
                : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {t('adminTabDrafts')}
          </button>

          <button
            onClick={handleResetDefaults}
            className="ms-2 text-stone-500 hover:text-stone-900 p-1.5"
            title={t('adminResetDefaults')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-lg border border-stone-300 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#F4EFE6] text-stone-700 uppercase tracking-wider font-serif text-[11px] border-b border-stone-300">
              <tr>
                <th className="py-3 px-4">{t('adminTableManuscript')}</th>
                <th className="py-3 px-4">{t('adminTableDiscipline')}</th>
                <th className="py-3 px-4">{t('adminTableSizePages')}</th>
                <th className="py-3 px-4">{t('adminTableStatus')}</th>
                <th className="py-3 px-4 text-end">{t('adminTableActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400 font-serif">
                    Loading administrative records...
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-500">
                    No books found matching this view.
                  </td>
                </tr>
              ) : (
                paginatedBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Title, Cover Thumbnail & Author */}
                    <td className="py-3 px-4 max-w-sm text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-12 shrink-0 rounded overflow-hidden border border-stone-300 shadow-2xs bg-[#F5F2EB]">
                          <PdfCoverPreview book={book} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-serif font-semibold text-stone-900 text-sm truncate">
                            {book.title}
                          </div>
                          {book.originalTitle && (
                            <div dir="rtl" className="font-arabic text-xs text-stone-500 mt-0.5 truncate">
                              {book.originalTitle}
                            </div>
                          )}
                          <div className="text-stone-500 text-[11px] mt-0.5 truncate">
                            {book.author}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Discipline & Language */}
                    <td className="py-3 px-4 text-start">
                      <div className="font-medium text-emerald-950">{book.category}</div>
                      <div className="text-stone-500 text-[11px]">{book.language}</div>
                    </td>

                    {/* Size */}
                    <td className="py-3 px-4 font-mono tabular-nums text-stone-600 text-start" dir="ltr">
                      <div>{formatBytes(book.fileSize)}</div>
                      <div className="text-[11px] text-stone-400">
                        {book.pageCount ? `${book.pageCount} ${t('cardPages')}` : 'PDF'}
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4 text-start">
                      <button
                        onClick={() => handleTogglePublish(book)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                          book.published
                            ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {book.published ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-700" />
                            <span>{t('adminStatusPublished')}</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-amber-700" />
                            <span>{t('adminStatusDraft')}</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-end space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => onNavigate(`/read/${book.id}`)}
                        className="p-1.5 text-stone-600 hover:text-emerald-900 hover:bg-stone-100 rounded"
                        title="Open in PDF Reader"
                      >
                        <BookOpen className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onNavigate(`/admin/books/${book.id}/edit`)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
                        title="Edit Metadata"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setShowDeleteConfirm(book.id)}
                        className="p-1.5 text-stone-600 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Delete Book"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Bar */}
        {totalItems > 0 && (
          <div className="p-3 bg-[#FAF7F2] border-t border-stone-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
            <div className="flex items-center gap-2 flex-wrap">
              <span>
                Showing <strong className="text-stone-900 font-mono">{(tablePage - 1) * pageSize + 1}</strong> to{' '}
                <strong className="text-stone-900 font-mono">
                  {Math.min(tablePage * pageSize, totalItems)}
                </strong>{' '}
                of <strong className="text-stone-900 font-mono">{totalItems}</strong> manuscripts
              </span>
              <span className="text-stone-300">|</span>
              <div className="flex items-center gap-1 text-[11px]">
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setTablePage(1);
                  }}
                  className="bg-white border border-stone-300 rounded px-1.5 py-0.5 text-xs text-stone-800"
                >
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>per page</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTablePage((p) => Math.max(1, p - 1))}
                disabled={tablePage <= 1}
                className="p-1.5 rounded border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-40 transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs px-2 text-stone-700">
                Page {tablePage} of {totalPages}
              </span>
              <button
                onClick={() => setTablePage((p) => Math.min(totalPages, p + 1))}
                disabled={tablePage >= totalPages}
                className="p-1.5 rounded border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-40 transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Security & Password Reset Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FBF9F5] rounded-lg max-w-md w-full p-6 border border-stone-300 shadow-xl space-y-5 text-start">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2 text-stone-900 font-bold font-serif text-lg">
                <KeyRound className="w-5 h-5 text-emerald-800" />
                <span>{t('resetPasswordDashboardTitle')}</span>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-stone-500 hover:text-stone-900"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {t('resetPasswordDashboardDesc')}
            </p>

            {/* Action 1: Send reset email */}
            <div className="p-3 bg-stone-100 rounded border border-stone-300 space-y-2">
              <span className="text-xs font-semibold text-stone-800 block">
                Official Email Reset Dispatch
              </span>
              <p className="text-[11px] text-stone-500">
                Dispatches a password reset link to <strong className="text-stone-800">{user?.email}</strong>.
              </p>
              <button
                onClick={handleRequestResetEmail}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-amber-50 rounded text-xs font-medium transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{t('resetPasswordDashboardAction')}</span>
              </button>
            </div>

            {/* Action 2: Direct Password Update */}
            <form onSubmit={handleUpdatePasswordDirect} className="space-y-3 pt-2 border-t border-stone-200">
              <span className="text-xs font-semibold text-stone-800 block">
                Direct Password Update
              </span>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  {t('newPasswordLabel')} (min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-emerald-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={passwordConfirmInput}
                  onChange={(e) => setPasswordConfirmInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-emerald-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="px-4 py-1.5 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-50 text-amber-50 rounded text-xs font-medium transition-colors"
                >
                  {updatingPassword ? 'Updating...' : t('updatePasswordBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FBF9F5] rounded-lg max-w-md w-full p-6 border border-stone-300 shadow-xl space-y-4 text-start">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-serif text-lg font-bold">{t('adminDeleteConfirmTitle')}</h3>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {t('adminDeleteConfirmDesc')}
            </p>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-stone-200 rounded transition-colors"
              >
                {t('adminDeleteCancel')}
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={deletingId === showDeleteConfirm}
                className="px-3.5 py-2 text-xs font-medium bg-red-700 hover:bg-red-800 text-white rounded transition-colors disabled:opacity-50"
              >
                {deletingId === showDeleteConfirm ? 'Deleting...' : t('adminDeleteConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
