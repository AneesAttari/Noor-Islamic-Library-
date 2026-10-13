const fs = require('fs');
const path = require('path');

const books = [
  {
    id: 'tafsir-al-baydawi',
    title: 'Tafsir al-Baydawi',
    subtitle: 'Anwar al-Tanzil wa-Asrar al-Ta\'wil',
    arabicTitle: 'أَنْوَارُ التَّنْزِيلِ وَأَسْرَارُ التَّأْوِيلِ',
    arabicSubtitle: 'تَفْسِيرُ الإِمَامِ البَيْضَاوِيّ',
    author: 'Imam Nasir al-Din al-Baydawi (d. 685 AH)',
    arabicAuthor: 'الإمام ناصر الدين عبد الله بن عمر البيضاوي',
    category: 'Tafsir',
    arabicCategory: 'التَّفْسِيرُ وَعُلُومُ القُرْآنِ',
    theme: {
      bg1: '#07241A',
      bg2: '#0D382A',
      bg3: '#041710',
      accent: '#E5C158',
      goldLight: '#FFF0B3',
      goldDark: '#8F6614',
      seal: 'تَفْسِير'
    }
  },
  {
    id: 'tafsir-al-jalalayn',
    title: 'Tafsir al-Jalalayn',
    subtitle: 'Great Exegesis of the Noble Quran',
    arabicTitle: 'تَفْسِيرُ الجَلَالَيْنِ',
    arabicSubtitle: 'المَحَلِّي وَالسُّيُوطِيّ',
    author: 'Jalal al-Din al-Mahalli & Jalal al-Din al-Suyuti',
    arabicAuthor: 'الإمامان جلال الدين المحلي وجلال الدين السيوطي',
    category: 'Tafsir',
    arabicCategory: 'التَّفْسِيرُ وَعُلُومُ القُرْآنِ',
    theme: {
      bg1: '#08281E',
      bg2: '#103F30',
      bg3: '#051A13',
      accent: '#E5C158',
      goldLight: '#FFF0B3',
      goldDark: '#8F6614',
      seal: 'تَفْسِير'
    }
  },
  {
    id: 'riyad-al-salihin',
    title: 'Riyad al-Salihin',
    subtitle: 'Gardens of the Righteous from Hadith',
    arabicTitle: 'رِيَاضُ الصَّالِحِينَ',
    arabicSubtitle: 'مِنْ كَلَامِ سَيِّدِ المُرْسَلِينَ ﷺ',
    author: 'Imam Yahya ibn Sharaf al-Nawawi (d. 676 AH)',
    arabicAuthor: 'الإمام محيي الدين يحيى بن شرف النووي',
    category: 'Hadith',
    arabicCategory: 'الحَدِيثُ الشَّرِيفُ وَعُلُومُهُ',
    theme: {
      bg1: '#091E33',
      bg2: '#123252',
      bg3: '#05111E',
      accent: '#E5C158',
      goldLight: '#FFF0B3',
      goldDark: '#8F6614',
      seal: 'حَدِيث'
    }
  },
  {
    id: 'al-aqeedah-al-tahawiyyah',
    title: 'Al-Aqeedah al-Tahawiyyah',
    subtitle: 'Creed of Ahl al-Sunnah wa al-Jama\'ah',
    arabicTitle: 'العَقِيدَةُ الطَّحَاوِيَّةُ',
    arabicSubtitle: 'بَيَانُ عَقِيدَةِ أَهْلِ السُّنَّةِ وَالجَمَاعَةِ',
    author: 'Imam Abu Ja\'far al-Tahawi (d. 321 AH)',
    arabicAuthor: 'الإمام أحمد بن محمد بن سلامة الطحاوي',
    category: 'Aqeedah',
    arabicCategory: 'العَقِيدَةُ وَالتَّوْحِيدُ',
    theme: {
      bg1: '#12152D',
      bg2: '#1D2248',
      bg3: '#0A0C1A',
      accent: '#E5C158',
      goldLight: '#FFF0B3',
      goldDark: '#8F6614',
      seal: 'عَقِيدَة'
    }
  },
  {
    id: 'al-hidayah',
    title: 'Al-Hidayah fi Sharh Bidayat al-Mubtadi',
    subtitle: 'Masterwork of Comparative Jurisprudence',
    arabicTitle: 'الهِدَايَةُ شَرْحُ بِدَايَةِ المُبْتَدِي',
    arabicSubtitle: 'عُمْدَةُ الفِقْهِ الحَنَفِيِّ المُقَارَنِ',
    author: 'Burhan al-Din al-Marghinani (d. 593 AH)',
    arabicAuthor: 'الإمام برهان الدين علي بن أبي بكر المرغيناني',
    category: 'Fiqh',
    arabicCategory: 'الفِقْهُ الإِسْلَامِيُّ المُقَارَنُ',
    theme: {
      bg1: '#350B13',
      bg2: '#521420',
      bg3: '#20060B',
      accent: '#E5C158',
      goldLight: '#FFF0B3',
      goldDark: '#8F6614',
      seal: 'فِقْه'
    }
  },
  {
    id: 'al-waraqat-usul-al-fiqh',
    title: 'Al-Waraqat fi Usul al-Fiqh',
    subtitle: 'Foundational Epistemology & Legal Theory',
    arabicTitle: 'الوَرَقَاتُ فِي أُصُولِ الفِقْهِ',
    arabicSubtitle: 'مَتْنٌ جَامِعٌ فِي أُصُولِ الاسْتِنْبَاطِ',
    author: 'Imam al-Haramayn al-Juwayni (d. 478 AH)',
    arabicAuthor: 'إمام الحرمين عبد الملك بن عبد الله الجويني',
    category: 'Usul al-Fiqh',
    arabicCategory: 'أُصُولُ الفِقْهِ وَقَوَاعِدُهُ',
    theme: {
      bg1: '#0D291F',
      bg2: '#163E30',
      bg3: '#081B14',
      accent: '#E5C158',
      goldLight: '#FFF0B3',
      goldDark: '#8F6614',
      seal: 'أُصُول'
    }
  },
  {
    id: 'al-ajrumiyyah-commentary',
    title: 'Sharh al-Muqaddimah al-Ajrumiyyah',
    subtitle: 'Al-Tuhfat al-Saniyyah in Arabic Syntax',
    arabicTitle: 'التُّحْفَةُ السَّنِيَّةُ بِشَرْحِ الآجُرُّومِيَّةِ',
    arabicSubtitle: 'مَدْخَلُ الإِعْرَابِ وَعُلُومِ اللُّغَةِ العَرَبِيَّةِ',
    author: 'Ibn Ajurrum & Muhyiddin Abd al-Hamid',
    arabicAuthor: 'ابن آجروم ومحمد محيي الدين عبد الحميد',
    category: 'Arabic Language',
    arabicCategory: 'اللُّغَةُ العَرَبِيَّةُ وَالنَّحْوُ',
    theme: {
      bg1: '#092531',
      bg2: '#11394B',
      bg3: '#051820',
      accent: '#E5C158',
      goldLight: '#FFF0B3',
      goldDark: '#8F6614',
      seal: 'نَحْو'
    }
  },
  {
    id: 'ar-raheeq-al-makhtum',
    title: 'Ar-Raheeq Al-Makhtum',
    subtitle: 'The Sealed Nectar · Prophetic Biography',
    arabicTitle: 'الرَّحِيقُ المَخْتُومُ',
    arabicSubtitle: 'بَحْثٌ فِي السِّيرَةِ النَّبَوِيَّةِ الشَّرِيفَةِ',
    author: 'Safiur Rahman Mubarakpuri (d. 1427 AH)',
    arabicAuthor: 'الشيخ صفي الرحمن المباركفوري',
    category: 'Seerah',
    arabicCategory: 'السِّيرَةُ النَّبَوِيَّةُ المُطَهَّرَةُ',
    theme: {
      bg1: '#33190A',
      bg2: '#4F2812',
      bg3: '#1E0E05',
      accent: '#E5C158',
      goldLight: '#FFF0B3',
      goldDark: '#8F6614',
      seal: 'سِيرَة'
    }
  },
  {
    id: 'tarikh-al-tabari',
    title: 'Tarikh al-Tabari',
    subtitle: 'History of the Prophets and Kings',
    arabicTitle: 'تَارِيخُ الرُّسُلِ وَالمُلُوكِ',
    arabicSubtitle: 'تَارِيخُ الطَّبَرِيّ - المَوْسُوعَةُ التَّارِيخِيَّةُ',
    author: 'Imam Abu Ja\'far Muhammad ibn Jarir al-Tabari',
    arabicAuthor: 'الإمام محمد بن جرير الطبري (ت ٣١٠ هـ)',
    category: 'Islamic History',
    arabicCategory: 'التَّارِيخُ وَالتَّرَاجِمُ',
    theme: {
      bg1: '#2A131D',
      bg2: '#431F2F',
      bg3: '#1A0B12',
      accent: '#E5C158',
      goldLight: '#FFF0B3',
      goldDark: '#8F6614',
      seal: 'تَارِيخ'
    }
  },
  {
    id: 'ihya-ulum-al-din',
    title: 'Ihya\' Ulum al-Din',
    subtitle: 'Revival of the Religious Sciences',
    arabicTitle: 'إِحْيَاءُ عُلُومِ الدِّينِ',
    arabicSubtitle: 'حُجَّةُ الإِسْلَامِ وَمَنْبَعُ التَّزْكِيَةِ',
    author: 'Hujjat al-Islam Abu Hamid al-Ghazali (d. 505 AH)',
    arabicAuthor: 'الإمام أبو حامد محمد بن محمد الغزالي',
    category: 'Ethics & Tazkiyah',
    arabicCategory: 'التَّزْكِيَةُ وَالآدَابُ الشَّرْعِيَّةُ',
    theme: {
      bg1: '#0D2727',
      bg2: '#163D3D',
      bg3: '#081919',
      accent: '#E5C158',
      goldLight: '#FFF0B3',
      goldDark: '#8F6614',
      seal: 'تَزْكِيَة'
    }
  }
];

function generateCoverSvg(b) {
  const { theme } = b;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 840" width="100%" height="100%">
  <defs>
    <!-- Background Leather Gradient -->
    <linearGradient id="leatherGrad_${b.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg1}" />
      <stop offset="50%" stop-color="${theme.bg2}" />
      <stop offset="100%" stop-color="${theme.bg3}" />
    </linearGradient>

    <!-- Metallic Gold Foil Gradient -->
    <linearGradient id="goldGrad_${b.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.goldDark}" />
      <stop offset="25%" stop-color="${theme.goldLight}" />
      <stop offset="50%" stop-color="${theme.accent}" />
      <stop offset="75%" stop-color="${theme.goldLight}" />
      <stop offset="100%" stop-color="${theme.goldDark}" />
    </linearGradient>

    <!-- Spine Shadow -->
    <linearGradient id="spineShadow_${b.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.75" />
      <stop offset="25%" stop-color="#000000" stop-opacity="0.3" />
      <stop offset="60%" stop-color="#ffffff" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.35" />
    </linearGradient>

    <!-- Medallion Center Radial Gradient -->
    <radialGradient id="medallionBg_${b.id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${theme.bg2}" stop-opacity="0.95" />
      <stop offset="65%" stop-color="${theme.bg1}" stop-opacity="0.98" />
      <stop offset="100%" stop-color="${theme.bg3}" stop-opacity="1" />
    </radialGradient>

    <!-- Star Pattern -->
    <pattern id="latticePattern_${b.id}" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="${theme.accent}" stroke-width="0.5" stroke-opacity="0.12" />
      <circle cx="20" cy="20" r="1.5" fill="${theme.accent}" fill-opacity="0.15" />
    </pattern>

    <filter id="dropShadow_${b.id}" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.5" />
    </filter>
  </defs>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&amp;family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&amp;display=swap');
    .ar-title { font-family: 'Amiri', 'Traditional Arabic', serif; font-size: 32px; font-weight: 700; text-anchor: middle; }
    .ar-sub { font-family: 'Amiri', 'Traditional Arabic', serif; font-size: 19px; font-weight: 600; text-anchor: middle; }
    .ar-auth { font-family: 'Amiri', 'Traditional Arabic', serif; font-size: 18px; font-weight: 600; text-anchor: middle; }
    .ar-kicker { font-family: 'Amiri', 'Traditional Arabic', serif; font-size: 17px; font-weight: 700; text-anchor: middle; }
    .en-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 23px; font-weight: 700; text-anchor: middle; letter-spacing: 0.5px; }
    .en-sub { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 14px; font-style: italic; text-anchor: middle; }
    .en-auth { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 15px; font-weight: 600; text-anchor: middle; letter-spacing: 0.5px; }
    .lib-seal { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-anchor: middle; text-transform: uppercase; }
  </style>

  <!-- Hardcover Base -->
  <rect width="600" height="840" rx="6" fill="url(#leatherGrad_${b.id})" />

  <!-- Subtle Lattice -->
  <rect x="22" y="22" width="556" height="796" fill="url(#latticePattern_${b.id})" />

  <!-- Outer Gilded Border -->
  <rect x="22" y="22" width="556" height="796" rx="4" fill="none" stroke="url(#goldGrad_${b.id})" stroke-width="2.5" filter="url(#dropShadow_${b.id})" />

  <!-- Secondary Fine Gilded Inlay Border -->
  <rect x="30" y="30" width="540" height="780" rx="2" fill="none" stroke="url(#goldGrad_${b.id})" stroke-width="1" stroke-opacity="0.8" />

  <!-- Inner Frame with Corner Brackets -->
  <rect x="44" y="44" width="512" height="752" fill="none" stroke="url(#goldGrad_${b.id})" stroke-width="1.5" />

  <!-- Corner 8-pointed star ornaments -->
  <!-- Top Left -->
  <g transform="translate(44, 44)">
    <circle cx="0" cy="0" r="7" fill="none" stroke="url(#goldGrad_${b.id})" stroke-width="1" />
    <circle cx="0" cy="0" r="2.5" fill="${theme.accent}" />
    <path d="M0 0 L22 0 L22 3 L3 3 L3 22 L0 22 Z" fill="url(#goldGrad_${b.id})" opacity="0.85" />
  </g>
  <!-- Top Right -->
  <g transform="translate(556, 44)">
    <circle cx="0" cy="0" r="7" fill="none" stroke="url(#goldGrad_${b.id})" stroke-width="1" />
    <circle cx="0" cy="0" r="2.5" fill="${theme.accent}" />
    <path d="M0 0 L-22 0 L-22 3 L-3 3 L-3 22 L0 22 Z" fill="url(#goldGrad_${b.id})" opacity="0.85" />
  </g>
  <!-- Bottom Left -->
  <g transform="translate(44, 796)">
    <circle cx="0" cy="0" r="7" fill="none" stroke="url(#goldGrad_${b.id})" stroke-width="1" />
    <circle cx="0" cy="0" r="2.5" fill="${theme.accent}" />
    <path d="M0 0 L22 0 L22 -3 L3 -3 L3 -22 L0 -22 Z" fill="url(#goldGrad_${b.id})" opacity="0.85" />
  </g>
  <!-- Bottom Right -->
  <g transform="translate(556, 796)">
    <circle cx="0" cy="0" r="7" fill="none" stroke="url(#goldGrad_${b.id})" stroke-width="1" />
    <circle cx="0" cy="0" r="2.5" fill="${theme.accent}" />
    <path d="M0 0 L-22 0 L-22 -3 L-3 -3 L-3 -22 L0 -22 Z" fill="url(#goldGrad_${b.id})" opacity="0.85" />
  </g>

  <!-- TOP HEADER / BANNER -->
  <g transform="translate(300, 95)">
    <!-- Illuminated Library Cartouche -->
    <path d="M -140 0 C -70 -14 70 -14 140 0 C 70 14 -70 14 -140 0 Z" fill="${theme.bg3}" stroke="url(#goldGrad_${b.id})" stroke-width="1.2" opacity="0.9" />
    <text y="-2" fill="url(#goldGrad_${b.id})" class="ar-kicker">نُور - المَكْتَبَةُ الإِسْلَامِيَّة</text>
    <text y="28" fill="url(#goldGrad_${b.id})" class="lib-seal" opacity="0.85">NOOR · ISLAMIC LIBRARY</text>
    
    <!-- Divider -->
    <circle cx="0" cy="46" r="3.5" fill="none" stroke="url(#goldGrad_${b.id})" stroke-width="1" />
    <circle cx="0" cy="46" r="1.5" fill="${theme.accent}" />
    <line x1="-80" y1="46" x2="-10" y2="46" stroke="url(#goldGrad_${b.id})" stroke-width="0.8" stroke-opacity="0.7" />
    <line x1="10" y1="46" x2="80" y2="46" stroke="url(#goldGrad_${b.id})" stroke-width="0.8" stroke-opacity="0.7" />
    
    <!-- Category Badge -->
    <text y="66" fill="#FFF0B3" class="ar-sub" font-size="16" opacity="0.95">${b.arabicCategory}</text>
  </g>

  <!-- CENTRAL ILLUMINATED SHAMSA MEDALLION -->
  <g transform="translate(300, 375)" filter="url(#dropShadow_${b.id})">
    <rect x="-215" y="-160" width="430" height="320" rx="22" fill="url(#medallionBg_${b.id})" stroke="url(#goldGrad_${b.id})" stroke-width="2.5" />
    <rect x="-207" y="-152" width="414" height="304" rx="16" fill="none" stroke="url(#goldGrad_${b.id})" stroke-width="1" stroke-dasharray="5,3" opacity="0.75" />

    <!-- Crown ornaments -->
    <path d="M -50 -160 C -25 -182 25 -182 50 -160 C 25 -168 -25 -168 -50 -160 Z" fill="url(#goldGrad_${b.id})" />
    <circle cx="0" cy="-178" r="4.5" fill="url(#goldGrad_${b.id})" />
    <path d="M -50 160 C -25 182 25 182 50 160 C 25 168 -25 168 -50 160 Z" fill="url(#goldGrad_${b.id})" />
    <circle cx="0" cy="178" r="4.5" fill="url(#goldGrad_${b.id})" />

    <!-- Central Arabic Title -->
    <text y="-30" fill="url(#goldGrad_${b.id})" class="ar-title" filter="url(#dropShadow_${b.id})">${b.arabicTitle}</text>
    
    <!-- Gold Divider Knot -->
    <g transform="translate(0, 10)">
      <line x1="-120" y1="0" x2="-20" y2="0" stroke="url(#goldGrad_${b.id})" stroke-width="1.2" />
      <circle cx="0" cy="0" r="7" fill="none" stroke="url(#goldGrad_${b.id})" stroke-width="1.5" />
      <polygon points="0,-4 3,0 0,4 -3,0" fill="${theme.goldLight}" />
      <line x1="20" y1="0" x2="120" y2="0" stroke="url(#goldGrad_${b.id})" stroke-width="1.2" />
    </g>

    <!-- Arabic Subtitle -->
    <text y="50" fill="#FFF0B3" class="ar-sub">${b.arabicSubtitle}</text>

    <!-- Arabic Author in Medallion -->
    <text y="105" fill="url(#goldGrad_${b.id})" class="ar-auth" opacity="0.95">${b.arabicAuthor}</text>
  </g>

  <!-- ENGLISH TITLE & AUTHOR SECTION -->
  <g transform="translate(300, 605)">
    <line x1="-120" y1="-20" x2="120" y2="-20" stroke="url(#goldGrad_${b.id})" stroke-width="1" stroke-opacity="0.6" />
    <text y="10" fill="#FFFFFF" class="en-title" filter="url(#dropShadow_${b.id})">${b.title}</text>
    <text y="35" fill="#FFF0B3" class="en-sub" opacity="0.9">${b.subtitle}</text>
    <text y="62" fill="url(#goldGrad_${b.id})" class="en-auth">${b.author}</text>
  </g>

  <!-- FOOTER SEAL -->
  <g transform="translate(300, 742)">
    <circle cx="0" cy="0" r="20" fill="${theme.bg3}" stroke="url(#goldGrad_${b.id})" stroke-width="1.5" />
    <circle cx="0" cy="0" r="16" fill="none" stroke="url(#goldGrad_${b.id})" stroke-width="0.8" stroke-dasharray="3,2" />
    <text y="5" fill="url(#goldGrad_${b.id})" class="ar-kicker" font-size="11">${theme.seal}</text>

    <line x1="-150" y1="0" x2="-32" y2="0" stroke="url(#goldGrad_${b.id})" stroke-width="1" stroke-opacity="0.6" />
    <polygon points="-32,0 -36,-3 -40,0 -36,3" fill="url(#goldGrad_${b.id})" />
    <polygon points="32,0 36,-3 40,0 36,3" fill="url(#goldGrad_${b.id})" />
    <line x1="32" y1="0" x2="150" y2="0" stroke="url(#goldGrad_${b.id})" stroke-width="1" stroke-opacity="0.6" />

    <text y="30" fill="#FFF0B3" class="lib-seal" font-size="10" opacity="0.75">
      CLASSICAL ISLAMIC HERITAGE ARCHIVE · WAQF
    </text>
  </g>

  <!-- REALISTIC 3D HARDCOVER SPINE CREASE & LIGHTING (LEFT EDGE) -->
  <rect x="0" y="0" width="34" height="840" fill="url(#spineShadow_${b.id})" opacity="0.85" />
  <line x1="34" y1="0" x2="34" y2="840" stroke="#000000" stroke-width="1.5" opacity="0.65" />
  <line x1="35.5" y1="0" x2="35.5" y2="840" stroke="#ffffff" stroke-width="0.8" opacity="0.25" />

  <!-- Outer right edge bevel -->
  <line x1="599" y1="0" x2="599" y2="840" stroke="#000000" stroke-width="1" opacity="0.5" />
  <!-- Top and bottom edge gilding hints -->
  <line x1="0" y1="1" x2="600" y2="1" stroke="url(#goldGrad_${b.id})" stroke-width="1" opacity="0.3" />
  <line x1="0" y1="839" x2="600" y2="839" stroke="url(#goldGrad_${b.id})" stroke-width="1" opacity="0.3" />
</svg>`;
}

// Generate all 10 covers
for (const b of books) {
  const svg = generateCoverSvg(b);
  const outPath = path.join('/public/covers', b.id + '.svg');
  fs.writeFileSync(outPath, svg, 'utf-8');
  console.log('Successfully generated SVG cover:', outPath, 'size:', svg.length);
}
