// services/templateService.ts — VERSION OPTIMISÉE

export const getNiveauPct = (n: string): number =>
  ({Débutant:25,Intermédiaire:50,Avancé:75,Natif:100}[n]??50);

// CSS de base partagé entre tous les templates
const B = `*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;font-size:12px;}`;

// Fonctions utilitaires partagées
const sidebar = (cv:any, photo:string|null, colors:{bg:string,accent:string,text:string,muted:string}) => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${B}
.cv{display:flex;width:100%;min-height:100vh;}
.L{width:32%;background:${colors.bg};padding:0 0 24px;color:#fff;}
.R{width:68%;padding:24px;background:#fff;}
.ltop{padding:22px 14px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.1);}
.ph{width:85px;height:85px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.7);display:block;margin:0 auto 10px;}
.pp{width:85px;height:85px;border-radius:50%;background:rgba(255,255,255,0.1);margin:0 auto 10px;}
.lp{padding:0 14px;}
.lt{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${colors.muted};border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:3px;margin:12px 0 7px;}
.ci{font-size:10px;color:${colors.muted};margin-bottom:4px;display:flex;gap:6px;}
.sk{font-size:10px;color:${colors.muted};margin-bottom:3px;}
.sk::before{content:"• ";}
.bg{height:3px;background:rgba(255,255,255,0.15);border-radius:2px;margin-top:2px;}
.bf{height:3px;background:${colors.accent};border-radius:2px;}
.rnm{font-size:26px;font-weight:900;color:#111;border-bottom:3px solid ${colors.bg};padding-bottom:8px;margin-bottom:6px;}
.rdg{font-size:11px;color:${colors.bg};font-weight:600;margin-bottom:16px;text-transform:uppercase;}
.rs{background:${colors.bg};color:#fff;font-size:10px;font-weight:700;text-transform:uppercase;padding:4px 12px;border-radius:3px;margin:12px 0 8px;display:inline-block;}
.ei{margin-bottom:11px;padding-left:10px;border-left:3px solid ${colors.bg};}
.et{font-size:11px;font-weight:700;color:#111;}
.ec{font-size:10px;color:${colors.bg};margin-top:1px;}
.ed{font-size:9px;color:#888;}
.edesc{font-size:10px;color:#555;margin-top:2px;line-height:1.5;}
</style></head><body><div class="cv">
<div class="L">
  <div class="ltop">
    ${photo?`<img class="ph" src="${photo}"/>`:`<div class="pp"></div>`}
    <div style="font-size:14px;font-weight:700;color:#fff;">${cv.prenom} ${cv.nom}</div>
    <div style="font-size:10px;color:${colors.muted};margin-top:3px;">${cv.titre??''}</div>
  </div>
  <div class="lp">
    <div class="lt">Contact</div>
    ${cv.telephone?`<div class="ci">📞 ${cv.telephone}</div>`:''}
    ${cv.email?`<div class="ci">✉ ${cv.email}</div>`:''}
    ${cv.ville?`<div class="ci">📍 ${cv.ville}</div>`:''}
    ${cv.objectif?`<div class="lt">Profil</div><p style="font-size:10px;color:${colors.muted};line-height:1.6;">${cv.objectif}</p>`:''}
    ${cv.competences?.length>0?`<div class="lt">Compétences</div>${cv.competences.map((c:string)=>`<div class="sk">${c}</div>`).join('')}`:''}
    ${cv.langues?.length>0?`<div class="lt">Langues</div>${cv.langues.map((l:any)=>`<div style="margin-bottom:7px;"><div style="font-size:10px;color:${colors.muted};margin-bottom:2px;">${l.langue} — ${l.niveau}</div><div class="bg"><div class="bf" style="width:${getNiveauPct(l.niveau)}%"></div></div></div>`).join('')}`:''}
    ${cv.loisirs?.length>0?`<div class="lt">Loisirs</div>${cv.loisirs.map((l:string)=>`<div class="sk">${l}</div>`).join('')}`:''}
  </div>
</div>
<div class="R">
  <div class="rnm">${cv.prenom} ${cv.nom}</div>
  <div class="rdg">${cv.titre??''}</div>
  ${cv.formations?.length>0?`<div class="rs">Formation</div>${cv.formations.map((f:any)=>`<div class="ei"><div class="et">${f.diplome}</div><div class="ec">${f.etablissement}</div><div class="ed">${f.annee}</div></div>`).join('')}`:''}
  ${cv.experiences?.length>0?`<div class="rs">Expériences</div>${cv.experiences.map((e:any)=>`<div class="ei"><div class="et">${e.poste}</div><div class="ec">${e.entreprise}</div><div class="ed">${e.debut} – ${e.fin}</div><div class="edesc">${e.description??''}</div></div>`).join('')}`:''}
</div></div></body></html>`;

// Tous les templates sidebar utilisent la même fonction avec des couleurs différentes
export const templateSidebarBleu   = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1a3a5c',accent:'#4a9fd4',text:'#fff',muted:'#cde0f5'});
export const templateDarkSidebar   = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#2c2c2c',accent:'#9ca3af',text:'#fff',muted:'#d1d5db'});
export const templateViolet        = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#6b21a8',accent:'#c084fc',text:'#fff',muted:'#e9d5ff'});
export const templateNavyPro       = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1e3a6e',accent:'#90afd4',text:'#fff',muted:'#bfdbfe'});
export const templateOrangeSidebar = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#ea580c',accent:'#fed7aa',text:'#fff',muted:'#fed7aa'});
export const templateFresherDark   = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1a2744',accent:'#90a4c0',text:'#fff',muted:'#c5d3e8'});
export const templateRougeModerne  = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#dc2626',accent:'#fca5a5',text:'#fff',muted:'#fecaca'});
export const templateJaunePro      = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1a1a1a',accent:'#eab308',text:'#fff',muted:'#fde047'});
export const templateDarkOrange    = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1c1917',accent:'#f97316',text:'#fff',muted:'#fed7aa'});
export const templateCrimsonPro    = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#7f1d1d',accent:'#fca5a5',text:'#fff',muted:'#fecaca'});
export const templateMidnightPro   = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1e1b4b',accent:'#a5b4fc',text:'#fff',muted:'#c7d2fe'});
export const templateSaharaWarm    = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#8b6914',accent:'#fdf4e3',text:'#fff',muted:'#f5deb3'});
export const templateAuroraDark    = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1a0533',accent:'#8b5cf6',text:'#fff',muted:'#c4b5fd'});
export const templateGalaxyDark    = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#050510',accent:'#6366f1',text:'#fff',muted:'#c7d2fe'});
export const templateVolcanoDark   = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1a0000',accent:'#ef4444',text:'#fff',muted:'#fecaca'});
export const templateNinjaDark     = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#050000',accent:'#dc2626',text:'#fff',muted:'#fecaca'});
export const templateObsidianPro   = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1e1a2e',accent:'#8b5cf6',text:'#fff',muted:'#c4b5fd'});
export const templateDuskPurple    = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#120027',accent:'#a855f7',text:'#fff',muted:'#f0abfc'});
export const templatePhantomDark   = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#030303',accent:'#374151',text:'#fff',muted:'#9ca3af'});
export const templateFireDark      = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#0d0000',accent:'#ef4444',text:'#fff',muted:'#fca5a5'});
export const templateNoirRose      = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#0d000d',accent:'#f472b6',text:'#fff',muted:'#fbcfe8'});
export const templateChromeTech    = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#27272a',accent:'#a1a1aa',text:'#fff',muted:'#d4d4d8'});
export const templateTitaniumPra   = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1e2a3a',accent:'#60a5fa',text:'#fff',muted:'#93c5fd'});
export const templateOnyxGold      = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1a1500',accent:'#d4af37',text:'#fff',muted:'#f5d060'});
export const templateSteelBlue     = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#0c2a3a',accent:'#38bdf8',text:'#fff',muted:'#7dd3fc'});
export const templateThunderDark   = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#0d0d00',accent:'#facc15',text:'#fff',muted:'#fef08a'});
export const templateLavaHot       = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1a0a00',accent:'#f97316',text:'#fff',muted:'#fed7aa'});
export const templateShadowDark    = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#030303',accent:'#374151',text:'#fff',muted:'#d1d5db'});
export const templateMatrixGreen   = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#000a00',accent:'#00ff41',text:'#fff',muted:'#00cc33'});
export const templateCarbonTech    = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#111111',accent:'#22d3ee',text:'#fff',muted:'#a5f3fc'});
export const templateNeonDark      = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#050505',accent:'#a3e635',text:'#fff',muted:'#d9f99d'});
export const templateSpaceDark     = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#020617',accent:'#38bdf8',text:'#fff',muted:'#7dd3fc'});
export const templateArcticDark    = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#0a1628',accent:'#7dd3fc',text:'#fff',muted:'#bae6fd'});
export const templateAmberDark     = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1c1207',accent:'#d97706',text:'#fff',muted:'#fde68a'});
export const templateVelvetDark    = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#2e1065',accent:'#c026d3',text:'#fff',muted:'#f0abfc'});

// Fonction utilitaire pour templates clairs (fond blanc/clair)
const light = (cv:any, photo:string|null, colors:{accent:string,bg:string,light:string}) => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${B}
body{background:${colors.light};padding:28px;}
.header{display:flex;gap:18px;align-items:center;padding-bottom:16px;border-bottom:3px solid ${colors.accent};margin-bottom:18px;}
.ph{width:85px;height:85px;border-radius:50%;object-fit:cover;border:3px solid ${colors.accent};}
.pp{width:85px;height:85px;border-radius:50%;background:${colors.bg};border:3px solid ${colors.accent};}
.nm{font-size:26px;font-weight:900;color:#111;}
.dg{font-size:11px;color:${colors.accent};font-weight:600;margin-top:4px;text-transform:uppercase;letter-spacing:2px;}
.contacts{display:flex;gap:14px;margin-top:8px;flex-wrap:wrap;}
.cb{font-size:10px;color:#6b7280;}
.body{display:flex;gap:22px;}
.cl{width:33%;}.cr{flex:1;}
.sec{font-size:10px;font-weight:700;text-transform:uppercase;color:${colors.accent};border-left:4px solid ${colors.accent};padding-left:8px;margin:14px 0 8px;}
.sk{font-size:10px;color:#374151;margin-bottom:4px;}
.sk::before{content:"✓ ";color:${colors.accent};font-weight:700;}
.bg{height:3px;background:${colors.bg};border-radius:2px;margin-top:2px;}
.bf{height:3px;background:${colors.accent};border-radius:2px;}
.ei{margin-bottom:12px;padding:9px;background:#fff;border-radius:6px;border-left:3px solid ${colors.accent};}
.et{font-size:11px;font-weight:700;color:#111;}
.ec{font-size:10px;color:${colors.accent};margin-top:1px;}
.ed{font-size:9px;color:#888;}
.edesc{font-size:10px;color:#555;margin-top:3px;line-height:1.5;}
</style></head><body>
<div class="header">
  ${photo?`<img class="ph" src="${photo}"/>`:`<div class="pp"></div>`}
  <div>
    <div class="nm">${cv.prenom} ${cv.nom}</div>
    <div class="dg">${cv.titre??''}</div>
    <div class="contacts">
      ${cv.telephone?`<span class="cb">📞 ${cv.telephone}</span>`:''}
      ${cv.email?`<span class="cb">✉ ${cv.email}</span>`:''}
      ${cv.ville?`<span class="cb">📍 ${cv.ville}</span>`:''}
    </div>
  </div>
</div>
<div class="body">
  <div class="cl">
    ${cv.objectif?`<div class="sec">Profil</div><p style="font-size:10px;color:#444;line-height:1.6;">${cv.objectif}</p>`:''}
    ${cv.competences?.length>0?`<div class="sec">Compétences</div>${cv.competences.map((c:string)=>`<div class="sk">${c}</div>`).join('')}`:''}
    ${cv.langues?.length>0?`<div class="sec">Langues</div>${cv.langues.map((l:any)=>`<div style="margin-bottom:7px;"><div style="font-size:10px;color:#444;margin-bottom:2px;">${l.langue} — ${l.niveau}</div><div class="bg"><div class="bf" style="width:${getNiveauPct(l.niveau)}%"></div></div></div>`).join('')}`:''}
    ${cv.loisirs?.length>0?`<div class="sec">Loisirs</div>${cv.loisirs.map((l:string)=>`<div class="sk">${l}</div>`).join('')}`:''}
  </div>
  <div class="cr">
    ${cv.formations?.length>0?`<div class="sec">Formation</div>${cv.formations.map((f:any)=>`<div class="ei"><div class="et">${f.diplome}</div><div class="ec">${f.etablissement}</div><div class="ed">${f.annee}</div></div>`).join('')}`:''}
    ${cv.experiences?.length>0?`<div class="sec">Expériences</div>${cv.experiences.map((e:any)=>`<div class="ei"><div class="et">${e.poste}</div><div class="ec">${e.entreprise}</div><div class="ed">${e.debut} – ${e.fin}</div><div class="edesc">${e.description??''}</div></div>`).join('')}`:''}
  </div>
</div></body></html>`;

export const templateVertMinimal   = (cv:any,p:string|null) => light(cv,p,{accent:'#16a34a',bg:'#dcfce7',light:'#f0fdf4'});
export const templateRoseElegant   = (cv:any,p:string|null) => light(cv,p,{accent:'#be185d',bg:'#fce7f3',light:'#fff5f7'});
export const templateCoralFresh    = (cv:any,p:string|null) => light(cv,p,{accent:'#f43f5e',bg:'#ffe4e6',light:'#fff1f2'});
export const templateMintClean     = (cv:any,p:string|null) => light(cv,p,{accent:'#14b8a6',bg:'#ccfbf1',light:'#f0fdfa'});
export const templateAzureClean    = (cv:any,p:string|null) => light(cv,p,{accent:'#2563eb',bg:'#dbeafe',light:'#eff6ff'});
export const templateForestGreen   = (cv:any,p:string|null) => light(cv,p,{accent:'#15803d',bg:'#bbf7d0',light:'#f0fdf4'});
export const templateLavenderSoft  = (cv:any,p:string|null) => light(cv,p,{accent:'#7c3aed',bg:'#f5f3ff',light:'#faf5ff'});
export const templateAmberWarm     = (cv:any,p:string|null) => light(cv,p,{accent:'#d97706',bg:'#fde68a',light:'#fffbeb'});
export const templateBurgundyClassic=(cv:any,p:string|null) => light(cv,p,{accent:'#7f1d1d',bg:'#fee2e2',light:'#fff9f9'});
export const templateSageMinimal   = (cv:any,p:string|null) => light(cv,p,{accent:'#84cc16',bg:'#ecfccb',light:'#f7fee7'});
export const templateTopazBright   = (cv:any,p:string|null) => light(cv,p,{accent:'#0891b2',bg:'#a5f3fc',light:'#ecfeff'});
export const templateElectricBlue  = (cv:any,p:string|null) => light(cv,p,{accent:'#1d4ed8',bg:'#dbeafe',light:'#eff6ff'});
export const templateSkyCreative   = (cv:any,p:string|null) => light(cv,p,{accent:'#0284c7',bg:'#e0f2fe',light:'#f0f9ff'});
export const templateSpringGreen   = (cv:any,p:string|null) => light(cv,p,{accent:'#22c55e',bg:'#dcfce7',light:'#f0fdf4'});
export const templateCactusGreen   = (cv:any,p:string|null) => light(cv,p,{accent:'#4d7c0f',bg:'#d9f99d',light:'#f7fee7'});
export const templateLagoonBlue    = (cv:any,p:string|null) => light(cv,p,{accent:'#0284c7',bg:'#bae6fd',light:'#f0f9ff'});
export const templateMonsoonBlue   = (cv:any,p:string|null) => light(cv,p,{accent:'#1d4ed8',bg:'#bfdbfe',light:'#eff6ff'});
export const templateHarborBlue    = (cv:any,p:string|null) => light(cv,p,{accent:'#0369a1',bg:'#bae6fd',light:'#f0f9ff'});
export const templateTropicsFresh  = (cv:any,p:string|null) => light(cv,p,{accent:'#0d9488',bg:'#99f6e4',light:'#f0fdfa'});
export const templateCanopyGreen   = (cv:any,p:string|null) => light(cv,p,{accent:'#15803d',bg:'#a7f3d0',light:'#f0fdf4'});
export const templateJadeFresh     = (cv:any,p:string|null) => light(cv,p,{accent:'#0f766e',bg:'#ccfbf1',light:'#f0fdfa'});
export const templateMeadowSoft    = (cv:any,p:string|null) => light(cv,p,{accent:'#16a34a',bg:'#dcfce7',light:'#f0fff4'});
export const templateCitrusFresh   = (cv:any,p:string|null) => light(cv,p,{accent:'#ca8a04',bg:'#fef08a',light:'#fefce8'});
export const templateLemonZest     = (cv:any,p:string|null) => light(cv,p,{accent:'#ca8a04',bg:'#fde68a',light:'#fefce8'});
export const templatePapayaBright  = (cv:any,p:string|null) => light(cv,p,{accent:'#ea580c',bg:'#fed7aa',light:'#fff7ed'});
export const templateBlushModern   = (cv:any,p:string|null) => light(cv,p,{accent:'#be185d',bg:'#fbcfe8',light:'#fce7f3'});
export const templateSakuraPink    = (cv:any,p:string|null) => light(cv,p,{accent:'#f472b6',bg:'#fce7f3',light:'#fdf2f8'});
export const templateFlamingoPink  = (cv:any,p:string|null) => light(cv,p,{accent:'#ec4899',bg:'#fbcfe8',light:'#fdf4ff'});
export const templateDustyRose     = (cv:any,p:string|null) => light(cv,p,{accent:'#9d174d',bg:'#fce7f3',light:'#fff5f8'});
export const templateSpringBlossom = (cv:any,p:string|null) => light(cv,p,{accent:'#db2777',bg:'#fce7f3',light:'#fff5f8'});
export const templatePastelDream   = (cv:any,p:string|null) => light(cv,p,{accent:'#be185d',bg:'#fce7f3',light:'#fff5f8'});
export const templateCottonSoft    = (cv:any,p:string|null) => light(cv,p,{accent:'#7c3aed',bg:'#f5f3ff',light:'#faf5ff'});
export const templateCloudSoft     = (cv:any,p:string|null) => light(cv,p,{accent:'#0369a1',bg:'#bae6fd',light:'#f0f9ff'});
export const templateGlacierWhite  = (cv:any,p:string|null) => light(cv,p,{accent:'#0e7490',bg:'#a5f3fc',light:'#ecfeff'});
export const templateArcticPro     = (cv:any,p:string|null) => light(cv,p,{accent:'#0369a1',bg:'#bae6fd',light:'#f0f9ff'});
export const templateGlacierCool   = (cv:any,p:string|null) => light(cv,p,{accent:'#0284c7',bg:'#bae6fd',light:'#f0f9ff'});
export const templateNordicClean   = (cv:any,p:string|null) => light(cv,p,{accent:'#374151',bg:'#e5e7eb',light:'#f9fafb'});
export const templateZenMinimal    = (cv:any,p:string|null) => light(cv,p,{accent:'#374151',bg:'#e5e7eb',light:'#f9fafb'});
export const templateInkMinimal    = (cv:any,p:string|null) => light(cv,p,{accent:'#0f172a',bg:'#e2e8f0',light:'#f8fafc'});
export const templateMarbleLuxe    = (cv:any,p:string|null) => light(cv,p,{accent:'#6b7280',bg:'#f3f4f6',light:'#f9fafb'});
export const templatePearlWhite    = (cv:any,p:string|null) => light(cv,p,{accent:'#374151',bg:'#f3f4f6',light:'#ffffff'});
export const templateUrbanGrey     = (cv:any,p:string|null) => light(cv,p,{accent:'#374151',bg:'#e5e7eb',light:'#f9fafb'});
export const templateSteelCorporate=(cv:any,p:string|null) => light(cv,p,{accent:'#374151',bg:'#e5e7eb',light:'#f8fafc'});
export const templateCharcoalPro   = (cv:any,p:string|null) => light(cv,p,{accent:'#1f2937',bg:'#e5e7eb',light:'#f9fafb'});
export const templateGraphitePro   = (cv:any,p:string|null) => light(cv,p,{accent:'#27272a',bg:'#e4e4e7',light:'#fafafa'});
export const templateStormGrey     = (cv:any,p:string|null) => light(cv,p,{accent:'#374151',bg:'#d1d5db',light:'#f3f4f6'});
export const templateSandMinimal   = (cv:any,p:string|null) => light(cv,p,{accent:'#78350f',bg:'#e7d8c5',light:'#fdf8f0'});
export const templateCreamLuxe     = (cv:any,p:string|null) => light(cv,p,{accent:'#92400e',bg:'#fde68a',light:'#fffdf5'});
export const templateIvoryClassic  = (cv:any,p:string|null) => light(cv,p,{accent:'#713f12',bg:'#fef9ec',light:'#fefef7'});
export const templateWineClassic   = (cv:any,p:string|null) => light(cv,p,{accent:'#7f1d1d',bg:'#fecdd3',light:'#fff9f9'});
export const templateBronzeClassic = (cv:any,p:string|null) => light(cv,p,{accent:'#cd7f32',bg:'#fde68a',light:'#fdf8f0'});
export const templateCopperElegant = (cv:any,p:string|null) => light(cv,p,{accent:'#b87333',bg:'#fde68a',light:'#fdf8f0'});
export const templateMahoganyRich  = (cv:any,p:string|null) => light(cv,p,{accent:'#c0392b',bg:'#fecdd3',light:'#fdf6f0'});
export const templateRubyLuxe      = (cv:any,p:string|null) => light(cv,p,{accent:'#e11d48',bg:'#ffe4e6',light:'#fff1f2'});
export const templateRoseGold      = (cv:any,p:string|null) => light(cv,p,{accent:'#f43f5e',bg:'#fce7f3',light:'#fff5f8'});
export const templateRustBold      = (cv:any,p:string|null) => light(cv,p,{accent:'#b45309',bg:'#fed7aa',light:'#fff7ed'});
export const templateTerracottaWarm= (cv:any,p:string|null) => light(cv,p,{accent:'#c2410c',bg:'#fdba74',light:'#fff7ed'});
export const templateBrickWarm     = (cv:any,p:string|null) => light(cv,p,{accent:'#b45309',bg:'#fde68a',light:'#fffbeb'});
export const templateCedarWarm     = (cv:any,p:string|null) => light(cv,p,{accent:'#92400e',bg:'#fed7aa',light:'#fff7ed'});
export const templateMochaWarm     = (cv:any,p:string|null) => light(cv,p,{accent:'#a07850',bg:'#fde8d0',light:'#fdf6f0'});
export const templateSepiaVintage  = (cv:any,p:string|null) => light(cv,p,{accent:'#C8A87A',bg:'#f5ead8',light:'#fdf8f0'});
export const templateOliveNatural  = (cv:any,p:string|null) => light(cv,p,{accent:'#65a30d',bg:'#d9f99d',light:'#f7fee7'});
export const templateTerraceMed    = (cv:any,p:string|null) => light(cv,p,{accent:'#3d6b3d',bg:'#c8e6c0',light:'#f0f7f0'});
export const templatePineForest    = (cv:any,p:string|null) => light(cv,p,{accent:'#15803d',bg:'#a7f3d0',light:'#f0fdf4'});
export const templateForestDark    = (cv:any,p:string|null) => light(cv,p,{accent:'#166534',bg:'#bbf7d0',light:'#f0fdf4'});
export const templateBambooZen     = (cv:any,p:string|null) => light(cv,p,{accent:'#2d5016',bg:'#e8e0cc',light:'#fafaf7'});
export const templateRoyalPurple   = (cv:any,p:string|null) => light(cv,p,{accent:'#7c3aed',bg:'#ede9fe',light:'#faf5ff'});
export const templatePlumElegant   = (cv:any,p:string|null) => light(cv,p,{accent:'#6d28d9',bg:'#ede9fe',light:'#faf5ff'});
export const templateIndigoModern  = (cv:any,p:string|null) => light(cv,p,{accent:'#4338ca',bg:'#e0e7ff',light:'#eef2ff'});
export const templateCobaltModern  = (cv:any,p:string|null) => light(cv,p,{accent:'#1d4ed8',bg:'#dbeafe',light:'#eff6ff'});
export const templateDenimCasual   = (cv:any,p:string|null) => light(cv,p,{accent:'#2563eb',bg:'#dbeafe',light:'#eff6ff'});
export const templateDiamondLuxe   = (cv:any,p:string|null) => light(cv,p,{accent:'#06b6d4',bg:'#cffafe',light:'#f0fdff'});
export const templateTitaniumPro   = (cv:any,p:string|null) => light(cv,p,{accent:'#60a5fa',bg:'#dbeafe',light:'#f0f9ff'});
export const templateGlacierCool2  = (cv:any,p:string|null) => light(cv,p,{accent:'#38bdf8',bg:'#e0f2fe',light:'#f0f9ff'});
export const templatePrismColorful = (cv:any,p:string|null) => light(cv,p,{accent:'#8b5cf6',bg:'#ede9fe',light:'#faf5ff'});

// Templates spéciaux (layouts uniques)
export const templateMinimaliste   = (cv:any,p:string|null) => light(cv,p,{accent:'#111',bg:'#f0f0f0',light:'#fff'});
export const templateClassiquePro  = (cv:any,p:string|null) => light(cv,p,{accent:'#888',bg:'#f0f0f0',light:'#fff'});
export const templateGagnant       = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1a3a5c',accent:'#4a9fd4',text:'#fff',muted:'#cde0f5'});
export const templateTealStudent   = (cv:any,p:string|null) => light(cv,p,{accent:'#3d9b8a',bg:'#e8e8e8',light:'#f0f0f0'});
export const templateBleuArrondi   = (cv:any,p:string|null) => light(cv,p,{accent:'#2563eb',bg:'#dbeafe',light:'#f0f4ff'});
export const templateBrunElegant   = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#2a2520',accent:'#c9a96e',text:'#fff',muted:'#d1c4b0'});
export const templateFresherVert   = (cv:any,p:string|null) => light(cv,p,{accent:'#2d5a27',bg:'#e8e8e8',light:'#f5f5f0'});
export const templateGeometrique   = (cv:any,p:string|null) => light(cv,p,{accent:'#e85d30',bg:'#f0f0f0',light:'#fff'});
export const templateVertNature    = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1e3422',accent:'#4a6344',text:'#fff',muted:'#c8d5b9'});
export const templateBoldNoir      = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#111',accent:'#9ca3af',text:'#fff',muted:'#9ca3af'});
export const templateDarkGris      = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1f2937',accent:'#9ca3af',text:'#fff',muted:'#d1d5db'});
export const templateLimeTech      = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#111827',accent:'#84cc16',text:'#fff',muted:'#d9f99d'});
export const templateEmeraldTech   = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#022c22',accent:'#10b981',text:'#fff',muted:'#a7f3d0'});
export const templateTechDark      = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#0a0a0f',accent:'#6366f1',text:'#fff',muted:'#c7d2fe'});
export const templateSlateModern   = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1e293b',accent:'#38bdf8',text:'#fff',muted:'#cbd5e1'});
export const templateGoldBlack     = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#000000',accent:'#ffd700',text:'#fff',muted:'#ffd700'});
export const templateEbonyGold     = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#0a0500',accent:'#ffd700',text:'#fff',muted:'#ffd700'});
export const templateGoldBlack2    = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#111111',accent:'#daa520',text:'#fff',muted:'#f5d060'});

// Aliases pour maintenir la compatibilité
export const templateTealBanner    = templateTealStudent;
export const templateBleuJaune     = templateBleuArrondi;
export const templateGrisArche     = templateMinimaliste;
export const templateVertDiamant   = templateVertMinimal;
export const templateDarkRouge     = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1a0a0a',accent:'#e8363a',text:'#fff',muted:'#fca5a5'});
export const templateNoirBlob      = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#0a0a0a',accent:'#9ca3af',text:'#fff',muted:'#aaa'});
export const templateWaveCyan      = (cv:any,p:string|null) => light(cv,p,{accent:'#0891b2',bg:'#cffafe',light:'#ecfeff'});
export const templateGrisWave      = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#4b5563',accent:'#d1d5db',text:'#fff',muted:'#e5e7eb'});
export const templateTealCercle    = (cv:any,p:string|null) => light(cv,p,{accent:'#0f766e',bg:'#ccfbf1',light:'#f0fdfa'});
export const templateOrangeMinimal = (cv:any,p:string|null) => light(cv,p,{accent:'#ea580c',bg:'#fed7aa',light:'#fff7ed'});
export const templateNoirJaune     = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1a1a1a',accent:'#fde047',text:'#fff',muted:'#fef08a'});
export const templateDoreDark      = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#1c1a12',accent:'#d97706',text:'#fff',muted:'#fde68a'});
export const templateBrunRose      = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#5c3d2e',accent:'#e07b86',text:'#fff',muted:'#fecdd3'});
export const templateGrisVague     = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#64748b',accent:'#d1d5db',text:'#fff',muted:'#e2e8f0'});
export const templateGeoOrange     = (cv:any,p:string|null) => light(cv,p,{accent:'#f97316',bg:'#f0f0f0',light:'#fff'});
export const templateDoreSidebar   = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#292524',accent:'#c9a96e',text:'#fff',muted:'#fde68a'});
export const templateNavyWave      = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#0f2952',accent:'#38bdf8',text:'#fff',muted:'#bae6fd'});
export const templateDarkDore2     = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#18130a',accent:'#d4a017',text:'#fff',muted:'#f5d060'});
export const templateWaveNoir      = (cv:any,p:string|null) => light(cv,p,{accent:'#0f172a',bg:'#e2e8f0',light:'#f8fafc'});
export const templateBlushModern2  = (cv:any,p:string|null) => light(cv,p,{accent:'#db2777',bg:'#fce7f3',light:'#fff5f8'});

// Nouveaux templates restants
export const templateOceanBlue     = (cv:any,p:string|null) => light(cv,p,{accent:'#0369a1',bg:'#bae6fd',light:'#f0f9ff'});
export const templateSunsetWarm    = (cv:any,p:string|null) => light(cv,p,{accent:'#f97316',bg:'#fed7aa',light:'#fff7ed'});
export const templateCoralFresh2   = (cv:any,p:string|null) => light(cv,p,{accent:'#f43f5e',bg:'#ffe4e6',light:'#fff1f2'});
export const templateMetroPro      = (cv:any,p:string|null) => light(cv,p,{accent:'#0f172a',bg:'#f8fafc',light:'#f8fafc'});
export const templateNordicClean2  = (cv:any,p:string|null) => light(cv,p,{accent:'#374151',bg:'#f3f4f6',light:'#f9fafb'});
export const templateGalaxyDark2   = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#050510',accent:'#6366f1',text:'#fff',muted:'#c7d2fe'});
export const templateChromeTech2   = (cv:any,p:string|null) => sidebar(cv,p,{bg:'#27272a',accent:'#a1a1aa',text:'#fff',muted:'#d4d4d8'});
export const templateBambooZen2    = (cv:any,p:string|null) => light(cv,p,{accent:'#4a7c4e',bg:'#e8f5e9',light:'#f1f8f1'});
export const templateMonsoon2      = (cv:any,p:string|null) => light(cv,p,{accent:'#1e40af',bg:'#bfdbfe',light:'#eff6ff'});
export const templatePrism2        = (cv:any,p:string|null) => light(cv,p,{accent:'#7c3aed',bg:'#ede9fe',light:'#faf5ff'});

// Générer le HTML final
export const generateCVHTML = (cv: any, photo: string | null, templateId: string): string => {
  const templates: Record<string, (cv:any, p:string|null)=>string> = {
    sidebar_bleu: templateSidebarBleu,
    gagnant: templateGagnant,
    minimaliste: templateMinimaliste,
    teal_student: templateTealStudent,
    teal: templateTealStudent,
    dark_sidebar: templateDarkSidebar,
    violet: templateViolet,
    classique_pro: templateClassiquePro,
    bold_noir: templateBoldNoir,
    bleu_arrondi: templateBleuArrondi,
    brun_elegant: templateBrunElegant,
    fresher_vert: templateFresherVert,
    geometrique: templateGeometrique,
    vert_nature: templateVertNature,
    navy_pro: templateNavyPro,
    fresher_dark: templateFresherDark,
    teal_banner: templateTealBanner,
    bleu_jaune: templateBleuJaune,
    gris_arche: templateGrisArche,
    vert_diamant: templateVertDiamant,
    dark_rouge: templateDarkRouge,
    noir_blob: templateNoirBlob,
    wave_cyan: templateWaveCyan,
    gris_wave: templateGrisWave,
    teal_cercle: templateTealCercle,
    orange_minimal: templateOrangeMinimal,
    noir_jaune: templateNoirJaune,
    dore_dark: templateDoreDark,
    brun_rose: templateBrunRose,
    gris_vague: templateGrisVague,
    geo_orange: templateGeoOrange,
    dore_sidebar: templateDoreSidebar,
    navy_wave: templateNavyWave,
    dark_dore2: templateDarkDore2,
    dark_gris: templateDarkGris,
    wave_noir: templateWaveNoir,
    rouge_moderne: templateRougeModerne,
    jaune_pro: templateJaunePro,
    vert_minimal: templateVertMinimal,
    orange_sidebar: templateOrangeSidebar,
    rose_elegant: templateRoseElegant,
    dark_orange: templateDarkOrange,
    crimson_pro: templateCrimsonPro,
    ocean_blue: templateOceanBlue,
    slate_modern: templateSlateModern,
    emerald_tech: templateEmeraldTech,
    sunset_warm: templateSunsetWarm,
    arctic_white: templateNordicClean,
    midnight_pro: templateMidnightPro,
    copper_elegant: templateCopperElegant,
    forest_green: templateForestGreen,
    royal_purple: templateRoyalPurple,
    sand_minimal: templateSandMinimal,
    tech_dark: templateTechDark,
    coral_fresh: templateCoralFresh,
    gold_black: templateGoldBlack,
    mint_clean: templateMintClean,
    burgundy_classic: templateBurgundyClassic,
    sky_creative: templateSkyCreative,
    charcoal_pro: templateCharcoalPro,
    peach_soft: templateSunsetWarm,
    indigo_modern: templateIndigoModern,
    olive_natural: templateOliveNatural,
    ruby_luxe: templateRubyLuxe,
    steel_corporate: templateSteelCorporate,
    lavender_soft: templateLavenderSoft,
    amber_warm: templateAmberWarm,
    ink_minimal: templateInkMinimal,
    azure_clean: templateAzureClean,
    mahogany_rich: templateMahoganyRich,
    lime_tech: templateLimeTech,
    plum_elegant: templatePlumElegant,
    graphite_pro: templateGraphitePro,
    jade_fresh: templateJadeFresh,
    terracotta_warm: templateTerracottaWarm,
    cobalt_modern: templateCobaltModern,
    cream_luxe: templateCreamLuxe,
    carbon_tech: templateCarbonTech,
    sage_minimal: templateSageMinimal,
    wine_classic: templateWineClassic,
    topaz_bright: templateTopazBright,
    ebony_gold: templateEbonyGold,
    blush_modern: templateBlushModern,
    pine_forest: templatePineForest,
    denim_casual: templateDenimCasual,
    rose_gold: templateRoseGold,
    space_dark: templateSpaceDark,
    citrus_fresh: templateCitrusFresh,
    mocha_warm: templateMochaWarm,
    glacier_cool: templateGlacierCool,
    amber_dark: templateAmberDark,
    electric_blue: templateElectricBlue,
    dusty_rose: templateDustyRose,
    forest_dark: templateForestDark,
    ivory_classic: templateIvoryClassic,
    neon_dark: templateNeonDark,
    sepia_vintage: templateSepiaVintage,
    arctic_dark: templateArcticDark,
    blaze_orange: templateSunsetWarm,
    storm_grey: templateStormGrey,
    spring_green: templateSpringGreen,
    velvet_dark: templateVelvetDark,
    aurora_dark: templateAuroraDark,
    metro_pro: templateMetroPro,
    bamboo_zen: templateBambooZen,
    chrome_tech: templateChromeTech,
    sahara_warm: templateSaharaWarm,
    nordic_clean: templateNordicClean,
    galaxy_dark: templateGalaxyDark,
    terrace_med: templateTerraceMed,
    flamingo_pink: templateFlamingoPink,
    titanium_pro: templateTitaniumPro,
    canopy_green: templateCanopyGreen,
    brick_warm: templateBrickWarm,
    diamond_luxe: templateDiamondLuxe,
    arctic_pro: templateArcticPro,
    volcano_dark: templateVolcanoDark,
    spring_blossom: templateSpringBlossom,
    urban_grey: templateUrbanGrey,
    tropics_fresh: templateTropicsFresh,
    onyx_gold: templateOnyxGold,
    pastel_dream: templatePastelDream,
    ninja_dark: templateNinjaDark,
    lemon_zest: templateLemonZest,
    marble_luxe: templateMarbleLuxe,
    rust_bold: templateRustBold,
    lagoon_blue: templateLagoonBlue,
    obsidian_pro: templateObsidianPro,
    meadow_soft: templateMeadowSoft,
    prism_colorful: templatePrismColorful,
    shadow_dark: templateShadowDark,
    cotton_soft: templateCottonSoft,
    thunder_dark: templateThunderDark,
    cactus_green: templateCactusGreen,
    pearl_white: templatePearlWhite,
    lava_hot: templateLavaHot,
    monsoon_blue: templateMonsoonBlue,
    bronze_classic: templateBronzeClassic,
    sakura_pink: templateSakuraPink,
    matrix_green: templateMatrixGreen,
    dusk_purple: templateDuskPurple,
    glacier_white: templateGlacierWhite,
    cedar_warm: templateCedarWarm,
    phantom_dark: templatePhantomDark,
    papaya_bright: templatePapayaBright,
    steel_blue: templateSteelBlue,
    noir_rose: templateNoirRose,
    zen_minimal: templateZenMinimal,
    fire_dark: templateFireDark,
    cloud_soft: templateCloudSoft,
    harbor_blue: templateHarborBlue,
  };

  return (templates[templateId] ?? templateSidebarBleu)(cv, photo);
};