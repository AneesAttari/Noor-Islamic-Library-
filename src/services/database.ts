/**
 * Database & Catalogue Repository for Noor - Islamic Library
 * Manages authentic classical books, user uploads, persistent IndexedDB catalogue,
 * search, categories, and high-capacity streaming storage for 250 MB files and 2,000+ volumes.
 */

import { Book, BookCategory, FilterOptions, LibraryStats } from '../types/library';
import { StorageService } from './storage';

const STORAGE_KEY = 'noor_library_catalog_v4';

// 10 Famous Authentic Classical Islamic Books across every category,
// including Tafseer-e-Baidawi and Tafseer-e-Jalalain
function buildDefaultBooks(): Book[] {
  return [
    {
      id: 'tafsir-al-baydawi',
      title: 'Tafsir al-Baydawi (Anwar al-Tanzil wa-Asrar al-Ta\'wil)',
      originalTitle: 'أنوار التنزيل وأسرار التأويل (تفسير البيضاوي)',
      author: 'Imam Nasir al-Din al-Baydawi',
      originalAuthor: 'الإمام ناصر الدين عبد الله بن عمر البيضاوي (ت ٦٨٥ هـ)',
      description:
        'Renowned across Islamic civilization as one of the preeminent classical commentaries of the Holy Quran. Celebrated for its mastery of Arabic rhetoric, syntactic subtleties, theological depth, and succinct gloss, serving for centuries as the standard advanced tafsir text in Ottoman, Arab, and South Asian madrasas.',
      category: 'Tafsir',
      language: 'Arabic',
      pdfUrl: '/books/tafsir-al-baydawi.pdf',
      coverUrl: '/covers/tafsir-al-baydawi.jpg',
      fileSize: 21012446,
      pageCount: 277,
      published: true,
      allowDownload: true,
      eraOrYear: '685 AH / 1286 CE',
      publisherOrManuscriptSource: 'Ottoman Imperial & Al-Azhar Classical Recension',
      createdAt: '2026-01-01T08:00:00.000Z',
      updatedAt: '2026-01-01T08:00:00.000Z',
      isSampleData: true,
    },
    {
      id: 'tafsir-al-jalalayn',
      title: 'Tafsir al-Jalalayn',
      originalTitle: 'تفسير الجلالين',
      author: 'Jalal al-Din al-Mahalli & Jalal al-Din al-Suyuti',
      originalAuthor: 'جلال الدين المحلي وجلال الدين السيوطي (ت ٩١١ هـ)',
      description:
        'The universally acclaimed, lucid exegetical masterpiece composed by the two Jalals—Jalal al-Din al-Mahalli and his distinguished student Jalal al-Din al-Suyuti. Famed for its elegant conciseness, illuminating linguistic nuances, occasions of revelation (asbab al-nuzul), and theological clarity.',
      category: 'Tafsir',
      language: 'Arabic / English',
      pdfUrl: '/books/tafsir-al-jalalayn.pdf',
      coverUrl: '/covers/tafsir-al-jalalayn.jpg',
      fileSize: 11066564,
      pageCount: 675,
      published: true,
      allowDownload: true,
      eraOrYear: '911 AH / 1505 CE',
      publisherOrManuscriptSource: 'Dr. Feras Hamza / Royal Aal al-Bayt Institute & Great Books of Islamic Civilization',
      createdAt: '2026-01-02T09:00:00.000Z',
      updatedAt: '2026-01-02T09:00:00.000Z',
      isSampleData: true,
    },
    {
      id: 'riyad-al-salihin',
      title: 'Riyad al-Salihin (Gardens of the Righteous)',
      originalTitle: 'رياض الصالحين من كلام سيد المرسلين',
      author: 'Imam Yahya ibn Sharaf al-Nawawi',
      originalAuthor: 'الإمام محيي الدين يحيى بن شرف النووي (ت ٦٧٦ هـ)',
      description:
        'The timeless compilation of authentic Prophetic traditions selected from the canonical six collections of Hadith. Categorized by Imam al-Nawawi into thematic sections on sincerity, repentance, steadfastness, piety, exemplary character, and daily supplications to cultivate moral and spiritual excellence.',
      category: 'Hadith',
      language: 'Arabic',
      pdfUrl: '/books/riyad-al-salihin.pdf',
      coverUrl: '/covers/riyad-al-salihin.jpg',
      fileSize: 4650296,
      pageCount: 686,
      published: true,
      allowDownload: true,
      eraOrYear: '676 AH / 1277 CE',
      publisherOrManuscriptSource: 'Dar Ihya al-Kutub al-Arabiyyah / Classical Damascus Edition',
      createdAt: '2026-01-03T10:00:00.000Z',
      updatedAt: '2026-01-03T10:00:00.000Z',
      isSampleData: true,
    },
    {
      id: 'al-aqeedah-al-tahawiyyah',
      title: 'Al-Aqeedah al-Tahawiyyah',
      originalTitle: 'بيان عقيدة أهل السنة والجماعة (العقيدة الطحاوية)',
      author: 'Imam Abu Ja\'far al-Tahawi',
      originalAuthor: 'الإمام أحمد بن محمد بن سلامة الطحاوي الأزدي (ت ٣٢١ هـ)',
      description:
        'The authoritative exposition of orthodox Sunni creed (Ahl al-Sunnah wa al-Jama\'ah) formulated by the great Egyptian muhaddith and jurist Imam al-Tahawi. Articulates the foundational tenets of Islamic monotheism (Tawhid), the transcendence of the divine attributes, prophetic truth, and the realities of the unseen.',
      category: 'Aqeedah',
      language: 'Arabic / English',
      pdfUrl: '/books/al-aqeedah-al-tahawiyyah.pdf',
      coverUrl: '/covers/al-aqeedah-al-tahawiyyah.jpg',
      fileSize: 25900175,
      pageCount: 60,
      published: true,
      allowDownload: true,
      eraOrYear: '321 AH / 933 CE',
      publisherOrManuscriptSource: 'Hamza Yusuf Translation / Zaytuna Institute & Fons Vitae',
      createdAt: '2026-01-04T11:00:00.000Z',
      updatedAt: '2026-01-04T11:00:00.000Z',
      isSampleData: true,
    },
    {
      id: 'al-hidayah',
      title: 'Al-Hidayah fi Sharh Bidayat al-Mubtadi',
      originalTitle: 'الهداية في شرح بداية المبتدي',
      author: 'Burhan al-Din al-Marghinani',
      originalAuthor: 'الإمام برهان الدين علي بن أبي بكر المرغيناني (ت ٥٩٣ هـ)',
      description:
        'The quintessential masterwork of comparative jurisprudence and the crowning legal text of the Hanafi school. Renowned for its rigorous dialectical analysis, comprehensive presentation of legal proofs, and systematic exposition of juristic rulings across worship, civil law, family law, and commerce.',
      category: 'Fiqh',
      language: 'Urdu',
      pdfUrl: '/books/al-hidayah.pdf',
      coverUrl: '/covers/al-hidayah.jpg',
      fileSize: 13261504,
      pageCount: 757,
      published: true,
      allowDownload: true,
      eraOrYear: '593 AH / 1197 CE',
      publisherOrManuscriptSource: 'Maktaba Rahmaniyya / Classical Central Asian Juristic Codex',
      createdAt: '2026-01-05T12:00:00.000Z',
      updatedAt: '2026-01-05T12:00:00.000Z',
      isSampleData: true,
    },
    {
      id: 'al-waraqat-usul-al-fiqh',
      title: 'Al-Waraqat fi Usul al-Fiqh',
      originalTitle: 'الورقات في أصول الفقه',
      author: 'Imam al-Haramayn al-Juwayni',
      originalAuthor: 'عبد الملك بن عبد الله الجويني (ت ٤٧٨ هـ)',
      description:
        'The acclaimed foundational treatise on Islamic legal epistemology and jurisprudence methodology (Usul al-Fiqh). Concisely delineates the classifications of legal rulings, linguistic expressions, consensus (Ijma), juristic analogy (Qiyas), and the criteria of qualified legal deduction (Ijtihad).',
      category: 'Usul al-Fiqh',
      language: 'Arabic / English',
      pdfUrl: '/books/al-waraqat-usul-al-fiqh.pdf',
      coverUrl: '/covers/al-waraqat-usul-al-fiqh.jpg',
      fileSize: 757014,
      pageCount: 17,
      published: true,
      allowDownload: true,
      eraOrYear: '478 AH / 1085 CE',
      publisherOrManuscriptSource: 'Nizamiyya Manuscript Recension / Classical Cairo Edition',
      createdAt: '2026-01-06T13:00:00.000Z',
      updatedAt: '2026-01-06T13:00:00.000Z',
      isSampleData: true,
    },
    {
      id: 'al-ajrumiyyah-commentary',
      title: 'A Commentary on al-Ajrumiyyah (Al-Tuhfat al-Saniyyah)',
      originalTitle: 'شرح المقدمة الآجرومية - التحفة السنية',
      author: 'Ibn Ajurrum & Muhammad Muhyiddin Abd al-Hamid',
      originalAuthor: 'محمد بن آجروم ومحمد محيي الدين عبد الحميد',
      description:
        'The gold standard primer on classical Arabic syntax and grammatical analysis (Nahw). Provides thorough explanations of grammatical inflection (I\'rab), case endings, nominal and verbal structures, and syntactical rules vital for authentic comprehension of sacred texts.',
      category: 'Arabic Language',
      language: 'Arabic / English',
      pdfUrl: '/books/al-ajrumiyyah-commentary.pdf',
      coverUrl: '/covers/al-ajrumiyyah-commentary.jpg',
      fileSize: 20849482,
      pageCount: 409,
      published: true,
      allowDownload: true,
      eraOrYear: '723 AH / 1323 CE',
      publisherOrManuscriptSource: 'Bilingual Academic Critical Edition',
      createdAt: '2026-01-07T14:00:00.000Z',
      updatedAt: '2026-01-07T14:00:00.000Z',
      isSampleData: true,
    },
    {
      id: 'ar-raheeq-al-makhtum',
      title: 'Ar-Raheeq Al-Makhtum (The Sealed Nectar)',
      originalTitle: 'الرحيق المختوم - بحث في السيرة النبوية على صاحبها أفضل الصلاة والسلام',
      author: 'Safiur Rahman Mubarakpuri',
      originalAuthor: 'الشيخ صفي الرحمن المباركفوري (ت ١٤٢٧ هـ)',
      description:
        'The world-famous, award-winning biography of the Prophet Muhammad (peace and blessings be upon him). Awarded first prize worldwide by the Muslim World League, noted for its historical rigor, narrative depth, and thorough collation of early authentic sources.',
      category: 'Seerah',
      language: 'English',
      pdfUrl: '/books/ar-raheeq-al-makhtum.pdf',
      coverUrl: '/covers/ar-raheeq-al-makhtum.jpg',
      fileSize: 7076124,
      pageCount: 504,
      published: true,
      allowDownload: true,
      eraOrYear: 'Contemporary Classic (1399 AH / 1979 CE)',
      publisherOrManuscriptSource: 'Muslim World League / Darussalam Publishers',
      createdAt: '2026-01-08T15:00:00.000Z',
      updatedAt: '2026-01-08T15:00:00.000Z',
      isSampleData: true,
    },
    {
      id: 'tarikh-al-tabari',
      title: 'Tarikh al-Tabari (The History of al-Tabari)',
      originalTitle: 'تاريخ الرسل والملوك (تاريخ الطبري)',
      author: 'Imam Abu Ja\'far Muhammad ibn Jarir al-Tabari',
      originalAuthor: 'الإمام محمد بن جرير الطبري (ت ٣١٠ هـ)',
      description:
        'The crowning achievement of classical Islamic historiography. Imam al-Tabari compiles a monumental, authoritative chronicle from the creation of the world and prophetic genealogies through the era of the Prophet, the Rightly Guided Caliphate, and subsequent dynasties with full chains of transmission (isnad).',
      category: 'Islamic History',
      language: 'English',
      pdfUrl: '/books/tarikh-al-tabari.pdf',
      coverUrl: '/covers/tarikh-al-tabari.jpg',
      fileSize: 21839933,
      pageCount: 436,
      published: true,
      allowDownload: true,
      eraOrYear: '310 AH / 923 CE',
      publisherOrManuscriptSource: 'State University of New York (SUNY) Press / Bibliotheca Persica',
      createdAt: '2026-01-09T16:00:00.000Z',
      updatedAt: '2026-01-09T16:00:00.000Z',
      isSampleData: true,
    },
    {
      id: 'ihya-ulum-al-din',
      title: 'Ihya\' Ulum al-Din (Revival of the Religious Sciences)',
      originalTitle: 'إحياء علوم الدين',
      author: 'Hujjat al-Islam Abu Hamid al-Ghazali',
      originalAuthor: 'الإمام أبو حامد محمد بن محمد الغزالي (ت ٥٠٥ هـ)',
      description:
        'The magnum opus of Imam al-Ghazali and one of the most transformative spiritual and intellectual landmarks in Islamic history. Reconnects outward acts of worship and transactions with their inner spiritual life, providing profound guidance on self-purification, character refinement, and closeness to God.',
      category: 'Ethics & Tazkiyah',
      language: 'English',
      pdfUrl: '/books/ihya-ulum-al-din.pdf',
      coverUrl: '/covers/ihya-ulum-al-din.jpg',
      fileSize: 6781148,
      pageCount: 262,
      published: true,
      allowDownload: true,
      eraOrYear: '505 AH / 1111 CE',
      publisherOrManuscriptSource: 'Classical Translation & Islamic Heritage Publication',
      createdAt: '2026-01-10T17:00:00.000Z',
      updatedAt: '2026-01-10T17:00:00.000Z',
      isSampleData: true,
    },
  ];
}

class Database {
  private memoryBooks: Book[] = [];
  private initialized: boolean = false;

  private async initialize(): Promise<void> {
    if (this.initialized) return;

    // 1. Try loading persistent catalogue from IndexedDB first (resilient against quota limits)
    let loadedBooks: Book[] = [];
    try {
      loadedBooks = await StorageService.loadBooksFromDb();
    } catch {
      loadedBooks = [];
    }

    // 2. Fall back to localStorage if IndexedDB had no catalog yet
    if (!loadedBooks || loadedBooks.length === 0) {
      if (typeof window !== 'undefined') {
        try {
          const storedJson = localStorage.getItem(STORAGE_KEY);
          if (storedJson) {
            loadedBooks = JSON.parse(storedJson);
          }
        } catch {
          loadedBooks = [];
        }
      }
    }

    const authenticDefaults = buildDefaultBooks();

    // Check if loaded books contain old artificial mock books
    const hasOldArtificialBooks = loadedBooks.some(
      (b) =>
        b.id === 'al-arbain-an-nawawiyya' ||
        b.id === 'bidayat-al-hidayah' ||
        b.id === 'tafsir-al-jalalayn-fatihah' ||
        b.id === 'draft-fiqh-al-ibadat' ||
        b.id === 'mukhtasar-sirat-an-nabawiyyah'
    );
    const hasAuthenticBaydawi = loadedBooks.some((b) => b.id === 'tafsir-al-baydawi');
    const hasSvgCovers = loadedBooks.some((b) => b.id === 'tafsir-al-baydawi' && b.coverUrl?.endsWith('.svg'));

    // If empty or containing old artificial books or missing authentic books or needing cover upgrades, refresh
    if (loadedBooks.length === 0 || hasOldArtificialBooks || !hasAuthenticBaydawi || !hasSvgCovers) {
      // Retain any user-uploaded books (where isSampleData is not true)
      const userUploadedBooks = loadedBooks.filter((b) => !b.isSampleData);

      // Prepend user-uploaded books, followed by authentic classical collection
      this.memoryBooks = [...userUploadedBooks, ...authenticDefaults];
      await this.persist();
    } else {
      this.memoryBooks = loadedBooks;
    }

    this.initialized = true;
  }

  private async persist(): Promise<void> {
    if (typeof window === 'undefined') return;

    // 1. Primary permanent store: IndexedDB (handles thousands of records and hundreds of gigabytes)
    try {
      await StorageService.saveBooksToDb(this.memoryBooks);
    } catch (err) {
      console.warn('Failed to save books to IndexedDB:', err);
    }

    // 2. Secondary cache: localStorage (with strict quota safety)
    try {
      const slimBooks = this.memoryBooks.slice(0, 100).map((b) => {
        // Strip excessively long data URLs to prevent QuotaExceededError in localStorage
        if (b.coverUrl && b.coverUrl.length > 50000) {
          return { ...b, coverUrl: undefined };
        }
        return b;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slimBooks));
    } catch {
      // ignore quota exceeded if too large
    }
  }

  /**
   * Public Catalogue: only published books are returned.
   * Drafts are strictly excluded to enforce security requirements.
   */
  async getPublishedBooks(filter?: FilterOptions): Promise<Book[]> {
    await this.initialize();
    let books = this.memoryBooks.filter((b) => b.published === true);

    if (filter) {
      if (filter.searchQuery && filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase().trim();
        books = books.filter(
          (b) =>
            b.title.toLowerCase().includes(query) ||
            b.author.toLowerCase().includes(query) ||
            (b.originalTitle && b.originalTitle.includes(query)) ||
            (b.originalAuthor && b.originalAuthor.includes(query)) ||
            b.description.toLowerCase().includes(query) ||
            b.category.toLowerCase().includes(query)
        );
      }

      if (filter.category && filter.category !== 'All') {
        books = books.filter((b) => b.category === filter.category);
      }

      if (filter.language && filter.language !== 'All') {
        books = books.filter((b) => b.language === filter.language);
      }

      if (filter.sortBy) {
        switch (filter.sortBy) {
          case 'title':
            books = [...books].sort((a, b) => a.title.localeCompare(b.title));
            break;
          case 'author':
            books = [...books].sort((a, b) => a.author.localeCompare(b.author));
            break;
          case 'era':
            books = [...books].sort((a, b) => (a.eraOrYear || '').localeCompare(b.eraOrYear || ''));
            break;
          case 'newest':
          default:
            books = [...books].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
        }
      }
    }

    return books;
  }

  /**
   * Get single book: drafts are only accessible if explicitly requested (admin)
   */
  async getBookById(id: string, includeDrafts: boolean = false): Promise<Book | null> {
    await this.initialize();
    const book = this.memoryBooks.find((b) => b.id === id);
    if (!book) return null;

    if (!book.published && !includeDrafts) {
      // Hide unpublished drafts from public visitors!
      return null;
    }

    // Ensure URLs are live and fresh from IndexedDB
    if (book.pdfStorageKey) {
      const livePdf = await StorageService.resolveUrl(book.pdfStorageKey);
      if (livePdf) {
        book.pdfUrl = livePdf;
      }
    } else if (book.pdfUrl && !book.pdfUrl.startsWith('http') && !book.pdfUrl.startsWith('/')) {
      book.pdfUrl = await StorageService.resolveUrl(book.pdfUrl);
    }

    if (book.coverStorageKey) {
      const liveCover = await StorageService.resolveUrl(book.coverStorageKey);
      if (liveCover) {
        book.coverUrl = liveCover;
      }
    }

    return book;
  }

  /**
   * Admin Catalogue: returns all books including drafts
   */
  async getAllBooksAdmin(filter?: FilterOptions): Promise<Book[]> {
    await this.initialize();
    let books = [...this.memoryBooks];

    if (filter) {
      if (filter.searchQuery && filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase().trim();
        books = books.filter(
          (b) =>
            b.title.toLowerCase().includes(query) ||
            b.author.toLowerCase().includes(query) ||
            b.category.toLowerCase().includes(query)
        );
      }

      if (filter.status === 'published') {
        books = books.filter((b) => b.published === true);
      } else if (filter.status === 'draft') {
        books = books.filter((b) => b.published === false);
      }

      if (filter.category && filter.category !== 'All') {
        books = books.filter((b) => b.category === filter.category);
      }
    }

    return [...books].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  /**
   * Admin Create Book
   */
  async createBook(data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    await this.initialize();
    const now = new Date().toISOString();
    const id =
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
      '-' +
      Date.now().toString(36);

    const newBook: Book = {
      ...data,
      id,
      published: data.published !== undefined ? data.published : true,
      createdAt: now,
      updatedAt: now,
    };

    // Prepend new book so it appears immediately at the top of the homepage and library
    this.memoryBooks = [newBook, ...this.memoryBooks];
    await this.persist();
    return newBook;
  }

  /**
   * Admin Update Book
   */
  async updateBook(id: string, updates: Partial<Omit<Book, 'id' | 'createdAt'>>): Promise<Book> {
    await this.initialize();
    const index = this.memoryBooks.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error(`Book with ID "${id}" was not found in the archive repository.`);
    }

    const existing = this.memoryBooks[index];
    const updated: Book = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.memoryBooks[index] = updated;
    await this.persist();
    return updated;
  }

  /**
   * Admin Delete Book
   */
  async deleteBook(id: string): Promise<boolean> {
    await this.initialize();
    const bookToDelete = this.memoryBooks.find((b) => b.id === id);
    if (!bookToDelete) return false;

    // Clean up stored binaries if storage keys exist
    if (bookToDelete.pdfStorageKey) {
      await StorageService.deleteFile(bookToDelete.pdfStorageKey);
    }
    if (bookToDelete.coverStorageKey) {
      await StorageService.deleteFile(bookToDelete.coverStorageKey);
    }

    this.memoryBooks = this.memoryBooks.filter((b) => b.id !== id);
    await this.persist();
    return true;
  }

  /**
   * Get Library Stats
   */
  async getStats(): Promise<LibraryStats> {
    await this.initialize();
    const totalBooks = this.memoryBooks.length;
    const publishedBooks = this.memoryBooks.filter((b) => b.published).length;
    const draftBooks = this.memoryBooks.filter((b) => !b.published).length;
    const categories = new Set(this.memoryBooks.map((b) => b.category));
    const totalVolumeBytes = this.memoryBooks.reduce((sum, b) => sum + (b.fileSize || 0), 0);

    return {
      totalBooks,
      publishedBooks,
      draftBooks,
      totalCategories: categories.size,
      totalVolumeBytes,
    };
  }

  /**
   * Reset catalogue to authentic classical collection
   */
  async resetToAuthenticLibrary(): Promise<void> {
    const userUploadedBooks = this.memoryBooks.filter((b) => !b.isSampleData);
    this.memoryBooks = [...userUploadedBooks, ...buildDefaultBooks()];
    await this.persist();
  }

  async resetToDefaults(): Promise<void> {
    return this.resetToAuthenticLibrary();
  }

  async togglePublishStatus(id: string): Promise<Book> {
    await this.initialize();
    const book = this.memoryBooks.find((b) => b.id === id);
    if (!book) throw new Error(`Book with ID "${id}" was not found.`);
    return this.updateBook(id, { published: !book.published });
  }

  getStatistics(): Promise<LibraryStats> {
    return this.getStats();
  }

  /**
   * Export archive backup
   */
  async exportArchiveBackup(): Promise<{ fileName: string; jsonContent: string }> {
    await this.initialize();
    const blobs = await StorageService.exportAllBlobs();
    const backupPayload = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      archiveName: 'Noor - Islamic Library',
      totalBooks: this.memoryBooks.length,
      books: this.memoryBooks,
      blobs,
    };
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `noor_islamic_library_backup_${dateStr}.json`;
    return {
      fileName,
      jsonContent: JSON.stringify(backupPayload, null, 2),
    };
  }

  /**
   * Import archive backup from JSON string
   */
  async importArchiveBackup(jsonString: string): Promise<{ success: boolean; bookCount: number }> {
    try {
      const data = JSON.parse(jsonString);
      if (!data || !Array.isArray(data.books)) {
        throw new Error('Invalid backup file format: missing books array.');
      }

      if (data.blobs && typeof data.blobs === 'object') {
        await StorageService.restoreBlobs(data.blobs);
      }

      this.memoryBooks = data.books;
      await this.persist();
      return { success: true, bookCount: data.books.length };
    } catch (err: any) {
      console.error('Backup restore failed:', err);
      throw new Error(err.message || 'Failed to restore archive backup.');
    }
  }
}

export const LibraryDatabase = new Database();
