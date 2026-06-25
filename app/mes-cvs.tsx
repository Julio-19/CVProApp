import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useCVStore } from '../store/cvStore';
import { generateCVHTML } from '../services/templateService';

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
  const store = useCVStore();

  useEffect(() => {
    chargerCVs();
  }, []);

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
      console.error('Erreur chargement CVs:', err);
      Alert.alert('Erreur', 'Impossible de charger vos CVs : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOuvrirCV = (cv: CVSauvegarde) => {
    try {
      // Charger les données du CV dans le store
      const data = cv.data ?? {};
      store.setField('prenom',       data.prenom       ?? cv.prenom ?? '');
      store.setField('nom',          data.nom          ?? cv.nom    ?? '');
      store.setField('email',        data.email        ?? '');
      store.setField('telephone',    data.telephone    ?? '');
      store.setField('ville',        data.ville        ?? '');
      store.setField('titre',        data.titre        ?? cv.titre  ?? '');
      store.setField('objectif',     data.objectif     ?? '');
      store.setField('photo',        data.photo        ?? null);
      store.setField('experiences',  data.experiences  ?? []);
      store.setField('formations',   data.formations   ?? []);
      store.setField('competences',  data.competences  ?? []);
      store.setField('langues',      data.langues      ?? []);
      store.setField('loisirs',      data.loisirs      ?? []);
      store.setField('reseaux',      data.reseaux      ?? []);
      store.setField('certifications', data.certifications ?? []);
      store.setField('projets',      data.projets      ?? []);
      store.setTemplate(data.templateId ?? cv.template_id ?? 'sidebar_bleu');

      console.log('CV chargé:', cv.prenom, cv.nom, 'template:', data.templateId ?? cv.template_id);

      // Naviguer vers saved
      setTimeout(() => {
        router.push('/saved');
      }, 150);

    } catch (err: any) {
      console.error('Erreur ouverture CV:', err);
      Alert.alert('Erreur', 'Impossible d\'ouvrir ce CV');
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
    } catch { return dateStr; }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#534AB7" size="large" />
          <Text style={styles.loadingText}>Chargement de vos CVs...</Text>
        </View>
      ) : cvs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📂</Text>
          <Text style={styles.emptyTitle}>Aucun CV sauvegardé</Text>
          <Text style={styles.emptySub}>
            Créez et sauvegardez votre premier CV pour le retrouver ici.
          </Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/cv/step1-profil')}>
            <Text style={styles.emptyBtnText}>Créer un CV →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {cvs.map((cv) => (
            <TouchableOpacity
              key={cv.id}
              style={styles.cvCard}
              onPress={() => handleOuvrirCV(cv)}
              activeOpacity={0.85}
            >
              {/* Indicateur couleur template */}
              <View style={[styles.cvColor, {
                backgroundColor: cv.data?.templateId
                  ? (cv.data.templateId.includes('bleu')  ? '#1a3a5c' :
                     cv.data.templateId.includes('rouge') ? '#dc2626' :
                     cv.data.templateId.includes('vert')  ? '#1e3422' :
                     cv.data.templateId.includes('violet')? '#6b21a8' :
                     cv.data.templateId.includes('dark')  ? '#2c2c2c' :
                     '#534AB7')
                  : '#534AB7'
              }]} />

              <View style={styles.cvInfo}>
                <Text style={styles.cvNom}>
                  {cv.prenom || cv.data?.prenom || '—'} {cv.nom || cv.data?.nom || ''}
                </Text>
                <Text style={styles.cvTitre} numberOfLines={1}>
                  {cv.titre || cv.data?.titre || 'Sans titre'}
                </Text>
                <Text style={styles.cvDate}>
                  Modifié le {formatDate(cv.updated_at || cv.created_at)}
                </Text>
                <Text style={styles.cvTemplate}>
                  🎨 {(cv.data?.templateId ?? cv.template_id ?? 'sidebar_bleu')
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </Text>
              </View>

              <View style={styles.cvActions}>
                <TouchableOpacity
                  style={styles.btnOuvrir}
                  onPress={() => handleOuvrirCV(cv)}
                >
                  <Text style={styles.btnOuvrirText}>Ouvrir</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnSupprimer}
                  onPress={() => handleSupprimerCV(cv)}
                  disabled={deleting === cv.id}
                >
                  {deleting === cv.id
                    ? <ActivityIndicator size="small" color="#dc2626" />
                    : <Text style={styles.btnSupprimerText}>🗑️</Text>
                  }
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
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
  refreshText:      { color: '#fff', fontSize: 24, fontWeight: '300' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingText:      { fontSize: 14, color: '#888' },
  emptyContainer:   { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
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
  btnOuvrir:        { backgroundColor: '#534AB7', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
  btnOuvrirText:    { color: '#fff', fontSize: 11, fontWeight: '600' },
  btnSupprimer:     { backgroundColor: '#fef2f2', borderRadius: 8, padding: 8 },
  btnSupprimerText: { fontSize: 16 },
});