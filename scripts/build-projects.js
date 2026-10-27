/* ===========================================================================
   BUILD PROJECTS: reads src/data/*.json and writes
     projects/<slug>/index.html   one page per project
     projects/index.html          the /projects/ list page
     public/sitemap.xml           for Google
     public/robots.txt            points to the sitemap
   and fills the sliding Projects section in work.html between the markers
     <!-- PROJECTS:START -->  and  <!-- PROJECTS:END -->

   Run:  node scripts/build-projects.js            (dev: problems are warnings)
         node scripts/build-projects.js --strict   (build: problems stop the build)

   Optional fields in projects.json:
     "order": 1          slide order on the home slider (lower = first)
     "showOnHome": false hide from the slider but keep the project's own page
     "updated": "2026-10-27"  used as <lastmod> in sitemap.xml
   =========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STRICT = process.argv.includes('--strict');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* ---------- helpers ---------- */
const fails = [];   // must be fixed before launch (stop the build in --strict mode)
const notes = [];   // worth fixing, never stops the build
const fail = m => fails.push(m);
const note = m => notes.push(m);

function readJSON(rel, fallback) {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8')); }
  catch (e) {
    if (fallback !== undefined && e.code === 'ENOENT') return fallback;
    throw new Error(`Cannot read ${rel}: ${e.message}`);   // e.g. a missing comma in the JSON
  }
}
// Escape text so project content can never break (or inject into) the HTML
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
// JSON-LD is placed inside a <script>; "<" is escaped so it can never close the tag
const ld = obj => JSON.stringify(obj).replace(/</g, '\\u003c');
const pad = n => String(n).padStart(2, '0');

/* ---------- load data ---------- */
const site = readJSON('src/data/site.json');
const projects = readJSON('src/data/projects.json');
const manifest = readJSON('src/data/image-manifest.json', {});

if (!Array.isArray(projects)) throw new Error('src/data/projects.json must be a list: [ {...}, {...} ]');

if (!site.url || /REPLACE/i.test(site.url)) {
  fail('src/data/site.json: set "url" to your real domain, e.g. "https://www.example.com"');
  site.url = 'http://localhost:5173';
}
site.url = site.url.replace(/\/+$/, '');

/* ---------- validate ---------- */
const REQUIRED = ['slug', 'name', 'heading', 'seoTitle', 'description', 'body', 'images'];
const seen = new Set();
projects.forEach((p, i) => {
  const id = `projects.json item ${i + 1}${p.slug ? ` (${p.slug})` : ''}`;
  REQUIRED.forEach(k => { if (!p[k] || (Array.isArray(p[k]) && !p[k].length)) fail(`${id}: missing "${k}"`); });
  if (!p.slug) return;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) fail(`${id}: slug must be lowercase letters, numbers and hyphens only`);
  if (seen.has(p.slug)) fail(`${id}: duplicate slug`);
  seen.add(p.slug);
  if (/REPLACE/i.test(JSON.stringify(p))) fail(`${id}: still contains REPLACE placeholder text`);
  if (p.seoTitle && p.seoTitle.length > 65) note(`${id}: seoTitle is ${p.seoTitle.length} characters (keep about 60 or less)`);
  if (p.description && (p.description.length < 110 || p.description.length > 160)) note(`${id}: description is ${p.description.length} characters (aim for 110 to 160)`);
  if (p.updated && !/^\d{4}-\d{2}-\d{2}$/.test(p.updated)) note(`${id}: "updated" should look like 2026-10-27`);
  (p.images || []).forEach((im, k) => {
    if (!im.file || !im.alt) { fail(`${id}: image ${k + 1} needs "file" and "alt"`); return; }
    if (!manifest[`${p.slug}/${im.file}`]) fail(`${id}: image "${im.file}" is not optimized yet (put the original in images-source/${p.slug}/ and run: npm run images)`);
  });
});

/* ---------- image tag ---------- */
function img(p, im, { eager = false, sizes = '(min-width:1200px) 1100px, 100vw' } = {}) {
  const base = `/images/projects/${p.slug}/${im.file}`;
  const m = manifest[`${p.slug}/${im.file}`];
  const lazy = eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"';
  if (!m) return `<img src="${esc(base)}-1200.webp" alt="${esc(im.alt)}" ${lazy}>`;   // build fails in strict mode anyway
  const srcset = m.sizes.map(s => `${esc(base)}-${s}.webp ${s}w`).join(', ');
  return `<img src="${esc(base)}-${m.width}.webp" srcset="${srcset}" sizes="${sizes}" width="${m.width}" height="${m.height}" alt="${esc(im.alt)}" ${lazy}>`;
}
const ogImage = p => {
  const m = manifest[`${p.slug}/${p.images[0].file}`];
  return m ? `${site.url}/images/projects/${p.slug}/${p.images[0].file}-${m.sizes.includes(1200) ? 1200 : m.width}.webp` : '';
};

/* ---------- shared page parts ---------- */
const HEAD_COMMON = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`;
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">`;
const ASSETS = `<script src="/theme-init.js"></script>
<link rel="stylesheet" href="/src/css/style.css">
<link rel="stylesheet" href="/src/css/project.css">`;

const HEADER = `<header>
  <a class="logo" href="/">${esc(site.name)}</a>
  <nav><a href="/work.html#about">ABOUT</a><a href="/work.html#services">SERVICES</a><a href="/projects/">PROJECTS</a><a href="/work.html#contact">CONTACT</a></nav>
  <div class="hr">
    <button class="tbtn" id="theme" aria-label="Switch between black and white"><i></i><span>B / W</span></button>
    <a class="pill" href="/work.html#contact">START YOUR PROJECT ↳</a>
  </div>
</header>`;
const FOOTER = `<footer><span>© ${esc(site.name.toUpperCase())}</span><a href="#top">⇑ SCROLL TO TOP</a></footer>
<script type="module" src="/src/js/project.js"></script>`;

function meta({ title, description, url, image }) {
  return `<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">${image ? `
<meta property="og:image" content="${esc(image)}">` : ''}
<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">`;
}

const card = p => `<li><a href="/projects/${p.slug}/">
      ${img(p, p.images[0], { sizes: '(min-width:900px) 30vw, 90vw' })}
      <span class="cname">${esc(p.name)}</span>
      <span class="cmeta">${esc([p.location, p.type].filter(Boolean).join(' · '))}</span>
    </a></li>`;

/* ---------- one project page ---------- */
function projectPage(p, idx) {
  const url = `${site.url}/projects/${p.slug}/`;
  const facts = [['Location', p.location], ['Type', p.type], ['Year', p.year], ['Area', p.area], ['Status', p.status],
                 ['Services', Array.isArray(p.services) ? p.services.join(', ') : p.services]].filter(([, v]) => v);
  const related = projects.filter(o => o.slug !== p.slug);
  const next = [...related.slice(idx), ...related.slice(0, idx)].slice(0, 3);   // the next 3 projects in list order
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', name: p.heading, description: p.description, url },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Projects', item: `${site.url}/projects/` },
        { '@type': 'ListItem', position: 3, name: p.heading, item: url } ] }
    ]
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
${HEAD_COMMON}
${meta({ title: p.seoTitle, description: p.description, url, image: ogImage(p) })}
${FONTS}
${ASSETS}
<script type="application/ld+json">${ld(graph)}</script>
</head>
<body>
${HEADER}
<main class="pp" id="top">
  <p class="crumbs"><a href="/">Home</a> / <a href="/projects/">Projects</a> / ${esc(p.name)}</p>
  <h1>${esc(p.heading)}</h1>
  ${facts.length ? `<dl class="facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
  <div class="body">${p.body.map(t => `<p>${esc(t)}</p>`).join('')}</div>
  <div class="gallery">
    ${p.images.map((im, k) => `<figure>${img(p, im, { eager: k === 0 })}</figure>`).join('\n    ')}
  </div>
  ${next.length ? `<section class="more"><h2>More projects</h2><ul class="cards">
    ${next.map(card).join('\n    ')}
  </ul></section>` : ''}
  <p class="back"><a href="/projects/">← All projects</a></p>
</main>
${FOOTER}
</body>
</html>
`;
}

/* ---------- the /projects/ list page ---------- */
function indexPage() {
  const url = `${site.url}/projects/`;
  const graph = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', name: site.projectsTitle, description: site.projectsDescription, url },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: url } ] } ] };
  return `<!DOCTYPE html>
<html lang="en">
<head>
${HEAD_COMMON}
${meta({ title: site.projectsTitle, description: site.projectsDescription, url, image: projects[0] ? ogImage(projects[0]) : '' })}
${FONTS}
${ASSETS}
<script type="application/ld+json">${ld(graph)}</script>
</head>
<body>
${HEADER}
<main class="pp" id="top">
  <p class="crumbs"><a href="/">Home</a> / Projects</p>
  <h1>Projects.</h1>
  <ul class="cards">
    ${projects.map(card).join('\n    ')}
  </ul>
</main>
${FOOTER}
</body>
</html>
`;
}

/* ---------- write everything ---------- */
if (STRICT && fails.length) {
  console.error('\nBUILD STOPPED. Fix these first:\n' + fails.map(f => '  ✖ ' + f).join('\n'));
  if (notes.length) console.error('\nAlso worth fixing:\n' + notes.map(n => '  • ' + n).join('\n'));
  process.exit(1);
}

const outDir = path.join(ROOT, 'projects');
fs.rmSync(outDir, { recursive: true, force: true });          // removes pages of deleted projects
if (projects.length) {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), indexPage());
  projects.forEach((p, i) => {
    if (!p.slug) return;
    fs.mkdirSync(path.join(outDir, p.slug), { recursive: true });
    fs.writeFileSync(path.join(outDir, p.slug, 'index.html'), projectPage(p, i));
  });
}

// sitemap.xml + robots.txt
const entries = [
  { loc: `${site.url}/` },
  ...(projects.length ? [{ loc: `${site.url}/projects/` }] : []),
  ...projects.filter(p => p.slug).map(p => ({ loc: `${site.url}/projects/${p.slug}/`, lastmod: p.updated })),
];
fs.mkdirSync(path.join(ROOT, 'public'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map(e => `  <url><loc>${esc(e.loc)}</loc>${e.lastmod ? `<lastmod>${esc(e.lastmod)}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(ROOT, 'public/robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

// Fill the sliding Projects section in work.html between the two markers
const homePath = path.join(ROOT, 'work.html');
if (fs.existsSync(homePath)) {
  let html = fs.readFileSync(homePath, 'utf8');
  const A = '<!-- PROJECTS:START -->', B = '<!-- PROJECTS:END -->';
  const a = html.indexOf(A), b = html.indexOf(B);
  if (a !== -1 && b > a) {
    const shown = projects
      .filter(p => p.slug && p.showOnHome !== false)
      .sort((x, y) => (x.order ?? 999) - (y.order ?? 999));
    const slides = shown.map((p, i) => `    <article class="pj-slide">
      <a class="pj-img" href="/projects/${p.slug}/" tabindex="-1" aria-hidden="true">${img(p, p.images[0], { eager: i === 0, sizes: '(min-width:800px) 60vw, 100vw' })}</a>
      <div class="pj-txt">
        <span class="num">(${pad(i + 1)})</span>
        <h3><a href="/projects/${p.slug}/">${esc(p.name)}</a></h3>
        <p class="pj-loc">${esc([p.location, p.type].filter(Boolean).join(' · '))}</p>
        <p class="pj-desc">${esc(p.description)}</p>
      </div>
    </article>`).join('\n');
    const last = `    <article class="pj-slide pj-last"><a href="/projects/">View more projects ↗</a></article>`;
    html = html.slice(0, a + A.length) + '\n' + slides + '\n' + last + '\n    ' + html.slice(b);
    html = html.replace(/(<span id="pj-tot">)\d+(<\/span>)/, `$1${pad(shown.length)}$2`);
    fs.writeFileSync(homePath, html);
    console.log('work.html project slider updated.');
  } else {
    note('work.html: markers <!-- PROJECTS:START --> / <!-- PROJECTS:END --> not found inside #pj-stage');
  }
}

console.log(`Built ${projects.length} project page(s) + index + sitemap.`);
if (fails.length) console.warn('\nMust fix before launch:\n' + fails.map(f => '  ✖ ' + f).join('\n'));
if (notes.length) console.warn('\nWorth fixing:\n' + notes.map(n => '  • ' + n).join('\n'));