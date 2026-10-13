/**
 * Complete translation dictionaries for Maktaba Islamic Digital Library.
 * Supports English (LTR) and natural Urdu (RTL) across all interface views.
 */

export type Language = 'en' | 'ur';

export interface Translations {
  // Common / Navbar
  brandName: string;
  brandTagline: string;
  navHome: string;
  navCatalogue: string;
  navHadith: string;
  navAqeedah: string;
  navFiqh: string;
  navAdminPanel: string;
  navAdminSignIn: string;
  switchLanguage: string;
  searchPlaceholder: string;
  searchArchiveBtn: string;
  quickExplore: string;

  // Categories
  catHadith: string;
  catAqeedah: string;
  catFiqh: string;
  catTafsir: string;
  catArabicLanguage: string;
  catEthics: string;
  catUsul: string;
  catSeerah: string;
  catHistory: string;
  catAll: string;

  // Category hints / descriptions
  catHadithDesc: string;
  catAqeedahDesc: string;
  catFiqhDesc: string;
  catTafsirDesc: string;
  catArabicDesc: string;
  catEthicsDesc: string;
  catUsulDesc: string;
  catSeerahDesc: string;

  // Home Page
  homeArchiveKicker: string;
  homeHeroTitle: string;
  homeHeroDesc: string;
  homeFeaturedKicker: string;
  homeFeaturedTitle: string;
  homeBrowseFull: string;
  homeClassificationKicker: string;
  homeClassificationTitle: string;
  homeClassificationDesc: string;
  homeRecentKicker: string;
  homeRecentTitle: string;
  homeViewAll: string;
  homeCharterKicker: string;
  homeCharterTitle: string;
  homeCharterDesc: string;
  homeCharterPoints: string[];

  // Library / Catalogue Page
  catalogueKicker: string;
  catalogueTitle: string;
  catalogueDesc: string;
  filterDiscipline: string;
  filterLanguage: string;
  filterSortBy: string;
  sortNewest: string;
  sortTitle: string;
  sortAuthor: string;
  sortEra: string;
  filterReset: string;
  resultsShowing: string;
  resultsMatching: string;
  resultsIn: string;
  pageOf: string;
  noBooksFound: string;
  noBooksFoundDesc: string;
  paginationPrev: string;
  paginationNext: string;

  // Book Card
  cardSeries: string;
  cardReadOnline: string;
  cardDetails: string;
  cardRead: string;
  cardPages: string;

  // Book Details Page
  detailsBack: string;
  detailsReadOnline: string;
  detailsDownloadPdf: string;
  detailsDownloadRestricted: string;
  detailsShareLink: string;
  detailsLinkCopied: string;
  detailsAuthor: string;
  detailsSynopsis: string;
  detailsTechnicalMetadata: string;
  detailsAccessionId: string;
  detailsFormat: string;
  detailsVolumeSize: string;
  detailsCataloguedPages: string;
  detailsProvenance: string;
  detailsAccessProtocol: string;
  detailsOpenAccessNotice: string;
  detailsIntegrityNotice: string;
  detailsUnavailable: string;

  // Reader Page
  readerBack: string;
  readerPage: string;
  readerOf: string;
  readerZoomIn: string;
  readerZoomOut: string;
  readerFitWidth: string;
  readerFitPage: string;
  readerDownload: string;
  readerFullscreen: string;
  readerExitFullscreen: string;
  readerRecord: string;
  readerLoading: string;
  readerEngine: string;
  readerNotice: string;
  readerOpenDirectly: string;
  readerReturnCatalogue: string;
  readerRestrictedTitle: string;
  readerRestrictedDraft: string;
  readerSignInAdmin: string;

  // Admin Login
  adminLoginKicker: string;
  adminLoginTitle: string;
  adminLoginDesc: string;
  adminEmailLabel: string;
  adminPasswordLabel: string;
  adminSignInBtn: string;
  adminForgotPasswordBtn: string;
  adminDemoCredsBtn: string;
  adminCredsFilled: string;
  adminReturnHome: string;

  // Password Reset
  forgotPasswordTitle: string;
  forgotPasswordDesc: string;
  sendResetLinkBtn: string;
  backToLoginBtn: string;
  resetEmailSentSuccess: string;
  resetEmailSentDetail: string;
  resetEmailNotFound: string;
  resetPasswordDashboardTitle: string;
  resetPasswordDashboardDesc: string;
  resetPasswordDashboardAction: string;
  resetPasswordConfirmPrompt: string;
  newPasswordLabel: string;
  updatePasswordBtn: string;
  passwordUpdatedSuccess: string;

  // Admin Dashboard
  adminDashboardKicker: string;
  adminDashboardTitle: string;
  adminAddNewBtn: string;
  adminSignOutBtn: string;
  adminStatTotal: string;
  adminStatPublished: string;
  adminStatDrafts: string;
  adminStatVolume: string;
  adminStorageCheckpointTitle: string;
  adminStorageCheckpointDesc: string;
  adminTableManuscript: string;
  adminTableDiscipline: string;
  adminTableSizePages: string;
  adminTableStatus: string;
  adminTableActions: string;
  adminStatusPublished: string;
  adminStatusDraft: string;
  adminTabAll: string;
  adminTabPublished: string;
  adminTabDrafts: string;
  adminSearchPlaceholder: string;
  adminDeleteConfirmTitle: string;
  adminDeleteConfirmDesc: string;
  adminDeleteCancel: string;
  adminDeleteConfirm: string;
  adminResetDefaults: string;

  // Backup & Deployment Preservation
  adminBackupTitle: string;
  adminBackupDesc: string;
  adminExportBackupBtn: string;
  adminRestoreBackupBtn: string;
  adminBackupSuccess: string;
  adminRestoreSuccess: string;
  adminRestoreFailed: string;

  // Admin Book Form
  formEditTitle: string;
  formNewTitle: string;
  formRequiredNotice: string;
  formSection1: string;
  formSection2: string;
  formSection3: string;
  formSection4: string;
  formTitleLabel: string;
  formOriginalTitleLabel: string;
  formAuthorLabel: string;
  formOriginalAuthorLabel: string;
  formSynopsisLabel: string;
  formCategoryLabel: string;
  formLanguageLabel: string;
  formEraLabel: string;
  formProvenanceLabel: string;
  formPdfUploadLabel: string;
  formCoverUploadLabel: string;
  formPublishToggleLabel: string;
  formPublishToggleDesc: string;
  formDownloadToggleLabel: string;
  formDownloadToggleDesc: string;
  formCancelBtn: string;
  formSaveBtn: string;

  // Footer
  footerAboutText: string;
  footerDisciplinesKicker: string;
  footerCatalogueKicker: string;
  footerAdminKicker: string;
  footerCopyright: string;
  footerStandardsNotice: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brandName: 'Noor',
    brandTagline: 'Islamic Library',
    navHome: 'Home',
    navCatalogue: 'Catalogue',
    navHadith: 'Classical Hadith',
    navAqeedah: 'Theology & Creed',
    navFiqh: 'Jurisprudence',
    navAdminPanel: 'Admin Panel',
    navAdminSignIn: 'Admin Sign In',
    switchLanguage: 'اردو',
    searchPlaceholder: 'Search by title, author, or discipline (e.g. Nawawi, Aqeedah, Nahw)...',
    searchArchiveBtn: 'Search Archive',
    quickExplore: 'Quick explore:',

    catHadith: 'Hadith',
    catAqeedah: 'Aqeedah',
    catFiqh: 'Fiqh',
    catTafsir: 'Tafsir',
    catArabicLanguage: 'Arabic Language',
    catEthics: 'Ethics & Tazkiyah',
    catUsul: 'Usul al-Fiqh',
    catSeerah: 'Seerah',
    catHistory: 'Islamic History',
    catAll: 'All Disciplines',

    catHadithDesc: 'Primary collections, authentic traditions, and classical commentaries.',
    catAqeedahDesc: 'Orthodox creed of Ahl as-Sunnah, treatises on divine oneness and foundational tenets.',
    catFiqhDesc: 'Rulings of worship, legal transactions, and comparative juristic rulings.',
    catTafsirDesc: 'Classical commentaries, linguistic analysis, and occasions of divine revelation.',
    catArabicDesc: 'Foundational nahw, sarf, and balaghah keys to understanding the texts.',
    catEthicsDesc: 'Purification of the soul, inner conduct, sincere devotion, and moral excellence.',
    catUsulDesc: 'Epistemology, textual derivation, consensus, and juristic hermeneutics.',
    catSeerahDesc: 'Chronicles of the noble life, character, and mission of the Messenger of Allah ﷺ.',

    homeArchiveKicker: 'Noor - Islamic Library · Classical Digital Archive',
    homeHeroTitle: 'Scholarly preservation of classical Islamic literature.',
    homeHeroDesc:
      'A minimalist digital library dedicated to authentic Islamic books in PDF format. Browse foundational treatises, read verified manuscripts in your browser, and explore centuries of sacred scholarship without barriers.',
    homeFeaturedKicker: 'Curated Exemplars',
    homeFeaturedTitle: 'Featured Treatises',
    homeBrowseFull: 'Browse Full Catalogue',
    homeClassificationKicker: 'Classification',
    homeClassificationTitle: 'Disciplines of Islamic Learning',
    homeClassificationDesc:
      'Classical Islamic scholarship is organized according to distinct epistemological branches, each preserving an essential dimension of sacred transmission.',
    homeRecentKicker: 'Recent Accessions',
    homeRecentTitle: 'Recently Catalogued',
    homeViewAll: 'View All',
    homeCharterKicker: 'Archival Charter',
    homeCharterTitle: 'Preserving sacred wisdom with digital integrity.',
    homeCharterDesc:
      'Every document in the Noor - Islamic Library collection is catalogued with strict adherence to classical attribution, verified author lineage, and unabridged textual fidelity. In-browser PDF rendering guarantees open access from any device without barriers.',
    homeCharterPoints: [
      '· Zero Paywalls',
      '· Authentic Manuscripts',
      '· W3C Compliant Access',
      '· Academic PDF.js Engine',
    ],

    catalogueKicker: 'Library Catalogue',
    catalogueTitle: 'Published Scholarly Treatises',
    catalogueDesc:
      'Search and examine authentic Islamic texts across Hadith, Aqeedah, Fiqh, Tafsir, and Arabic grammar. All editions are available for immediate in-browser reading without registration.',
    filterDiscipline: 'Discipline:',
    filterLanguage: 'Language:',
    filterSortBy: 'Sort by:',
    sortNewest: 'Recently Catalogued',
    sortTitle: 'Title (A - Z)',
    sortAuthor: 'Author Name',
    sortEra: 'Classical Chronology',
    filterReset: 'Reset Filters',
    resultsShowing: 'Showing',
    resultsMatching: 'matching',
    resultsIn: 'in',
    pageOf: 'of',
    noBooksFound: 'No Published Manuscripts Found',
    noBooksFoundDesc:
      'No books match the specified criteria. Try clearing search keywords or selecting another discipline.',
    paginationPrev: 'Previous',
    paginationNext: 'Next',

    cardSeries: 'Noor Classical Series',
    cardReadOnline: 'Read Online',
    cardDetails: 'Details',
    cardRead: 'Read',
    cardPages: 'pp',

    detailsBack: 'Back to Catalogue',
    detailsReadOnline: 'Read Online (PDF Viewer)',
    detailsDownloadPdf: 'Download PDF',
    detailsDownloadRestricted:
      'Direct downloads restricted by curatorial permissions. Available for in-browser reading.',
    detailsShareLink: 'Share Manuscript Link',
    detailsLinkCopied: 'Link Copied to Clipboard',
    detailsAuthor: 'Author:',
    detailsSynopsis: 'Manuscript Synopsis & Scope',
    detailsTechnicalMetadata: 'Accession & Technical Metadata',
    detailsAccessionId: 'Accession Identifier',
    detailsFormat: 'Document Format',
    detailsVolumeSize: 'Volume Size',
    detailsCataloguedPages: 'Catalogued Pages',
    detailsProvenance: 'Manuscript / Provenance Source',
    detailsAccessProtocol: 'Access Protocol',
    detailsOpenAccessNotice: 'Open Scholarly Access (No Login Required)',
    detailsIntegrityNotice:
      'This digital edition has been verified for complete structural integrity and textual fidelity. Readers can freely inspect and read the text directly in the browser.',
    detailsUnavailable: 'Manuscript Unavailable',

    readerBack: 'Back',
    readerPage: 'Page',
    readerOf: 'of',
    readerZoomIn: 'Zoom In',
    readerZoomOut: 'Zoom Out',
    readerFitWidth: 'Fit Width',
    readerFitPage: 'Fit Page',
    readerDownload: 'Download PDF Document',
    readerFullscreen: 'Fullscreen',
    readerExitFullscreen: 'Exit Fullscreen',
    readerRecord: 'Bibliographic Record',
    readerLoading: 'Rendering manuscript pages...',
    readerEngine: 'Mozilla PDF.js Engine',
    readerNotice: 'Document Rendering Notice',
    readerOpenDirectly: 'Open PDF Directly',
    readerReturnCatalogue: 'Return to Catalogue',
    readerRestrictedTitle: 'Access Restricted',
    readerRestrictedDraft:
      'This manuscript is currently in draft review and has not been published for public access. Administrator authorization is required.',
    readerSignInAdmin: 'Sign In as Admin',

    adminLoginKicker: 'Librarian Sign In',
    adminLoginTitle: 'Administrator Sign In',
    adminLoginDesc:
      'Restricted administrative portal for managing the digital library catalogue and uploading manuscripts.',
    adminEmailLabel: 'Administrator Email',
    adminPasswordLabel: 'Password',
    adminSignInBtn: 'Sign In as Administrator',
    adminForgotPasswordBtn: 'Forgot password?',
    adminDemoCredsBtn: 'Auto-Fill Admin Credentials',
    adminCredsFilled: 'Credentials Filled',
    adminReturnHome: 'Return to Library Home',

    forgotPasswordTitle: 'Administrator Password Reset',
    forgotPasswordDesc:
      'Enter your registered administrator email address. A password reset instruction will be dispatched securely.',
    sendResetLinkBtn: 'Send Password Reset Link',
    backToLoginBtn: 'Back to Sign In',
    resetEmailSentSuccess: 'Password reset dispatch confirmed.',
    resetEmailSentDetail:
      'A secure password reset link has been dispatched to {email}. Follow the instructions to reset your password.',
    resetEmailNotFound: 'No administrator account found with that email address.',
    resetPasswordDashboardTitle: 'Security & Password Reset',
    resetPasswordDashboardDesc:
      'Send a password reset email to your administrator account or update your credentials directly.',
    resetPasswordDashboardAction: 'Request Password Reset Email',
    resetPasswordConfirmPrompt:
      'Are you sure you want to request a password reset email for {email}?',
    newPasswordLabel: 'New Password',
    updatePasswordBtn: 'Update Password',
    passwordUpdatedSuccess: 'Your administrator password has been updated successfully.',

    adminDashboardKicker: 'Restricted Administration Area',
    adminDashboardTitle: 'Catalogue Management Dashboard',
    adminAddNewBtn: 'Add New Manuscript',
    adminSignOutBtn: 'Sign Out',
    adminStatTotal: 'Total Manuscripts',
    adminStatPublished: 'Published Publicly',
    adminStatDrafts: 'Unpublished Drafts',
    adminStatVolume: 'Catalogued Volume',
    adminStorageCheckpointTitle: 'Storage & Deployment Checkpoint',
    adminStorageCheckpointDesc:
      'Durable storage active. Uploaded manuscripts and metadata are isolated from code releases and preserved.',
    adminTableManuscript: 'Manuscript & Title',
    adminTableDiscipline: 'Discipline',
    adminTableSizePages: 'Size & Pages',
    adminTableStatus: 'Publication Status',
    adminTableActions: 'Actions',
    adminStatusPublished: 'Published',
    adminStatusDraft: 'Draft (Hidden)',
    adminTabAll: 'All Records',
    adminTabPublished: 'Published Only',
    adminTabDrafts: 'Drafts Only',
    adminSearchPlaceholder: 'Search managed books by title or author...',
    adminDeleteConfirmTitle: 'Confirm Deletion',
    adminDeleteConfirmDesc:
      'Are you sure you want to permanently remove this manuscript? The metadata and stored PDF files will be deleted. This cannot be undone.',
    adminDeleteCancel: 'Cancel',
    adminDeleteConfirm: 'Delete Permanently',
    adminResetDefaults: 'Reset to Defaults',

    adminBackupTitle: 'Library Data Backup & Cloudflare Migration',
    adminBackupDesc:
      'Export a complete snapshot of all books, drafts, metadata, and uploaded binary files to protect against accidental loss during deployments.',
    adminExportBackupBtn: 'Export Complete Library Backup (.json)',
    adminRestoreBackupBtn: 'Restore Archive from Backup',
    adminBackupSuccess: 'Library archive backup exported successfully.',
    adminRestoreSuccess: 'Library archive restored successfully from backup.',
    adminRestoreFailed: 'Failed to restore backup. Invalid archive format.',

    formEditTitle: 'Edit Manuscript Record',
    formNewTitle: 'Catalogue New Manuscript',
    formRequiredNotice: 'Required fields marked with *',
    formSection1: '1. Bibliographic Identity',
    formSection2: '2. Classification & Provenance',
    formSection3: '3. File Uploads & Binary Validation',
    formSection4: '4. Access Control & Publication State',
    formTitleLabel: 'Standard Title',
    formOriginalTitleLabel: 'Original Arabic Title (Optional)',
    formAuthorLabel: 'Author Name',
    formOriginalAuthorLabel: 'Original Author Attribution (Optional)',
    formSynopsisLabel: 'Manuscript Synopsis & Scholarly Scope',
    formCategoryLabel: 'Discipline / Category',
    formLanguageLabel: 'Text Language',
    formEraLabel: 'Classical Era / Year (Optional)',
    formProvenanceLabel: 'Provenance / Manuscript Source (Optional)',
    formPdfUploadLabel: 'PDF Document File',
    formCoverUploadLabel: 'Cover Image (Optional)',
    formPublishToggleLabel: 'Publish to Public Catalogue',
    formPublishToggleDesc:
      'When unchecked, the book is saved as a private Draft and is strictly hidden from public visitors.',
    formDownloadToggleLabel: 'Permit Public File Download',
    formDownloadToggleDesc:
      'Allows public visitors to download the full PDF to their device in addition to online reading.',
    formCancelBtn: 'Cancel',
    formSaveBtn: 'Save Changes',

    footerAboutText:
      'Dedicated to the academic curation and public preservation of classical Islamic scholarship, manuscript editions, and primary reference treatises in authentic PDF format. Open access for researchers, students, and seekers of knowledge worldwide.',
    footerDisciplinesKicker: 'Disciplines',
    footerCatalogueKicker: 'Catalogue',
    footerAdminKicker: 'Administration',
    footerCopyright: 'Noor - Islamic Library. Preserved for educational and scholarly benefit.',
    footerStandardsNotice: 'Standards-Compliant PDF Archive · W3C Accessible',
  },
  ur: {
    brandName: 'نور',
    brandTagline: 'اسلامی کتب خانہ',
    navHome: 'صفحۂ اول',
    navCatalogue: 'فہرستِ کتب',
    navHadith: 'الحدیث الشریف',
    navAqeedah: 'عقائد و کلام',
    navFiqh: 'فقہ اسلامی',
    navAdminPanel: 'ایڈمن پینل',
    navAdminSignIn: 'ایڈمن لاگ ان',
    switchLanguage: 'English',
    searchPlaceholder: 'عنوان، مصنف یا موضوع کے ذریعے تلاش کریں (مثلاً: نووی، عقیدہ، نحو)...',
    searchArchiveBtn: 'کتب تلاش کریں',
    quickExplore: 'فوری تلاش:',

    catHadith: 'الحدیث',
    catAqeedah: 'العقیدہ',
    catFiqh: 'الفقہ',
    catTafsir: 'التفسیر',
    catArabicLanguage: 'عربی زبان و ادب',
    catEthics: 'اخلاق و تزکیہ',
    catUsul: 'اصولِ فقہ',
    catSeerah: 'سیرت النبی ﷺ',
    catHistory: 'اسلامی تاریخ',
    catAll: 'تمام علوم',

    catHadithDesc: 'احادیث کے معتبر مجموعے، سنن اور ائمہ کی شروحات۔',
    catAqeedahDesc: 'اہل السنۃ والجماعۃ کے اساسی عقائد اور توحید کے رسائل۔',
    catFiqhDesc: 'احکامِ طہارت، نماز اور معاملات کے فقہی متون۔',
    catTafsirDesc: 'قرآن کریم کی معتمد تفاسیر اور قرآنی علوم۔',
    catArabicDesc: 'نحو، صرف اور بلاغت کے وہ متون جو فہمِ دین کی بنیاد ہیں۔',
    catEthicsDesc: 'تزکیۂ نفس، اخلاصِ نیت اور باطنی پاکیزگی کے رہبر متون۔',
    catUsulDesc: 'استنباطِ احکام، دلائل، قیاس اور اجماع کے اصول۔',
    catSeerahDesc: 'حضور نبی کریم ﷺ کے اوصاف، شمائل اور مبارک سوانح۔',

    homeArchiveKicker: 'نور - اسلامی کتب خانہ · ڈیجیٹل آرکائیو',
    homeHeroTitle: 'کلاسیکی اسلامی کتب و مخطوطات کا علمی ذخیرہ',
    homeHeroDesc:
      'ایک جدید اور سادہ ڈیجیٹل کتب خانہ جہاں آپ مستند اسلامی کتب پی ڈی ایف (PDF) فارمیٹ میں براہِ راست پڑھ سکتے ہیں۔ بغیر کسی اکاؤنٹ یا رکاوٹ کے، علم کے صدیوں پرانے ذخائر تک رسائی حاصل کریں۔',
    homeFeaturedKicker: 'منتخب علمی متون',
    homeFeaturedTitle: 'نمایاں کتب و رسائل',
    homeBrowseFull: 'مکمل فہرستِ کتب دیکھیں',
    homeClassificationKicker: 'علمی درجہ بندی',
    homeClassificationTitle: 'اسلامی علوم و فنون',
    homeClassificationDesc:
      'کلاسیکی اسلامی علوم مختلف شاخوں میں منظم ہیں، جن میں سے ہر شعبہ دین کی ایک بنیادی جہت کی حفاظت کرتا ہے۔',
    homeRecentKicker: 'تازہ ترین شامل کردہ',
    homeRecentTitle: 'جدید ترین کتب',
    homeViewAll: 'تمام دیکھیں',
    homeCharterKicker: 'علمی منشور',
    homeCharterTitle: 'صحیح نسبت اور ڈیجیٹل دیانت کے ساتھ کتب کا تحفظ',
    homeCharterDesc:
      'نور - اسلامی کتب خانہ میں شامل ہر کتاب کو اس کے اصل مصنف اور متن کی مکمل درستی کے ساتھ پیش کیا جاتا ہے۔ براؤزر کے اندر پی ڈی ایف ریڈر کے ذریعے دنیا بھر کے طلبہ و محققین بآسانی مطالعہ کر سکتے ہیں۔',
    homeCharterPoints: [
      '· بغیر کسی فیس کے',
      '· اصل مستند نسخے',
      '· موبائل اور کمپیوٹر پر یکساں سہولت',
      '· جدید موزیلا پی ڈی ایف ریڈر',
    ],

    catalogueKicker: 'کتب خانہ',
    catalogueTitle: 'شائع شدہ علمی متون و کتب',
    catalogueDesc:
      'حدیث، عقیدہ، فقہ، تفسیر اور عربی گرائمر کی مستند کتب تلاش کریں۔ تمام کتب بغیر کسی رجسٹریشن کے فوری آن لائن مطالعے کے لیے دستیاب ہیں۔',
    filterDiscipline: 'شعبۂ علم:',
    filterLanguage: 'زبان:',
    filterSortBy: 'ترتیب:',
    sortNewest: 'تازہ ترین اندراج',
    sortTitle: 'عنوان (الف تا ے)',
    sortAuthor: 'مصنف کا نام',
    sortEra: 'تاریخی زمانی ترتیب',
    filterReset: 'فلٹرز ختم کریں',
    resultsShowing: 'تعداد:',
    resultsMatching: 'مطابقت رکھنے والی',
    resultsIn: 'شعبہ',
    pageOf: 'از',
    noBooksFound: 'کوئی کتاب دستیاب نہیں ملی',
    noBooksFoundDesc:
      'دیے گئے معیارات کے مطابق کوئی کتاب موجود نہیں۔ تلاش کے الفاظ تبدیل کریں یا دوسرے شعبے کا انتخاب کریں۔',
    paginationPrev: 'پچھلا صفحہ',
    paginationNext: 'اگلا صفحہ',

    cardSeries: 'نور کتب سلسلہ',
    cardReadOnline: 'آن لائن پڑھیں',
    cardDetails: 'تفصیلات',
    cardRead: 'مطالعہ',
    cardPages: 'صفحات',

    detailsBack: 'فہرستِ کتب پر واپس جائیں',
    detailsReadOnline: 'آن لائن مطالعہ کریں (PDF ریڈر)',
    detailsDownloadPdf: 'پی ڈی ایف ڈاؤن لوڈ کریں',
    detailsDownloadRestricted: 'براہِ راست ڈاؤن لوڈ محدود ہے۔ آن لائن مطالعہ مکمل طور پر کھلا ہے۔',
    detailsShareLink: 'کتاب کا ربط (Link) کاپی کریں',
    detailsLinkCopied: 'ربط کاپی ہو گیا ہے',
    detailsAuthor: 'مصنف:',
    detailsSynopsis: 'کتاب کا خلاصہ و موضوع',
    detailsTechnicalMetadata: 'تکنیکی معلومات و اشاریہ',
    detailsAccessionId: 'شناختی اندراج نمبر',
    detailsFormat: 'دستاویزی فارمیٹ',
    detailsVolumeSize: 'فائل کا حجم',
    detailsCataloguedPages: 'کل صفحات',
    detailsProvenance: 'ماخذ و اشاعت',
    detailsAccessProtocol: 'رسائی کی نوعیت',
    detailsOpenAccessNotice: 'عوامی علمی مطالعہ (کسی اکاؤنٹ کی ضرورت نہیں)',
    detailsIntegrityNotice:
      'اس ڈیجیٹل نسخے کی متنی صحت اور ساختی سالمیت کی تصدیق کی گئی ہے۔ قارئین بغیر کسی رکاوٹ کے براؤزر میں متن پڑھ سکتے ہیں۔',
    detailsUnavailable: 'کتاب دستیاب نہیں ہے',

    readerBack: 'واپسی',
    readerPage: 'صفحہ',
    readerOf: 'از',
    readerZoomIn: 'بڑا کریں (+)',
    readerZoomOut: 'چھوٹا کریں (-)',
    readerFitWidth: 'چوڑائی کے مطابق',
    readerFitPage: 'پورے صفحے کے مطابق',
    readerDownload: 'پی ڈی ایف ڈاؤن لوڈ کریں',
    readerFullscreen: 'مکمل سکرین',
    readerExitFullscreen: 'عام منظر',
    readerRecord: 'کتاب کی معلومات',
    readerLoading: 'صفحات تیار ہو رہے ہیں...',
    readerEngine: 'موزیلا پی ڈی ایف ریڈر انجن',
    readerNotice: 'مطالعے کے متعلق اطلاع',
    readerOpenDirectly: 'براہِ راست پی ڈی ایف کھولیں',
    readerReturnCatalogue: 'کتب خانے پر واپس جائیں',
    readerRestrictedTitle: 'رسائی محدود ہے',
    readerRestrictedDraft:
      'یہ کتاب فی الوقت ابتدائی جائزے (ڈرافٹ) میں ہے اور عوام کے لیے شائع نہیں کی گئی۔ اس کے لیے ایڈمنسٹریٹر کی اجازت درکار ہے۔',
    readerSignInAdmin: 'ایڈمنسٹریٹر کے طور پر لاگ ان کریں',

    adminLoginKicker: 'لائبریرین لاگ ان',
    adminLoginTitle: 'انتظامی داخلہ (Admin Sign In)',
    adminLoginDesc: 'کتب کے انتظام، نئی کتب شامل کرنے اور پی ڈی ایف اپلوڈ کے لیے مخصوص ایڈمن پورٹل۔',
    adminEmailLabel: 'ایڈمنسٹریٹر ای میل',
    adminPasswordLabel: 'پاس ورڈ',
    adminSignInBtn: 'بطور ایڈمنسٹریٹر لاگ ان کریں',
    adminForgotPasswordBtn: 'پاس ورڈ بھول گئے؟',
    adminDemoCredsBtn: 'ایڈمن اسناد خودکار درج کریں',
    adminCredsFilled: 'اسناد درج ہو گئیں',
    adminReturnHome: 'لائبریری ہوم پر واپس جائیں',

    forgotPasswordTitle: 'ایڈمن پاس ورڈ کی بحالی (Reset Password)',
    forgotPasswordDesc:
      'اپنا رجسٹرڈ ایڈمنسٹریٹر ای میل درج کریں۔ پاس ورڈ کی بحالی کی ہدایات محفوظ طریقے سے روانہ کر دی جائیں گی۔',
    sendResetLinkBtn: 'پاس ورڈ ری سیٹ لنک بھیجیں',
    backToLoginBtn: 'لاگ ان صفحے پر واپس جائیں',
    resetEmailSentSuccess: 'پاس ورڈ ری سیٹ کی درخواست موصول ہو گئی ہے۔',
    resetEmailSentDetail:
      '{email} پر پاس ورڈ ری سیٹ کا محفوظ لنک اور تصدیقی ہدایات روانہ کر دی گئی ہیں۔ اپنا ان باکس چیک کریں۔',
    resetEmailNotFound: 'اس ای میل سے کوئی ایڈمنسٹریٹر اکاؤنٹ موجود نہیں ہے۔',
    resetPasswordDashboardTitle: 'سیکیورٹی اور پاس ورڈ کی تبدیلی',
    resetPasswordDashboardDesc:
      'اپنے ایڈمنسٹریٹر اکاؤنٹ کا پاس ورڈ ری سیٹ کرنے کے لیے ای میل درخواست بھیجیں یا نیا پاس ورڈ مقرر کریں۔',
    resetPasswordDashboardAction: 'پاس ورڈ ری سیٹ ای میل درخواست بھیجیں',
    resetPasswordConfirmPrompt: 'کیا آپ واقعی {email} کے لیے پاس ورڈ ری سیٹ کی درخواست بھیجنا چاہتے ہیں؟',
    newPasswordLabel: 'نیا پاس ورڈ',
    updatePasswordBtn: 'پاس ورڈ تبدیل کریں',
    passwordUpdatedSuccess: 'آپ کا ایڈمنسٹریٹر پاس ورڈ کامیابی سے تبدیل ہو گیا ہے۔',

    adminDashboardKicker: 'محفوظ انتظامی علاقہ',
    adminDashboardTitle: 'کتب خانہ انتظامی ڈیش بورڈ',
    adminAddNewBtn: 'نئی کتاب شامل کریں',
    adminSignOutBtn: 'لاگ آؤٹ',
    adminStatTotal: 'کل کتب',
    adminStatPublished: 'عوامی شائع شدہ',
    adminStatDrafts: 'غیر شائع شدہ ڈرافٹس',
    adminStatVolume: 'کل محفوظ ڈیٹا حجم',
    adminStorageCheckpointTitle: 'اسٹوریج اور ڈیپلائمنٹ تحفظ',
    adminStorageCheckpointDesc:
      'دیرپا اسٹوریج فعال ہے۔ کلاؤڈ فلیر یا گٹ ہب ڈیپلائمنٹ کے دوران اپلوڈ کردہ کتب اور ڈیٹا مکمل محفوظ رہتے ہیں۔',
    adminTableManuscript: 'کتاب اور عنوان',
    adminTableDiscipline: 'شعبۂ علم',
    adminTableSizePages: 'حجم اور صفحات',
    adminTableStatus: 'اشاعت کی حیثیت',
    adminTableActions: 'اقدامات',
    adminStatusPublished: 'شائع شدہ',
    adminStatusDraft: 'ڈرافٹ (پوشیدہ)',
    adminTabAll: 'تمام کتب',
    adminTabPublished: 'صرف شائع شدہ',
    adminTabDrafts: 'صرف ڈرافٹس',
    adminSearchPlaceholder: 'عنوان یا مصنف کے ذریعے تلاش کریں...',
    adminDeleteConfirmTitle: 'کتاب حذف کرنے کی تصدیق',
    adminDeleteConfirmDesc:
      'کیا آپ واقعی اس کتاب کو مستقل طور پر حذف کرنا چاہتے ہیں؟ اس کا ریکارڈ اور متعلقہ پی ڈی ایف فائل ہمیشہ کے لیے مٹ جائے گی۔',
    adminDeleteCancel: 'منسوخ کریں',
    adminDeleteConfirm: 'مستقل حذف کریں',
    adminResetDefaults: 'ابتدائی حالت پر واپس لائیں',

    adminBackupTitle: 'ڈیٹا بیک اپ اور محفوظ منتقلی (Backup & Export)',
    adminBackupDesc:
      'تمام کتب، ڈرافٹس اور اپلوڈ شدہ فائلوں کا مکمل بیک اپ برآمد کریں تاکہ کسی بھی ڈیپلائمنٹ کے بعد ڈیٹا باآسانی بحال کیا جا سکے۔',
    adminExportBackupBtn: 'مکمل لائبریری بیک اپ برآمد کریں (.json)',
    adminRestoreBackupBtn: 'بیک اپ فائل سے ڈیٹا بحال کریں',
    adminBackupSuccess: 'لائبریری کا مکمل بیک اپ کامیابی سے برآمد ہو گیا۔',
    adminRestoreSuccess: 'بیک اپ فائل سے کتب خانہ کامیابی سے بحال ہو گیا۔',
    adminRestoreFailed: 'بیک اپ بحال کرنے میں ناکامی۔ فائل درست نہیں ہے۔',

    formEditTitle: 'کتاب کے ریکارڈ میں ترمیم',
    formNewTitle: 'نئی کتاب شامل کریں',
    formRequiredNotice: 'جن خانوں پر * ہے وہ لازمی ہیں',
    formSection1: '1. کتاب کی بنیادی معلومات',
    formSection2: '2. علمی درجہ بندی اور ماخذ',
    formSection3: '3. پی ڈی ایف فائل اور کور اپلوڈ',
    formSection4: '4. اشاعت کی حیثیت اور اجازت نامے',
    formTitleLabel: 'معیاری عنوان',
    formOriginalTitleLabel: 'اصل عربی عنوان (اختیاری)',
    formAuthorLabel: 'مصنف کا نام',
    formOriginalAuthorLabel: 'عربی نامِ مصنف (اختیاری)',
    formSynopsisLabel: 'کتاب کا خلاصہ و علمی تعارف',
    formCategoryLabel: 'علمی شعبہ / زمرہ',
    formLanguageLabel: 'کتاب کی زبان',
    formEraLabel: 'تاریخی دور / سنِ تالیف (اختیاری)',
    formProvenanceLabel: 'ماخذ یا اشاعتی نسخہ (اختیاری)',
    formPdfUploadLabel: 'پی ڈی ایف دستاویزی فائل',
    formCoverUploadLabel: 'سرورق تصویر (اختیاری)',
    formPublishToggleLabel: 'عوامی کتب خانے میں شائع کریں',
    formPublishToggleDesc: 'اگر غیر منتخب ہو تو کتاب بطور ڈرافٹ محفوظ رہے گی اور عام قارئین سے پوشیدہ ہوگی۔',
    formDownloadToggleLabel: 'قارئین کو پی ڈی ایف ڈاؤن لوڈ کی اجازت دیں',
    formDownloadToggleDesc: 'قارئین آن لائن مطالعے کے ساتھ اپنے کمپیوٹر یا موبائل پر فائل محفوظ کر سکیں گے۔',
    formCancelBtn: 'منسوخ کریں',
    formSaveBtn: 'محفوظ کریں',

    footerAboutText:
      'کلاسیکی اسلامی کتب، مخطوطات اور بنیادی متون کی تحقیقی حفاظت اور اشاعت کے لیے وقف۔ دنیا بھر کے محققین اور شائقینِ علم کے لیے بلامعاوضہ اور کھلی رسائی۔',
    footerDisciplinesKicker: 'اسلامی علوم',
    footerCatalogueKicker: 'فہرستِ کتب',
    footerAdminKicker: 'انتظامیہ',
    footerCopyright: 'نور - اسلامی کتب خانہ۔ جملہ علمی و اشاعتی حقوق محفوظ ہیں۔',
    footerStandardsNotice: 'معیاری پی ڈی ایف آرکائیو · بین الاقوامی W3C رسائی',
  },
};
