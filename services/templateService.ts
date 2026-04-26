export const getNiveauPct = (niveau: string): number => {
  const niveaux: Record<string, number> = {
    'Débutant': 25, 'Intermédiaire': 50, 'Avancé': 75, 'Natif': 100,
  };
  return niveaux[niveau] ?? 50;
};

export const generateCVHTML = (cv: any, photo: string | null, templateId: string): string => {
  switch (templateId) {
    case 'sidebar_bleu':   return templateSidebarBleu(cv, photo);
    case 'gagnant':        return templateGagnant(cv, photo);
    case 'minimaliste':    return templateMinimaliste(cv, photo);
    case 'teal_student':
    case 'teal':           return templateTealStudent(cv, photo);
    case 'dark_sidebar':   return templateDarkSidebar(cv, photo);
    case 'violet':         return templateViolet(cv, photo);
    case 'classique_pro':  return templateClassiquePro(cv, photo);
    case 'bold_noir':      return templateBoldNoir(cv, photo);
    case 'bleu_arrondi':   return templateBleuArrondi(cv, photo);
    case 'brun_elegant':   return templateBrunElegant(cv, photo);
    case 'fresher_vert':   return templateFresherVert(cv, photo);
    case 'geometrique':    return templateGeometrique(cv, photo);
    case 'vert_nature':    return templateVertNature(cv, photo);
    case 'navy_pro':       return templateNavyPro(cv, photo);
    case 'fresher_dark':   return templateFresherDark(cv, photo);
    case 'teal_banner':    return templateTealBanner(cv, photo);
    case 'bleu_jaune':     return templateBleuJaune(cv, photo);
    case 'gris_arche':     return templateGrisArche(cv, photo);
    case 'vert_diamant':   return templateVertDiamant(cv, photo);
    case 'dark_rouge':     return templateDarkRouge(cv, photo);
    case 'noir_blob':      return templateNoirBlob(cv, photo);
    case 'wave_cyan':      return templateWaveCyan(cv, photo);
    case 'gris_wave':      return templateGrisWave(cv, photo);
    case 'teal_cercle':    return templateTealCercle(cv, photo);
    case 'orange_minimal': return templateOrangeMinimal(cv, photo);
    case 'noir_jaune':     return templateNoirJaune(cv, photo);
    case 'dore_dark':      return templateDoreDark(cv, photo);
    case 'brun_rose':      return templateBrunRose(cv, photo);
    case 'gris_vague':     return templateGrisVague(cv, photo);
    case 'geo_orange':     return templateGeoOrange(cv, photo);
    case 'dore_sidebar':   return templateDoreSidebar(cv, photo);
    case 'navy_wave':      return templateNavyWave(cv, photo);
    case 'dark_dore2':     return templateDarkDore2(cv, photo);
    case 'dark_gris':      return templateDarkGris(cv, photo);
    case 'wave_noir':      return templateWaveNoir(cv, photo);
    case 'rouge_moderne':  return templateRougeModerne(cv, photo);
    case 'jaune_pro':      return templateJaunePro(cv, photo);
    case 'vert_minimal':   return templateVertMinimal(cv, photo);
    case 'orange_sidebar': return templateOrangeSidebar(cv, photo);
    case 'rose_elegant':   return templateRoseElegant(cv, photo);
    case 'dark_orange':    return templateDarkOrange(cv, photo);
    
    default:               return templateSidebarBleu(cv, photo);
  }
};

const base = `* { margin:0; padding:0; box-sizing:border-box; } body { font-family: Arial, sans-serif; font-size:12px; }`;

// ═══════════════════════════════════════════════════════
// TEMPLATE 1 — SIDEBAR BLEU
// ═══════════════════════════════════════════════════════
export const templateSidebarBleu = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
.cv{display:flex;width:100%;min-height:100vh;}
.L{width:32%;background:#1a3a5c;padding:28px 18px;color:#fff;}
.R{width:68%;padding:28px 26px;background:#fff;}
.ph{width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid #fff;display:block;margin:0 auto 18px;}
.pp{width:90px;height:90px;border-radius:50%;background:#2d5a8a;margin:0 auto 18px;}
.lt{font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #fff;padding-bottom:4px;margin:16px 0 10px;}
.ci{display:flex;align-items:flex-start;gap:8px;margin-bottom:7px;font-size:10px;color:#cde0f5;}
.cd{width:12px;height:12px;background:#2d5a8a;border-radius:50%;flex-shrink:0;margin-top:1px;}
.sk{display:flex;align-items:center;gap:7px;margin-bottom:6px;font-size:10px;color:#cde0f5;}
.sd{width:6px;height:6px;background:#4a9fd4;transform:rotate(45deg);flex-shrink:0;}
.lb{margin-bottom:9px;}.ln{font-size:10px;color:#cde0f5;margin-bottom:3px;}
.lbg{height:4px;background:#2d5a8a;border-radius:2px;}
.lf{height:4px;background:#4a9fd4;border-radius:2px;}
.rt{font-size:12px;font-weight:bold;color:#1a3a5c;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #1a3a5c;padding-bottom:3px;margin:16px 0 10px;}
.nm{font-size:24px;color:#1a1a1a;}.nm b{color:#1a3a5c;}
.dg{font-size:12px;color:#888;margin-top:3px;text-transform:uppercase;letter-spacing:1px;}
.ti{display:flex;gap:10px;margin-bottom:12px;}
.tc{display:flex;flex-direction:column;align-items:center;padding-top:3px;}
.td{width:10px;height:10px;border-radius:50%;background:#1a3a5c;flex-shrink:0;}
.tl{width:2px;flex:1;background:#e0e0e0;margin-top:3px;min-height:16px;}
.tt{font-size:12px;font-weight:bold;color:#1a1a1a;}
.ts{font-size:10px;color:#888;margin-top:2px;}
.td2{font-size:10px;color:#666;margin-top:3px;}
</style></head><body><div class="cv">
<div class="L">
  ${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}
  <div class="lt">Contacts</div>
  ${cv.telephone?`<div class="ci"><div class="cd"></div><span>${cv.telephone}</span></div>`:''}
  ${cv.email?`<div class="ci"><div class="cd"></div><span>${cv.email}</span></div>`:''}
  ${cv.ville?`<div class="ci"><div class="cd"></div><span>${cv.ville}</span></div>`:''}
  ${cv.competences?.length>0?`<div class="lt">Compétences</div>${cv.competences.map((c:string)=>`<div class="sk"><div class="sd"></div><span>${c}</span></div>`).join('')}`:''}
  ${cv.langues?.length>0?`<div class="lt">Langues</div>${cv.langues.map((l:any)=>`<div class="lb"><div class="ln">${l.langue}</div><div class="lbg"><div class="lf" style="width:${getNiveauPct(l.niveau)}%"></div></div></div>`).join('')}`:''}
  ${cv.loisirs?.length>0?`<div class="lt">Loisirs</div>${cv.loisirs.map((l:string)=>`<div class="sk"><div class="sd"></div><span>${l}</span></div>`).join('')}`:''}
</div>
<div class="R">
  <div style="border-bottom:1px solid #e0e0e0;padding-bottom:14px;margin-bottom:16px;">
    <div class="nm"><b>${cv.prenom}</b> ${cv.nom}</div>
    <div class="dg">${cv.titre??''}</div>
  </div>
  ${cv.objectif?`<div class="rt">À propos</div><p style="font-size:11px;color:#555;line-height:1.7;">${cv.objectif}</p>`:''}
  ${cv.formations?.length>0?`<div class="rt">Formation</div>${cv.formations.map((f:any,i:number)=>`<div class="ti"><div class="tc"><div class="td"></div>${i<cv.formations.length-1?'<div class="tl"></div>':''}</div><div><div class="tt">${f.etablissement}</div><div class="ts">${f.diplome} · ${f.annee}</div></div></div>`).join('')}`:''}
  ${cv.experiences?.length>0?`<div class="rt">Expériences</div>${cv.experiences.map((e:any,i:number)=>`<div class="ti"><div class="tc"><div class="td"></div>${i<cv.experiences.length-1?'<div class="tl"></div>':''}</div><div><div class="tt">${e.entreprise}</div><div class="ts">${e.poste} · ${e.debut} – ${e.fin}</div>${e.description?`<div class="td2">${e.description}</div>`:''}</div></div>`).join('')}`:''}
</div></div></body></html>`;

// ═══════════════════════════════════════════════════════
// TEMPLATE 2 — CV GAGNANT
// ═══════════════════════════════════════════════════════
export const templateGagnant = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
.cv{display:flex;width:100%;min-height:100vh;}
.L{width:32%;background:#f0f0f0;padding:0 0 24px;}
.R{width:68%;padding:24px 28px;background:#fff;}
.ltop{background:#1a3a5c;width:100%;padding:24px 16px;text-align:center;}
.ph{width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid #fff;display:block;margin:0 auto 10px;}
.pp{width:80px;height:80px;border-radius:50%;background:#2d5a8a;margin:0 auto 10px;}
.lpad{padding:0 14px;}
.lt{font-size:10px;font-weight:bold;text-transform:uppercase;background:#1a3a5c;color:#fff;padding:5px 10px;border-radius:3px;margin:14px 0 8px;display:flex;align-items:center;gap:6px;}
.ltrail{flex:1;height:1px;background:#ccc;}
.ci{font-size:10px;color:#444;margin-bottom:5px;padding-left:4px;}
.lb{margin-bottom:8px;}.ln{font-size:10px;color:#444;margin-bottom:3px;}
.lbg{height:3px;background:#ccc;border-radius:2px;}
.lf{height:3px;background:#1a3a5c;border-radius:2px;}
.nm{font-size:26px;color:#1a3a5c;font-weight:bold;text-align:right;margin-bottom:4px;}
.dg{font-size:12px;color:#888;text-align:right;margin-bottom:20px;text-transform:uppercase;}
.rt{font-size:10px;font-weight:bold;text-transform:uppercase;background:#1a3a5c;color:#fff;padding:5px 10px;border-radius:3px;margin:16px 0 10px;display:flex;align-items:center;gap:6px;}
.rtrail{flex:1;height:1px;background:#ccc;}
.exp{display:flex;gap:14px;margin-bottom:12px;}
.edate{font-size:10px;color:#1a3a5c;font-weight:bold;min-width:60px;}
.etitle{font-size:11px;font-weight:bold;color:#1a1a1a;}
.ename{font-size:10px;color:#1a3a5c;margin-top:1px;}
.edesc{font-size:10px;color:#666;margin-top:3px;line-height:1.5;}
.cgrid{display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;margin-top:4px;}
.ctag{font-size:10px;color:#444;}
</style></head><body><div class="cv">
<div class="L">
  <div class="ltop">${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}</div>
  <div class="lpad">
    <div class="lt">Profil <div class="ltrail"></div></div>
    <p style="font-size:10px;color:#444;line-height:1.6;">${cv.objectif??''}</p>
    <div class="lt">Contact <div class="ltrail"></div></div>
    ${cv.telephone?`<div class="ci">📞 ${cv.telephone}</div>`:''}
    ${cv.email?`<div class="ci">✉ ${cv.email}</div>`:''}
    ${cv.ville?`<div class="ci">📍 ${cv.ville}</div>`:''}
    ${cv.langues?.length>0?`<div class="lt">Langues <div class="ltrail"></div></div>${cv.langues.map((l:any)=>`<div class="lb"><div class="ln">${l.langue} — ${l.niveau}</div><div class="lbg"><div class="lf" style="width:${getNiveauPct(l.niveau)}%"></div></div></div>`).join('')}`:''}
    ${cv.loisirs?.length>0?`<div class="lt">Loisirs <div class="ltrail"></div></div>${cv.loisirs.map((l:string)=>`<div class="ci">• ${l}</div>`).join('')}`:''}
  </div>
</div>
<div class="R">
  <div class="nm">${cv.prenom} ${cv.nom}</div>
  <div class="dg">${cv.titre??''}</div>
  ${cv.formations?.length>0?`<div class="rt">Formation <div class="rtrail"></div></div>${cv.formations.map((f:any)=>`<div class="exp"><div class="edate">${f.annee}</div><div><div class="etitle">${f.diplome}</div><div class="ename">${f.etablissement}</div></div></div>`).join('')}`:''}
  ${cv.experiences?.length>0?`<div class="rt">Expériences <div class="rtrail"></div></div>${cv.experiences.map((e:any)=>`<div class="exp"><div class="edate">${e.debut}<br/>${e.fin}</div><div><div class="etitle">${e.poste}</div><div class="ename">${e.entreprise}</div><div class="edesc">${e.description??''}</div></div></div>`).join('')}`:''}
  ${cv.competences?.length>0?`<div class="rt">Compétences <div class="rtrail"></div></div><div class="cgrid">${cv.competences.map((c:string)=>`<div class="ctag">◆ ${c}</div>`).join('')}</div>`:''}
</div></div></body></html>`;

// ═══════════════════════════════════════════════════════
// TEMPLATE 3 — MINIMALISTE
// ═══════════════════════════════════════════════════════
export const templateMinimaliste = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
body{padding:32px;background:#fff;color:#1a1a1a;}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;}
.prenom{font-size:16px;color:#555;letter-spacing:2px;text-transform:uppercase;}
.nom{font-size:32px;font-weight:900;color:#111;text-transform:uppercase;line-height:1;}
.dg{font-size:11px;color:#888;letter-spacing:3px;text-transform:uppercase;margin-top:6px;}
.ph{width:80px;height:80px;border-radius:50%;object-fit:cover;border:2px solid #ddd;}
.pp{width:80px;height:80px;border-radius:50%;background:#ddd;}
.divider{height:1px;background:#ddd;margin:14px 0;}
.body{display:flex;gap:28px;}
.col-l{width:35%;}.col-r{flex:1;}
.section{font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:#111;margin:18px 0 10px;}
.ci{display:flex;align-items:center;gap:8px;font-size:10px;color:#444;margin-bottom:6px;}
.ci-icon{width:16px;height:16px;background:#ddd;border-radius:50%;flex-shrink:0;}
.sk{font-size:10px;color:#444;margin-bottom:4px;}
.sk::before{content:"• ";color:#111;}
.exp-item{display:flex;gap:10px;margin-bottom:14px;}
.exp-dot{width:10px;height:10px;border-radius:50%;background:#111;flex-shrink:0;margin-top:3px;}
.exp-title{font-size:11px;font-weight:bold;text-transform:uppercase;color:#111;}
.exp-co{font-size:10px;color:#888;margin-top:1px;}
.exp-desc{font-size:10px;color:#555;margin-top:3px;line-height:1.5;}
</style></head><body>
<div class="header">
  <div>
    <div class="prenom">${cv.prenom}</div>
    <div class="nom">${cv.nom?.toUpperCase()}</div>
    <div class="dg">${cv.titre??''}</div>
  </div>
  ${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}
</div>
<div class="divider"></div>
<div class="body">
  <div class="col-l">
    <div class="section">Contact</div>
    ${cv.telephone?`<div class="ci"><div class="ci-icon"></div>${cv.telephone}</div>`:''}
    ${cv.email?`<div class="ci"><div class="ci-icon"></div>${cv.email}</div>`:''}
    ${cv.ville?`<div class="ci"><div class="ci-icon"></div>${cv.ville}</div>`:''}
    ${cv.competences?.length>0?`<div class="section">Compétences</div><p style="font-size:10px;font-weight:bold;color:#666;margin-bottom:6px;">Professionnel</p>${cv.competences.map((c:string)=>`<div class="sk">${c}</div>`).join('')}`:''}
    ${cv.langues?.length>0?`<div class="section">Langues</div>${cv.langues.map((l:any)=>`<div class="sk">${l.langue} — ${l.niveau}</div>`).join('')}`:''}
    ${cv.formations?.length>0?`<div class="section">Formation</div>${cv.formations.map((f:any)=>`<div class="exp-item"><div class="exp-dot"></div><div><div class="exp-title">${f.etablissement}</div><div class="exp-co">${f.diplome} · ${f.annee}</div></div></div>`).join('')}`:''}
  </div>
  <div class="col-r">
    ${cv.objectif?`<div class="section">Résumé</div><p style="font-size:11px;color:#555;line-height:1.7;border-left:3px solid #ddd;padding-left:12px;margin-bottom:14px;">${cv.objectif}</p>`:''}
    ${cv.experiences?.length>0?`<div class="section">Expériences</div>${cv.experiences.map((e:any)=>`<div class="exp-item"><div class="exp-dot"></div><div><div class="exp-title">${e.poste}</div><div class="exp-co">${e.entreprise} | ${e.debut} – ${e.fin}</div>${e.description?`<div class="exp-desc">${e.description}</div>`:''}</div></div>`).join('')}`:''}
    ${cv.loisirs?.length>0?`<div class="section">Loisirs</div><p style="font-size:10px;color:#444;">${cv.loisirs.join(' · ')}</p>`:''}
  </div>
</div></body></html>`;

// ═══════════════════════════════════════════════════════
// TEMPLATE 4 — TEAL ÉTUDIANT
// ═══════════════════════════════════════════════════════
export const templateTealStudent = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
body{background:#f0f0f0;}
.header{display:flex;background:#3d9b8a;}
.ph{width:100px;height:100px;object-fit:cover;border-radius:6px;margin:12px;border:2px solid #fff;}
.pp{width:100px;height:100px;border-radius:6px;background:#5ab5a3;margin:12px;}
.hinfo{padding:18px 12px;color:#fff;flex:1;display:flex;flex-direction:column;justify-content:center;}
.nm{font-size:22px;font-weight:bold;text-transform:uppercase;}
.dg{font-size:11px;opacity:0.85;margin-top:4px;font-style:italic;}
.body{display:flex;}
.L{width:34%;background:#e8e8e8;padding:18px 14px;}
.R{flex:1;background:#fff;padding:18px 16px;}
.lt{font-size:10px;font-weight:bold;text-transform:uppercase;color:#3d9b8a;border-bottom:2px solid #3d9b8a;padding-bottom:3px;margin:14px 0 8px;}
.ci{font-size:10px;color:#374151;margin-bottom:5px;}
.sk{font-size:10px;color:#374151;margin-bottom:4px;}
.lb{margin-bottom:8px;}.ln{font-size:10px;color:#374151;margin-bottom:3px;}
.lbg{height:3px;background:#ccc;border-radius:2px;}
.lf{height:3px;background:#3d9b8a;border-radius:2px;}
.arrow-sec{display:flex;align-items:center;gap:6px;margin:14px 0 8px;}
.arrow{width:0;height:0;border-top:6px solid transparent;border-bottom:6px solid transparent;border-left:10px solid #3d9b8a;}
.sec-title{font-size:11px;font-weight:bold;text-transform:uppercase;color:#3d9b8a;}
.exp-item{margin-bottom:10px;}
.exp-title{font-size:11px;font-weight:bold;color:#1a1a1a;text-transform:uppercase;}
.exp-co{font-size:10px;color:#6b7280;}
.exp-desc{font-size:10px;color:#555;margin-top:3px;}
</style></head><body>
<div class="header">
  ${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}
  <div class="hinfo"><div class="nm">${cv.prenom} ${cv.nom}</div><div class="dg">${cv.titre??''}</div></div>
</div>
<div class="body">
  <div class="L">
    <div class="lt">Profil</div>
    <p style="font-size:10px;color:#444;line-height:1.6;">${cv.objectif??''}</p>
    <div class="lt">Contact</div>
    ${cv.telephone?`<div class="ci">📞 ${cv.telephone}</div>`:''}
    ${cv.email?`<div class="ci">✉ ${cv.email}</div>`:''}
    ${cv.ville?`<div class="ci">📍 ${cv.ville}</div>`:''}
    ${cv.competences?.length>0?`<div class="lt">Compétences</div>${cv.competences.map((c:string)=>`<div class="sk">• ${c}</div>`).join('')}`:''}
    ${cv.langues?.length>0?`<div class="lt">Langues</div>${cv.langues.map((l:any)=>`<div class="lb"><div class="ln">${l.langue} — ${l.niveau}</div><div class="lbg"><div class="lf" style="width:${getNiveauPct(l.niveau)}%"></div></div></div>`).join('')}`:''}
    ${cv.loisirs?.length>0?`<div class="lt">Loisirs</div>${cv.loisirs.map((l:string)=>`<div class="sk">• ${l}</div>`).join('')}`:''}
  </div>
  <div class="R">
    ${cv.formations?.length>0?`<div class="arrow-sec"><div class="arrow"></div><div class="sec-title">Formation</div></div>${cv.formations.map((f:any)=>`<div class="exp-item"><div class="exp-title">${f.etablissement}</div><div class="exp-co">${f.diplome} · ${f.annee}</div></div>`).join('')}`:''}
    ${cv.experiences?.length>0?`<div class="arrow-sec"><div class="arrow"></div><div class="sec-title">Expériences</div></div>${cv.experiences.map((e:any)=>`<div class="exp-item"><div class="exp-title">${e.poste}</div><div class="exp-co">${e.entreprise} · ${e.debut}–${e.fin}</div><div class="exp-desc">${e.description??''}</div></div>`).join('')}`:''}
    ${cv.loisirs?.length>0?`<div class="arrow-sec"><div class="arrow"></div><div class="sec-title">Loisirs</div></div><ul style="padding-left:16px;">${cv.loisirs.map((l:string)=>`<li style="font-size:10px;">${l}</li>`).join('')}</ul>`:''}
  </div>
</div></body></html>`;

// ═══════════════════════════════════════════════════════
// TEMPLATE 5 — DARK SIDEBAR
// ═══════════════════════════════════════════════════════
export const templateDarkSidebar = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
.cv{display:flex;width:100%;min-height:100vh;}
.L{width:32%;background:#2c2c2c;color:#fff;padding:0 0 24px;}
.R{width:68%;background:#f5f5f5;padding:28px 24px;}
.ltop{background:#1a1a1a;padding:28px 16px;text-align:center;margin-bottom:16px;}
.ph{width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid #fff;display:block;margin:0 auto 12px;}
.pp{width:90px;height:90px;border-radius:50%;background:#444;margin:0 auto 12px;}
.lpad{padding:0 16px;}
.lt{font-size:10px;color:#9ca3af;border-bottom:1px solid #444;padding-bottom:4px;margin:14px 0 8px;}
.ci{display:flex;gap:8px;font-size:10px;color:#d1d5db;margin-bottom:6px;}
.sk{font-size:10px;color:#d1d5db;margin-bottom:5px;}
.sk::before{content:"• ";color:#9ca3af;}
.exp-item{margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid #e5e7eb;}
.exp-header{display:flex;justify-content:space-between;margin-bottom:4px;}
.exp-co{font-size:11px;font-weight:bold;color:#374151;margin-bottom:3px;}
.exp-date{font-size:10px;color:#6b7280;}
.exp-sub{font-size:10px;color:#6b7280;margin-bottom:3px;}
.exp-desc{font-size:10px;color:#555;line-height:1.6;}
.r-section{font-size:13px;font-weight:bold;color:#111;border-bottom:1px solid #ddd;padding-bottom:6px;margin:20px 0 12px;}
.r-nm{font-size:26px;font-weight:300;color:#111;margin-bottom:2px;}
.r-nm b{font-weight:900;}
.r-dg{font-size:12px;color:#6b7280;margin-bottom:20px;text-transform:uppercase;}
</style></head><body><div class="cv">
<div class="L">
  <div class="ltop">${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}</div>
  <div style="font-size:20px;font-weight:900;color:#fff;padding:0 16px;">${cv.nom}</div>
  <div style="font-size:11px;color:#9ca3af;padding:4px 16px 0;">${cv.titre??''}</div>
  <div class="lpad">
    <div class="lt">À propos</div>
    <p style="font-size:10px;color:#d1d5db;line-height:1.6;">${cv.objectif??''}</p>
    <div class="lt">Contact</div>
    ${cv.telephone?`<div class="ci">📞 ${cv.telephone}</div>`:''}
    ${cv.email?`<div class="ci">✉ ${cv.email}</div>`:''}
    ${cv.ville?`<div class="ci">📍 ${cv.ville}</div>`:''}
    ${cv.formations?.length>0?`<div class="lt">Formation</div>${cv.formations.map((f:any)=>`<div style="margin-bottom:10px;"><div style="font-size:11px;color:#fff;font-weight:bold;">${f.etablissement}</div><div style="font-size:10px;color:#9ca3af;">${f.diplome}</div><div style="font-size:9px;color:#6b7280;">${f.annee}</div></div>`).join('')}`:''}
    ${cv.competences?.length>0?`<div class="lt">Compétences</div>${cv.competences.map((c:string)=>`<div class="sk">${c}</div>`).join('')}`:''}
  </div>
</div>
<div class="R">
  <div class="r-nm"><b>${cv.prenom}</b> ${cv.nom}</div>
  <div class="r-dg">${cv.titre??''}</div>
  ${cv.experiences?.length>0?`<div class="r-section">Expériences</div>${cv.experiences.map((e:any)=>`<div class="exp-item"><div class="exp-header"><div class="exp-co">${e.poste}</div><div class="exp-date">${e.debut} – ${e.fin}</div></div><div class="exp-sub">${e.entreprise}</div><div class="exp-desc">${e.description??''}</div></div>`).join('')}`:''}
  ${cv.langues?.length>0?`<div class="r-section">Langues</div>${cv.langues.map((l:any)=>`<div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:11px;"><span>${l.langue}</span><span style="color:#6b7280;">${l.niveau}</span></div>`).join('')}`:''}
</div></div></body></html>`;

// ═══════════════════════════════════════════════════════
// TEMPLATE 6 — VIOLET
// ═══════════════════════════════════════════════════════
export const templateViolet = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
body{background:#6b21a8;}
.cv{display:flex;width:100%;min-height:100vh;}
.L{width:32%;padding:24px 16px;background:rgba(0,0,0,0.15);}
.R{width:68%;padding:24px 20px;}
.ph{width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.6);display:block;margin:0 auto 12px;}
.pp{width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,0.2);margin:0 auto 12px;}
.nm{font-size:22px;font-weight:bold;color:#fff;margin-bottom:2px;}
.dg{font-size:11px;color:#c084fc;margin-bottom:16px;}
.lt{font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;color:#e9d5ff;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:4px;margin:14px 0 8px;}
.ci{font-size:10px;color:#e9d5ff;margin-bottom:5px;display:flex;align-items:center;gap:6px;}
.sk{font-size:10px;color:#e9d5ff;margin-bottom:4px;}
.lb{margin-bottom:8px;}.ln{font-size:10px;color:#e9d5ff;margin-bottom:3px;}
.lbg{height:3px;background:rgba(255,255,255,0.2);border-radius:2px;}
.lf{height:3px;background:#c084fc;border-radius:2px;}
.rt{font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;color:#e9d5ff;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:4px;margin:14px 0 10px;}
.ti{display:flex;gap:10px;margin-bottom:10px;}
.td{width:8px;height:8px;border-radius:50%;background:#c084fc;flex-shrink:0;margin-top:3px;}
.tt{font-size:11px;font-weight:bold;color:#fff;}
.ts{font-size:10px;color:#e9d5ff;margin-top:1px;}
.td2{font-size:10px;color:#dbb6ff;margin-top:2px;}
</style></head><body><div class="cv">
<div class="L">
  ${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}
  <div class="lt">Contact</div>
  ${cv.telephone?`<div class="ci">📞 ${cv.telephone}</div>`:''}
  ${cv.email?`<div class="ci">✉ ${cv.email}</div>`:''}
  ${cv.ville?`<div class="ci">📍 ${cv.ville}</div>`:''}
  ${cv.competences?.length>0?`<div class="lt">Compétences</div>${cv.competences.map((c:string)=>`<div class="sk">◆ ${c}</div>`).join('')}`:''}
  ${cv.langues?.length>0?`<div class="lt">Langues</div>${cv.langues.map((l:any)=>`<div class="lb"><div class="ln">${l.langue} — ${l.niveau}</div><div class="lbg"><div class="lf" style="width:${getNiveauPct(l.niveau)}%"></div></div></div>`).join('')}`:''}
  ${cv.loisirs?.length>0?`<div class="lt">Loisirs</div>${cv.loisirs.map((l:string)=>`<div class="sk">• ${l}</div>`).join('')}`:''}
</div>
<div class="R">
  <div class="nm">${cv.prenom} ${cv.nom}</div>
  <div class="dg">${cv.titre??''}</div>
  ${cv.objectif?`<div class="rt">Objectif</div><p style="font-size:10px;color:#e9d5ff;line-height:1.7;">${cv.objectif}</p>`:''}
  ${cv.formations?.length>0?`<div class="rt">Formation</div>${cv.formations.map((f:any)=>`<div class="ti"><div class="td"></div><div><div class="tt">${f.etablissement}</div><div class="ts">${f.diplome} · ${f.annee}</div></div></div>`).join('')}`:''}
  ${cv.experiences?.length>0?`<div class="rt">Expériences</div>${cv.experiences.map((e:any)=>`<div class="ti"><div class="td"></div><div><div class="tt">${e.poste}</div><div class="ts">${e.entreprise} · ${e.debut}–${e.fin}</div>${e.description?`<div class="td2">${e.description}</div>`:''}</div></div>`).join('')}`:''}
</div></div></body></html>`;

// ═══════════════════════════════════════════════════════
// TEMPLATE 7 — CLASSIQUE PRO
// ═══════════════════════════════════════════════════════
export const templateClassiquePro = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
body{padding:28px;background:#fff;color:#1a1a1a;}
.header{display:flex;gap:16px;margin-bottom:16px;}
.ph{width:100px;height:100px;object-fit:cover;}
.pp{width:100px;height:100px;background:#ddd;}
.hinfo{flex:1;}
.nm{font-size:28px;font-weight:300;color:#111;letter-spacing:1px;}
.dg{font-size:11px;color:#888;letter-spacing:3px;text-transform:uppercase;margin-top:4px;}
.divider{height:2px;background:#ddd;margin:14px 0;}
.body{display:flex;gap:28px;}
.col-l{width:32%;}.col-r{flex:1;}
.section{font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;color:#111;border-bottom:1px solid #ddd;padding-bottom:4px;margin:16px 0 10px;}
.ci{font-size:11px;color:#444;margin-bottom:6px;display:flex;align-items:center;gap:8px;}
.ci-icon{width:16px;height:16px;background:#f0f0f0;border-radius:50%;flex-shrink:0;}
.sk{font-size:10px;color:#444;margin-bottom:4px;}
.sk::before{content:"• ";}
.exp-item{margin-bottom:16px;}
.exp-company{font-size:11px;color:#888;font-style:italic;}
.exp-title{font-size:12px;font-weight:bold;text-transform:uppercase;color:#111;margin-top:2px;}
.exp-date{font-size:10px;color:#6b7280;margin-bottom:4px;}
.exp-desc{font-size:11px;color:#444;line-height:1.7;}
</style></head><body>
<div class="header">
  ${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}
  <div class="hinfo">
    <div class="nm">${cv.prenom} ${cv.nom}</div>
    <div class="dg">${cv.titre??''}</div>
  </div>
</div>
<div class="divider"></div>
<div class="body">
  <div class="col-l">
    <div class="section">Contact</div>
    ${cv.telephone?`<div class="ci"><div class="ci-icon"></div>${cv.telephone}</div>`:''}
    ${cv.email?`<div class="ci"><div class="ci-icon"></div>${cv.email}</div>`:''}
    ${cv.ville?`<div class="ci"><div class="ci-icon"></div>${cv.ville}</div>`:''}
    ${cv.formations?.length>0?`<div class="section">Formation</div>${cv.formations.map((f:any)=>`<div style="margin-bottom:10px;"><div style="font-size:11px;font-weight:bold;">${f.diplome}</div><div style="font-size:10px;color:#888;">${f.etablissement} · ${f.annee}</div></div>`).join('')}`:''}
    ${cv.competences?.length>0?`<div class="section">Compétences</div>${cv.competences.map((c:string)=>`<div class="sk">${c}</div>`).join('')}`:''}
    ${cv.langues?.length>0?`<div class="section">Langues</div>${cv.langues.map((l:any)=>`<div class="sk">${l.langue} — ${l.niveau}</div>`).join('')}`:''}
    ${cv.loisirs?.length>0?`<div class="section">Loisirs</div>${cv.loisirs.map((l:string)=>`<div class="sk">${l}</div>`).join('')}`:''}
  </div>
  <div class="col-r">
    ${cv.objectif?`<div class="section">Résumé</div><p style="font-size:11px;color:#444;line-height:1.7;margin-bottom:12px;">${cv.objectif}</p>`:''}
    ${cv.experiences?.length>0?`<div class="section">Expériences</div>${cv.experiences.map((e:any)=>`<div class="exp-item"><div class="exp-company">${e.entreprise}</div><div class="exp-title">${e.poste}</div><div class="exp-date">${e.debut} – ${e.fin}</div><div class="exp-desc">${e.description??''}</div></div>`).join('')}`:''}
  </div>
</div></body></html>`;

// ═══════════════════════════════════════════════════════
// TEMPLATE 8 — BOLD NOIR
// ═══════════════════════════════════════════════════════
export const templateBoldNoir = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
body{background:#fff;}
.hero{width:100%;height:180px;position:relative;overflow:hidden;background:#111;}
.hero-ph{width:100%;height:180px;object-fit:cover;object-position:top;opacity:0.7;}
.hero-pp{width:100%;height:180px;background:#222;}
.hero-overlay{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:flex-end;padding:16px 28px;}
.prenom{font-size:36px;font-weight:300;color:#fff;text-transform:uppercase;letter-spacing:4px;}
.nom{font-size:36px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:4px;}
.body{background:#111;display:flex;padding:28px;}
.col-l{width:35%;padding-right:24px;border-right:1px solid #333;}
.col-r{width:65%;padding-left:24px;}
.section{font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;color:#fff;border-bottom:1px solid #333;padding-bottom:5px;margin:16px 0 10px;}
.ci{font-size:10px;color:#d1d5db;margin-bottom:6px;}
.ci b{color:#fff;font-size:9px;text-transform:uppercase;display:block;margin-bottom:1px;}
.sk{display:flex;align-items:center;gap:8px;margin-bottom:10px;}
.sk-name{font-size:11px;color:#fff;}
.sk-dots{display:flex;gap:4px;}
.sk-dot{width:12px;height:12px;border-radius:50%;}
.sk-dot.on{background:#fff;}.sk-dot.off{background:#444;border:1px solid #666;}
.exp-item{margin-bottom:16px;}
.exp-company{font-size:11px;color:#9ca3af;}
.exp-date{font-size:10px;color:#6b7280;}
.exp-title{font-size:13px;font-weight:bold;color:#fff;margin-top:2px;}
.exp-desc{font-size:10px;color:#9ca3af;margin-top:4px;line-height:1.6;}
</style></head><body>
<div class="hero">
  ${photo?`<img class="hero-ph" src="${photo}"/>`:'<div class="hero-pp"></div>'}
  <div class="hero-overlay"><div><div class="prenom">${cv.prenom}</div><div class="nom">${cv.nom}</div></div></div>
</div>
<div class="body">
  <div class="col-l">
    <div class="section">Contact</div>
    ${cv.telephone?`<div class="ci"><b>Téléphone</b>${cv.telephone}</div>`:''}
    ${cv.email?`<div class="ci"><b>Email</b>${cv.email}</div>`:''}
    ${cv.ville?`<div class="ci"><b>Ville</b>${cv.ville}</div>`:''}
    ${cv.formations?.length>0?`<div class="section">Formation</div>${cv.formations.map((f:any)=>`<div class="ci"><b>${f.etablissement}</b>${f.diplome} · ${f.annee}</div>`).join('')}`:''}
    ${cv.competences?.length>0?`<div class="section">Compétences</div>${cv.competences.map((c:string)=>`<div class="sk"><div class="sk-name">${c}</div><div class="sk-dots"><div class="sk-dot on"></div><div class="sk-dot on"></div><div class="sk-dot on"></div><div class="sk-dot on"></div><div class="sk-dot off"></div></div></div>`).join('')}`:''}
  </div>
  <div class="col-r">
    <div style="margin-bottom:12px;"><div style="font-size:16px;color:#fff;font-weight:bold;">${cv.titre??''}</div>${cv.objectif?`<p style="font-size:10px;color:#9ca3af;margin-top:6px;line-height:1.7;">${cv.objectif}</p>`:''}</div>
    ${cv.experiences?.length>0?`<div class="section">Expériences</div>${cv.experiences.map((e:any)=>`<div class="exp-item"><div class="exp-company">${e.entreprise}</div><div class="exp-date">${e.debut} – ${e.fin}</div><div class="exp-title">${e.poste}</div><div class="exp-desc">${e.description??''}</div></div>`).join('')}`:''}
    ${cv.langues?.length>0?`<div class="section">Langues</div>${cv.langues.map((l:any)=>`<div class="sk"><div class="sk-name">${l.langue} — ${l.niveau}</div></div>`).join('')}`:''}
  </div>
</div></body></html>`;

// ═══════════════════════════════════════════════════════
// TEMPLATE 9 — BLEU ARRONDI
// ═══════════════════════════════════════════════════════
export const templateBleuArrondi = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
body{background:#f0f4ff;}
.cv{display:flex;width:100%;min-height:100vh;}
.L{width:35%;padding:0 0 24px;}
.R{width:65%;padding:20px 20px 20px 0;}
.ltop{background:linear-gradient(135deg,#2563eb,#1e40af);border-radius:0 0 40px 0;padding:24px 16px;margin-bottom:16px;}
.ph{width:75px;height:75px;border-radius:50%;object-fit:cover;border:3px solid #fff;display:block;margin:0 auto 10px;}
.pp{width:75px;height:75px;border-radius:50%;background:#93c5fd;margin:0 auto 10px;}
.nm{font-size:16px;font-weight:bold;color:#fff;text-align:center;}
.dg{font-size:10px;color:#bfdbfe;text-align:center;margin-top:3px;}
.lpad{padding:0 14px;}
.lt{font-size:9px;font-weight:bold;text-transform:uppercase;background:#2563eb;color:#fff;padding:4px 10px;border-radius:12px;margin:12px 0 8px;display:inline-block;}
.ci{font-size:10px;color:#374151;margin-bottom:5px;display:flex;align-items:center;gap:6px;}
.ci-icon{width:14px;height:14px;background:#bfdbfe;border-radius:50%;flex-shrink:0;}
.sk-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;}
.sk-name{font-size:10px;color:#374151;}
.sk-stars{color:#2563eb;font-size:12px;}
.lb{margin-bottom:8px;}.ln{font-size:10px;color:#374151;margin-bottom:3px;}
.lbg{height:3px;background:#dbeafe;border-radius:2px;}
.lf{height:3px;background:#2563eb;border-radius:2px;}
.circ-row{display:flex;gap:10px;margin-top:4px;}
.circ{text-align:center;}
.circ-ring{width:30px;height:30px;border-radius:50%;border:3px solid #2563eb;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:bold;color:#2563eb;margin:0 auto 2px;}
.circ-label{font-size:8px;color:#374151;}
.rt{font-size:10px;font-weight:bold;text-transform:uppercase;background:#2563eb;color:#fff;padding:5px 14px;border-radius:0 12px 12px 0;margin:14px 0 10px;display:inline-block;}
.exp-item{margin-bottom:12px;padding-left:12px;border-left:2px solid #bfdbfe;}
.exp-date{font-size:9px;color:#2563eb;font-weight:bold;margin-bottom:2px;}
.exp-title{font-size:11px;font-weight:bold;color:#111;}
.exp-co{font-size:10px;color:#6b7280;}
.exp-desc{font-size:10px;color:#555;margin-top:3px;line-height:1.5;}
</style></head><body><div class="cv">
<div class="L">
  <div class="ltop">
    ${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}
    <div class="nm">${cv.prenom} ${cv.nom}</div>
    <div class="dg">${cv.titre??''}</div>
  </div>
  <div class="lpad">
    <div class="lt">Contact</div>
    ${cv.telephone?`<div class="ci"><div class="ci-icon"></div>${cv.telephone}</div>`:''}
    ${cv.email?`<div class="ci"><div class="ci-icon"></div>${cv.email}</div>`:''}
    ${cv.ville?`<div class="ci"><div class="ci-icon"></div>${cv.ville}</div>`:''}
    ${cv.competences?.length>0?`<div class="lt">Compétences</div>${cv.competences.map((c:string)=>`<div class="sk-row"><div class="sk-name">${c}</div><div class="sk-stars">★★★★☆</div></div>`).join('')}`:''}
    ${cv.langues?.length>0?`<div class="lt">Langues</div><div class="circ-row">${cv.langues.map((l:any)=>`<div class="circ"><div class="circ-ring">${getNiveauPct(l.niveau)}%</div><div class="circ-label">${l.langue}</div></div>`).join('')}</div>`:''}
    ${cv.loisirs?.length>0?`<div class="lt">Loisirs</div>${cv.loisirs.map((l:string)=>`<div class="ci">• ${l}</div>`).join('')}`:''}
  </div>
</div>
<div class="R">
  ${cv.objectif?`<div class="rt">Profil</div><p style="font-size:10px;color:#444;line-height:1.6;margin-bottom:12px;padding-left:12px;">${cv.objectif}</p>`:''}
  ${cv.experiences?.length>0?`<div class="rt">Expériences</div>${cv.experiences.map((e:any)=>`<div class="exp-item"><div class="exp-date">${e.debut} – ${e.fin}</div><div class="exp-title">${e.poste}</div><div class="exp-co">${e.entreprise}</div><div class="exp-desc">${e.description??''}</div></div>`).join('')}`:''}
  ${cv.formations?.length>0?`<div class="rt">Formation</div>${cv.formations.map((f:any)=>`<div class="exp-item"><div class="exp-date">${f.annee}</div><div class="exp-title">${f.diplome}</div><div class="exp-co">${f.etablissement}</div></div>`).join('')}`:''}
</div></div></body></html>`;

// ═══════════════════════════════════════════════════════
// TEMPLATE 10 — BRUN ÉLÉGANT
// ═══════════════════════════════════════════════════════
export const templateBrunElegant = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
.cv{display:flex;width:100%;min-height:100vh;}
.L{width:32%;background:#2a2520;padding:0 0 24px;}
.R{width:68%;background:#f5f5f2;padding:24px 24px;}
.ltop{padding:24px 16px;text-align:center;border-bottom:1px solid #3d3028;}
.ph{width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid #c9a96e;display:block;margin:0 auto 12px;}
.pp{width:90px;height:90px;border-radius:50%;background:#3d3028;border:3px solid #c9a96e;margin:0 auto 12px;}
.lpad{padding:0 16px;}
.lt{font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;color:#c9a96e;border-bottom:1px solid #3d3028;padding-bottom:4px;margin:14px 0 8px;}
.ci{font-size:10px;color:#d1c4b0;margin-bottom:5px;}
.sk{font-size:10px;color:#d1c4b0;margin-bottom:5px;display:flex;justify-content:space-between;}
.lb{margin-bottom:8px;}.ln{font-size:10px;color:#d1c4b0;margin-bottom:3px;}
.lbg{height:3px;background:#3d3028;border-radius:2px;}
.lf{height:3px;background:#c9a96e;border-radius:2px;}
.r-header{background:#c9a96e;padding:16px 20px;border-radius:4px;margin-bottom:20px;}
.nm{font-size:22px;font-weight:bold;color:#fff;}
.dg{font-size:11px;color:rgba(255,255,255,0.8);margin-top:4px;}
.r-section{display:flex;align-items:center;gap:8px;margin:16px 0 10px;}
.r-dots{display:flex;gap:3px;}
.r-dot{width:6px;height:6px;border-radius:50%;background:#c9a96e;}
.sec-title{font-size:11px;font-weight:bold;color:#2a2520;text-transform:uppercase;}
.exp-row{display:flex;gap:12px;margin-bottom:12px;}
.exp-years{font-size:9px;color:#c9a96e;min-width:50px;text-align:right;padding-top:2px;}
.exp-dot2{width:8px;height:8px;border-radius:50%;background:#c9a96e;flex-shrink:0;margin-top:3px;}
.exp-content{flex:1;}
.exp-title{font-size:11px;font-weight:bold;color:#111;}
.exp-co{font-size:10px;color:#6b7280;}
.sk-star{color:#c9a96e;font-size:11px;}
</style></head><body><div class="cv">
<div class="L">
  <div class="ltop">
    ${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}
    <div style="text-align:center;margin-top:8px;">
      <div style="font-size:14px;font-weight:bold;color:#fff;">${cv.prenom} ${cv.nom}</div>
      <div style="font-size:10px;color:#c9a96e;margin-top:4px;">${cv.titre??''}</div>
    </div>
  </div>
  <div class="lpad">
    <div class="lt">Langues</div>
    ${cv.langues?.map((l:any)=>`<div class="lb"><div class="ln">${l.langue}</div><div class="lbg"><div class="lf" style="width:${getNiveauPct(l.niveau)}%"></div></div></div>`).join('')??''}
    <div class="lt">Compétences</div>
    ${cv.competences?.map((c:string)=>`<div class="sk"><span>${c}</span><div style="display:flex;gap:2px;">${[1,2,3,4].map(()=>'<span class="sk-star">★</span>').join('')}<span style="color:#555;font-size:11px;">☆</span></div></div>`).join('')??''}
    <div class="lt">Contact</div>
    ${cv.telephone?`<div class="ci">📞 ${cv.telephone}</div>`:''}
    ${cv.email?`<div class="ci">✉ ${cv.email}</div>`:''}
    ${cv.ville?`<div class="ci">📍 ${cv.ville}</div>`:''}
  </div>
</div>
<div class="R">
  <div class="r-header"><div class="nm">${cv.prenom} ${cv.nom}</div><div class="dg">${cv.titre??''}</div></div>
  ${cv.objectif?`<p style="font-size:10px;color:#555;line-height:1.6;margin-bottom:14px;">${cv.objectif}</p>`:''}
  ${cv.formations?.length>0?`<div class="r-section"><div class="r-dots"><div class="r-dot"></div><div class="r-dot"></div><div class="r-dot"></div></div><div class="sec-title">Formation</div></div>${cv.formations.map((f:any)=>`<div class="exp-row"><div class="exp-years">${f.annee}</div><div class="exp-dot2"></div><div class="exp-content"><div class="exp-title">${f.etablissement}</div><div class="exp-co">${f.diplome}</div></div></div>`).join('')}`:''}
  ${cv.experiences?.length>0?`<div class="r-section"><div class="r-dots"><div class="r-dot"></div><div class="r-dot"></div><div class="r-dot"></div></div><div class="sec-title">Expériences</div></div>${cv.experiences.map((e:any)=>`<div class="exp-row"><div class="exp-years">${e.debut}<br/>${e.fin}</div><div class="exp-dot2"></div><div class="exp-content"><div class="exp-title">${e.poste}</div><div class="exp-co">${e.entreprise}</div>${e.description?`<div style="font-size:10px;color:#555;margin-top:3px;">${e.description}</div>`:''}</div></div>`).join('')}`:''}
</div></div></body></html>`;

// ═══════════════════════════════════════════════════════
// TEMPLATE 11 — FRESHER VERT (unique, photo+nom côte à côte)
// ═══════════════════════════════════════════════════════
export const templateFresherVert = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
.cv{display:flex;width:100%;min-height:100vh;}
.L{width:36%;background:#f5f5f0;padding:0 0 24px;}
.R{width:64%;background:#fff;}
.ltop{display:flex;}
.pb{width:50%;background:#111;padding:10px;}
.ph{width:100%;height:120px;object-fit:cover;}
.pp{width:100%;height:120px;background:#333;}
.nb{width:50%;background:#2d5a27;padding:14px 10px;display:flex;flex-direction:column;justify-content:flex-end;}
.nm{font-size:18px;font-weight:bold;color:#fff;text-transform:uppercase;}
.dg{font-size:10px;color:#c8e6c0;margin-top:3px;}
.lpad{padding:14px;}
.lt{font-size:10px;font-weight:bold;text-transform:uppercase;color:#1a1a1a;display:flex;align-items:center;gap:6px;margin:12px 0 7px;}
.ld{width:14px;height:14px;background:#2d5a27;border-radius:50%;flex-shrink:0;}
.ci{font-size:10px;color:#444;margin-bottom:4px;}
.sk{font-size:10px;color:#444;margin-bottom:3px;}
.lb{margin-bottom:7px;}.ln{font-size:10px;color:#444;margin-bottom:2px;}
.lbg{height:3px;background:#ccc;border-radius:2px;}
.lf{height:3px;background:#2d5a27;border-radius:2px;}
.sb{background:#2d5a27;color:#fff;font-size:10px;font-weight:bold;text-transform:uppercase;padding:5px 14px;margin:12px 0 7px;}
.rp{padding:10px 14px;}
.ei{margin-bottom:10px;}
.et{font-size:11px;font-weight:bold;color:#1a1a1a;}
.ec{font-size:10px;color:#2d5a27;margin-top:1px;}
.ed{font-size:10px;color:#555;margin-top:2px;}
.bul li{font-size:10px;color:#444;margin-bottom:2px;}
</style></head><body><div class="cv">
<div class="L">
  <div class="ltop">
    <div class="pb">${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}</div>
    <div class="nb"><div class="nm">${cv.prenom}<br/>${cv.nom}</div><div class="dg">${cv.titre??''}</div></div>
  </div>
  <div class="lpad">
    <div class="lt"><div class="ld"></div>Objectif</div>
    <p style="font-size:10px;color:#444;line-height:1.6;">${cv.objectif??''}</p>
    <div class="lt"><div class="ld"></div>Contact</div>
    ${cv.telephone?`<div class="ci">📞 ${cv.telephone}</div>`:''}
    ${cv.email?`<div class="ci">✉ ${cv.email}</div>`:''}
    ${cv.ville?`<div class="ci">📍 ${cv.ville}</div>`:''}
    ${cv.competences?.length>0?`<div class="lt"><div class="ld"></div>Compétences</div>${cv.competences.map((c:string)=>`<div class="sk">• ${c}</div>`).join('')}`:''}
    ${cv.langues?.length>0?`<div class="lt"><div class="ld"></div>Langues</div>${cv.langues.map((l:any)=>`<div class="lb"><div class="ln">${l.langue} — ${l.niveau}</div><div class="lbg"><div class="lf" style="width:${getNiveauPct(l.niveau)}%"></div></div></div>`).join('')}`:''}
    ${cv.loisirs?.length>0?`<div class="lt"><div class="ld"></div>Loisirs</div>${cv.loisirs.map((l:string)=>`<div class="sk">• ${l}</div>`).join('')}`:''}
  </div>
</div>
<div class="R">
  ${cv.formations?.length>0?`<div class="sb">Formation</div><div class="rp">${cv.formations.map((f:any)=>`<div class="ei"><div class="et">${f.diplome}</div><div class="ec">${f.etablissement} · ${f.annee}</div></div>`).join('')}</div>`:''}
  ${cv.experiences?.length>0?`<div class="sb">Expériences</div><div class="rp">${cv.experiences.map((e:any)=>`<div class="ei"><div class="et">${e.poste}</div><div class="ec">${e.entreprise} · ${e.debut}–${e.fin}</div><div class="ed">${e.description??''}</div></div>`).join('')}</div>`:''}
  ${cv.competences?.length>0?`<div class="sb">Compétences techniques</div><div class="rp"><ul class="bul">${cv.competences.map((c:string)=>`<li>${c}</li>`).join('')}</ul></div>`:''}
  ${cv.loisirs?.length>0?`<div class="sb">Loisirs</div><div class="rp"><ul class="bul">${cv.loisirs.map((l:string)=>`<li>${l}</li>`).join('')}</ul></div>`:''}
</div></div></body></html>`;

// ═══════════════════════════════════════════════════════
// TEMPLATE 12 — GÉOMÉTRIQUE (coins colorés)
// ═══════════════════════════════════════════════════════
export const templateGeometrique = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
body{background:#fff;position:relative;overflow:hidden;}
.c1{position:absolute;top:0;left:0;width:55px;height:55px;background:#1a2744;}
.c2{position:absolute;top:0;right:0;width:35px;height:35px;background:#e85d30;}
.c3{position:absolute;bottom:0;left:0;width:35px;height:35px;background:#1a2744;}
.c4{position:absolute;bottom:0;right:0;width:45px;height:45px;background:#e85d30;}
.cv{display:flex;width:100%;min-height:100vh;position:relative;z-index:1;}
.L{width:40%;padding:70px 18px 24px;}
.R{width:60%;padding:22px 18px 24px 0;}
.ph{width:100px;height:100px;border-radius:50%;object-fit:cover;border:4px solid #e85d30;display:block;margin:0 auto 12px;}
.pp{width:100px;height:100px;border-radius:50%;background:#ddd;border:4px solid #e85d30;margin:0 auto 12px;}
.nm{font-size:20px;font-weight:bold;color:#1a2744;margin-bottom:2px;}
.dg{font-size:11px;color:#e85d30;margin-bottom:14px;}
.lt{display:flex;align-items:center;gap:7px;font-size:10px;font-weight:bold;text-transform:uppercase;color:#1a1a1a;margin:12px 0 7px;}
.lb2{flex:1;height:2px;background:#e85d30;}
.ci{font-size:10px;color:#374151;margin-bottom:4px;}
.sk{font-size:10px;color:#374151;margin-bottom:3px;}
.sk::before{content:"• ";}
.lb{margin-bottom:7px;}.ln{font-size:10px;color:#374151;margin-bottom:2px;}
.lbg{height:3px;background:#ddd;border-radius:2px;}
.lf{height:3px;background:#1a2744;border-radius:2px;}
.sec{font-size:11px;font-weight:bold;text-transform:uppercase;color:#1a1a1a;display:flex;align-items:center;gap:7px;margin:14px 0 9px;}
.sl{flex:1;height:1.5px;background:#1a2744;}
.ei{margin-bottom:11px;}
.et{font-size:11px;font-weight:bold;color:#1a2744;}
.ec{font-size:10px;color:#e85d30;margin-top:1px;}
.ed{font-size:9px;color:#888;}
.edesc{font-size:10px;color:#555;margin-top:3px;}
.bul li{font-size:10px;color:#374151;margin-bottom:2px;}
</style></head><body>
<div class="c1"></div><div class="c2"></div><div class="c3"></div><div class="c4"></div>
<div class="cv">
<div class="L">
  ${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}
  <div class="nm">${cv.prenom} ${cv.nom}</div>
  <div class="dg">${cv.titre??''}</div>
  <div class="lt">Objectif <div class="lb2"></div></div>
  <p style="font-size:10px;color:#444;line-height:1.6;">${cv.objectif??''}</p>
  <div class="lt">Contact <div class="lb2"></div></div>
  ${cv.telephone?`<div class="ci">📞 ${cv.telephone}</div>`:''}
  ${cv.email?`<div class="ci">✉ ${cv.email}</div>`:''}
  ${cv.ville?`<div class="ci">📍 ${cv.ville}</div>`:''}
  ${cv.langues?.length>0?`<div class="lt">Langues <div class="lb2"></div></div>${cv.langues.map((l:any)=>`<div class="lb"><div class="ln">${l.langue} — ${l.niveau}</div><div class="lbg"><div class="lf" style="width:${getNiveauPct(l.niveau)}%"></div></div></div>`).join('')}`:''}
</div>
<div class="R">
  ${cv.formations?.length>0?`<div class="sec">Formation <div class="sl"></div></div>${cv.formations.map((f:any)=>`<div class="ei"><div class="et">${f.diplome}</div><div class="ec">${f.etablissement}</div><div class="ed">${f.annee}</div></div>`).join('')}`:''}
  ${cv.experiences?.length>0?`<div class="sec">Expériences <div class="sl"></div></div>${cv.experiences.map((e:any)=>`<div class="ei"><div class="et">${e.poste}</div><div class="ec">${e.entreprise}</div><div class="ed">${e.debut} – ${e.fin}</div><div class="edesc">${e.description??''}</div></div>`).join('')}`:''}
  ${cv.competences?.length>0?`<div class="sec">Compétences <div class="sl"></div></div><ul class="bul">${cv.competences.map((c:string)=>`<li>${c}</li>`).join('')}</ul>`:''}
  ${cv.loisirs?.length>0?`<div class="sec">Loisirs <div class="sl"></div></div><ul class="bul">${cv.loisirs.map((l:string)=>`<li>${l}</li>`).join('')}</ul>`:''}
</div></div></body></html>`;

// ═══════════════════════════════════════════════════════
// TEMPLATE 13 — VERT NATURE
// ═══════════════════════════════════════════════════════
export const templateVertNature = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
body{background:#f5f3ee;}
.cv{display:flex;width:100%;min-height:100vh;}
.L{width:44%;padding:24px 18px;background:#f5f3ee;}
.R{width:56%;background:#1e3422;padding:24px 18px;}
.nm{font-size:28px;font-weight:900;color:#1e3422;text-transform:uppercase;line-height:1;}
.nm2{font-weight:300;}
.dg{font-size:12px;color:#4a6344;margin-top:4px;margin-bottom:14px;}
.ph{width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid #4a6344;float:right;margin:0 0 10px 10px;}
.pp{width:90px;height:90px;border-radius:50%;background:#c8d5b9;border:3px solid #4a6344;float:right;margin:0 0 10px 10px;}
.ls{background:#c8d5b9;color:#1e3422;font-size:9px;font-weight:bold;text-transform:uppercase;padding:3px 10px;border-radius:12px;margin:12px 0 7px;display:inline-block;}
.ci{font-size:10px;color:#374151;margin-bottom:4px;}
.sr{display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;}
.sn{font-size:11px;color:#1e3422;}
.sp{font-size:10px;color:#4a6344;font-weight:bold;}
.sb{height:3px;background:#ddd;border-radius:2px;margin-top:2px;}
.sf{height:3px;background:#4a6344;border-radius:2px;}
.lc{display:flex;gap:14px;margin-top:4px;}
.lci{text-align:center;}
.lr{width:34px;height:34px;border-radius:50%;border:3px solid #4a6344;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:bold;color:#1e3422;margin:0 auto 3px;}
.ll{font-size:9px;color:#374151;}
.rs{font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;color:#c8d5b9;background:#2a4a2e;padding:5px 10px;border-radius:3px;margin:12px 0 8px;display:inline-block;}
.ei{margin-bottom:12px;}
.ed{font-size:9px;color:#4a6344;font-weight:bold;}
.et{font-size:12px;font-weight:bold;color:#fff;margin-top:1px;}
.ec{font-size:10px;color:#c8d5b9;}
.eb li{font-size:10px;color:#a8c4a0;margin-bottom:2px;margin-top:3px;}
</style></head><body><div class="cv">
<div class="L">
  ${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}
  <div class="nm">${cv.prenom}<br/><span class="nm2">${cv.nom}</span></div>
  <div class="dg">${cv.titre??''}</div>
  <div style="clear:both;"></div>
  <div class="ls">À propos</div>
  <p style="font-size:10px;color:#444;line-height:1.7;">${cv.objectif??''}</p>
  ${cv.competences?.length>0?`<div class="ls">Compétences</div>${cv.competences.map((c:string,i:number)=>`<div class="sr"><div><div class="sn">${c}</div><div class="sb"><div class="sf" style="width:${Math.min(80+i*5,95)}%"></div></div></div><div class="sp">${Math.min(80+i*5,95)}%</div></div>`).join('')}`:''}
  ${cv.langues?.length>0?`<div class="ls">Langues</div><div class="lc">${cv.langues.map((l:any)=>`<div class="lci"><div class="lr">${getNiveauPct(l.niveau)}%</div><div class="ll">${l.langue}</div></div>`).join('')}</div>`:''}
  <div class="ls">Contact</div>
  ${cv.telephone?`<div class="ci">📞 ${cv.telephone}</div>`:''}
  ${cv.email?`<div class="ci">✉ ${cv.email}</div>`:''}
  ${cv.ville?`<div class="ci">📍 ${cv.ville}</div>`:''}
</div>
<div class="R">
  ${cv.experiences?.length>0?`<div class="rs">Expériences</div>${cv.experiences.map((e:any)=>`<div class="ei"><div class="ed">${e.debut} – ${e.fin}</div><div class="et">${e.poste}</div><div class="ec">${e.entreprise}</div>${e.description?`<ul class="eb"><li>${e.description}</li></ul>`:''}</div>`).join('')}`:''}
  ${cv.formations?.length>0?`<div class="rs">Formation</div>${cv.formations.map((f:any)=>`<div class="ei"><div class="ed">${f.annee}</div><div class="et">${f.diplome}</div><div class="ec">${f.etablissement}</div></div>`).join('')}`:''}
  ${cv.loisirs?.length>0?`<div class="rs">Loisirs</div><div style="display:flex;flex-wrap:wrap;gap:5px;">${cv.loisirs.map((l:string)=>`<span style="background:#2a4a2e;color:#c8d5b9;padding:2px 8px;border-radius:10px;font-size:10px;">${l}</span>`).join('')}</div>`:''}
</div></div></body></html>`;

// ═══════════════════════════════════════════════════════
// TEMPLATE 14 — NAVY PRO
// ═══════════════════════════════════════════════════════
export const templateNavyPro = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
.cv{display:flex;width:100%;min-height:100vh;}
.L{width:30%;background:#1e3a6e;padding:0 0 24px;}
.R{width:70%;background:#fff;padding:24px;}
.ltop{background:#1e3a6e;padding:22px 14px;text-align:center;}
.ph{width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid #fff;display:block;margin:0 auto 10px;}
.pp{width:80px;height:80px;border-radius:50%;background:#2d4f8e;margin:0 auto 10px;}
.l-nm{font-size:14px;font-weight:bold;color:#fff;text-align:center;}
.l-dg{font-size:10px;color:#90afd4;text-align:center;margin-top:2px;}
.lpad{padding:0 12px;}
.lt{font-size:9px;font-weight:bold;text-transform:uppercase;background:#fff;color:#1e3a6e;padding:3px 10px;border-radius:3px;margin:12px 0 7px;}
.ci{font-size:10px;color:#bfdbfe;margin-bottom:4px;display:flex;align-items:center;gap:5px;}
.sk{font-size:10px;color:#bfdbfe;margin-bottom:3px;}
.lb{margin-bottom:7px;}.ln{font-size:10px;color:#bfdbfe;margin-bottom:2px;}
.lbg{height:3px;background:#2d4f8e;border-radius:2px;}
.lf{height:3px;background:#90afd4;border-radius:2px;}
.r-nm{font-size:24px;font-weight:900;color:#1e3a6e;border-bottom:3px solid #1e3a6e;padding-bottom:8px;margin-bottom:14px;}
.rs{background:#1e3a6e;color:#fff;font-size:10px;font-weight:bold;text-transform:uppercase;padding:4px 10px;border-radius:3px;margin:14px 0 8px;display:inline-block;}
.ei{display:flex;gap:10px;margin-bottom:10px;padding-left:6px;border-left:3px solid #1e3a6e;}
.ed{font-size:9px;color:#1e3a6e;font-weight:bold;min-width:50px;}
.ec2{flex:1;}
.et{font-size:11px;font-weight:bold;color:#111;}
.ec{font-size:10px;color:#6b7280;}
.edesc{font-size:10px;color:#555;margin-top:2px;}
</style></head><body><div class="cv">
<div class="L">
  <div class="ltop">
    ${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}
    <div class="l-nm">${cv.prenom} ${cv.nom}</div>
    <div class="l-dg">${cv.titre??''}</div>
  </div>
  <div class="lpad">
    <div class="lt">Contact</div>
    ${cv.telephone?`<div class="ci">📞 ${cv.telephone}</div>`:''}
    ${cv.email?`<div class="ci">✉ ${cv.email}</div>`:''}
    ${cv.ville?`<div class="ci">📍 ${cv.ville}</div>`:''}
    ${cv.competences?.length>0?`<div class="lt">Compétences</div>${cv.competences.map((c:string)=>`<div class="sk">• ${c}</div>`).join('')}`:''}
    ${cv.langues?.length>0?`<div class="lt">Langues</div>${cv.langues.map((l:any)=>`<div class="lb"><div class="ln">${l.langue} — ${l.niveau}</div><div class="lbg"><div class="lf" style="width:${getNiveauPct(l.niveau)}%"></div></div></div>`).join('')}`:''}
    ${cv.loisirs?.length>0?`<div class="lt">Loisirs</div>${cv.loisirs.map((l:string)=>`<div class="sk">• ${l}</div>`).join('')}`:''}
  </div>
</div>
<div class="R">
  <div class="r-nm">${cv.prenom} ${cv.nom}</div>
  ${cv.objectif?`<div class="rs">Objectif</div><p style="font-size:10px;color:#444;line-height:1.6;margin-bottom:10px;">${cv.objectif}</p>`:''}
  ${cv.formations?.length>0?`<div class="rs">Formation</div>${cv.formations.map((f:any)=>`<div class="ei"><div class="ed">${f.annee}</div><div class="ec2"><div class="et">${f.diplome}</div><div class="ec">${f.etablissement}</div></div></div>`).join('')}`:''}
  ${cv.experiences?.length>0?`<div class="rs">Expériences</div>${cv.experiences.map((e:any)=>`<div class="ei"><div class="ed">${e.debut}<br/>${e.fin}</div><div class="ec2"><div class="et">${e.poste}</div><div class="ec">${e.entreprise}</div><div class="edesc">${e.description??''}</div></div></div>`).join('')}`:''}
</div></div></body></html>`;

// ═══════════════════════════════════════════════════════
// TEMPLATE 15 — FRESHER DARK
// ═══════════════════════════════════════════════════════
export const templateFresherDark = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
.cv{display:flex;width:100%;min-height:100vh;}
.L{width:36%;background:#fff;padding:0 0 24px;border-right:1px solid #eee;}
.R{width:64%;background:#fff;}
.lt{display:flex;}
.pb{width:45%;background:#1a2744;padding:10px;}
.ph{width:100%;height:110px;object-fit:cover;}
.pp{width:100%;height:110px;background:#2a3754;}
.nb{width:55%;background:#1a2744;padding:14px 10px;display:flex;flex-direction:column;justify-content:center;}
.nm{font-size:17px;font-weight:bold;color:#fff;text-transform:uppercase;}
.dg{font-size:10px;color:#90a4c0;margin-top:3px;}
.lp{padding:14px 12px;}
.ls{font-size:9px;font-weight:bold;text-transform:uppercase;background:#1a2744;color:#fff;padding:4px 10px;border-radius:3px;margin:10px 0 7px;display:flex;align-items:center;gap:6px;}
.tr{flex:1;height:1px;background:#3a4754;}
.ci{font-size:10px;color:#374151;margin-bottom:4px;display:flex;align-items:center;gap:6px;}
.sk{font-size:10px;color:#374151;margin-bottom:3px;}
.sk::before{content:"• ";}
.lb{margin-bottom:7px;}.ln{font-size:10px;color:#374151;margin-bottom:2px;}
.lbg{height:3px;background:#ddd;border-radius:2px;}
.lf{height:3px;background:#1a2744;border-radius:2px;}
.rb{background:#1a2744;color:#fff;font-size:9px;font-weight:bold;text-transform:uppercase;padding:5px 14px;letter-spacing:1px;display:flex;align-items:center;gap:6px;}
.ri{width:11px;height:11px;border:2px solid #90a4c0;border-radius:2px;flex-shrink:0;}
.rp{padding:10px 14px;}
.ei{margin-bottom:10px;}
.et{font-size:11px;font-weight:bold;color:#1a2744;}
.ec{font-size:10px;color:#6b7280;}
.ed2{font-size:9px;color:#90a4c0;}
.edesc{font-size:10px;color:#555;margin-top:2px;}
.bul li{font-size:10px;color:#374151;margin-bottom:2px;}
</style></head><body><div class="cv">
<div class="L">
  <div class="lt">
    <div class="pb">${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}</div>
    <div class="nb"><div class="nm">${cv.prenom}<br/>${cv.nom}</div><div class="dg">${cv.titre??''}</div></div>
  </div>
  <div class="lp">
    <div class="ls">Contact <div class="tr"></div></div>
    ${cv.telephone?`<div class="ci">📞 ${cv.telephone}</div>`:''}
    ${cv.email?`<div class="ci">✉ ${cv.email}</div>`:''}
    ${cv.ville?`<div class="ci">📍 ${cv.ville}</div>`:''}
    ${cv.competences?.length>0?`<div class="ls">Compétences <div class="tr"></div></div>${cv.competences.map((c:string)=>`<div class="sk">${c}</div>`).join('')}`:''}
    ${cv.langues?.length>0?`<div class="ls">Langues <div class="tr"></div></div>${cv.langues.map((l:any)=>`<div class="lb"><div class="ln">${l.langue} — ${l.niveau}</div><div class="lbg"><div class="lf" style="width:${getNiveauPct(l.niveau)}%"></div></div></div>`).join('')}`:''}
    ${cv.loisirs?.length>0?`<div class="ls">Loisirs <div class="tr"></div></div>${cv.loisirs.map((l:string)=>`<div class="sk">${l}</div>`).join('')}`:''}
  </div>
</div>
<div class="R">
  <div class="rb"><div class="ri"></div>Objectif</div>
  <div class="rp"><p style="font-size:10px;color:#444;line-height:1.6;">${cv.objectif??''}</p></div>
  ${cv.formations?.length>0?`<div class="rb"><div class="ri"></div>Formation</div><div class="rp">${cv.formations.map((f:any)=>`<div class="ei"><div class="et">${f.diplome}</div><div class="ec">${f.etablissement}</div><div class="ed2">${f.annee}</div></div>`).join('')}</div>`:''}
  ${cv.experiences?.length>0?`<div class="rb"><div class="ri"></div>Expériences</div><div class="rp">${cv.experiences.map((e:any)=>`<div class="ei"><div class="et">${e.poste}</div><div class="ec">${e.entreprise}</div><div class="ed2">${e.debut} – ${e.fin}</div><div class="edesc">${e.description??''}</div></div>`).join('')}</div>`:''}
  ${cv.competences?.length>0?`<div class="rb"><div class="ri"></div>Compétences</div><div class="rp"><ul class="bul">${cv.competences.map((c:string)=>`<li>${c}</li>`).join('')}</ul></div>`:''}
  ${cv.loisirs?.length>0?`<div class="rb"><div class="ri"></div>Loisirs</div><div class="rp"><ul class="bul">${cv.loisirs.map((l:string)=>`<li>${l}</li>`).join('')}</ul></div>`:''}
</div></div></body></html>`;

// ═══════════════════════════════════════════════════════
// TEMPLATES 16-34 — VARIANTES COULEUR (uniques)
// ═══════════════════════════════════════════════════════
export const templateTealBanner    = (cv:any,p:string|null) => templateTealStudent(cv,p).replace(/#3d9b8a/g,'#5b9fa0').replace(/#5ab5a3/g,'#6dbdb8').replace(/#e8e8e8/g,'#dff5f3');
export const templateBleuJaune     = (cv:any,p:string|null) => templateNavyPro(cv,p).replace(/#1e3a6e/g,'#1a2f6e').replace(/#90afd4/g,'#f5c518').replace(/#bfdbfe/g,'#fff3b0').replace(/#2d4f8e/g,'#2a3f8e');
export const templateGrisArche     = (cv:any,p:string|null) => templateMinimaliste(cv,p).replace(/#111/g,'#5a5a5a').replace(/color:#1a1a1a/g,'color:#333');
export const templateVertDiamant   = (cv:any,p:string|null) => templateGeometrique(cv,p).replace(/#1a2744/g,'#2d5a1b').replace(/#e85d30/g,'#8fbc5a');
export const templateDarkRouge     = (cv:any,p:string|null) => templateDarkSidebar(cv,p).replace(/#2c2c2c/g,'#1a0a0a').replace(/#1a1a1a/g,'#110505').replace(/#9ca3af/g,'#e8363a').replace(/#444/g,'#2a1010');
export const templateNoirBlob      = (cv:any,p:string|null) => templateBoldNoir(cv,p).replace(/#111/g,'#0a0a0a').replace(/#222/g,'#111').replace(/#9ca3af/g,'#aaa');
export const templateWaveCyan      = (cv:any,p:string|null) => templateBleuArrondi(cv,p).replace(/#2563eb/g,'#0891b2').replace(/#1e40af/g,'#0e7490').replace(/#dbeafe/g,'#cffafe').replace(/#f0f4ff/g,'#ecfeff');
export const templateGrisWave      = (cv:any,p:string|null) => templateDarkSidebar(cv,p).replace(/#2c2c2c/g,'#4b5563').replace(/#1a1a1a/g,'#374151').replace(/#9ca3af/g,'#d1d5db').replace(/#444/g,'#6b7280');
export const templateTealCercle    = (cv:any,p:string|null) => templateTealStudent(cv,p).replace(/#3d9b8a/g,'#0f766e').replace(/#5ab5a3/g,'#14b8a6').replace(/#e8e8e8/g,'#f0fdfa');
export const templateOrangeMinimal = (cv:any,p:string|null) => templateClassiquePro(cv,p).replace(/#888/g,'#ea580c').replace(/border-bottom:2px solid #ddd/g,'border-bottom:2px solid #ea580c').replace(/border-bottom:1px solid #ddd/g,'border-bottom:1px solid #fed7aa');
export const templateNoirJaune     = (cv:any,p:string|null) => templateFresherVert(cv,p).replace(/#2d5a27/g,'#1a1a1a').replace(/#c8e6c0/g,'#fde047').replace(/#f5f5f0/g,'#111').replace(/color:#444/g,'color:#ccc').replace(/color:#1a1a1a/g,'color:#fff');
export const templateDoreDark      = (cv:any,p:string|null) => templateBrunElegant(cv,p).replace(/#2a2520/g,'#1c1a12').replace(/#c9a96e/g,'#d97706').replace(/#3d3028/g,'#2c2410').replace(/#f5f5f2/g,'#fef9ef');
export const templateBrunRose      = (cv:any,p:string|null) => templateBrunElegant(cv,p).replace(/#2a2520/g,'#5c3d2e').replace(/#c9a96e/g,'#e07b86').replace(/#3d3028/g,'#7a5040').replace(/#f5f5f2/g,'#fff1f2');
export const templateGrisVague     = (cv:any,p:string|null) => templateGrisWave(cv,p).replace(/#4b5563/g,'#64748b').replace(/#374151/g,'#475569');
export const templateGeoOrange     = (cv:any,p:string|null) => templateGeometrique(cv,p).replace(/#e85d30/g,'#f97316').replace(/#1a2744/g,'#0f172a');
export const templateDoreSidebar   = (cv:any,p:string|null) => templateNavyPro(cv,p).replace(/#1e3a6e/g,'#292524').replace(/#90afd4/g,'#c9a96e').replace(/#bfdbfe/g,'#fde68a').replace(/#2d4f8e/g,'#44403c');
export const templateNavyWave      = (cv:any,p:string|null) => templateNavyPro(cv,p).replace(/#1e3a6e/g,'#0f2952').replace(/#90afd4/g,'#38bdf8').replace(/#bfdbfe/g,'#bae6fd').replace(/#2d4f8e/g,'#1e3a5f');
export const templateDarkDore2     = (cv:any,p:string|null) => templateBoldNoir(cv,p).replace(/#111/g,'#18130a').replace(/#222/g,'#231c0e').replace(/#9ca3af/g,'#d4a017').replace(/#6b7280/g,'#a07820');
export const templateDarkGris      = (cv:any,p:string|null) => templateDarkSidebar(cv,p).replace(/#2c2c2c/g,'#1f2937').replace(/#1a1a1a/g,'#111827').replace(/#9ca3af/g,'#9ca3af').replace(/#444/g,'#374151');
export const templateWaveNoir      = (cv:any,p:string|null) => templateBleuArrondi(cv,p).replace(/#2563eb/g,'#0f172a').replace(/#1e40af/g,'#1e293b').replace(/#dbeafe/g,'#e2e8f0').replace(/#f0f4ff/g,'#f8fafc');

// ═══════════════════════════════════════════════════════
// TEMPLATES 35-40 — DESIGNS ENTIÈREMENT NOUVEAUX
// ═══════════════════════════════════════════════════════

// Template 35 — Rouge Moderne (bandeau rouge + contenu blanc)
export const templateRougeModerne = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
body{background:#fff;}
.top-band{background:#dc2626;padding:0;}
.header{display:flex;align-items:center;padding:20px 24px;background:#dc2626;}
.ph{width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.7);margin-right:16px;}
.pp{width:80px;height:80px;border-radius:50%;background:#991b1b;border:3px solid rgba(255,255,255,0.5);margin-right:16px;}
.hinfo{flex:1;}
.nm{font-size:24px;font-weight:bold;color:#fff;}
.dg{font-size:11px;color:rgba(255,255,255,0.8);margin-top:3px;}
.contact-bar{display:flex;gap:20px;background:#b91c1c;padding:8px 24px;}
.cb{font-size:10px;color:#fecaca;}
.body{display:flex;padding:20px 24px;gap:24px;}
.col-l{width:30%;}
.col-r{flex:1;}
.sec{font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#dc2626;border-left:3px solid #dc2626;padding-left:8px;margin:16px 0 8px;}
.sk{font-size:10px;color:#444;margin-bottom:4px;}
.sk::before{content:"▸ ";color:#dc2626;}
.lb{margin-bottom:8px;}.ln{font-size:10px;color:#444;margin-bottom:3px;}
.lbg{height:3px;background:#fee2e2;border-radius:2px;}
.lf{height:3px;background:#dc2626;border-radius:2px;}
.ei{margin-bottom:14px;border-left:2px solid #fee2e2;padding-left:12px;}
.et{font-size:12px;font-weight:bold;color:#111;}
.ec{font-size:10px;color:#dc2626;margin-top:1px;}
.ed{font-size:9px;color:#888;}
.edesc{font-size:10px;color:#555;margin-top:3px;}
</style></head><body>
<div class="header">
  ${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}
  <div class="hinfo">
    <div class="nm">${cv.prenom} ${cv.nom}</div>
    <div class="dg">${cv.titre??''}</div>
  </div>
</div>
<div class="contact-bar">
  ${cv.telephone?`<span class="cb">📞 ${cv.telephone}</span>`:''}
  ${cv.email?`<span class="cb">✉ ${cv.email}</span>`:''}
  ${cv.ville?`<span class="cb">📍 ${cv.ville}</span>`:''}
</div>
<div class="body">
  <div class="col-l">
    ${cv.objectif?`<div class="sec">Profil</div><p style="font-size:10px;color:#444;line-height:1.6;">${cv.objectif}</p>`:''}
    ${cv.competences?.length>0?`<div class="sec">Compétences</div>${cv.competences.map((c:string)=>`<div class="sk">${c}</div>`).join('')}`:''}
    ${cv.langues?.length>0?`<div class="sec">Langues</div>${cv.langues.map((l:any)=>`<div class="lb"><div class="ln">${l.langue} — ${l.niveau}</div><div class="lbg"><div class="lf" style="width:${getNiveauPct(l.niveau)}%"></div></div></div>`).join('')}`:''}
    ${cv.loisirs?.length>0?`<div class="sec">Loisirs</div>${cv.loisirs.map((l:string)=>`<div class="sk">${l}</div>`).join('')}`:''}
  </div>
  <div class="col-r">
    ${cv.formations?.length>0?`<div class="sec">Formation</div>${cv.formations.map((f:any)=>`<div class="ei"><div class="et">${f.diplome}</div><div class="ec">${f.etablissement}</div><div class="ed">${f.annee}</div></div>`).join('')}`:''}
    ${cv.experiences?.length>0?`<div class="sec">Expériences</div>${cv.experiences.map((e:any)=>`<div class="ei"><div class="et">${e.poste}</div><div class="ec">${e.entreprise}</div><div class="ed">${e.debut} – ${e.fin}</div><div class="edesc">${e.description??''}</div></div>`).join('')}`:''}
  </div>
</div></body></html>`;

// Template 36 — Jaune Pro (jaune vif + noir)
export const templateJaunePro = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
body{background:#fefce8;}
.cv{display:flex;width:100%;min-height:100vh;}
.L{width:38%;background:#111;padding:0 0 24px;}
.R{width:62%;padding:24px 20px;}
.ltop{background:#eab308;padding:24px 16px;text-align:center;}
.ph{width:90px;height:90px;border-radius:50%;object-fit:cover;border:4px solid #111;display:block;margin:0 auto 10px;}
.pp{width:90px;height:90px;border-radius:50%;background:#ca8a04;border:4px solid #111;margin:0 auto 10px;}
.nm-l{font-size:16px;font-weight:900;color:#111;text-align:center;}
.dg-l{font-size:10px;color:#111;font-weight:bold;text-align:center;margin-top:3px;}
.lpad{padding:0 14px;}
.lt{font-size:9px;font-weight:bold;text-transform:uppercase;background:#eab308;color:#111;padding:4px 10px;margin:14px 0 8px;display:block;}
.ci{font-size:10px;color:#d1d5db;margin-bottom:5px;display:flex;gap:6px;}
.sk{font-size:10px;color:#d1d5db;margin-bottom:4px;}
.sk::before{content:"◆ ";color:#eab308;}
.lb{margin-bottom:8px;}.ln{font-size:10px;color:#d1d5db;margin-bottom:3px;}
.lbg{height:3px;background:#333;border-radius:2px;}
.lf{height:3px;background:#eab308;border-radius:2px;}
.r-nm{font-size:26px;font-weight:900;color:#111;border-bottom:3px solid #111;padding-bottom:8px;margin-bottom:16px;}
.r-dg{font-size:12px;color:#ca8a04;font-weight:bold;}
.rs{background:#111;color:#eab308;font-size:10px;font-weight:bold;text-transform:uppercase;padding:5px 12px;margin:14px 0 10px;display:inline-block;}
.ei{margin-bottom:12px;padding-left:10px;border-left:3px solid #eab308;}
.et{font-size:11px;font-weight:bold;color:#111;}
.ec{font-size:10px;color:#ca8a04;margin-top:1px;}
.ed{font-size:9px;color:#888;}
.edesc{font-size:10px;color:#444;margin-top:3px;}
</style></head><body><div class="cv">
<div class="L">
  <div class="ltop">
    ${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}
    <div class="nm-l">${cv.prenom} ${cv.nom}</div>
    <div class="dg-l">${cv.titre??''}</div>
  </div>
  <div class="lpad">
    <div class="lt">Contact</div>
    ${cv.telephone?`<div class="ci">📞 ${cv.telephone}</div>`:''}
    ${cv.email?`<div class="ci">✉ ${cv.email}</div>`:''}
    ${cv.ville?`<div class="ci">📍 ${cv.ville}</div>`:''}
    ${cv.competences?.length>0?`<div class="lt">Compétences</div>${cv.competences.map((c:string)=>`<div class="sk">${c}</div>`).join('')}`:''}
    ${cv.langues?.length>0?`<div class="lt">Langues</div>${cv.langues.map((l:any)=>`<div class="lb"><div class="ln">${l.langue} — ${l.niveau}</div><div class="lbg"><div class="lf" style="width:${getNiveauPct(l.niveau)}%"></div></div></div>`).join('')}`:''}
    ${cv.loisirs?.length>0?`<div class="lt">Loisirs</div>${cv.loisirs.map((l:string)=>`<div class="sk">${l}</div>`).join('')}`:''}
  </div>
</div>
<div class="R">
  <div class="r-nm">${cv.prenom} ${cv.nom}</div>
  <div class="r-dg">${cv.titre??''}</div>
  ${cv.objectif?`<div class="rs">Profil</div><p style="font-size:10px;color:#444;line-height:1.6;margin-bottom:10px;">${cv.objectif}</p>`:''}
  ${cv.formations?.length>0?`<div class="rs">Formation</div>${cv.formations.map((f:any)=>`<div class="ei"><div class="et">${f.diplome}</div><div class="ec">${f.etablissement}</div><div class="ed">${f.annee}</div></div>`).join('')}`:''}
  ${cv.experiences?.length>0?`<div class="rs">Expériences</div>${cv.experiences.map((e:any)=>`<div class="ei"><div class="et">${e.poste}</div><div class="ec">${e.entreprise}</div><div class="ed">${e.debut} – ${e.fin}</div><div class="edesc">${e.description??''}</div></div>`).join('')}`:''}
</div></div></body></html>`;

// Template 37 — Vert Minimal (vert forêt, layout simple)
export const templateVertMinimal = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
body{background:#f0fdf4;padding:28px;}
.header{display:flex;gap:20px;align-items:center;margin-bottom:20px;padding-bottom:16px;border-bottom:3px solid #16a34a;}
.ph{width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid #16a34a;}
.pp{width:90px;height:90px;border-radius:50%;background:#dcfce7;border:3px solid #16a34a;}
.hinfo{flex:1;}
.nm{font-size:26px;font-weight:bold;color:#14532d;}
.dg{font-size:11px;color:#16a34a;font-weight:600;margin-top:4px;text-transform:uppercase;}
.contacts{display:flex;gap:16px;margin-top:8px;}
.cb{font-size:10px;color:#555;display:flex;align-items:center;gap:4px;}
.body{display:flex;gap:24px;}
.col-l{width:33%;}
.col-r{flex:1;}
.sec{font-size:11px;font-weight:bold;text-transform:uppercase;color:#14532d;background:#dcfce7;padding:4px 10px;border-left:4px solid #16a34a;margin:14px 0 8px;}
.sk{font-size:10px;color:#374151;margin-bottom:4px;}
.sk::before{content:"✓ ";color:#16a34a;font-weight:bold;}
.lb{margin-bottom:8px;}.ln{font-size:10px;color:#374151;margin-bottom:3px;}
.lbg{height:3px;background:#bbf7d0;border-radius:2px;}
.lf{height:3px;background:#16a34a;border-radius:2px;}
.ei{margin-bottom:12px;padding:8px;background:#fff;border-radius:6px;border-left:3px solid #16a34a;}
.et{font-size:11px;font-weight:bold;color:#14532d;}
.ec{font-size:10px;color:#16a34a;margin-top:1px;}
.ed{font-size:9px;color:#888;}
.edesc{font-size:10px;color:#555;margin-top:3px;}
</style></head><body>
<div class="header">
  ${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}
  <div class="hinfo">
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
  <div class="col-l">
    ${cv.objectif?`<div class="sec">Profil</div><p style="font-size:10px;color:#444;line-height:1.6;">${cv.objectif}</p>`:''}
    ${cv.competences?.length>0?`<div class="sec">Compétences</div>${cv.competences.map((c:string)=>`<div class="sk">${c}</div>`).join('')}`:''}
    ${cv.langues?.length>0?`<div class="sec">Langues</div>${cv.langues.map((l:any)=>`<div class="lb"><div class="ln">${l.langue} — ${l.niveau}</div><div class="lbg"><div class="lf" style="width:${getNiveauPct(l.niveau)}%"></div></div></div>`).join('')}`:''}
    ${cv.loisirs?.length>0?`<div class="sec">Loisirs</div>${cv.loisirs.map((l:string)=>`<div class="sk">${l}</div>`).join('')}`:''}
  </div>
  <div class="col-r">
    ${cv.formations?.length>0?`<div class="sec">Formation</div>${cv.formations.map((f:any)=>`<div class="ei"><div class="et">${f.diplome}</div><div class="ec">${f.etablissement}</div><div class="ed">${f.annee}</div></div>`).join('')}`:''}
    ${cv.experiences?.length>0?`<div class="sec">Expériences</div>${cv.experiences.map((e:any)=>`<div class="ei"><div class="et">${e.poste}</div><div class="ec">${e.entreprise}</div><div class="ed">${e.debut} – ${e.fin}</div><div class="edesc">${e.description??''}</div></div>`).join('')}`:''}
  </div>
</div></body></html>`;

// Template 38 — Orange Sidebar (orange vif + fond blanc)
export const templateOrangeSidebar = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
.cv{display:flex;width:100%;min-height:100vh;}
.L{width:30%;background:#ea580c;padding:24px 16px;color:#fff;}
.R{width:70%;background:#fff;padding:24px;}
.ph{width:85px;height:85px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.8);display:block;margin:0 auto 14px;}
.pp{width:85px;height:85px;border-radius:50%;background:#c2410c;margin:0 auto 14px;}
.nm-l{font-size:15px;font-weight:bold;color:#fff;text-align:center;margin-bottom:4px;}
.dg-l{font-size:10px;color:rgba(255,255,255,0.8);text-align:center;}
.lt{font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1.5px solid rgba(255,255,255,0.4);padding-bottom:4px;margin:16px 0 8px;}
.ci{font-size:10px;color:#fff;margin-bottom:5px;display:flex;gap:6px;align-items:center;}
.sk{font-size:10px;color:#fed7aa;margin-bottom:4px;}
.sk::before{content:"• ";}
.lb{margin-bottom:8px;}.ln{font-size:10px;color:#fed7aa;margin-bottom:3px;}
.lbg{height:3px;background:rgba(255,255,255,0.25);border-radius:2px;}
.lf{height:3px;background:#fff;border-radius:2px;}
.r-nm{font-size:26px;font-weight:bold;color:#c2410c;border-bottom:3px solid #ea580c;padding-bottom:8px;margin-bottom:16px;}
.rs{background:#ea580c;color:#fff;font-size:10px;font-weight:bold;text-transform:uppercase;padding:5px 14px;border-radius:20px;margin:14px 0 10px;display:inline-block;}
.ei{margin-bottom:12px;padding-left:12px;border-left:2px solid #fed7aa;}
.et{font-size:11px;font-weight:bold;color:#111;}
.ec{font-size:10px;color:#ea580c;margin-top:1px;}
.ed{font-size:9px;color:#888;}
.edesc{font-size:10px;color:#555;margin-top:3px;}
</style></head><body><div class="cv">
<div class="L">
  ${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}
  <div class="nm-l">${cv.prenom} ${cv.nom}</div>
  <div class="dg-l">${cv.titre??''}</div>
  <div class="lt">Contact</div>
  ${cv.telephone?`<div class="ci">📞 ${cv.telephone}</div>`:''}
  ${cv.email?`<div class="ci">✉ ${cv.email}</div>`:''}
  ${cv.ville?`<div class="ci">📍 ${cv.ville}</div>`:''}
  ${cv.objectif?`<div class="lt">À propos</div><p style="font-size:10px;color:#fed7aa;line-height:1.6;">${cv.objectif}</p>`:''}
  ${cv.competences?.length>0?`<div class="lt">Compétences</div>${cv.competences.map((c:string)=>`<div class="sk">${c}</div>`).join('')}`:''}
  ${cv.langues?.length>0?`<div class="lt">Langues</div>${cv.langues.map((l:any)=>`<div class="lb"><div class="ln">${l.langue} — ${l.niveau}</div><div class="lbg"><div class="lf" style="width:${getNiveauPct(l.niveau)}%"></div></div></div>`).join('')}`:''}
  ${cv.loisirs?.length>0?`<div class="lt">Loisirs</div>${cv.loisirs.map((l:string)=>`<div class="sk">${l}</div>`).join('')}`:''}
</div>
<div class="R">
  <div class="r-nm">${cv.prenom} ${cv.nom}</div>
  ${cv.formations?.length>0?`<div class="rs">Formation</div>${cv.formations.map((f:any)=>`<div class="ei"><div class="et">${f.diplome}</div><div class="ec">${f.etablissement}</div><div class="ed">${f.annee}</div></div>`).join('')}`:''}
  ${cv.experiences?.length>0?`<div class="rs">Expériences</div>${cv.experiences.map((e:any)=>`<div class="ei"><div class="et">${e.poste}</div><div class="ec">${e.entreprise}</div><div class="ed">${e.debut} – ${e.fin}</div><div class="edesc">${e.description??''}</div></div>`).join('')}`:''}
</div></div></body></html>`;

// Template 39 — Rose Élégant (rose poudré + gris)
export const templateRoseElegant = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
body{background:#fff5f7;padding:28px;}
.header{display:flex;gap:20px;align-items:flex-start;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid #f9a8d4;}
.ph{width:100px;height:100px;border-radius:50%;object-fit:cover;border:4px solid #f9a8d4;}
.pp{width:100px;height:100px;border-radius:50%;background:#fce7f3;border:4px solid #f9a8d4;}
.hinfo{flex:1;}
.nm{font-size:28px;font-weight:300;color:#831843;letter-spacing:2px;}
.nm b{font-weight:900;}
.dg{font-size:11px;color:#be185d;margin-top:4px;letter-spacing:3px;text-transform:uppercase;}
.contacts{display:flex;gap:14px;margin-top:10px;flex-wrap:wrap;}
.cb{font-size:10px;color:#6b7280;display:flex;align-items:center;gap:4px;}
.body{display:flex;gap:24px;}
.col-l{width:35%;}
.col-r{flex:1;}
.sec{font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;color:#831843;border-bottom:1px solid #f9a8d4;padding-bottom:4px;margin:16px 0 10px;}
.sk{font-size:10px;color:#374151;margin-bottom:5px;}
.sk::before{content:"♦ ";color:#be185d;font-size:8px;}
.lb{margin-bottom:8px;}.ln{font-size:10px;color:#374151;margin-bottom:3px;}
.lbg{height:3px;background:#fce7f3;border-radius:2px;}
.lf{height:3px;background:#be185d;border-radius:2px;}
.ei{margin-bottom:14px;}
.et{font-size:11px;font-weight:bold;color:#111;}
.ec{font-size:10px;color:#be185d;margin-top:1px;font-style:italic;}
.ed{font-size:9px;color:#888;}
.edesc{font-size:10px;color:#555;margin-top:4px;line-height:1.6;}
</style></head><body>
<div class="header">
  ${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}
  <div class="hinfo">
    <div class="nm"><b>${cv.prenom}</b> ${cv.nom}</div>
    <div class="dg">${cv.titre??''}</div>
    <div class="contacts">
      ${cv.telephone?`<span class="cb">📞 ${cv.telephone}</span>`:''}
      ${cv.email?`<span class="cb">✉ ${cv.email}</span>`:''}
      ${cv.ville?`<span class="cb">📍 ${cv.ville}</span>`:''}
    </div>
  </div>
</div>
<div class="body">
  <div class="col-l">
    ${cv.objectif?`<div class="sec">Profil</div><p style="font-size:10px;color:#555;line-height:1.7;">${cv.objectif}</p>`:''}
    ${cv.competences?.length>0?`<div class="sec">Compétences</div>${cv.competences.map((c:string)=>`<div class="sk">${c}</div>`).join('')}`:''}
    ${cv.langues?.length>0?`<div class="sec">Langues</div>${cv.langues.map((l:any)=>`<div class="lb"><div class="ln">${l.langue} — ${l.niveau}</div><div class="lbg"><div class="lf" style="width:${getNiveauPct(l.niveau)}%"></div></div></div>`).join('')}`:''}
    ${cv.loisirs?.length>0?`<div class="sec">Loisirs</div>${cv.loisirs.map((l:string)=>`<div class="sk">${l}</div>`).join('')}`:''}
  </div>
  <div class="col-r">
    ${cv.formations?.length>0?`<div class="sec">Formation</div>${cv.formations.map((f:any)=>`<div class="ei"><div class="et">${f.diplome}</div><div class="ec">${f.etablissement}</div><div class="ed">${f.annee}</div></div>`).join('')}`:''}
    ${cv.experiences?.length>0?`<div class="sec">Expériences</div>${cv.experiences.map((e:any)=>`<div class="ei"><div class="et">${e.poste}</div><div class="ec">${e.entreprise}</div><div class="ed">${e.debut} – ${e.fin}</div><div class="edesc">${e.description??''}</div></div>`).join('')}`:''}
  </div>
</div></body></html>`;

// Template 40 — Dark Orange (fond très sombre + accents orange)
export const templateDarkOrange = (cv: any, photo: string | null): string => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>${base}
body{background:#0c0a09;}
.cv{display:flex;width:100%;min-height:100vh;}
.L{width:35%;background:#1c1917;padding:24px 16px;}
.R{width:65%;background:#0c0a09;padding:24px 20px;}
.ph{width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid #f97316;display:block;margin:0 auto 12px;}
.pp{width:90px;height:90px;border-radius:50%;background:#292524;border:3px solid #f97316;margin:0 auto 12px;}
.nm-l{font-size:15px;font-weight:bold;color:#fff;text-align:center;}
.dg-l{font-size:10px;color:#f97316;text-align:center;margin-top:3px;font-weight:bold;}
.lt{font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;color:#f97316;border-bottom:1px solid #292524;padding-bottom:4px;margin:14px 0 8px;}
.ci{font-size:10px;color:#d6d3d1;margin-bottom:5px;display:flex;gap:6px;}
.sk{font-size:10px;color:#a8a29e;margin-bottom:4px;}
.sk::before{content:"◆ ";color:#f97316;font-size:8px;}
.lb{margin-bottom:8px;}.ln{font-size:10px;color:#a8a29e;margin-bottom:3px;}
.lbg{height:3px;background:#292524;border-radius:2px;}
.lf{height:3px;background:#f97316;border-radius:2px;}
.r-nm{font-size:26px;font-weight:bold;color:#fff;border-bottom:2px solid #f97316;padding-bottom:8px;margin-bottom:16px;}
.r-dg{font-size:11px;color:#f97316;margin-top:-12px;margin-bottom:16px;}
.rs{background:#f97316;color:#fff;font-size:10px;font-weight:bold;text-transform:uppercase;padding:5px 14px;border-radius:3px;margin:14px 0 10px;display:inline-block;}
.ei{margin-bottom:14px;border-left:2px solid #292524;padding-left:12px;}
.et{font-size:11px;font-weight:bold;color:#fff;}
.ec{font-size:10px;color:#f97316;margin-top:1px;}
.ed{font-size:9px;color:#78716c;}
.edesc{font-size:10px;color:#a8a29e;margin-top:3px;line-height:1.6;}
.about{font-size:10px;color:#a8a29e;line-height:1.7;margin-bottom:14px;}
</style></head><body><div class="cv">
<div class="L">
  ${photo?`<img class="ph" src="${photo}"/>`:'<div class="pp"></div>'}
  <div class="nm-l">${cv.prenom} ${cv.nom}</div>
  <div class="dg-l">${cv.titre??''}</div>
  <div class="lt">Contact</div>
  ${cv.telephone?`<div class="ci">📞 ${cv.telephone}</div>`:''}
  ${cv.email?`<div class="ci">✉ ${cv.email}</div>`:''}
  ${cv.ville?`<div class="ci">📍 ${cv.ville}</div>`:''}
  ${cv.competences?.length>0?`<div class="lt">Compétences</div>${cv.competences.map((c:string)=>`<div class="sk">${c}</div>`).join('')}`:''}
  ${cv.langues?.length>0?`<div class="lt">Langues</div>${cv.langues.map((l:any)=>`<div class="lb"><div class="ln">${l.langue} — ${l.niveau}</div><div class="lbg"><div class="lf" style="width:${getNiveauPct(l.niveau)}%"></div></div></div>`).join('')}`:''}
  ${cv.loisirs?.length>0?`<div class="lt">Loisirs</div>${cv.loisirs.map((l:string)=>`<div class="sk">${l}</div>`).join('')}`:''}
</div>
<div class="R">
  <div class="r-nm">${cv.prenom} ${cv.nom}</div>
  ${cv.objectif?`<div class="about">${cv.objectif}</div>`:''}
  ${cv.formations?.length>0?`<div class="rs">Formation</div>${cv.formations.map((f:any)=>`<div class="ei"><div class="et">${f.diplome}</div><div class="ec">${f.etablissement}</div><div class="ed">${f.annee}</div></div>`).join('')}`:''}
  ${cv.experiences?.length>0?`<div class="rs">Expériences</div>${cv.experiences.map((e:any)=>`<div class="ei"><div class="et">${e.poste}</div><div class="ec">${e.entreprise}</div><div class="ed">${e.debut} – ${e.fin}</div><div class="edesc">${e.description??''}</div></div>`).join('')}`:''}
</div></div></body></html>`;