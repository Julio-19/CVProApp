#!/bin/bash
set -e
echo "Build CVPro..."
npx expo export --platform web
sed -i 's|<script src="/_expo|<script type="module" src="/_expo|g' dist/index.html
sed -i 's|</head>|<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script></head>|g' dist/index.html

# Remplacer le SW Expo par notre SW sans cache
cp public/sw.js dist/sw.js
echo "SW sans cache copié"

cp dist/index.html dist/404.html
cp public/_headers dist/_headers
echo "Build termine!"