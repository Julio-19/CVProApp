# deploy-git.ps1
Write-Host "🚀 Déploiement CVProApp via Git" -ForegroundColor Cyan

# Nettoyer les dossiers précédents
Remove-Item -Recurse -Force deploy -ErrorAction SilentlyContinue

# Préparer deploy
Write-Host "📁 Préparation..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path deploy -Force | Out-Null
Copy-Item -Path dist\* -Destination deploy\ -Recurse -Force
Copy-Item -Path dist\_expo -Destination deploy\ -Recurse -Force

# Copier app.js
$jsFile = Get-ChildItem deploy\_expo\static\js\web\*.js | Select-Object -First 1
Copy-Item -Path $jsFile.FullName -Destination deploy\app.js -Force
Write-Host "✅ app.js créé" -ForegroundColor Green

# S'assurer que index.html a type="module"
$html = Get-Content deploy\index.html -Raw
if ($html -notmatch 'type="module"') {
    Write-Host "📝 Ajout de type='module'..." -ForegroundColor Yellow
    $html = $html -replace '<script src="app.js" defer>', '<script type="module" src="app.js" defer>'
    $html | Out-File -Encoding UTF8 deploy\index.html
}

# S'assurer que base href est présent
if ($html -notmatch '<base href="/CVProApp/">') {
    Write-Host "📝 Ajout de base href..." -ForegroundColor Yellow
    $html = $html -replace '<head>', '<head><base href="/CVProApp/">'
    $html | Out-File -Encoding UTF8 deploy\index.html
}

# Créer .nojekyll
New-Item -Path deploy\.nojekyll -ItemType File -Force | Out-Null

# Déployer via Git
Write-Host "🚀 Déploiement sur GitHub Pages..." -ForegroundColor Yellow
Push-Location deploy
git init
git remote add origin https://github.com/julio-19/CVProApp.git
git checkout -b gh-pages
git add .
git commit -m "Fix: index.html avec type=module et base href $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git push -f origin gh-pages
Pop-Location

# Nettoyer
Remove-Item -Recurse -Force deploy -ErrorAction SilentlyContinue

Write-Host "`n✅ Déploiement terminé !" -ForegroundColor Green
Write-Host "🌐 https://julio-19.github.io/CVProApp/" -ForegroundColor Cyan
Write-Host "📝 Attendez 1-2 minutes pour la mise à jour..." -ForegroundColor Yellow
