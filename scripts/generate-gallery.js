const fs = require('fs');
const path = require('path');

const galleryDir = path.join(process.cwd(), 'public', 'gallery');
const folders = fs.readdirSync(galleryDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

const projects = folders.map(folderName => {
  const files = fs.readdirSync(path.join(galleryDir, folderName));
  const images = files
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map(file => `/gallery/${encodeURIComponent(folderName)}/${encodeURIComponent(file)}`);
  return { name: folderName, images };
}).filter(p => p.images.length > 0);

fs.writeFileSync(path.join(process.cwd(), 'lib', 'gallery-data.json'), JSON.stringify(projects, null, 2));
console.log('Successfully generated lib/gallery-data.json');
