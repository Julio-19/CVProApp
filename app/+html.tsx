import { type PropsWithChildren } from 'react';
import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        
        {/* IMPORTANT: Base URL pour GitHub Pages */}
        <base href="/CVProApp/" />
        
        {/* Reset des styles pour expo-router */}
        <ScrollViewStyleReset />
        
        {/* Styles de base */}
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            background-color: #ffffff;
          }
          #root {
            min-height: 100vh;
          }
        ` }} />
        
        {/* Scripts externes */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}