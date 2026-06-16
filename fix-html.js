// fix-html.js
const fs = require("fs");
const path = require("path");

const distPath = path.join(__dirname, "dist");
const indexPath = path.join(distPath, "index.html");

function fixHTML(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Fichier non trouvé: ${filePath}`);
    return;
  }

  let html = fs.readFileSync(filePath, "utf8");

  // Supprimer d'abord tous les base href existants
  html = html.replace(/<base href="[^"]*">/g, "");
  html = html.replace(/<base href='[^']*'>/g, "");

  // Ajouter le bon base href
  html = html.replace("<head>", '<head>\n  <base href="/CVProApp/">');

  // Corriger les chemins des ressources
  html = html.replace(/href="\//g, 'href="/CVProApp/');
  html = html.replace(/src="\//g, 'src="/CVProApp/');
  html = html.replace(/href='\//g, "href='/CVProApp/");
  html = html.replace(/src='\//g, "src='/CVProApp/");

  fs.writeFileSync(filePath, html);
  console.log(`✅ Fichier corrigé: ${filePath}`);
}

// Exécuter
fixHTML(indexPath);

// Créer 404.html
const errorPath = path.join(distPath, "404.html");
const errorHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <base href="/CVProApp/">
  <script>
    const path = window.location.pathname;
    if (path === '/CVProApp/' || path === '/') {
      window.location.href = '/CVProApp/';
    } else {
      const newPath = '/CVProApp/' + path.replace('/CVProApp/', '').replace(/^\\//, '');
      window.location.href = newPath;
    }
  </script>
</head>
<body>
  <p>Redirection vers l'application...</p>
</body>
</html>`;

fs.writeFileSync(errorPath, errorHtml);
console.log("✅ 404.html créé");

console.log("✅ Correction terminée !");
