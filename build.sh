#!/bin/bash
set -e

echo "🔨 Build CVPro..."
npx expo export --platform web

echo "📄 Copie index.html → 404.html pour SPA routing..."
cp dist/index.html dist/404.html

echo "📝 Ajout script html2pdf..."
sed -i 's|</head>|<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script></head>|' dist/index.html
sed -i 's|</head>|<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script></head>|' dist/404.html

echo "✅ Build terminé !"
