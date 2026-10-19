import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const banner = `/**
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * License: ${pkg.license}
 */`;

const sharedOptions = {
  bundle: true,
  minify: true,
  sourcemap: true,
  legalComments: 'none',
  target: ['es2020', 'node18'],
  logOverride: {
    'duplicate-object-key': 'silent',
  },
};

async function runBuild() {
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  console.log(`Building ${pkg.name} v${pkg.version}...`);

  // 1. Browser standalone bundle (IIFE for CDN <script> tags)
  await build({
    ...sharedOptions,
    entryPoints: ['src/index.js'],
    outfile: 'dist/marathi-transliterate.min.js',
    format: 'iife',
    globalName: 'MarathiTransliterate',
    banner: { js: banner },
    footer: {
      js: 'if (typeof window !== "undefined" && window.MarathiTransliterate && window.MarathiTransliterate.default) { Object.assign(window.MarathiTransliterate, window.MarathiTransliterate.default); }',
    },
  });

  // 2. Minified ESM bundle (root entry)
  await build({
    ...sharedOptions,
    entryPoints: ['src/index.js'],
    outfile: 'dist/index.min.js',
    format: 'esm',
    banner: { js: banner },
  });

  // 3. Minified ESM Search subpath bundle
  await build({
    ...sharedOptions,
    entryPoints: ['src/search.js'],
    outfile: 'dist/search.min.js',
    format: 'esm',
    banner: { js: banner },
  });

  // 4. Minified ESM DOM subpath bundle
  await build({
    ...sharedOptions,
    entryPoints: ['src/dom.js'],
    outfile: 'dist/dom.min.js',
    format: 'esm',
    banner: { js: banner },
  });

  const files = fs.readdirSync('dist').filter(f => !f.endsWith('.map'));
  console.log('✓ Successfully generated bundles in dist/:');
  for (const f of files) {
    const stat = fs.statSync(path.join('dist', f));
    console.log(`  - dist/${f} (${(stat.size / 1024).toFixed(2)} KB)`);
  }
}

runBuild().catch(err => {
  console.error(err);
  process.exit(1);
});
