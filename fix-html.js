// fix-html.js
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

// Fonction pour traiter un fichier HTML
function fixHTML(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Ajouter base URL si pas déjà présent
  if (!html.includes('<base href="/CVProApp/">')) {
    html = html.replace('<head>', '<head>\n  <base href="/CVProApp/">');
  }
  
  // Corriger les chemins des ressources
  html = html.replace(/href="\//g, 'href="/CVProApp/');
  html = html.replace(/src="\//g, 'src="/CVProApp/');
  html = html.replace(/href='\//g, "href='/CVProApp/");
  html = html.replace(/src='\//g, "src='/CVProApp/");
  
  fs.writeFileSync(filePath, html);
  console.log(`✅ Fichier corrigé: ${filePath}`);
}

// Traiter index.html
fixHTML(indexPath);

// Traiter 404.html si présent
const errorPath = path.join(distPath, '404.html');
if (fs.existsSync(errorPath)) {
  fixHTML(errorPath);
}

console.log('✅ Tous les fichiers HTML ont été corrigés');