import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  ArrowLeft,
  ArrowRight,
  Info,
  RotateCw,
  AlertTriangle,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { Book } from '../types/library';
import { StorageService } from '../services/storage';
import { useLanguage } from '../i18n/LanguageContext';

// Configure PDF.js worker
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
}

interface PdfReaderProps {
  book: Book;
  onBack: () => void;
}

export const PdfReader: React.FC<PdfReaderProps> = ({ book, onBack }) => {
  const { t, isUrdu } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(book.pageCount || 1);
  const [scale, setScale] = useState<number>(1.0);
  const [isFitWidth, setIsFitWidth] = useState<boolean>(true);
  const [pageUnscaledWidth, setPageUnscaledWidth] = useState<number>(595);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showMetadata, setShowMetadata] = useState<boolean>(false);
  const [pageInput, setPageInput] = useState<string>('1');

  // Calculate fit-to-width scale based on current container width
  const calculateFitWidthScale = useCallback(
    (unscaledWidth: number) => {
      if (!scrollAreaRef.current) return 1.0;
      const containerWidth = scrollAreaRef.current.clientWidth;
      const horizontalPadding = window.innerWidth < 640 ? 24 : 48;
      const availableWidth = Math.max(containerWidth - horizontalPadding, 240);
      const computed = availableWidth / unscaledWidth;
      return Math.max(0.35, Math.min(computed, 2.5));
    },
    []
  );

  // Load document
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    const loadDocument = async () => {
      try {
        let sourceOptions: any = null;

        // 1. Try streaming binary blob directly from IndexedDB if available
        if (book.pdfStorageKey) {
          const blob = await StorageService.getBlob(book.pdfStorageKey);
          if (blob) {
            const streamUrl = URL.createObjectURL(blob);
            sourceOptions = {
              url: streamUrl,
              rangeChunkSize: 65536 * 4,
              disableAutoFetch: false,
            };
          }
        }

        // 2. Fall back to resolved URL
        if (!sourceOptions) {
          let targetUrl = book.pdfUrl;
          if (book.pdfStorageKey) {
            targetUrl = await StorageService.resolveUrl(book.pdfStorageKey);
          }
          if (!targetUrl) {
            throw new Error('PDF storage reference is missing or not provided.');
          }
          sourceOptions = {
            url: targetUrl,
            rangeChunkSize: 65536 * 4,
          };
        }

        const loadingTask = pdfjsLib.getDocument({
          ...sourceOptions,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (isCancelled) return;

        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setCurrentPage(1);
        setPageInput('1');

        // Probe first page to determine dimensions
        const firstPage = await doc.getPage(1);
        const unscaledViewport = firstPage.getViewport({ scale: 1.0 });
        setPageUnscaledWidth(unscaledViewport.width);

        const initialScale = calculateFitWidthScale(unscaledViewport.width);
        setScale(initialScale);
        setIsFitWidth(true);
        setLoading(false);
      } catch (err: any) {
        if (isCancelled) return;
        console.error('PDF.js loading error:', err);
        setError(
          err.message || 'Failed to parse and load PDF document. The file may be corrupt or inaccessible.'
        );
        setLoading(false);
      }
    };

    loadDocument();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [book.pdfUrl, calculateFitWidthScale]);

  // ResizeObserver to handle phone rotation and container resize
  useEffect(() => {
    if (!scrollAreaRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (isFitWidth && pageUnscaledWidth > 0) {
        const newScale = calculateFitWidthScale(pageUnscaledWidth);
        setScale(newScale);
      }
    });

    resizeObserver.observe(scrollAreaRef.current);
    return () => resizeObserver.disconnect();
  }, [isFitWidth, pageUnscaledWidth, calculateFitWidthScale]);

  // Render specific page
  const renderPage = useCallback(
    async (pageNum: number, currentScale: number) => {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const page = await pdfDoc.getPage(pageNum);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        const viewport = page.getViewport({ scale: currentScale });
        const pixelRatio = window.devicePixelRatio || 1;

        // Render at physical pixels for crisp HiDPI text
        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.height = Math.floor(viewport.height * pixelRatio);

        // Explicit CSS dimensions prevent distortion or cropping
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        context.clearRect(0, 0, canvas.width, canvas.height);

        const renderContext: any = {
          canvasContext: context,
          viewport: viewport,
        };

        if (pixelRatio !== 1) {
          renderContext.transform = [pixelRatio, 0, 0, pixelRatio, 0, 0];
        }

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.error('Render error:', err);
        }
      }
    },
    [pdfDoc]
  );

  useEffect(() => {
    if (pdfDoc && !loading) {
      renderPage(currentPage, scale);
    }
  }, [pdfDoc, currentPage, scale, loading, renderPage]);

  // Page navigation handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      const next = currentPage - 1;
      setCurrentPage(next);
      setPageInput(String(next));
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const next = currentPage + 1;
      setCurrentPage(next);
      setPageInput(String(next));
    }
  };

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(pageInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      setCurrentPage(parsed);
    } else {
      setPageInput(String(currentPage));
    }
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setIsFitWidth(false);
    setScale((prev) => Math.min(prev + 0.15, 3.0));
  };

  const handleZoomOut = () => {
    setIsFitWidth(false);
    setScale((prev) => Math.max(prev - 0.15, 0.4));
  };

  const handleFitWidth = () => {
    setIsFitWidth(true);
    const newScale = calculateFitWidthScale(pageUnscaledWidth);
    setScale(newScale);
  };

  const handleFitPage = () => {
    setIsFitWidth(false);
    if (scrollAreaRef.current) {
      const containerHeight = scrollAreaRef.current.clientHeight - 60;
      // Standard page height ratio ~1.414
      const estScale = containerHeight / (pageUnscaledWidth * 1.414);
      setScale(Math.max(0.35, Math.min(estScale, 2.0)));
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevPage();
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        handleNextPage();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  // Download action
  const handleDownload = () => {
    if (!book.allowDownload) return;
    const a = document.createElement('a');
    a.href = book.pdfUrl;
    a.download = `${book.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-stone-900 text-stone-100 min-h-screen ${
        isFullscreen ? 'fixed inset-0 z-50' : 'h-[calc(100vh-4rem)]'
      }`}
    >
      {/* Reader Control Header Bar */}
      <header className="bg-stone-950/95 border-b border-stone-800 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 shrink-0 z-20">
        {/* Left / Start: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-100 transition-colors py-1.5 px-2 rounded hover:bg-stone-800 shrink-0"
            title={t('readerBack')}
          >
            {isUrdu ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span className="hidden sm:inline">{t('readerBack')}</span>
          </button>

          <div className="min-w-0">
            <h1 className="font-serif text-xs sm:text-sm font-semibold text-stone-200 truncate">
              {book.title}
            </h1>
            <p className="text-[11px] text-stone-500 truncate hidden sm:block">
              {book.author} · {book.category}
            </p>
          </div>
        </div>

        {/* Center: Pagination Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0" dir="ltr">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || loading}
            className="p-1.5 rounded text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            title={`${t('paginationPrev')} (Left Arrow)`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <form onSubmit={handlePageSubmit} className="flex items-center gap-1 text-xs text-stone-400">
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={() => setPageInput(String(currentPage))}
              className="w-10 sm:w-12 text-center bg-stone-900 border border-stone-700 rounded py-1 text-stone-100 text-xs focus:outline-none focus:border-emerald-600 font-mono tabular-nums"
              disabled={loading}
              title={t('readerPage')}
            />
            <span className="text-stone-500 font-mono tabular-nums text-xs">/ {totalPages}</span>
          </form>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || loading}
            className="p-1.5 rounded text-stone-300 hover:text-white hover:bg-stone-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            title={`${t('paginationNext')} (Right Arrow)`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right / End: Zoom & Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Zoom controls */}
          <div className="hidden md:flex items-center bg-stone-900 rounded border border-stone-800 p-0.5" dir="ltr">
            <button
              onClick={handleZoomOut}
              disabled={loading || scale <= 0.4}
              className="p-1 rounded text-stone-400 hover:text-white hover:bg-stone-800 disabled:opacity-30"
              title={t('readerZoomOut')}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono tabular-nums text-stone-300 min-w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={loading || scale >= 3.0}
              className="p-1 rounded text-stone-400 hover:text-white hover:bg-stone-800 disabled:opacity-30"
              title={t('readerZoomIn')}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleFitWidth}
            className={`hidden lg:inline-flex items-center gap-1 text-xs px-2 py-1.5 rounded transition-colors ${
              isFitWidth
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
            title={t('readerFitWidth')}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('readerFitWidth')}</span>
          </button>

          {/* Download if allowed */}
          {book.allowDownload && (
            <button
              onClick={handleDownload}
              className="p-1.5 text-stone-400 hover:text-emerald-400 hover:bg-stone-800 rounded transition-colors"
              title={t('readerDownload')}
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {/* Metadata Drawer Toggle */}
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className={`p-1.5 rounded transition-colors ${
              showMetadata ? 'bg-emerald-950 text-emerald-400' : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
            title={t('readerRecord')}
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded transition-colors"
            title={isFullscreen ? t('readerExitFullscreen') : t('readerFullscreen')}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Reading Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canvas Scroll Area - Fixed against clipping */}
        <main
          ref={scrollAreaRef}
          className="flex-1 overflow-auto bg-[#171615] relative p-2 sm:p-6"
          tabIndex={0}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-stone-400 space-y-3">
              <RotateCw className="w-8 h-8 animate-spin text-emerald-600" />
              <p className="font-serif text-sm">{t('readerLoading')}</p>
              <p className="text-xs text-stone-500 font-mono">{t('readerEngine')}</p>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto my-16 p-6 bg-stone-900 border border-stone-800 rounded-lg text-center space-y-4">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
              <h2 className="font-serif text-lg font-semibold text-stone-200">
                {t('readerNotice')}
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed">{error}</p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <a
                  href={book.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-900 hover:bg-emerald-800 text-stone-100 px-3.5 py-2 rounded transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{t('readerOpenDirectly')}</span>
                </a>
                <button
                  onClick={onBack}
                  className="text-xs text-stone-400 hover:text-stone-200 px-3 py-2 transition-colors"
                >
                  {t('readerReturnCatalogue')}
                </button>
              </div>
            </div>
          ) : (
            /* Centered wrapper without flexbox left-edge clipping */
            <div className="min-w-full w-max flex justify-center py-2">
              <div
                className="relative shadow-2xl bg-white border border-stone-300 transition-shadow"
                dir="ltr"
              >
                <canvas ref={canvasRef} className="block select-text" />
              </div>
            </div>
          )}
        </main>

        {/* Metadata Sidebar Drawer */}
        {showMetadata && (
          <aside className="w-80 border-s border-stone-800 bg-stone-950 p-6 overflow-y-auto space-y-6 text-xs text-stone-300 shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-amber-300/90">
                {t('readerRecord')}
              </h3>
              <button
                onClick={() => setShowMetadata(false)}
                className="text-stone-500 hover:text-stone-300 p-1"
              >
                ✕
              </button>
            </div>

            {book.originalTitle && (
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">Original Title</span>
                <p dir="rtl" className="font-arabic text-base text-amber-100 mt-1">
                  {book.originalTitle}
                </p>
              </div>
            )}

            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">Standard Title</span>
              <p className="font-serif text-sm font-semibold text-stone-100 mt-0.5">{book.title}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">{t('detailsAuthor')}</span>
              <p className="text-stone-200 mt-0.5">{book.author}</p>
              {book.originalAuthor && <p dir="rtl" className="font-arabic text-stone-400 text-xs mt-0.5">{book.originalAuthor}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-800/80">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">Discipline</span>
                <p className="text-emerald-400 mt-0.5">{book.category}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">Language</span>
                <p className="text-stone-200 mt-0.5">{book.language}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">Era</span>
                <p className="text-stone-200 mt-0.5">{book.eraOrYear || 'Classical'}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">{t('detailsCataloguedPages')}</span>
                <p className="font-mono tabular-nums text-stone-200 mt-0.5">{totalPages}</p>
              </div>
            </div>

            {book.publisherOrManuscriptSource && (
              <div className="pt-2 border-t border-stone-800/80">
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">{t('detailsProvenance')}</span>
                <p className="text-stone-400 mt-0.5">{book.publisherOrManuscriptSource}</p>
              </div>
            )}

            <div className="pt-2 border-t border-stone-800/80">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">{t('detailsSynopsis')}</span>
              <p className="text-stone-400 leading-relaxed mt-1">{book.description}</p>
            </div>

            <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-500">
              <span>{t('detailsAccessionId')}: MAK-{book.id.toUpperCase()}</span>
            </div>
          </aside>
        )}
      </div>

      {/* Mobile Floating Bottom Controls */}
      <div className="sm:hidden bg-stone-950 border-t border-stone-800 px-4 py-2 flex items-center justify-between" dir="ltr">
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1 || loading}
          className="flex items-center gap-1 text-xs text-stone-300 disabled:opacity-40 py-1 px-2"
        >
          <ChevronLeft className="w-4 h-4" /> {t('paginationPrev')}
        </button>

        <span className="font-mono tabular-nums text-xs text-stone-400">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages || loading}
          className="flex items-center gap-1 text-xs text-stone-300 disabled:opacity-40 py-1 px-2"
        >
          {t('paginationNext')} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
