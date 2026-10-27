// Builds the Projects stage from src/data/projects.json
import data from '../data/projects.json';

const stage = document.getElementById('pj-stage');
const items = Array.isArray(data) ? data : (data.projects || []);

if (stage) {
  items.forEach((p, i) => {
    const a = document.createElement('a');
    a.className = 'pj-item';
    a.href = p.url || p.link || (p.slug ? `/projects/#${p.slug}` : '#');

    const num = document.createElement('span');
    num.className = 'num';
    num.textContent = `(${String(i + 1).padStart(2, '0')})`;

    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = p.name || p.title || '';

    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = p.location || '';

    a.append(num, name, meta);
    stage.append(a);
  });

  const tot = document.getElementById('pj-tot');
  if (tot) tot.textContent = String(items.length).padStart(2, '0');
}