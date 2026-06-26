import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert, Platform
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
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
  const [cvs, setCvs]           = useState<CVSauvegarde[]>([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [opening, setOpening]   = useState<string | null>(null);

  useEffect(() => { chargerCVs(); }, []);

  const chargerCVs = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      setCvs(data ?? []);
    } catch (err: any) {
      Alert.alert('Erreur', 'Impossible de charger vos CVs : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOuvrirCV = async (cv: CVSauvegarde) => {
    try {
      setOpening(cv.id);
      const data = cv.data ?? {};
      const templateId = data.templateId ?? cv.template_id ?? 'sidebar_bleu';

      // ── Mettre à jour le store Zustand d'un seul coup ─────────────────
      useCVStore.setState({
        prenom:         data.prenom         ?? cv.prenom  ?? '',
        nom:            data.nom            ?? cv.nom     ?? '',
        email:          data.email          ?? '',
        telephone:      data.telephone      ?? '',
        ville:          data.ville          ?? '',
        titre:          data.titre          ?? cv.titre   ?? '',
        objectif:       data.objectif       ?? '',
        photo:          data.photo          ?? null,
        experiences:    data.experiences    ?? [],
        formations:     data.formations     ?? [],
        competences:    data.competences    ?? [],
        langues:        data.langues        ?? [],
        loisirs:        data.loisirs        ?? [],
        reseaux:        data.reseaux        ?? [],
        certifications: data.certifications ?? [],
        projets:        data.projets        ?? [],
        templateId,
      });

      // ── Sur web : persister aussi dans localStorage immédiatement ──────
      if (Platform.OS === 'web') {
        try {
          const storeState = useCVStore.getState();
          const storageData = {
            state: {
              prenom:         storeState.prenom,
              nom:            storeState.nom,
              email:          storeState.email,
              telephone:      storeState.telephone,
              ville:          storeState.ville,
              titre:          storeState.titre,
              objectif:       storeState.objectif,
              photo:          storeState.photo,
              experiences:    storeState.experiences,
              formations:     storeState.formations,
              competences:    storeState.competences,
              langues:        storeState.langues,
              loisirs:        storeState.loisirs,
              reseaux:        storeState.reseaux,
              certifications: storeState.certifications,
              projets:        storeState.projets,
              templateId:     storeState.templateId,
            },
            version: 0,
          };
          localStorage.setItem('cv-storage', JSON.stringify(storageData));
          console.log('✅ Store persisté dans localStorage, templateId:', templateId);
        } catch(e) {
          console.error('Erreur localStorage:', e);
        }
      }

      // Attendre que le store et localStorage soient bien mis à jour
      await new Promise(resolve => setTimeout(resolve, 300));

      router.replace('/saved');

    } catch (err: any) {
      console.error('Erreur ouverture CV:', err);
      Alert.alert('Erreur', 'Impossible d\'ouvrir ce CV');
    } finally {
      setOpening(null);
    }
  };

  const handleSupprimerCV = (cv: CVSauvegarde) => {
    Alert.alert(
      '🗑️ Supprimer ce CV ?',
      `Voulez-vous supprimer le CV de ${cv.prenom} ${cv.nom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(cv.id);
              const { error } = await supabase.from('cvs').delete().eq('id', cv.id);
              if (error) throw error;
              setCvs(prev => prev.filter(c => c.id !== cv.id));
            } catch (err: any) {
              Alert.alert('Erreur', 'Impossible de supprimer : ' + err.message);
            } finally {
              setDeleting(null);
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
    } catch { return ''; }
  };

  const getTemplateColor = (templateId: string): string => {
    const colors: Record<string, string> = {
      sidebar_bleu: '#1a3a5c', rouge_moderne: '#dc2626', vert_nature: '#1e3422',
      violet: '#6b21a8', dark_sidebar: '#2c2c2c', navy_pro: '#1e3a6e',
      teal_student: '#3d9b8a', fresher_dark: '#1a2744', bold_noir: '#111',
    };
    return colors[templateId] ?? '#534AB7';
  };

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

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#534AB7" size="large" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : cvs.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>📂</Text>
          <Text style={styles.emptyTitle}>Aucun CV sauvegardé</Text>
          <Text style={styles.emptySub}>Créez votre premier CV et sauvegardez-le.</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/cv/step1-profil')}>
            <Text style={styles.emptyBtnText}>Créer un CV →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {cvs.map((cv) => {
            const templateId = cv.data?.templateId ?? cv.template_id ?? 'sidebar_bleu';
            const isOpening  = opening === cv.id;
            const isDeleting = deleting === cv.id;
            return (
              <View key={cv.id} style={styles.cvCard}>
                <View style={[styles.cvColor, { backgroundColor: getTemplateColor(templateId) }]} />
                <View style={styles.cvInfo}>
                  <Text style={styles.cvNom}>
                    {cv.data?.prenom ?? cv.prenom ?? '—'} {cv.data?.nom ?? cv.nom ?? ''}
                  </Text>
                  <Text style={styles.cvTitre} numberOfLines={1}>
                    {cv.data?.titre ?? cv.titre ?? 'Sans titre'}
                  </Text>
                  <Text style={styles.cvDate}>
                    Modifié le {formatDate(cv.updated_at ?? cv.created_at)}
                  </Text>
                  <Text style={styles.cvTemplate}>
                    🎨 {templateId.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </Text>
                </View>
                <View style={styles.cvActions}>
                  <TouchableOpacity
                    style={[styles.btnOuvrir, isOpening && { opacity: 0.6 }]}
                    onPress={() => handleOuvrirCV(cv)}
                    disabled={isOpening}
                  >
                    {isOpening
                      ? <ActivityIndicator size="small" color="#fff" />
                      : <Text style={styles.btnOuvrirText}>Ouvrir</Text>
                    }
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnSupprimer, isDeleting && { opacity: 0.6 }]}
                    onPress={() => handleSupprimerCV(cv)}
                    disabled={isDeleting}
                  >
                    {isDeleting
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