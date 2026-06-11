import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { html } = await req.json()

    if (!html) {
      return new Response(JSON.stringify({ error: 'HTML manquant' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Utiliser l'API Browserless ou Puppeteer pour générer le PDF
    // On va utiliser une approche avec fetch vers une API externe gratuite
    
    // Option : utiliser l'API html-pdf-service ou similaire
    // Pour l'instant, on retourne le HTML avec les styles d'impression forcés
    
    const htmlModifie = html
      .replace(
        '* { margin:0; padding:0; box-sizing:border-box; }',
        '* { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; color-adjust:exact !important; }'
      )

    return new Response(JSON.stringify({ html: htmlModifie }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
