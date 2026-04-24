import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ActivityIndicator, Animated, RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../config/supabase';
import { useCVStore } from '../store/cvStore';

type CVSauvegarde = {
  id: string;
  prenom: string;
  nom: string;
  titre: string;
  template_id: string;
  created_at: string;
  updated_at: string;
  experiences: any[];
  formations: any[];
  competences: string[];
};

const TEMPLATE_COLORS: Record<string, string> = {
  sidebar_bleu: '#1a3a5c', gagnant: '#1a3a5c', minimaliste: '#111',
  teal_student: '#3d9b8a', dark_sidebar: '#2c2c2c', violet: '#6b21a8',
  classique_pro: '#6b7280', bold_noir: '#111', bleu_arrondi: '#2563eb',
  brun_elegant: '#2a2520', fresher_vert: '#2d5a27', geometrique: '#e85d30',
  vert_nature: '#1e3422', navy_pro: '#1e3a6e', fresher_dark: '#1a2744',
  rouge_moderne: '#dc2626', jaune_pro: '#ca8a04', vert_minimal: '#14532d',
  orange_sidebar: '#ea580c', rose_elegant: '#831843', dark_orange: '#f97316',
};

export default function MesCVsScreen() {
  const [cvs, setCvs]           = useState<CVSauvegarde[]>([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const setField    = useCVStore(s => s.setField);
  const setTemplate = useCVStore(s => s.setTemplate);
  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const slideAnim   = useRef(new Animated.Value(20)).current;

  useEffect(() => { chargerCVs(); }, []);

const chargerCVs = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace('/login'); return; }

    console.log('📂 Chargement CVs pour user:', user.id);

    const { data, error } = await supabase
      .from('cvs')
      .select(`
        id,
        prenom,
        nom,
        titre,
        template_id,
        created_at,
        updated_at,
        experiences,
        formations,
        competences
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Erreur CVs:', error.message);
      Alert.alert('Erreur', error.message);
      return;
    }

    console.log('✅ CVs trouvés:', data?.length ?? 0);
    data?.forEach((cv, i) => {
      console.log(`CV ${i+1}: ${cv.prenom} ${cv.nom} | ${cv.titre} | ${cv.template_id}`);
    });

    setCvs(data ?? []);

    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
    ]).start();

  } catch (error: any) {
    console.error('Erreur:', error.message);
    Alert.alert('Erreur', error.message);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};
  const onRefresh = () => { setRefreshing(true); chargerCVs(); };

  const ouvrirCV = async (cv: CVSauvegarde) => {
  try {
    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', cv.id)
      .single();

    if (error) throw error;

    // Charger dans le store
    const fields: Record<string, any> = {
      prenom:         data.prenom         ?? '',
      nom:            data.nom            ?? '',
      email:          data.email          ?? '',
      telephone:      data.telephone      ?? '',
      ville:          data.ville          ?? '',
      titre:          data.titre          ?? '',
      objectif:       data.objectif       ?? '',
      photo:          data.photo_url      ?? null,  // ← photo_url → photo
      experiences:    data.experiences    ?? [],
      formations:     data.formations     ?? [],
      competences:    data.competences    ?? [],
      langues:        data.langues        ?? [],
      loisirs:        data.loisirs        ?? [],
      reseaux:        data.reseaux        ?? [],
      certifications: data.certifications ?? [],
      projets:        data.projets        ?? [],
    };

    Object.entries(fields).forEach(([key, value]) => {
      (setField as any)(key, value);
    });

    setTemplate(data.template_id ?? 'sidebar_bleu');
    router.push('/saved');
  } catch (error: any) {
    Alert.alert('Erreur', error.message);
  }
};

  const supprimerCV = (cv: CVSauvegarde) => {
    Alert.alert(
      'Supprimer ce CV ?',
      `${cv.prenom} ${cv.nom} — ${cv.titre || 'Sans titre'}`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.from('cvs').delete().eq('id', cv.id);
            if (error) { Alert.alert('Erreur', error.message); return; }
            setCvs(prev => prev.filter(c => c.id !== cv.id));
          },
        },
      ]
    );
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const getColor = (templateId: string) => TEMPLATE_COLORS[templateId] ?? '#534AB7';

  const getInitiales = (prenom: string, nom: string) =>
    `${prenom?.[0] ?? ''}${nom?.[0] ?? ''}`.toUpperCase() || '?';

  const renderCV = ({ item: cv, index }: { item: CVSauvegarde; index: number }) => {
    const color    = getColor(cv.template_id);
    const initials = getInitiales(cv.prenom, cv.nom);

    return (
      <Animated.View style={[
        styles.card,
        {
          opacity:   fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}>
        <TouchableOpacity
          style={styles.cardInner}
          onPress={() => ouvrirCV(cv)}
          activeOpacity={0.85}
        >
          {/* Avatar */}
          <View style={[styles.avatar, { backgroundColor: color }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          {/* Infos */}
          <View style={styles.cardInfo}>
            <Text style={styles.cardName} numberOfLines={1}>
              {cv.prenom} {cv.nom}
            </Text>
            <Text style={styles.cardTitre} numberOfLines={1}>
              {cv.titre || 'Sans titre'}
            </Text>

            {/* Stats */}
            <View style={styles.statsRow}>
              {[
                { n: cv.experiences?.length ?? 0, l: 'exp' },
                { n: cv.formations?.length ?? 0,  l: 'form' },
                { n: cv.competences?.length ?? 0, l: 'comp' },
              ].map((s, i) => (
                <View key={i} style={styles.statItem}>
                  <Text style={styles.statNum}>{s.n}</Text>
                  <Text style={styles.statLbl}>{s.l}</Text>
                </View>
              ))}
            </View>

            {/* Template badge + date */}
            <View style={styles.cardMeta}>
              <View style={[styles.badge, { backgroundColor: color + '22' }]}>
                <Text style={[styles.badgeText, { color }]}>
                  {cv.template_id?.replace(/_/g, ' ')}
                </Text>
              </View>
              <Text style={styles.cardDate}>{formatDate(cv.updated_at)}</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: color + '15' }]}
              onPress={() => ouvrirCV(cv)}
            >
              <Text style={[styles.actionIcon, { color }]}>↗</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => supprimerCV(cv)}
            >
              <Text style={styles.deleteIcon}>🗑</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
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
          <Text style={styles.headerTitle}>Mes CVs</Text>
          <Text style={styles.headerSub}>
            {cvs.length} CV{cvs.length > 1 ? 's' : ''} sauvegardé{cvs.length > 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <Text style={styles.refreshText}>↺</Text>
        </TouchableOpacity>
      </View>

      {/* Stats globales */}
      {!loading && cvs.length > 0 && (
        <View style={styles.globalStats}>
          <View style={styles.globalStat}>
            <Text style={styles.globalStatNum}>{cvs.length}</Text>
            <Text style={styles.globalStatLbl}>CVs</Text>
          </View>
          <View style={styles.globalStatDivider} />
          <View style={styles.globalStat}>
            <Text style={styles.globalStatNum}>
              {new Set(cvs.map(c => c.template_id)).size}
            </Text>
            <Text style={styles.globalStatLbl}>Templates</Text>
          </View>
          <View style={styles.globalStatDivider} />
          <View style={styles.globalStat}>
            <Text style={styles.globalStatNum}>
              {cvs.reduce((acc, c) => acc + (c.experiences?.length ?? 0), 0)}
            </Text>
            <Text style={styles.globalStatLbl}>Expériences</Text>
          </View>
        </View>
      )}

      {/* Contenu */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#534AB7" />
          <Text style={styles.loadingText}>Chargement de vos CVs...</Text>
        </View>
      ) : cvs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyTitle}>Aucun CV sauvegardé</Text>
          <Text style={styles.emptySub}>
            Créez votre premier CV et sauvegardez-le en ligne pour le retrouver ici.
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => { useCVStore.getState().reset(); router.push('/cv/step1-profil'); }}
          >
            <Text style={styles.emptyBtnText}>✨ Créer un CV</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cvs}
          keyExtractor={item => item.id}
          renderItem={renderCV}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#534AB7']}
            />
          }
        />
      )}

      {/* FAB */}
      {!loading && cvs.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => { useCVStore.getState().reset(); router.push('/cv/step1-profil'); }}
        >
          <Text style={styles.fabText}>+ Nouveau CV</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#f5f7fa' },
  header:            { backgroundColor: '#534AB7', paddingTop: 52, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  backBtn:           { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backText:          { color: '#fff', fontSize: 24, fontWeight: '300' },
  headerCenter:      { flex: 1, alignItems: 'center' },
  headerTitle:       { color: '#fff', fontSize: 18, fontWeight: '600' },
  headerSub:         { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  refreshBtn:        { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  refreshText:       { color: '#fff', fontSize: 22 },
  globalStats:       { backgroundColor: '#fff', flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  globalStat:        { flex: 1, alignItems: 'center' },
  globalStatNum:     { fontSize: 22, fontWeight: '800', color: '#534AB7' },
  globalStatLbl:     { fontSize: 11, color: '#888', marginTop: 2 },
  globalStatDivider: { width: 1, backgroundColor: '#eee' },
  loadingContainer:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText:       { color: '#888', fontSize: 14 },
  emptyContainer:    { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
  emptyEmoji:        { fontSize: 64 },
  emptyTitle:        { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },
  emptySub:          { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 22 },
  emptyBtn:          { backgroundColor: '#534AB7', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 32 },
  emptyBtnText:      { color: '#fff', fontSize: 15, fontWeight: '700' },
  list:              { padding: 16, paddingBottom: 100 },
  card:              { backgroundColor: '#fff', borderRadius: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6 },
  cardInner:         { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  avatar:            { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText:        { color: '#fff', fontSize: 18, fontWeight: '800' },
  cardInfo:          { flex: 1, gap: 4 },
  cardName:          { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  cardTitre:         { fontSize: 12, color: '#555' },
  statsRow:          { flexDirection: 'row', gap: 8, marginTop: 4 },
  statItem:          { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statNum:           { fontSize: 11, fontWeight: '700', color: '#534AB7' },
  statLbl:           { fontSize: 10, color: '#888' },
  cardMeta:          { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  badge:             { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  badgeText:         { fontSize: 9, fontWeight: '700' },
  cardDate:          { fontSize: 10, color: '#aaa' },
  cardActions:       { gap: 8, flexShrink: 0 },
  actionBtn:         { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  actionIcon:        { fontSize: 16, fontWeight: '700' },
  deleteBtn:         { width: 34, height: 34, backgroundColor: '#fee2e2', borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  deleteIcon:        { fontSize: 14 },
  fab:               { position: 'absolute', bottom: 24, right: 24, backgroundColor: '#534AB7', borderRadius: 28, paddingVertical: 14, paddingHorizontal: 24, elevation: 6, shadowColor: '#534AB7', shadowOpacity: 0.4, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 },
  fabText:           { color: '#fff', fontSize: 15, fontWeight: '700' },
});