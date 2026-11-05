const fs = require('fs');
const p = JSON.parse(fs.readFileSync('src/data/projects.json', 'utf8'));
let m = {};
try { m = JSON.parse(fs.readFileSync('src/data/image-manifest.json', 'utf8')); } catch (e) {}
let n = 0;
p.forEach(x => (x.images || []).forEach(i => {
  if (!m[x.slug + '/' + i.file]) {
    fs.mkdirSync('images-source/' + x.slug, { recursive: true });
    console.log('images-source/' + x.slug + '/' + i.file + '.png (or .jpg)');
    n++;
  }
}));
console.log('\nMissing images: ' + n);
