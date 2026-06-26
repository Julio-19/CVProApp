import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert, Platform
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useCVStore } from '../store/cvStore';

type CVSauvegarde = {
  id: string;
  created_at: string;
  updated_at: string;
  prenom: string;
  nom: string;
  titre: string;
  template_id: string;
  data: any;
};

export default function MesCVsScreen() {
  const [cvs, setCvs]         = useState<CVSauvegarde[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [opening, setOpening]   = useState<string | null>(null);

  const chargerCVs = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }

      const { data, error } = await supabase
        .from('cvs')
        .select('id, created_at, updated_at, prenom, nom, titre, template_id, data')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setCvs(data ?? []);
    } catch (err: any) {
      console.error('Erreur chargement:', err);
      Alert.alert('Erreur', 'Impossible de charger vos CVs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { chargerCVs(); }, []);

  const handleOuvrirCV = async (cv: CVSauvegarde) => {
    try {
      setOpening(cv.id);
      const d = cv.data ?? {};
      const templateId = d.templateId ?? cv.template_id ?? 'sidebar_bleu';

      // Mettre à jour le store en une seule opération
      useCVStore.setState({
        prenom:         d.prenom         ?? cv.prenom  ?? '',
        nom:            d.nom            ?? cv.nom     ?? '',
        email:          d.email          ?? '',
        telephone:      d.telephone      ?? '',
        ville:          d.ville          ?? '',
        titre:          d.titre          ?? cv.titre   ?? '',
        objectif:       d.objectif       ?? '',
        photo:          d.photo          ?? null,
        experiences:    d.experiences    ?? [],
        formations:     d.formations     ?? [],
        competences:    d.competences    ?? [],
        langues:        d.langues        ?? [],
        loisirs:        d.loisirs        ?? [],
        reseaux:        d.reseaux        ?? [],
        certifications: d.certifications ?? [],
        projets:        d.projets        ?? [],
        templateId,
      });

      // Persister dans localStorage immédiatement
      if (Platform.OS === 'web') {
        try {
          const state = useCVStore.getState();
          localStorage.setItem('cv-storage', JSON.stringify({
            state: {
              prenom: state.prenom, nom: state.nom, email: state.email,
              telephone: state.telephone, ville: state.ville, titre: state.titre,
              objectif: state.objectif, photo: state.photo,
              experiences: state.experiences, formations: state.formations,
              competences: state.competences, langues: state.langues,
              loisirs: state.loisirs, reseaux: state.reseaux,
              certifications: state.certifications, projets: state.projets,
              templateId: state.templateId,
            },
            version: 0,
          }));
          console.log('CV chargé:', state.prenom, state.nom, 'template:', templateId);
        } catch(e) {}
      }

      await new Promise(r => setTimeout(r, 200));
      router.replace('/saved');

    } catch (err: any) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir ce CV');
    } finally {
      setOpening(null);
    }
  };

  const handleSupprimer = (cv: CVSauvegarde) => {
    Alert.alert(
      '🗑️ Supprimer ?',
      `Supprimer le CV de ${cv.prenom} ${cv.nom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer', style: 'destructive',
          onPress: async () => {
            setDeleting(cv.id);
            try {
              const { error } = await supabase.from('cvs').delete().eq('id', cv.id);
              if (error) throw error;
              setCvs(p => p.filter(c => c.id !== cv.id));
            } catch(e: any) {
              Alert.alert('Erreur', e.message);
            } finally {
              setDeleting(null);
            }
          }
        }
      ]
    );
  };

  const getColor = (id: string) => {
    const m: Record<string, string> = {
      sidebar_bleu: '#1a3a5c', rouge_moderne: '#dc2626', vert_nature: '#1e3422',
      violet: '#6b21a8', dark_sidebar: '#2c2c2c', navy_pro: '#1e3a6e',
      teal_student: '#3d9b8a', fresher_dark: '#1a2744', bold_noir: '#111',
      bleu_arrondi: '#2563eb', dark_rouge: '#7f1d1d', vert_diamant: '#2d5a1b',
    };
    return m[id] ?? '#534AB7';
  };

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }); }
    catch { return ''; }
  };

  if (loading) return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Mes CVs sauvegardés</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.center}>
        <ActivityIndicator color="#534AB7" size="large" />
        <Text style={styles.loadingText}>Chargement de vos CVs...</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Mes CVs sauvegardés</Text>
          <Text style={styles.headerSub}>{cvs.length} CV(s)</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={chargerCVs}>
          <Text style={styles.refreshText}>↻</Text>
        </TouchableOpacity>
      </View>

      {cvs.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>📂</Text>
          <Text style={styles.emptyTitle}>Aucun CV sauvegardé</Text>
          <Text style={styles.emptySub}>Créez et sauvegardez votre premier CV.</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/cv/step1-profil')}>
            <Text style={styles.emptyBtnText}>Créer un CV →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {cvs.map((cv) => {
            const templateId = cv.data?.templateId ?? cv.template_id ?? 'sidebar_bleu';
            return (
              <View key={cv.id} style={styles.cvCard}>
                <View style={[styles.cvColor, { backgroundColor: getColor(templateId) }]} />
                <View style={styles.cvInfo}>
                  <Text style={styles.cvNom}>
                    {cv.data?.prenom ?? cv.prenom ?? '—'} {cv.data?.nom ?? cv.nom ?? ''}
                  </Text>
                  <Text style={styles.cvTitre} numberOfLines={1}>
                    {cv.data?.titre ?? cv.titre ?? 'Sans titre'}
                  </Text>
                  <Text style={styles.cvDate}>
                    {formatDate(cv.updated_at ?? cv.created_at)}
                  </Text>
                  <Text style={styles.cvTemplate}>
                    🎨 {templateId.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </Text>
                </View>
                <View style={styles.cvActions}>
                  <TouchableOpacity
                    style={[styles.btnOuvrir, opening === cv.id && { opacity: 0.6 }]}
                    onPress={() => handleOuvrirCV(cv)}
                    disabled={opening === cv.id}
                  >
                    {opening === cv.id
                      ? <ActivityIndicator size="small" color="#fff" />
                      : <Text style={styles.btnOuvrirText}>Ouvrir</Text>
                    }
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnSupprimer, deleting === cv.id && { opacity: 0.6 }]}
                    onPress={() => handleSupprimer(cv)}
                    disabled={deleting === cv.id}
                  >
                    {deleting === cv.id
                      ? <ActivityIndicator size="small" color="#dc2626" />
                      : <Text style={styles.btnSupprimerText}>🗑️</Text>
                    }
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
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
  refreshBtn:       { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  refreshText:      { color: '#fff', fontSize: 24 },
  center:           { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 },
  loadingText:      { fontSize: 14, color: '#888' },
  emptyEmoji:       { fontSize: 56 },
  emptyTitle:       { fontSize: 20, fontWeight: '800', color: '#111', textAlign: 'center' },
  emptySub:         { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 22 },
  emptyBtn:         { backgroundColor: '#534AB7', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 28 },
  emptyBtnText:     { color: '#fff', fontSize: 14, fontWeight: '700' },
  content:          { padding: 16, gap: 12, paddingBottom: 40 },
  cvCard:           { backgroundColor: '#fff', borderRadius: 16, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  cvColor:          { width: 8, alignSelf: 'stretch', minHeight: 90 },
  cvInfo:           { flex: 1, padding: 14, gap: 3 },
  cvNom:            { fontSize: 15, fontWeight: '700', color: '#111' },
  cvTitre:          { fontSize: 12, color: '#534AB7', fontWeight: '500' },
  cvDate:           { fontSize: 10, color: '#aaa', marginTop: 4 },
  cvTemplate:       { fontSize: 10, color: '#888' },
  cvActions:        { flexDirection: 'column', padding: 12, gap: 8, alignItems: 'center' },
  btnOuvrir:        { backgroundColor: '#534AB7', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, minWidth: 60, alignItems: 'center' },
  btnOuvrirText:    { color: '#fff', fontSize: 11, fontWeight: '600' },
  btnSupprimer:     { backgroundColor: '#fef2f2', borderRadius: 8, padding: 8 },
  btnSupprimerText: { fontSize: 16 },
});