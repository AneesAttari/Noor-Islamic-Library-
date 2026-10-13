import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  Image as ImageIcon,
  FileText,
  RotateCw,
  Sparkles,
} from 'lucide-react';
import { Book, BookCategory, BookLanguage } from '../types/library';
import { LibraryDatabase } from '../services/database';
import { StorageService } from '../services/storage';
import { extractFirstPageThumbnail } from '../utils/pdfThumbnail';
import { useLanguage } from '../i18n/LanguageContext';

interface AdminBookFormProps {
  bookId?: string; // If provided, Edit mode; otherwise New mode
  onNavigate: (path: string) => void;
}

const CATEGORIES: BookCategory[] = [
  'Hadith',
  'Aqeedah',
  'Fiqh',
  'Tafsir',
  'Arabic Language',
  'Ethics & Tazkiyah',
  'Usul al-Fiqh',
  'Seerah',
  'Islamic History',
];

const LANGUAGES: BookLanguage[] = [
  'Arabic',
  'English',
  'Arabic / English',
  'Urdu',
];

export const AdminBookForm: React.FC<AdminBookFormProps> = ({ bookId, onNavigate }) => {
  const { t, isUrdu } = useLanguage();
  const isEdit = Boolean(bookId);

  // Form states
  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [originalAuthor, setOriginalAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<BookCategory>('Hadith');
  const [language, setLanguage] = useState<BookLanguage>('Arabic / English');
  const [eraOrYear, setEraOrYear] = useState('');
  const [publisherOrManuscriptSource, setPublisherOrManuscriptSource] = useState('');
  const [published, setPublished] = useState(true); // Default to TRUE so new manuscripts immediately show on Homepage!
  const [allowDownload, setAllowDownload] = useState(true);

  // File states
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfValidation, setPdfValidation] = useState<{ valid: boolean; message?: string } | null>(null);
  const [isExtractingThumbnail, setIsExtractingThumbnail] = useState<boolean>(false);
  const [pdfThumbnailDataUrl, setPdfThumbnailDataUrl] = useState<string | null>(null);
  const [detectedPageCount, setDetectedPageCount] = useState<number | null>(null);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isAutoExtractedCover, setIsAutoExtractedCover] = useState<boolean>(false);

  const [existingPdfUrl, setExistingPdfUrl] = useState<string>('');
  const [existingPdfStorageKey, setExistingPdfStorageKey] = useState<string | undefined>(undefined);
  const [existingCoverStorageKey, setExistingCoverStorageKey] = useState<string | undefined>(undefined);
  const [existingFileSize, setExistingFileSize] = useState<number>(0);

  // Status & errors
  const [loadingInitial, setLoadingInitial] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load existing book in Edit mode
  useEffect(() => {
    if (isEdit && bookId) {
      const loadBook = async () => {
        try {
          const book = await LibraryDatabase.getBookById(bookId, true);
          if (!book) {
            setError(`Manuscript with ID "${bookId}" was not found.`);
            return;
          }
          setTitle(book.title);
          setOriginalTitle(book.originalTitle || '');
          setAuthor(book.author);
          setOriginalAuthor(book.originalAuthor || '');
          setDescription(book.description);
          setCategory(book.category);
          setLanguage(book.language);
          setEraOrYear(book.eraOrYear || '');
          setPublisherOrManuscriptSource(book.publisherOrManuscriptSource || '');
          setPublished(book.published);
          setAllowDownload(book.allowDownload);
          setExistingPdfUrl(book.pdfUrl);
          setExistingPdfStorageKey(book.pdfStorageKey);
          setExistingCoverStorageKey(book.coverStorageKey);
          setExistingFileSize(book.fileSize);
          if (book.pageCount) {
            setDetectedPageCount(book.pageCount);
          }
          if (book.coverUrl) {
            setCoverPreview(book.coverUrl);
          }
        } catch (err: any) {
          setError(err.message || 'Failed to load book for editing.');
        } finally {
          setLoadingInitial(false);
        }
      };
      loadBook();
    }
  }, [isEdit, bookId]);

  // Handle PDF file selection and automatically extract Page 1 as cover
  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) {
      setPdfFile(null);
      setPdfValidation(null);
      return;
    }

    const validation = await StorageService.validatePdf(file);
    if (!validation.valid) {
      setPdfValidation({ valid: false, message: validation.error });
      setPdfFile(null);
      return;
    }

    setPdfFile(file);
    setIsExtractingThumbnail(true);
    setPdfValidation({
      valid: true,
      message: `Verified PDF header (%PDF- binary signature valid). Extracting authentic Page 1 cover...`,
    });

    try {
      // Automatically extract first page of the uploaded PDF
      const thumb = await extractFirstPageThumbnail(file);
      setPdfThumbnailDataUrl(thumb.dataUrl);
      setDetectedPageCount(thumb.numPages);

      // Auto-set cover preview to Page 1 if no manual custom cover was chosen
      if (!coverFile) {
        setCoverPreview(thumb.dataUrl);
        setIsAutoExtractedCover(true);
      }

      setPdfValidation({
        valid: true,
        message: `Verified authentic PDF (${thumb.numPages} pages, ${(file.size / (1024 * 1024)).toFixed(2)} MB). First page captured as authentic manuscript cover!`,
      });
    } catch (err) {
      console.warn('Could not extract first page thumbnail:', err);
      setPdfValidation({
        valid: true,
        message: `Verified PDF format (%PDF- binary signature valid). File size: ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)} MB`,
      });
    } finally {
      setIsExtractingThumbnail(false);
    }
  };

  // Handle cover image selection
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) {
      setCoverFile(null);
      return;
    }

    const validation = await StorageService.validateCoverImage(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid cover image.');
      setCoverFile(null);
      return;
    }

    setCoverFile(file);
    setIsAutoExtractedCover(false);
    const previewUrl = URL.createObjectURL(file);
    setCoverPreview(previewUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!author.trim()) {
      setError('Author name is required.');
      return;
    }
    if (!description.trim()) {
      setError('Manuscript description is required.');
      return;
    }
    if (!isEdit && !pdfFile) {
      setError('A valid PDF manuscript file is required to create a new catalogue record.');
      return;
    }

    setSubmitting(true);

    try {
      let finalPdfUrl = existingPdfUrl;
      let finalPdfStorageKey = existingPdfStorageKey;
      let finalFileSize = existingFileSize;
      let finalCoverUrl = coverPreview || undefined;
      let finalCoverStorageKey = existingCoverStorageKey;
      let finalPageCount = detectedPageCount || undefined;

      // 1. Process PDF upload to permanent IndexedDB storage
      if (pdfFile) {
        const pdfResult = await StorageService.uploadPdf(pdfFile, bookId, pdfFile.name);
        finalPdfUrl = pdfResult.url;
        finalPdfStorageKey = pdfResult.key;
        finalFileSize = pdfResult.fileSize;

        // 2. If no separate cover file was uploaded, save the generated Page 1 thumbnail
        if (!coverFile && pdfThumbnailDataUrl) {
          try {
            const thumbRes = await fetch(pdfThumbnailDataUrl);
            const thumbBlob = await thumbRes.blob();
            const coverResult = await StorageService.uploadCoverBlob(thumbBlob, bookId, '.jpg');
            finalCoverUrl = coverResult.url;
            finalCoverStorageKey = coverResult.key;
          } catch (thumbSaveErr) {
            console.warn('Could not persist cover thumbnail blob:', thumbSaveErr);
          }
        }
      }

      // 3. Process Cover upload if new manual image selected
      if (coverFile) {
        const coverResult = await StorageService.uploadCoverImage(coverFile, bookId);
        finalCoverUrl = coverResult.url;
        finalCoverStorageKey = coverResult.key;
      }

      // 4. Persist to database & IndexedDB
      const bookPayload = {
        title: title.trim(),
        originalTitle: originalTitle.trim() || undefined,
        author: author.trim(),
        originalAuthor: originalAuthor.trim() || undefined,
        description: description.trim(),
        category,
        language,
        eraOrYear: eraOrYear.trim() || undefined,
        publisherOrManuscriptSource: publisherOrManuscriptSource.trim() || undefined,
        published,
        allowDownload,
        pdfUrl: finalPdfUrl,
        pdfStorageKey: finalPdfStorageKey,
        fileSize: finalFileSize,
        coverUrl: finalCoverUrl,
        coverStorageKey: finalCoverStorageKey,
        pageCount: finalPageCount,
      };

      if (isEdit && bookId) {
        await LibraryDatabase.updateBook(bookId, bookPayload);
        setSuccess('Manuscript record updated and persisted successfully.');
      } else {
        await LibraryDatabase.createBook(bookPayload);
        setSuccess('New manuscript catalogued and published successfully.');
      }

      setTimeout(() => {
        onNavigate('/admin');
      }, 1500);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setError(err.message || 'Operation failed. Your entered metadata has been preserved.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center font-serif text-stone-500">
        Loading manuscript metadata for editing...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-start">
      {/* Back button */}
      <button
        onClick={() => onNavigate('/admin')}
        className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 transition-colors"
      >
        {isUrdu ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
        <span>Return to Administrator Dashboard</span>
      </button>

      {/* Header */}
      <div className="border-b border-stone-300 pb-4">
        <span className="text-xs uppercase tracking-widest font-serif text-emerald-900 font-semibold">
          Curatorial Ingestion
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
          {isEdit ? t('formEditTitle') : t('formNewTitle')}
        </h1>
        <p className="text-xs text-stone-600 mt-1">
          {t('formRequiredNotice')}.
        </p>
      </div>

      {/* Feedback Banners */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{success} Redirecting to dashboard...</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-[#FAF7F2] p-6 sm:p-8 rounded-lg border border-stone-300">
        {/* Section 1: Bibliographic Identity */}
        <div className="space-y-4">
          <h2 className="font-serif text-base font-semibold text-stone-900 border-b border-stone-300 pb-2">
            {t('formSection1')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                {t('formTitleLabel')} <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Al-Arba’in an-Nawawiyyah"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                {t('formOriginalTitleLabel')}
              </label>
              <input
                type="text"
                dir="rtl"
                value={originalTitle}
                onChange={(e) => setOriginalTitle(e.target.value)}
                placeholder="الأربعون النووية"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 font-arabic text-right focus:outline-none focus:border-emerald-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                {t('formAuthorLabel')} <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Imam Yahya ibn Sharaf an-Nawawi"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                {t('formOriginalAuthorLabel')}
              </label>
              <input
                type="text"
                dir="rtl"
                value={originalAuthor}
                onChange={(e) => setOriginalAuthor(e.target.value)}
                placeholder="الإمام يحيى بن شرف النووي"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 font-arabic text-right focus:outline-none focus:border-emerald-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              {t('formSynopsisLabel')} <span className="text-red-700">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide an authentic synopsis of the treatise, its chapters, and pedagogical importance..."
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-emerald-800"
            />
          </div>
        </div>

        {/* Section 2: Classification & Provenance */}
        <div className="space-y-4">
          <h2 className="font-serif text-base font-semibold text-stone-900 border-b border-stone-300 pb-2">
            {t('formSection2')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                {t('formCategoryLabel')} <span className="text-red-700">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BookCategory)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-emerald-800"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                {t('formLanguageLabel')} <span className="text-red-700">*</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as BookLanguage)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-emerald-800"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                {t('formEraLabel')}
              </label>
              <input
                type="text"
                value={eraOrYear}
                onChange={(e) => setEraOrYear(e.target.value)}
                placeholder="e.g. 676 AH / 1277 CE"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                {t('formProvenanceLabel')}
              </label>
              <input
                type="text"
                value={publisherOrManuscriptSource}
                onChange={(e) => setPublisherOrManuscriptSource(e.target.value)}
                placeholder="e.g. Damascus Classical Recension"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-emerald-800"
              />
            </div>
          </div>
        </div>

        {/* Section 3: File Uploads */}
        <div className="space-y-4">
          <h2 className="font-serif text-base font-semibold text-stone-900 border-b border-stone-300 pb-2">
            {t('formSection3')}
          </h2>

          {/* PDF Upload */}
          <div className="bg-white p-4 rounded border border-stone-300 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-900" />
                <span>
                  {t('formPdfUploadLabel')} {isEdit ? <span className="text-stone-400 font-normal">(Optional replacement)</span> : <span className="text-red-700">*</span>}
                </span>
              </label>
              <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Max size: 250 MB
              </span>
            </div>

            <p className="text-[11px] text-stone-600">
              High-capacity streaming storage supports manuscripts up to 250 MB each and archives exceeding 2,000 volumes.
            </p>

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handlePdfChange}
              className="block w-full text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald-900 file:text-amber-50 hover:file:bg-emerald-800 file:cursor-pointer"
            />

            {isExtractingThumbnail && (
              <div className="text-[11px] p-2 bg-stone-100 rounded text-stone-700 flex items-center gap-2 animate-pulse">
                <RotateCw className="w-3.5 h-3.5 animate-spin text-emerald-800" />
                <span>Extracting high-resolution Page 1 from PDF to use as authentic cover...</span>
              </div>
            )}

            {pdfValidation && (
              <div
                className={`text-[11px] p-2 rounded flex items-center gap-1.5 ${
                  pdfValidation.valid ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-800'
                }`}
              >
                {pdfValidation.valid ? <FileCheck className="w-3.5 h-3.5 text-emerald-700" /> : <AlertTriangle className="w-3.5 h-3.5 text-red-600" />}
                <span>{pdfValidation.message}</span>
              </div>
            )}

            {isEdit && !pdfFile && existingPdfUrl && (
              <p className="text-[11px] text-stone-500 italic">
                Current PDF attached ({(existingFileSize / 1024).toFixed(1)} KB). Upload a new file only if replacing.
              </p>
            )}
          </div>

          {/* Cover Image / Authentic Page 1 Capture */}
          <div className="bg-white p-4 rounded border border-stone-300 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-stone-700" />
                <span>
                  Manuscript Cover Presentation
                </span>
              </label>
              <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Auto-extracts from PDF Page 1
              </span>
            </div>

            <p className="text-[11px] text-stone-600">
              When you upload a PDF, its original first page is automatically captured and displayed on the homepage and library. You can also upload a separate custom frontispiece image below if desired.
            </p>

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/*"
              onChange={handleCoverChange}
              className="block w-full text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-stone-800 file:text-stone-100 hover:file:bg-stone-700 file:cursor-pointer"
            />

            {coverPreview && (
              <div className="flex items-start gap-3 pt-2 bg-[#FBF9F5] p-3 rounded border border-stone-200">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-16 h-22 object-cover rounded border border-stone-300 shadow-xs shrink-0"
                />
                <div className="text-[11px] text-stone-600 space-y-1">
                  <div className="flex items-center gap-1 text-emerald-900 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      {isAutoExtractedCover
                        ? 'Original PDF First Page (Active Cover)'
                        : 'Custom Uploaded Cover'}
                    </span>
                  </div>
                  <p className="text-stone-500 text-[10px] leading-relaxed">
                    {isAutoExtractedCover
                      ? 'This genuine first page of your uploaded PDF will appear as the cover on the Homepage and Catalogue.'
                      : 'Custom cover image selected for this manuscript catalogue record.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCoverFile(null);
                      if (pdfThumbnailDataUrl) {
                        setCoverPreview(pdfThumbnailDataUrl);
                        setIsAutoExtractedCover(true);
                      } else {
                        setCoverPreview(null);
                      }
                    }}
                    className="text-emerald-900 hover:underline font-medium text-[11px] pt-1 block"
                  >
                    {isAutoExtractedCover && coverFile ? 'Reset to PDF Page 1' : 'Clear custom cover'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Publication Governance & Permissions */}
        <div className="space-y-4">
          <h2 className="font-serif text-base font-semibold text-stone-900 border-b border-stone-300 pb-2">
            {t('formSection4')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Published vs Draft toggle */}
            <div className="p-4 bg-white rounded border border-stone-300 flex items-start gap-3">
              <input
                id="published"
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-emerald-900 rounded border-stone-300 focus:ring-emerald-800"
              />
              <div>
                <label htmlFor="published" className="text-xs font-semibold text-stone-900 block cursor-pointer">
                  Publish to Public Library (Visible on Homepage)
                </label>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  When enabled, this manuscript immediately appears on the Homepage and in the Public Catalogue for readers.
                </p>
              </div>
            </div>

            {/* Download permission */}
            <div className="p-4 bg-white rounded border border-stone-300 flex items-start gap-3">
              <input
                id="allowDownload"
                type="checkbox"
                checked={allowDownload}
                onChange={(e) => setAllowDownload(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-emerald-900 rounded border-stone-300 focus:ring-emerald-800"
              />
              <div>
                <label htmlFor="allowDownload" className="text-xs font-semibold text-stone-900 block cursor-pointer">
                  {t('formDownloadToggleLabel')}
                </label>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {t('formDownloadToggleDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Actions */}
        <div className="pt-4 border-t border-stone-300 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/admin')}
            className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-200 rounded transition-colors"
          >
            {t('formCancelBtn')}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-50 text-amber-50 text-xs font-medium rounded transition-colors flex items-center gap-2 shadow-xs"
          >
            {submitting && <RotateCw className="w-3.5 h-3.5 animate-spin" />}
            <span>
              {submitting
                ? 'Persisting manuscript to storage...'
                : isEdit
                ? t('formSaveBtn')
                : t('formNewTitle')}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
