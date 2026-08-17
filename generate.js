import { build } from 'vite';
import { readdirSync, writeFileSync, copyFileSync, existsSync } from 'fs';

async function generateStatic() {
  await build({
    mode: 'production',
    build: {
      outDir: '.output/public',
      ssr: false
    }
  });

  const assets = readdirSync('.output/public/assets');
  const indexJs = assets.find(file => file.startsWith('index-') && file.endsWith('.js'));
  const stylesCss = assets.find(file => file.startsWith('styles-') && file.endsWith('.css'));

  if (indexJs) {
      const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NNA VITTALO — Adventure Travel</title>
    ${stylesCss ? `<link rel="stylesheet" href="/assets/${stylesCss}" />` : ''}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${indexJs}"></script>
  </body>
</html>`;
      writeFileSync('.output/public/index.html', html);
      // For GitHub pages routing fallback:
      writeFileSync('.output/public/404.html', html);
      console.log('Created index.html and 404.html with entry', indexJs, 'and style', stylesCss);

      // Touch nojekyll
      writeFileSync('.output/public/.nojekyll', '');

      // Copy CNAME if it exists so custom domains continue to work
      if (existsSync('CNAME')) {
        copyFileSync('CNAME', '.output/public/CNAME');
        console.log('Copied CNAME to output');
      }
  }
}
generateStatic();
