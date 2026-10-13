/**
 * PDF First-Page Renderer & Thumbnail Generator
 * Renders authentic high-resolution first page of any PDF document into an image data URL.
 * Automatically extracts total page count and page dimensions.
 */

import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  }
}

// In-memory cache for generated thumbnail data URLs
const thumbnailMemoryCache = new Map<string, string>();

export interface PdfThumbnailResult {
  dataUrl: string;
  numPages: number;
  width: number;
  height: number;
}

/**
 * Extract the first page of a PDF as a high-quality image Data URL.
 * Works with File, Blob, ArrayBuffer, or URL string.
 */
export async function extractFirstPageThumbnail(
  source: File | Blob | ArrayBuffer | string,
  cacheKey?: string
): Promise<PdfThumbnailResult> {
  if (cacheKey && thumbnailMemoryCache.has(cacheKey)) {
    return {
      dataUrl: thumbnailMemoryCache.get(cacheKey)!,
      numPages: 1,
      width: 600,
      height: 800,
    };
  }

  let tempBlobUrl: string | null = null;
  let loadingTask: any;

  try {
    if (source instanceof File || source instanceof Blob) {
      tempBlobUrl = URL.createObjectURL(source);
      loadingTask = pdfjsLib.getDocument({
        url: tempBlobUrl,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
        cMapPacked: true,
      });
    } else if (source instanceof ArrayBuffer) {
      loadingTask = pdfjsLib.getDocument({
        data: source,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
        cMapPacked: true,
      });
    } else if (typeof source === 'string') {
      loadingTask = pdfjsLib.getDocument({
        url: source,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
        cMapPacked: true,
      });
    } else {
      throw new Error('Unsupported PDF source type for thumbnail extraction');
    }

    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages || 1;
    const page = await pdfDoc.getPage(1);

    // High quality viewport for crisp manuscript rendering
    const unscaled = page.getViewport({ scale: 1.0 });
    const targetWidth = 640;
    const scale = Math.max(1.0, targetWidth / (unscaled.width || 600));
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) {
      throw new Error('Canvas 2D context unavailable');
    }

    // Draw clean paper background first
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

    if (cacheKey) {
      thumbnailMemoryCache.set(cacheKey, dataUrl);
    }

    return {
      dataUrl,
      numPages,
      width: canvas.width,
      height: canvas.height,
    };
  } finally {
    if (tempBlobUrl) {
      URL.revokeObjectURL(tempBlobUrl);
    }
  }
}
