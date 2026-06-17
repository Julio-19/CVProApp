// deploy.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Déploiement de CVProApp sur GitHub Pages\n');

// 1. Vérifier que dist existe
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ Le dossier dist n\'existe pas. Exécutez d\'abord: npm run build:web');
  process.exit(1);
}

// 2. Créer le dossier deploy
const deployPath = path.join(__dirname, 'deploy');
if (fs.existsSync(deployPath)) {
  fs.rmSync(deployPath, { recursive: true, force: true });
}
fs.mkdirSync(deployPath);

console.log('📁 Copie des fichiers...');

// 3. Copier tous les fichiers de dist vers deploy
const copyRecursive = (src, dest) => {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};
copyRecursive(distPath, deployPath);

// 4. Copier le fichier JS à la racine
const jsFiles = fs.readdirSync(path.join(distPath, '/CVProApp/_expo/', 'static', 'js', 'web'))
  .filter(f => f.endsWith('.js'));

if (jsFiles.length === 0) {
  console.error('❌ Fichier JS non trouvé !');
  process.exit(1);
}

const jsFile = jsFiles[0];
const jsSource = path.join(distPath, '/CVProApp/_expo/', 'static', 'js', 'web', jsFile);
const jsDest = path.join(deployPath, 'app.js');
fs.copyFileSync(jsSource, jsDest);
console.log(`✅ app.js créé (${jsFile})`);

// 5. Créer index.html avec app.js
const html = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>CVProApp</title>
    <link rel="icon" href="/CVProApp/favicon.ico" />
    <style>
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
      body {
        overflow: hidden;
      }
      #root {
        display: flex;
        height: 100%;
        flex: 1;
      }
    </style>
  </head>
  <body>
    <noscript>Vous devez activer JavaScript pour utiliser cette application.</noscript>
    <div id="root"></div>
    <script src="/CVProApp/app.js" defer></script>
  </body>
</html>`;

fs.writeFileSync(path.join(deployPath, 'index.html'), html);
console.log('✅ index.html créé');

// 6. Créer .nojekyll
fs.writeFileSync(path.join(deployPath, '.nojekyll'), '');
console.log('✅ .nojekyll créé');

// 7. Créer 404.html
const errorHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirection</title>
  <script>
    var path = window.location.pathname;
    if (path === '/' || path === '/index.html') {
      window.location.href = '/CVProApp/';
    } else {
      window.location.href = '/CVProApp/' + path.replace('/CVProApp/', '');
    }
  </script>
</head>
<body>
  <p>Redirection vers CVProApp...</p>
</body>
</html>`;

fs.writeFileSync(path.join(deployPath, '404.html'), errorHtml);
console.log('✅ 404.html créé');

// 8. Déployer sur GitHub Pages
console.log('\n🚀 Déploiement sur GitHub Pages...');
try {
  execSync('npx gh-pages-clean', { stdio: 'inherit' });
  execSync(`npx gh-pages -d ${deployPath} --no-history`, { stdio: 'inherit' });
  console.log('\n✅ Déploiement terminé avec succès !');
  console.log('🌐 https://julio-19.github.io/CVProApp/');
} catch (error) {
  console.error('❌ Erreur lors du déploiement:', error.message);
  process.exit(1);
} finally {
  // Nettoyer
  if (fs.existsSync(deployPath)) {
    fs.rmSync(deployPath, { recursive: true, force: true });
  }
}
