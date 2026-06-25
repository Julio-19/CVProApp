import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, Alert, Animated, Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { sauvegarderCV, uploaderPhoto } from '../services/cvService';
import { useState, useEffect, useRef } from 'react';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { useCVStore } from '../store/cvStore';
import { Colors } from '../constants/colors';
import { generateCVHTML } from '../services/templateService';
import { notifCVSauvegarde, notifPDFGenere } from '../services/notificationService';

const { width } = Dimensions.get('window');

// ── Couleur du template ───────────────────────────────────────────────────────
const getTemplateColor = (templateId: string): string => {
  const colors: Record<string, string> = {
    sidebar_bleu:   '#1a3a5c', gagnant:       '#1a3a5c', minimaliste:   '#111',
    teal_student:   '#3d9b8a', dark_sidebar:  '#2c2c2c', violet:        '#6b21a8',
    classique_pro:  '#6b7280', bold_noir:     '#111',    bleu_arrondi:  '#2563eb',
    brun_elegant:   '#2a2520', fresher_vert:  '#2d5a27', geometrique:   '#e85d30',
    vert_nature:    '#1e3422', navy_pro:      '#1e3a6e', fresher_dark:  '#1a2744',
    rouge_moderne:  '#dc2626', jaune_pro:     '#ca8a04', vert_minimal:  '#14532d',
    orange_sidebar: '#ea580c', rose_elegant:  '#831843', dark_orange:   '#f97316',
  };
  return colors[templateId] ?? '#534AB7';
};

const genererPDFWeb = async (html: string, nomCV: string = 'Mon_CV'): Promise<void> => {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // CSS forcé pour les couleurs de fond
  const forcedCSS = `
    <style id="force-print-colors">
      *, *::before, *::after {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      html, body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        margin: 0 !important;
        padding: 0 !important;
      }
    </style>
  `;

  const htmlFinal = html.includes('</head>')
    ? html.replace('</head>', forcedCSS + '</head>')
    : forcedCSS + html;

  if (isMobile) {
    try {
      if (typeof (window as any).html2pdf === 'undefined') {
        throw new Error('html2pdf non disponible');
      }

      // ── Créer une page dédiée au CV dans un blob ────────────────────────
      const blob = new Blob([htmlFinal], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);

      // Ouvrir dans un iframe caché
      const iframe = document.createElement('iframe');
      iframe.id = 'cv-render-iframe';
      iframe.src = blobUrl;
      iframe.style.cssText = `
        position: fixed;
        top: 0;
        left: -9999px;
        width: 794px;
        height: 1123px;
        border: none;
        z-index: -1;
        visibility: hidden;
      `;
      document.body.appendChild(iframe);

      // Attendre le chargement complet de l'iframe
      await new Promise<void>((resolve) => {
        iframe.onload = () => resolve();
        setTimeout(resolve, 3000); // timeout de sécurité
      });

      // Attendre rendu des styles
      await new Promise(resolve => setTimeout(resolve, 1000));

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc || !iframeDoc.body) {
        throw new Error('iframe body non disponible');
      }

      const opt = {
        margin: 0,
        filename: `${nomCV}_CV.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: 794,
          windowWidth: 794,
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
      };

      // Capturer depuis le body de l'iframe
      await (window as any).html2pdf()
        .set(opt)
        .from(iframeDoc.documentElement)
        .save();

      // Nettoyer
      URL.revokeObjectURL(blobUrl);
      const el = document.getElementById('cv-render-iframe');
      if (el) document.body.removeChild(el);

      setTimeout(() => {
        Alert.alert(
          '✅ CV téléchargé !',
          'Votre CV PDF a été téléchargé dans vos fichiers.',
          [{ text: 'Super !' }]
        );
      }, 500);

    } catch (error: any) {
      console.error('Erreur html2pdf:', error);

      // Nettoyer
      const el = document.getElementById('cv-render-iframe');
      if (el) try { document.body.removeChild(el); } catch(e) {}

      // Fallback : télécharger HTML
      const blob = new Blob([htmlFinal], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${nomCV}_CV.html`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => { try { URL.revokeObjectURL(blobUrl); } catch(e) {} }, 5000);

      setTimeout(() => {
        Alert.alert(
          '📄 CV téléchargé en HTML',
          'Pour un PDF avec couleurs :\n\n' +
          '1️⃣ Ouvrez le fichier avec Chrome\n' +
          '2️⃣ Menu ⋮ → Imprimer\n' +
          '3️⃣ Enregistrer en PDF\n\n' +
          '✅ Toutes les couleurs seront présentes !',
          [{ text: 'OK, compris !' }]
        );
      }, 500);
    }

  } else {
    // Sur PC : nouvel onglet avec impression auto
    const htmlPC = htmlFinal.replace('</head>', `
      <style>
        @media print {
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          @page { margin: 0; size: A4 portrait; }
        }
      </style>
      <script>
        window.addEventListener('load', function() {
          setTimeout(function() { window.print(); }, 600);
        });
        window.addEventListener('afterprint', function() {
          setTimeout(function() { window.close(); }, 300);
        });
      </script>
    </head>`);

    const newWindow = window.open('', '_blank', 'width=1200,height=800');
    if (newWindow) {
      newWindow.document.write(htmlPC);
      newWindow.document.close();
    } else {
      const blob = new Blob([htmlFinal], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${nomCV}_CV.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => { try { URL.revokeObjectURL(blobUrl); } catch(e) {} }, 5000);
    }
  }
};


export default function SavedScreen() {
  const cv = useCVStore();

  const [loading, setLoading]         = useState(false);
  const [saving, setSaving]           = useState(false);
  const [pdfUri, setPdfUri]           = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [activeTab, setActiveTab]     = useState<'apercu' | 'actions'>('apercu');
  const [cvIdActuel, setCvIdActuel]   = useState<string | null>(null);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    console.log('=== CV STORE ===');
    console.log('PRENOM:', cv.prenom);
    console.log('NOM:', cv.nom);
    console.log('EMAIL:', cv.email);
    console.log('TITRE:', cv.titre);
    console.log('TEMPLATE:', cv.templateId);
    console.log('===============');
  }, []);

  useEffect(() => {
    setPdfUri(null);
    setPhotoBase64(null);
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: Platform.OS !== 'web' }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 8, useNativeDriver: Platform.OS !== 'web' }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: Platform.OS !== 'web' }),
    ]).start();
  }, [cv.templateId]);

  const getPhotoData = async (): Promise<string | null> => {
    if (!cv.photo) return null;
    if (cv.photo.startsWith('data:image')) return cv.photo;
    if (Platform.OS === 'web') return null;
    try {
      const base64 = await FileSystem.readAsStringAsync(cv.photo, { encoding: 'base64' });
      return `data:image/jpeg;base64,${base64}`;
    } catch { return null; }
  };

  const getCompletionScore = () => {
    const fields = [cv.prenom, cv.nom, cv.email, cv.telephone, cv.ville, cv.titre, cv.objectif, cv.photo];
    const filled = fields.filter(Boolean).length;
    const extras = [
      (cv.experiences?.length  ?? 0) > 0,
      (cv.formations?.length   ?? 0) > 0,
      (cv.competences?.length  ?? 0) > 0,
      (cv.langues?.length      ?? 0) > 0,
    ].filter(Boolean).length;
    return Math.round(((filled + extras) / 12) * 100);
  };

  const score    = getCompletionScore();
  const nomComplet = [cv.prenom, cv.nom].filter(Boolean).join(' ') || '—';
  const templateNom = (cv.templateId ?? 'sidebar_bleu')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    try {
      setLoading(true);

      console.log('=== GÉNÉRATION PDF ===');
      console.log('TEMPLATE ID:', cv.templateId);
      console.log('PRENOM:', cv.prenom);
      console.log('NOM:', cv.nom);
      console.log('=====================');

      const photoData  = await getPhotoData();
      setPhotoBase64(photoData);
      const templateId = cv.templateId ?? 'sidebar_bleu';
      const html       = generateCVHTML(cv, photoData, templateId);
      const nomCV      = `${cv.prenom ?? ''}_${cv.nom ?? ''}`.trim() || 'Mon';

      if (Platform.OS === 'web') {
        await genererPDFWeb(html, nomCV);
        setPdfUri('web-generated');
        setActiveTab('actions');
      } else {
        const { uri } = await Print.printToFileAsync({ html, base64: false });
        setPdfUri(uri);
        await notifPDFGenere(`${cv.prenom ?? ''} ${cv.nom ?? ''}`);
        setActiveTab('actions');
      }

    } catch (err: any) {
      console.error('Erreur génération:', err);
      Alert.alert('Erreur', 'Impossible de générer le PDF : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!pdfUri) return;

    if (Platform.OS === 'web') {
      const photoData  = await getPhotoData();
      const templateId = cv.templateId ?? 'sidebar_bleu';
      const html       = generateCVHTML(cv, photoData, templateId);
      const nomCV      = `${cv.prenom ?? ''}_${cv.nom ?? ''}`.trim() || 'Mon';
      await genererPDFWeb(html, nomCV);
      return;
    }

    try {
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Télécharger votre CV',
        UTI: 'com.adobe.pdf',
      });
    } catch (e) { console.error(e); }
  };

  const handlePrint = async () => {
    if (Platform.OS === 'web') {
      const photoData  = await getPhotoData();
      const templateId = cv.templateId ?? 'sidebar_bleu';
      const html       = generateCVHTML(cv, photoData, templateId);
      const nomCV      = `${cv.prenom ?? ''}_${cv.nom ?? ''}`.trim() || 'Mon';
      await genererPDFWeb(html, nomCV);
      return;
    }

    try {
      const photoData  = await getPhotoData();
      const templateId = cv.templateId ?? 'sidebar_bleu';
      const html       = generateCVHTML(cv, photoData, templateId);
      await Print.printAsync({ html });
    } catch (e) { console.error(e); }
  };

  const handleSauvegarder = async () => {
    try {
      setSaving(true);
      console.log('=== SAUVEGARDE ===');
      console.log('PRENOM:', cv.prenom);
      console.log('NOM:', cv.nom);

      if (!cv.prenom && !cv.nom) {
        Alert.alert(
          'CV incomplet',
          'Votre CV ne contient pas de nom. Remplissez d\'abord vos informations.',
          [{ text: 'Remplir', onPress: () => router.push('/cv/step1-profil') }]
        );
        return;
      }

      let photoURL = cv.photo;
      if (cv.photo && !cv.photo.startsWith('https') && !cv.photo.startsWith('data:')) {
        photoURL = await uploaderPhoto(cv.photo);
      }

      if (cvIdActuel) {
        Alert.alert(
          'Mettre à jour ou créer ?',
          'Voulez-vous mettre à jour ce CV ou en créer un nouveau ?',
          [
            {
              text: 'Mettre à jour',
              onPress: async () => {
                const id = await sauvegarderCV({ ...cv, photo: photoURL }, cvIdActuel);
                setCvIdActuel(id);
                await notifCVSauvegarde();
                Alert.alert('✅ Mis à jour !', 'Votre CV a été mis à jour.');
              },
            },
            {
              text: 'Nouveau CV',
              onPress: async () => {
                const id = await sauvegarderCV({ ...cv, photo: photoURL });
                setCvIdActuel(id);
                await notifCVSauvegarde();
                Alert.alert('✅ Nouveau CV créé !', 'Disponible dans "Mes CVs".');
              },
            },
            { text: 'Annuler', style: 'cancel' },
          ]
        );
      } else {
        const id = await sauvegarderCV({ ...cv, photo: photoURL });
        setCvIdActuel(id);
        await notifCVSauvegarde();
        Alert.alert('✅ Sauvegardé !', 'Votre CV est disponible dans "Mes CVs".');
      }
    } catch (error: any) {
      console.error('Erreur sauvegarde:', error.message);
      Alert.alert('Erreur', error.message);
    } finally {
      setSaving(false);
    }
  };

  const InfoRow = ({ label, value, color }: { label: string; value: string; color?: string }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, color ? { color } : {}]} numberOfLines={1}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Votre CV</Text>
          <Text style={styles.headerSub} numberOfLines={1}>{nomComplet}</Text>
        </View>
        <TouchableOpacity style={styles.mesCVsBtn} onPress={() => router.push('/mes-cvs')}>
          <Text style={styles.mesCVsText}>📂</Text>
        </TouchableOpacity>
      </View>

      {/* Score */}
      <Animated.View style={[styles.scoreBar, { opacity: fadeAnim }]}>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Complétion du CV</Text>
          <Text style={[styles.scorePct, {
            color: score >= 80 ? '#16a34a' : score >= 50 ? '#f59e0b' : '#dc2626'
          }]}>{String(score)}{'%'}</Text>
        </View>
        <View style={styles.scoreTrack}>
          <View style={[styles.scoreFill, {
            width: `${score}%` as any,
            backgroundColor: score >= 80 ? '#16a34a' : score >= 50 ? '#f59e0b' : '#dc2626',
          }]} />
        </View>
      </Animated.View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'apercu' && styles.tabActive]}
          onPress={() => setActiveTab('apercu')}
        >
          <Text style={[styles.tabText, activeTab === 'apercu' && styles.tabTextActive]}>
            {'👁 Aperçu'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'actions' && styles.tabActive]}
          onPress={() => setActiveTab('actions')}
        >
          <Text style={[styles.tabText, activeTab === 'actions' && styles.tabTextActive]}>
            {'⚡ Actions'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{
          opacity:   fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
        }}>

          {/* ── TAB APERÇU ── */}
          {activeTab === 'apercu' && (
            <>
              <View style={styles.templateCard}>
                <View style={[styles.templatePreview, { backgroundColor: getTemplateColor(cv.templateId ?? '') }]}>
                  <Text style={styles.templateEmoji}>{'🎨'}</Text>
                  {pdfUri ? (
                    <View style={styles.pdfReadyBadge}>
                      <Text style={styles.pdfReadyText}>Prêt</Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.templateInfo}>
                  <Text style={styles.templateNom}>{templateNom}</Text>
                  <Text style={styles.templateDesc}>Template sélectionné</Text>
                  <TouchableOpacity style={styles.changeTemplateBtn} onPress={() => router.push('/templates')}>
                    <Text style={styles.changeTemplateTxt}>Changer →</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>{'📋 Informations'}</Text>
                <InfoRow label="Nom complet" value={nomComplet} />
                <InfoRow label="Titre"       value={cv.titre     || '—'} />
                <InfoRow label="Email"       value={cv.email     || '—'} />
                <InfoRow label="Téléphone"   value={cv.telephone || '—'} />
                <InfoRow label="Ville"       value={cv.ville     || '—'} />
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>{'📊 Sections'}</Text>
                <View style={styles.sectionsGrid}>
                  {[
                    { label: 'Expériences', count: cv.experiences?.length ?? 0, emoji: '💼' },
                    { label: 'Formations',  count: cv.formations?.length  ?? 0, emoji: '🎓' },
                    { label: 'Compétences', count: cv.competences?.length ?? 0, emoji: '⚡' },
                    { label: 'Langues',     count: cv.langues?.length     ?? 0, emoji: '🌍' },
                  ].map((s, i) => (
                    <View key={i} style={[styles.sectionItem, s.count === 0 && styles.sectionEmpty]}>
                      <Text style={styles.sectionEmoji}>{s.emoji}</Text>
                      <Text style={styles.sectionCount}>{String(s.count)}</Text>
                      <Text style={styles.sectionLabel}>{s.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {!pdfUri ? (
                <TouchableOpacity
                  style={[styles.btnGenerer, loading && styles.btnDisabled]}
                  onPress={handleGenerate}
                  disabled={loading}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={styles.btnGenererText}>
                        {Platform.OS === 'web' ? '📄 Télécharger le CV' : '🔄 Générer le PDF'}
                      </Text>
                  }
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.btnDownload} onPress={handleDownload}>
                  <Text style={styles.btnDownloadText}>
                    {Platform.OS === 'web' ? '📄 Retélécharger le CV' : '⬇️ Télécharger le PDF'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* ── TAB ACTIONS ── */}
          {activeTab === 'actions' && (
            <>
              <View style={[styles.statusCard, { borderColor: pdfUri ? '#16a34a' : '#f59e0b' }]}>
                <Text style={styles.statusEmoji}>{pdfUri ? '✅' : '⏳'}</Text>
                <View style={styles.statusInfo}>
                  <Text style={styles.statusTitle}>
                    {pdfUri ? 'CV prêt !' : 'CV non généré'}
                  </Text>
                  <Text style={styles.statusSub}>
                    {pdfUri
                      ? Platform.OS === 'web'
                        ? `${cv.prenom ?? ''}_${cv.nom ?? ''}_CV.html téléchargé`
                        : `${cv.prenom ?? ''}_${cv.nom ?? ''}_CV.pdf`
                      : 'Cliquez sur "Télécharger" pour créer le CV'
                    }
                  </Text>
                </View>
              </View>

              {/* Instruction mobile PWA */}
              {Platform.OS === 'web' && pdfUri && (
                <View style={styles.instructionCard}>
                  <Text style={styles.instructionTitle}>📱 Comment obtenir le PDF coloré ?</Text>
                  <Text style={styles.instructionStep}>1️⃣ Ouvrez le fichier .html téléchargé avec Chrome</Text>
                  <Text style={styles.instructionStep}>2️⃣ Appuyez sur ⋮ → Imprimer</Text>
                  <Text style={styles.instructionStep}>3️⃣ Choisissez "Enregistrer en PDF"</Text>
                  <Text style={styles.instructionStep}>✅ Le PDF aura toutes les couleurs !</Text>
                </View>
              )}

              <View style={styles.card}>
                <Text style={styles.cardTitle}>{'📄 CV'}</Text>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnPrimary, loading && styles.btnDisabled]}
                  onPress={handleGenerate}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Text style={styles.actionBtnIcon}>{'📄'}</Text>
                      <View style={styles.actionBtnInfo}>
                        <Text style={styles.actionBtnTitle}>
                          {pdfUri ? 'Regénérer le CV' : Platform.OS === 'web' ? 'Télécharger le CV' : 'Générer le PDF'}
                        </Text>
                        <Text style={styles.actionBtnSub}>
                          {Platform.OS === 'web'
                            ? 'Télécharge le fichier HTML du CV'
                            : 'Crée un fichier PDF de votre CV'
                          }
                        </Text>
                      </View>
                    </>
                  )}
                </TouchableOpacity>

                {pdfUri ? (
                  <>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleDownload}>
                      <Text style={styles.actionBtnIcon}>{'⬇️'}</Text>
                      <View style={styles.actionBtnInfo}>
                        <Text style={styles.actionBtnTitle}>
                          {Platform.OS === 'web' ? 'Retélécharger le CV' : 'Télécharger / Partager'}
                        </Text>
                        <Text style={styles.actionBtnSub}>
                          {Platform.OS === 'web'
                            ? 'Télécharge à nouveau le fichier CV'
                            : 'Enregistrez ou envoyez le PDF'
                          }
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {Platform.OS !== 'web' && (
                      <TouchableOpacity style={styles.actionBtn} onPress={handlePrint}>
                        <Text style={styles.actionBtnIcon}>{'🖨️'}</Text>
                        <View style={styles.actionBtnInfo}>
                          <Text style={styles.actionBtnTitle}>Imprimer</Text>
                          <Text style={styles.actionBtnSub}>Imprimez directement depuis l'app</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </>
                ) : null}
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>{'☁️ En ligne'}</Text>
                <TouchableOpacity
                  style={[styles.actionBtn, saving && styles.btnDisabled]}
                  onPress={handleSauvegarder}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color={Colors.primary} size="small" />
                  ) : (
                    <>
                      <Text style={styles.actionBtnIcon}>{'💾'}</Text>
                      <View style={styles.actionBtnInfo}>
                        <Text style={styles.actionBtnTitle}>Sauvegarder en ligne</Text>
                        <Text style={styles.actionBtnSub}>Accédez à votre CV depuis n'importe où</Text>
                      </View>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/mes-cvs')}>
                  <Text style={styles.actionBtnIcon}>{'📂'}</Text>
                  <View style={styles.actionBtnInfo}>
                    <Text style={styles.actionBtnTitle}>Mes CVs sauvegardés</Text>
                    <Text style={styles.actionBtnSub}>Retrouvez tous vos CVs en ligne</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>{'✏️ Modifier'}</Text>
                <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/cv/step1-profil')}>
                  <Text style={styles.actionBtnIcon}>{'👤'}</Text>
                  <View style={styles.actionBtnInfo}>
                    <Text style={styles.actionBtnTitle}>Modifier le profil</Text>
                    <Text style={styles.actionBtnSub}>Nom, titre, contact...</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/templates')}>
                  <Text style={styles.actionBtnIcon}>{'🎨'}</Text>
  <View style={styles.actionBtnInfo}>
    <Text style={styles.actionBtnTitle}>Changer de template</Text>
    <Text style={styles.actionBtnSub}>150 designs disponibles</Text>
  </View>
</TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnDanger]}
                  onPress={() => {
                    Alert.alert(
                      'Nouveau CV',
                      'Voulez-vous créer un nouveau CV ? Le CV actuel sera perdu.',
                      [
                        { text: 'Annuler', style: 'cancel' },
                        {
                          text: 'Nouveau CV',
                          style: 'destructive',
                          onPress: () => {
                            useCVStore.getState().reset();
                            router.push('/cv/step1-profil');
                          }
                        },
                      ]
                    );
                  }}
                >
                  <Text style={styles.actionBtnIcon}>{'➕'}</Text>
                  <View style={styles.actionBtnInfo}>
                    <Text style={[styles.actionBtnTitle, { color: '#dc2626' }]}>Nouveau CV</Text>
                    <Text style={styles.actionBtnSub}>Recommencer depuis zéro</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/parametres')}>
                  <Text style={styles.actionBtnIcon}>{'⚙️'}</Text>
                  <View style={styles.actionBtnInfo}>
                    <Text style={styles.actionBtnTitle}>Paramètres</Text>
                    <Text style={styles.actionBtnSub}>Langue, évaluation, partage...</Text>
                  </View>
                </TouchableOpacity>
              </View>

            </>
          )}

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#f5f7fa' },
  header:           { backgroundColor: '#534AB7', paddingTop: 52, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  backBtn:          { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backText:         { color: '#fff', fontSize: 24, fontWeight: '300' },
  headerCenter:     { flex: 1, alignItems: 'center' },
  headerTitle:      { color: '#fff', fontSize: 18, fontWeight: '600' },
  headerSub:        { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  mesCVsBtn:        { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  mesCVsText:       { fontSize: 22 },
  scoreBar:         { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  scoreRow:         { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  scoreLabel:       { fontSize: 12, color: '#555', fontWeight: '500' },
  scorePct:         { fontSize: 12, fontWeight: '700' },
  scoreTrack:       { height: 6, backgroundColor: '#f0f0f0', borderRadius: 3 },
  scoreFill:        { height: 6, borderRadius: 3 },
  tabs:             { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tab:              { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive:        { borderBottomWidth: 2, borderBottomColor: '#534AB7' },
  tabText:          { fontSize: 14, color: '#888', fontWeight: '500' },
  tabTextActive:    { color: '#534AB7', fontWeight: '700' },
  content:          { padding: 16, gap: 14, paddingBottom: 40 },
  templateCard:     { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', flexDirection: 'row', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  templatePreview:  { width: 100, height: 110, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  templateEmoji:    { fontSize: 32 },
  pdfReadyBadge:    { position: 'absolute', bottom: 6, left: 6, right: 6, backgroundColor: '#16a34a', borderRadius: 6, paddingVertical: 2, alignItems: 'center' },
  pdfReadyText:     { color: '#fff', fontSize: 9, fontWeight: '700' },
  templateInfo:     { flex: 1, padding: 14, justifyContent: 'center', gap: 4 },
  templateNom:      { fontSize: 15, fontWeight: '700', color: '#111' },
  templateDesc:     { fontSize: 11, color: '#888' },
  changeTemplateBtn:{ marginTop: 8, backgroundColor: '#534AB71A', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, alignSelf: 'flex-start' },
  changeTemplateTxt:{ fontSize: 12, color: '#534AB7', fontWeight: '600' },
  card:             { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  cardTitle:        { fontSize: 13, fontWeight: '700', color: '#111', marginBottom: 4 },
  infoRow:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  infoLabel:        { fontSize: 12, color: '#888' },
  infoValue:        { fontSize: 12, fontWeight: '600', color: '#111', maxWidth: '60%', textAlign: 'right' },
  sectionsGrid:     { flexDirection: 'row', gap: 8 },
  sectionItem:      { flex: 1, backgroundColor: '#f0f4ff', borderRadius: 12, padding: 10, alignItems: 'center', gap: 2 },
  sectionEmpty:     { backgroundColor: '#f5f5f5' },
  sectionEmoji:     { fontSize: 18 },
  sectionCount:     { fontSize: 18, fontWeight: '800', color: '#534AB7' },
  sectionLabel:     { fontSize: 9, color: '#888', textAlign: 'center' },
  btnGenerer:       { backgroundColor: '#534AB7', borderRadius: 16, paddingVertical: 18, alignItems: 'center', elevation: 4, shadowColor: '#534AB7', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 },
  btnGenererText:   { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnDownload:      { backgroundColor: '#16a34a', borderRadius: 16, paddingVertical: 18, alignItems: 'center', elevation: 4, shadowColor: '#16a34a', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 },
  btnDownloadText:  { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnDisabled:      { opacity: 0.55 },
  statusCard:       { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 2, elevation: 2 },
  statusEmoji:      { fontSize: 32 },
  statusInfo:       { flex: 1 },
  statusTitle:      { fontSize: 14, fontWeight: '700', color: '#111' },
  statusSub:        { fontSize: 11, color: '#888', marginTop: 2 },
  instructionCard:  { backgroundColor: '#eff6ff', borderRadius: 12, padding: 14, gap: 6, borderWidth: 1, borderColor: '#bfdbfe' },
  instructionTitle: { fontSize: 13, fontWeight: '700', color: '#1e40af', marginBottom: 4 },
  instructionStep:  { fontSize: 12, color: '#374151', lineHeight: 20 },
  actionBtn:        { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  actionBtnPrimary: { backgroundColor: '#534AB71A', borderRadius: 12, padding: 12, borderBottomWidth: 0 },
  actionBtnDanger:  { borderBottomWidth: 0 },
  actionBtnIcon:    { fontSize: 24, width: 36, textAlign: 'center' },
  actionBtnInfo:    { flex: 1 },
  actionBtnTitle:   { fontSize: 13, fontWeight: '600', color: '#111' },
  actionBtnSub:     { fontSize: 11, color: '#888', marginTop: 2 },
});