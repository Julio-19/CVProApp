import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { useCVStore } from '../store/cvStore';
import Svg, { Rect, Circle } from 'react-native-svg';
import { supabase } from '../config/supabase';

type Template = {
  id: string;
  nom: string;
  prix: number;
  description: string;
};

const TEMPLATES: Template[] = [
  { id: 'sidebar_bleu',   nom: 'Sidebar Bleu',    prix: 1000, description: 'Sidebar bleu classique' },
  { id: 'minimaliste',    nom: 'Minimaliste',      prix: 1000, description: 'Noir et blanc épuré' },
  { id: 'teal_student',   nom: 'Teal Étudiant',    prix: 1000, description: 'Header teal moderne' },
  { id: 'classique_pro',  nom: 'Classique Pro',    prix: 1000, description: 'Layout sobre et élégant' },
  { id: 'gagnant',        nom: 'CV Gagnant',       prix: 1500, description: 'Sidebar gris + bleu marine' },
  { id: 'fresher_vert',   nom: 'Fresher Vert',     prix: 1500, description: 'Photo + nom vert' },
  { id: 'bleu_arrondi',   nom: 'Bleu Arrondi',     prix: 2000, description: 'Gradient bleu arrondi' },
  { id: 'fresher_dark',   nom: 'Fresher Dark',     prix: 1500, description: 'Sidebar dark navy' },
  { id: 'geometrique',    nom: 'Géométrique',      prix: 2000, description: 'Coins orange et bleu' },
  { id: 'bold_noir',      nom: 'Bold Noir',        prix: 2000, description: 'Photo pleine largeur noire' },
  { id: 'dark_sidebar',   nom: 'Dark Sidebar',     prix: 1500, description: 'Sidebar très sombre' },
  { id: 'violet',         nom: 'Violet',           prix: 2000, description: 'Fond violet entier' },
  { id: 'navy_pro',       nom: 'Navy Pro',         prix: 1500, description: 'Navy professionnel' },
  { id: 'vert_nature',    nom: 'Vert Nature',      prix: 2000, description: 'Vert forêt + beige' },
  { id: 'brun_elegant',   nom: 'Brun Élégant',     prix: 2500, description: 'Sidebar sombre + doré' },
  { id: 'teal_banner',    nom: 'Teal Banner',      prix: 1500, description: 'Bandeau teal moderne' },
  { id: 'bleu_jaune',     nom: 'Bleu & Jaune',     prix: 2000, description: 'Blue navy et jaune vif' },
  { id: 'gris_arche',     nom: 'Gris Arche',       prix: 2000, description: 'Arche grise élégante' },
  { id: 'vert_diamant',   nom: 'Vert Diamant',     prix: 2000, description: 'Formes vert géométrique' },
  { id: 'dark_rouge',     nom: 'Dark Rouge',       prix: 2500, description: 'Sombre avec rouge vif' },
  { id: 'noir_blob',      nom: 'Noir Blob',        prix: 2000, description: 'Formes arrondies noir' },
  { id: 'wave_cyan',      nom: 'Wave Cyan',        prix: 2000, description: 'Vagues cyan et bleu' },
  { id: 'gris_wave',      nom: 'Gris Wave',        prix: 1500, description: 'Sidebar gris sobre' },
  { id: 'teal_cercle',    nom: 'Teal Cercle',      prix: 1500, description: 'Cercle teal en-tête' },
  { id: 'orange_minimal', nom: 'Orange Minimal',   prix: 1500, description: 'Orange et blanc épuré' },
  { id: 'noir_jaune',     nom: 'Noir & Jaune',     prix: 2500, description: 'Contraste noir et jaune' },
  { id: 'dore_dark',      nom: 'Doré Dark',        prix: 2500, description: 'Sidebar sombre doré' },
  { id: 'brun_rose',      nom: 'Brun & Rose',      prix: 2000, description: 'Brun chocolat et rose' },
  { id: 'gris_vague',     nom: 'Gris Vague',       prix: 1500, description: 'Vague grise sidebar' },
  { id: 'geo_orange',     nom: 'Géo Orange',       prix: 2000, description: 'Triangles bleu et orange' },
  { id: 'dore_sidebar',   nom: 'Doré Sidebar',     prix: 2500, description: 'Sidebar sombre doré v2' },
  { id: 'navy_wave',      nom: 'Navy Wave',        prix: 2000, description: 'Vague navy moderne' },
  { id: 'dark_dore2',     nom: 'Dark Doré 2',      prix: 2500, description: 'Dark avec accents dorés' },
  { id: 'dark_gris',      nom: 'Dark Gris',        prix: 2000, description: 'Dark gris épuré' },
  { id: 'wave_noir',      nom: 'Wave Noir',        prix: 2000, description: 'Vague noire moderne' },
  { id: 'rouge_moderne',  nom: 'Rouge Moderne',    prix: 2000, description: 'Bandeau rouge vif' },
  { id: 'jaune_pro',      nom: 'Jaune Pro',        prix: 2000, description: 'Jaune et noir contrasté' },
  { id: 'vert_minimal',   nom: 'Vert Minimal',     prix: 1500, description: 'Vert forêt épuré' },
  { id: 'orange_sidebar', nom: 'Orange Sidebar',   prix: 1500, description: 'Sidebar orange vif' },
  { id: 'rose_elegant',   nom: 'Rose Élégant',     prix: 2000, description: 'Rose poudré élégant' },
  { id: 'dark_orange',    nom: 'Dark Orange',      prix: 2500, description: 'Fond sombre + orange' },

  
  { id: 'crimson_pro',      nom: 'Crimson Pro',       prix: 1500, description: 'Corporate' },
  { id: 'ocean_blue',       nom: 'Ocean Blue',         prix: 1500,  description: 'Moderne' },
  { id: 'slate_modern',     nom: 'Slate Modern',       prix: 2000, description: 'Tech' },
  { id: 'emerald_tech',     nom: 'Emerald Tech',       prix: 2000, description: 'Tech' },
  { id: 'sunset_warm',      nom: 'Sunset Warm',        prix: 1500, description: 'Créatif' },
  { id: 'arctic_white',     nom: 'Arctic White',       prix: 1000, description: 'Minimal' },
  { id: 'midnight_pro',     nom: 'Midnight Pro',       prix: 2000, description: 'Luxe' },
  { id: 'copper_elegant',   nom: 'Copper Elegant',     prix: 2000, description: 'Luxe' },
  { id: 'forest_green',     nom: 'Forest Green',       prix: 1500, description: 'Nature' },
  { id: 'royal_purple',     nom: 'Royal Purple',       prix: 2000, description: 'Luxe' },
  { id: 'sand_minimal',     nom: 'Sand Minimal',       prix: 1000, description: 'Minimal' },
  { id: 'tech_dark',        nom: 'Tech Dark',          prix: 2500, description: 'Tech' },
  { id: 'coral_fresh',      nom: 'Coral Fresh',        prix: 1500, description: 'Créatif' },
  { id: 'gold_black',       nom: 'Gold & Black',       prix: 2500, description: 'Luxe' },
  { id: 'mint_clean',       nom: 'Mint Clean',         prix: 1000, description: 'Minimal' },
  { id: 'burgundy_classic', nom: 'Burgundy Classic',   prix: 1500, description: 'Corporate' },
  { id: 'sky_creative',     nom: 'Sky Creative',       prix: 1500, description: 'Créatif' },
  { id: 'charcoal_pro',     nom: 'Charcoal Pro',       prix: 2000, description: 'Corporate' },
  { id: 'peach_soft',       nom: 'Peach Soft',         prix: 1000, description: 'Doux' },
  { id: 'indigo_modern',    nom: 'Indigo Modern',      prix: 2000, description: 'Moderne' },
  { id: 'olive_natural',    nom: 'Olive Natural',      prix: 1500, description: 'Nature' },
  { id: 'ruby_luxe',        nom: 'Ruby Luxe',          prix: 2500, description: 'Luxe' },
  { id: 'steel_corporate',  nom: 'Steel Corporate',    prix: 2000, description: 'Corporate' },
  { id: 'lavender_soft',    nom: 'Lavender Soft',      prix: 1000, description: 'Doux' },
  { id: 'amber_warm',       nom: 'Amber Warm',         prix: 1500, description: 'Chaud' },
  { id: 'ink_minimal',      nom: 'Ink Minimal',        prix: 1000, description: 'Minimal' },
  { id: 'azure_clean',      nom: 'Azure Clean',        prix: 1500, description: 'Moderne' },
  { id: 'mahogany_rich',    nom: 'Mahogany Rich',      prix: 2000, description: 'Luxe' },
  { id: 'lime_tech',        nom: 'Lime Tech',          prix: 2000, description: 'Tech' },
  { id: 'plum_elegant',     nom: 'Plum Elegant',       prix: 2000, description: 'Luxe' },
  { id: 'graphite_pro',     nom: 'Graphite Pro',       prix: 1500, description: 'Corporate' },
  { id: 'jade_fresh',       nom: 'Jade Fresh',         prix: 1500, description: 'Nature' },
  { id: 'terracotta_warm',  nom: 'Terracotta Warm',    prix: 1500, description: 'Chaud' },
  { id: 'cobalt_modern',    nom: 'Cobalt Modern',      prix: 2000, description: 'Moderne' },
  { id: 'cream_luxe',       nom: 'Cream Luxe',         prix: 2000, description: 'Luxe' },
  { id: 'carbon_tech',      nom: 'Carbon Tech',        prix: 2500, description: 'Tech' },
  { id: 'sage_minimal',     nom: 'Sage Minimal',       prix: 1000, description: 'Minimal' },
  { id: 'wine_classic',     nom: 'Wine Classic',       prix: 1500, description: 'Classic' },
  { id: 'topaz_bright',     nom: 'Topaz Bright',       prix: 1500, description: 'Coloré' },
  { id: 'ebony_gold',       nom: 'Ebony Gold',         prix: 2500, description: 'Luxe' },
  { id: 'blush_modern',     nom: 'Blush Modern',       prix: 1000, description: 'Doux' },
  { id: 'pine_forest',      nom: 'Pine Forest',        prix: 1500, description: 'Nature' },
  { id: 'denim_casual',     nom: 'Denim Casual',       prix: 1000, description: 'Décontracté' },
  { id: 'rose_gold',        nom: 'Rose Gold',          prix: 2500, description: 'Luxe' },
  { id: 'space_dark',       nom: 'Space Dark',         prix: 2000, description: 'Tech' },
  { id: 'citrus_fresh',     nom: 'Citrus Fresh',       prix: 1000, description: 'Coloré' },
  { id: 'mocha_warm',       nom: 'Mocha Warm',         prix: 1500, description: 'Chaud' },
  { id: 'glacier_cool',     nom: 'Glacier Cool',       prix: 1500, description: 'Cool' },
  { id: 'amber_dark',       nom: 'Amber Dark',         prix: 2000, description: 'Sombre' },
  { id: 'electric_blue',    nom: 'Electric Blue',      prix: 2000, description: 'Coloré' },
  { id: 'dusty_rose',       nom: 'Dusty Rose',         prix: 1000, description: 'Doux' },
  { id: 'forest_dark',      nom: 'Forest Dark',        prix: 1500, description: 'Nature' },
  { id: 'ivory_classic',    nom: 'Ivory Classic',      prix: 1500, description: 'Classic' },
  { id: 'neon_dark',        nom: 'Neon Dark',          prix: 2500, description: 'Tech' },
  { id: 'sepia_vintage',    nom: 'Sepia Vintage',      prix: 2000, description: 'Vintage' },
  { id: 'arctic_dark',      nom: 'Arctic Dark',        prix: 2000, description: 'Sombre' },
  { id: 'blaze_orange',     nom: 'Blaze Orange',       prix: 1500, description: 'Coloré' },
  { id: 'storm_grey',       nom: 'Storm Grey',         prix: 1500, description: 'Corporate' },
  { id: 'spring_green',     nom: 'Spring Green',       prix: 1000, description: 'Nature' },
  { id: 'velvet_dark',      nom: 'Velvet Dark',        prix: 2500, description: 'Luxe' },

  { id: 'aurora_dark',      nom: 'Aurora Dark',       prix: 2500, description: 'Luxe' },
{ id: 'metro_pro',        nom: 'Metro Pro',          prix: 2000, description: 'Corporate' },
{ id: 'bamboo_zen',       nom: 'Bamboo Zen',         prix: 2000, description: 'Artistique' },
{ id: 'chrome_tech',      nom: 'Chrome Tech',        prix: 2000, description: 'Tech' },
{ id: 'sahara_warm',      nom: 'Sahara Warm',        prix: 1500, description: 'Chaud' },
{ id: 'nordic_clean',     nom: 'Nordic Clean',       prix: 1500, description: 'Minimal' },
{ id: 'galaxy_dark',      nom: 'Galaxy Dark',        prix: 2500, description: 'Sombre' },
{ id: 'terrace_med',      nom: 'Terrace Med',        prix: 1500, description: 'Nature' },
{ id: 'flamingo_pink',    nom: 'Flamingo Pink',      prix: 1500, description: 'Coloré' },
{ id: 'titanium_pro',     nom: 'Titanium Pro',       prix: 2000, description: 'Tech' },
{ id: 'canopy_green',     nom: 'Canopy Green',       prix: 1500, description: 'Nature' },
{ id: 'brick_warm',       nom: 'Brick Warm',         prix: 1500, description: 'Chaud' },
{ id: 'diamond_luxe',     nom: 'Diamond Luxe',       prix: 2500, description: 'Luxe' },
{ id: 'arctic_pro',       nom: 'Arctic Pro',         prix: 2000, description: 'Cool' },
{ id: 'volcano_dark',     nom: 'Volcano Dark',       prix: 2500, description: 'Sombre' },
{ id: 'spring_blossom',   nom: 'Spring Blossom',     prix: 1000, description: 'Doux' },
{ id: 'urban_grey',       nom: 'Urban Grey',         prix: 1500, description: 'Corporate' },
{ id: 'tropics_fresh',    nom: 'Tropics Fresh',      prix: 1500, description: 'Nature' },
{ id: 'onyx_gold',        nom: 'Onyx Gold',          prix: 2500, description: 'Luxe' },
{ id: 'pastel_dream',     nom: 'Pastel Dream',       prix: 1000, description: 'Doux' },
{ id: 'ninja_dark',       nom: 'Ninja Dark',         prix: 2000, description: 'Sombre' },
{ id: 'lemon_zest',       nom: 'Lemon Zest',         prix: 1000, description: 'Coloré' },
{ id: 'marble_luxe',      nom: 'Marble Luxe',        prix: 2500, description: 'Luxe' },
{ id: 'rust_bold',        nom: 'Rust Bold',          prix: 1500, description: 'Chaud' },
{ id: 'lagoon_blue',      nom: 'Lagoon Blue',        prix: 1500, description: 'Cool' },
{ id: 'obsidian_pro',     nom: 'Obsidian Pro',       prix: 2000, description: 'Tech' },
{ id: 'meadow_soft',      nom: 'Meadow Soft',        prix: 1000, description: 'Nature' },
{ id: 'prism_colorful',   nom: 'Prism Colorful',     prix: 2000, description: 'Coloré' },
{ id: 'shadow_dark',      nom: 'Shadow Dark',        prix: 1500, description: 'Sombre' },
{ id: 'cotton_soft',      nom: 'Cotton Soft',        prix: 1000, description: 'Doux' },
{ id: 'thunder_dark',     nom: 'Thunder Dark',       prix: 2000, description: 'Sombre' },
{ id: 'cactus_green',     nom: 'Cactus Green',       prix: 1500, description: 'Nature' },
{ id: 'pearl_white',      nom: 'Pearl White',        prix: 2000, description: 'Luxe' },
{ id: 'lava_hot',         nom: 'Lava Hot',           prix: 2000, description: 'Sombre' },
{ id: 'monsoon_blue',     nom: 'Monsoon Blue',       prix: 1500, description: 'Cool' },
{ id: 'bronze_classic',   nom: 'Bronze Classic',     prix: 2000, description: 'Luxe' },
{ id: 'sakura_pink',      nom: 'Sakura Pink',        prix: 1000, description: 'Doux' },
{ id: 'matrix_green',     nom: 'Matrix Green',       prix: 2500, description: 'Tech' },
{ id: 'dusk_purple',      nom: 'Dusk Purple',        prix: 2000, description: 'Artistique' },
{ id: 'glacier_white',    nom: 'Glacier White',      prix: 1500, description: 'Cool' },
{ id: 'cedar_warm',       nom: 'Cedar Warm',         prix: 1500, description: 'Chaud' },
{ id: 'phantom_dark',     nom: 'Phantom Dark',       prix: 2000, categorie: 'Sombre' },
{ id: 'papaya_bright',    nom: 'Papaya Bright',      prix: 1000, categorie: 'Coloré' },
{ id: 'steel_blue',       nom: 'Steel Blue',         prix: 2000, categorie: 'Tech' },
{ id: 'noir_rose',        nom: 'Noir Rose',          prix: 2000, categorie: 'Artistique' },
{ id: 'zen_minimal',      nom: 'Zen Minimal',        prix: 1000, categorie: 'Minimal' },
{ id: 'fire_dark',        nom: 'Fire Dark',          prix: 2000, categorie: 'Sombre' },
{ id: 'cloud_soft',       nom: 'Cloud Soft',         prix: 1000, categorie: 'Doux' },
{ id: 'harbor_blue',      nom: 'Harbor Blue',        prix: 1500, categorie: 'Cool' },
];

const SIDEBAR_COLORS: Record<string, string> = {
  sidebar_bleu: '#1a3a5c', minimaliste: '#111', teal_student: '#3d9b8a',
  classique_pro: '#555', gagnant: '#1a3a5c', fresher_vert: '#2d5a27',
  bleu_arrondi: '#2563eb', fresher_dark: '#1a2744', geometrique: '#e85d30',
  bold_noir: '#111', dark_sidebar: '#2c2c2c', violet: '#6b21a8',
  navy_pro: '#1e3a6e', vert_nature: '#1e3422', brun_elegant: '#2a2520',
  teal_banner: '#5b9fa0', bleu_jaune: '#1a2f6e', gris_arche: '#5a5a5a',
  vert_diamant: '#2d5a1b', dark_rouge: '#1a0a0a', noir_blob: '#0a0a0a',
  wave_cyan: '#0891b2', gris_wave: '#4b5563', teal_cercle: '#0f766e',
  orange_minimal: '#ea580c', noir_jaune: '#1a1a1a', dore_dark: '#1c1a12',
  brun_rose: '#5c3d2e', gris_vague: '#64748b', geo_orange: '#0f172a',
  dore_sidebar: '#292524', navy_wave: '#0f2952', dark_dore2: '#18130a',
  dark_gris: '#1f2937', wave_noir: '#0f172a', rouge_moderne: '#dc2626',
  jaune_pro: '#111', vert_minimal: '#14532d', orange_sidebar: '#ea580c',
  rose_elegant: '#831843', dark_orange: '#0c0a09',
};

const MiniatureSVG = ({ templateId, dejaAchete }: { templateId: string; dejaAchete: boolean }) => {
  const w = 100, h = 130;
  const color = SIDEBAR_COLORS[templateId] ?? '#534AB7';
  const sw = 35;

  return (
    <Svg width={w} height={h}>
      <Rect width={w} height={h} fill="#f8f8f8" />
      <Rect width={sw} height={h} fill={color} />
      <Circle cx={sw / 2} cy={20} r={11} fill="rgba(255,255,255,0.3)" />
      {[36, 48, 60, 72, 84].map((y, i) => (
        <Rect key={i} x={5} y={y} width={sw - 10} height={3} rx={1.5} fill="rgba(255,255,255,0.4)" />
      ))}
      {[15, 28, 42, 56, 70, 84, 98].map((y, i) => (
        <Rect key={i} x={sw + 8} y={y} width={w - sw - 16} height={3} rx={1.5}
          fill={color} opacity={i === 0 ? 0.8 : 0.15} />
      ))}
      {dejaAchete && (
        <>
          <Rect width={w} height={h} fill="rgba(22,163,74,0.12)" />
        </>
      )}
    </Svg>
  );
};

export default function TemplatesScreen() {
  const { setTemplate, templateId: templateActuel } = useCVStore();
  const [filtre, setFiltre] = useState<'tous' | 'gratuits' | 'achetes'>('tous');
  const [achetes, setAchetes] = useState<string[]>([]);
  const [loadingAchetes, setLoadingAchetes] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    chargerAchetes();
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const chargerAchetes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('templates_achetes')
        .select('template_id')
        .eq('user_id', user.id);
      setAchetes((data ?? []).map((r: any) => r.template_id));
    } finally {
      setLoadingAchetes(false);
    }
  };

  const templatesFiltres = TEMPLATES.filter(t => {
    if (filtre === 'gratuits') return false; // aucun gratuit
    if (filtre === 'achetes')  return achetes.includes(t.id);
    return true;
  });

  const handleChoisir = (t: Template) => {
    if (achetes.includes(t.id)) {
      // Déjà acheté → utiliser directement
      setTemplate(t.id);
      router.push('/saved');
    } else {
      // Aller au paiement
      router.push({ pathname: '/paiement', params: { templateId: t.id, prix: t.prix } });
    }
  };

  const renderTemplate = ({ item: t }: { item: Template }) => {
    const selectionne = t.id === templateActuel;
    const dejaAchete  = achetes.includes(t.id);

    return (
      <TouchableOpacity
        style={[styles.card, selectionne && styles.cardSelected, dejaAchete && styles.cardAchete]}
        onPress={() => handleChoisir(t)}
        activeOpacity={0.85}
      >
        <View style={styles.preview}>
          <MiniatureSVG templateId={t.id} dejaAchete={dejaAchete} />

          {selectionne && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>✓</Text>
            </View>
          )}

          {dejaAchete ? (
            <View style={[styles.prixBadge, styles.acheteBadge]}>
              <Text style={styles.prixBadgeText}>✓ Acheté</Text>
            </View>
          ) : (
            <View style={styles.prixBadge}>
              <Text style={styles.prixBadgeText}>{t.prix.toLocaleString()} XOF</Text>
            </View>
          )}
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardNom} numberOfLines={1}>{t.nom}</Text>
          <Text style={styles.cardDesc} numberOfLines={1}>{t.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Choisir un template</Text>
          <Text style={styles.headerSub}>{TEMPLATES.length} designs disponibles</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Filtres */}
      <View style={styles.filtres}>
        {([
          { key: 'tous',     label: 'Tous' },
          { key: 'achetes',  label: `Mes achats (${achetes.length})` },
          { key: 'gratuits', label: 'Gratuits' },
        ] as const).map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filtreBtn, filtre === f.key && styles.filtreBtnActive]}
            onPress={() => setFiltre(f.key)}
          >
            <Text style={[styles.filtreTxt, filtre === f.key && styles.filtreTxtActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Message aucun gratuit */}
      {filtre === 'gratuits' && (
        <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
          <Text style={styles.emptyEmoji}>🔒</Text>
          <Text style={styles.emptyTitle}>Aucun template gratuit</Text>
          <Text style={styles.emptySub}>
            Tous nos templates sont premium.{'\n'}
            Prix à partir de 1 000 XOF seulement.
          </Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => setFiltre('tous')}>
            <Text style={styles.emptyBtnText}>Voir tous les templates →</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Message aucun achat */}
      {filtre === 'achetes' && achetes.length === 0 && (
        <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
          <Text style={styles.emptyEmoji}>🛍️</Text>
          <Text style={styles.emptyTitle}>Aucun achat pour l'instant</Text>
          <Text style={styles.emptySub}>
            Achetez un template pour le retrouver ici et l'utiliser sans limites.
          </Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => setFiltre('tous')}>
            <Text style={styles.emptyBtnText}>Parcourir les templates →</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Grille */}
      {filtre !== 'gratuits' && (filtre !== 'achetes' || achetes.length > 0) && (
        <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
          <FlatList
            data={templatesFiltres}
            keyExtractor={t => t.id}
            numColumns={2}
            renderItem={renderTemplate}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      )}

      {/* Footer */}
      {templateActuel && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.continuerBtn} onPress={() => router.push('/saved')}>
            <Text style={styles.continuerTxt}>Générer mon CV →</Text>
          </TouchableOpacity>
        </View>
      )}
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
  filtres:          { flexDirection: 'row', padding: 12, gap: 8, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  filtreBtn:        { flex: 1, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', alignItems: 'center' },
  filtreBtnActive:  { backgroundColor: '#534AB7' },
  filtreTxt:        { fontSize: 12, color: '#555', fontWeight: '500' },
  filtreTxtActive:  { color: '#fff' },
  emptyContainer:   { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
  emptyEmoji:       { fontSize: 56 },
  emptyTitle:       { fontSize: 20, fontWeight: '800', color: '#111', textAlign: 'center' },
  emptySub:         { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 22 },
  emptyBtn:         { backgroundColor: '#534AB7', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 28 },
  emptyBtnText:     { color: '#fff', fontSize: 14, fontWeight: '700' },
  grid:             { padding: 10, paddingBottom: 24 },
  card:             { flex: 1, margin: 5, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent', elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  cardSelected:     { borderColor: '#534AB7' },
  cardAchete:       { borderColor: '#16a34a' },
  preview:          { height: 130, backgroundColor: '#f8f8f8', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  selectedBadge:    { position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: '#534AB7', alignItems: 'center', justifyContent: 'center' },
  selectedBadgeText:{ color: '#fff', fontSize: 12, fontWeight: '700' },
  prixBadge:        { position: 'absolute', bottom: 6, left: 6, backgroundColor: '#534AB7', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  acheteBadge:      { backgroundColor: '#16a34a' },
  prixBadgeText:    { color: '#fff', fontSize: 9, fontWeight: '700' },
  cardInfo:         { padding: 8 },
  cardNom:          { fontSize: 12, fontWeight: '600', color: '#1a1a1a' },
  cardDesc:         { fontSize: 10, color: '#888', marginTop: 2 },
  footer:           { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  continuerBtn:     { backgroundColor: '#534AB7', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  continuerTxt:     { color: '#fff', fontSize: 16, fontWeight: '600' },
});