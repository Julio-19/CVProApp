# deploy.ps1
param([string]$message = "Mise à jour CVPro")

Write-Host "🔨 Build en cours..." -ForegroundColor Cyan
npx expo export --platform web

Write-Host "📝 Fix type=module..." -ForegroundColor Cyan
(Get-Content dist\index.html) -replace '<script src="/_expo', '<script type="module" src="/_expo' | Set-Content dist\index.html

Write-Host "📝 Ajout html2pdf..." -ForegroundColor Cyan
(Get-Content dist\index.html) -replace '</head>', '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script></head>' | Set-Content dist\index.html

Write-Host "📄 Copie 404.html..." -ForegroundColor Cyan
Copy-Item dist\index.html dist\404.html

Write-Host "🚀 Push GitHub..." -ForegroundColor Green
git add -A
git commit -m $message
git push

Write-Host "✅ Déploiement terminé ! Cloudflare va redéployer automatiquement." -ForegroundColor Green
Write-Host "🌐 Vérifiez sur : https://cvpro-app.pages.dev" -ForegroundColor Yellow