const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const books = [
  { id: 'tafsir-al-jalalayn', pdf: 'tafsir-al-jalalayn.pdf', page: 1 },
  { id: 'tafsir-al-baydawi', pdf: 'tafsir-al-baydawi.pdf', page: 1 },
  { id: 'riyad-al-salihin', pdf: 'riyad-al-salihin.pdf', page: 2 },
  { id: 'al-aqeedah-al-tahawiyyah', pdf: 'al-aqeedah-al-tahawiyyah.pdf', page: 1 },
  { id: 'al-hidayah', pdf: 'al-hidayah.pdf', page: 1 },
  { id: 'al-waraqat-usul-al-fiqh', pdf: 'al-waraqat-usul-al-fiqh.pdf', page: 1 },
  { id: 'al-ajrumiyyah-commentary', pdf: 'al-ajrumiyyah-commentary.pdf', page: 1 },
  { id: 'ar-raheeq-al-makhtum', pdf: 'ar-raheeq-al-makhtum.pdf', page: 1 },
  { id: 'tarikh-al-tabari', pdf: 'tarikh-al-tabari.pdf', page: 1 },
  { id: 'ihya-ulum-al-din', pdf: 'ihya-ulum-al-din.pdf', page: 1 }
];

for (const b of books) {
  const outJpg = path.join('/public/covers', b.id + '.jpg');
  const pdfPath = path.join('/public/books', b.pdf);
  const cmd = `gs -sDEVICE=jpeg -dFirstPage=${b.page} -dLastPage=${b.page} -r150 -o "${outJpg}" "${pdfPath}"`;
  try {
    execSync(cmd);
    const stat = fs.statSync(outJpg);
    console.log(`Generated original cover for ${b.id}: ${stat.size} bytes`);
  } catch (err) {
    console.error(`Failed for ${b.id}:`, err.message);
  }
}
