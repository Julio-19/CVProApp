import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Animated
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useCVStore } from '../../store/cvStore';

const RESEAUX_TYPES = [
  { label: 'LinkedIn',  emoji: '💼', placeholder: 'https://linkedin.com/in/votre-profil' },
  { label: 'GitHub',    emoji: '💻', placeholder: 'https://github.com/votre-profil' },
  { label: 'Twitter',   emoji: '🐦', placeholder: 'https://twitter.com/votre-profil' },
  { label: 'Portfolio', emoji: '🌐', placeholder: 'https://votre-site.com' },
  { label: 'Autre',     emoji: '🔗', placeholder: 'https://...' },
];

export default function EditReseauxScreen() {
  const { reseaux, addReseau, removeReseau } = useCVStore();
  const [form, setForm] = useState({ reseau: 'LinkedIn', url: '' });
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleAdd = () => {
    if (!form.url.trim()) {
      Alert.alert('Erreur', 'Entrez l\'URL du réseau social.');
      return;
    }
    addReseau({ reseau: form.reseau, url: form.url.trim() });
    setForm({ reseau: 'LinkedIn', url: '' });
    Alert.alert('✅ Ajouté !', `${form.reseau} ajouté à votre CV.`);
  };

  const placeholder = RESEAUX_TYPES.find(r => r.label === form.reseau)?.placeholder ?? 'https://...';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Réseaux sociaux</Text>
        <View style={{ width: 40 }} />
      </View>

      <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <ScrollView contentContainerStyle={styles.content}>

          {/* Liste des réseaux ajoutés */}
          {reseaux.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>✅ Réseaux ajoutés ({reseaux.length})</Text>
              {reseaux.map((r, i) => {
                const type = RESEAUX_TYPES.find(t => t.label === r.reseau);
                return (
                  <View key={i} style={styles.reseauItem}>
                    <Text style={styles.reseauEmoji}>{type?.emoji ?? '🔗'}</Text>
                    <View style={styles.reseauInfo}>
                      <Text style={styles.reseauNom}>{r.reseau}</Text>
                      <Text style={styles.reseauUrl} numberOfLines={1}>{r.url}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => removeReseau(i)}
                    >
                      <Text style={styles.deleteText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          {/* Formulaire */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>➕ Ajouter un réseau</Text>

            <Text style={styles.label}>Type de réseau</Text>
            <View style={styles.typesRow}>
              {RESEAUX_TYPES.map(t => (
                <TouchableOpacity
                  key={t.label}
                  style={[styles.typeBtn, form.reseau === t.label && styles.typeBtnActive]}
                  onPress={() => setForm(f => ({ ...f, reseau: t.label }))}
                >
                  <Text style={styles.typeEmoji}>{t.emoji}</Text>
                  <Text style={[styles.typeTxt, form.reseau === t.label && styles.typeTxtActive]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <InputField
              label="URL du profil"
              placeholder={placeholder}
              value={form.url}
              onChangeText={v => setForm(f => ({ ...f, url: v }))}
            />

            <Button label="+ Ajouter ce réseau" variant="secondary" onPress={handleAdd} />
          </View>

          <Button label="← Retour au CV" variant="outline" onPress={() => router.back()} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#f5f7fa' },
  header:         { backgroundColor: '#534AB7', paddingTop: 52, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  backBtn:        { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backText:       { color: '#fff', fontSize: 24, fontWeight: '300' },
  headerTitle:    { flex: 1, color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
  content:        { padding: 16, gap: 14, paddingBottom: 40 },
  card:           { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  cardTitle:      { fontSize: 13, fontWeight: '700', color: '#111' },
  reseauItem:     { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  reseauEmoji:    { fontSize: 22 },
  reseauInfo:     { flex: 1 },
  reseauNom:      { fontSize: 13, fontWeight: '600', color: '#111' },
  reseauUrl:      { fontSize: 11, color: '#888', marginTop: 2 },
  deleteBtn:      { width: 28, height: 28, backgroundColor: '#fee2e2', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  deleteText:     { color: '#dc2626', fontSize: 12, fontWeight: '700' },
  label:          { fontSize: 12, color: '#555', fontWeight: '500' },
  typesRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBtn:        { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: '#e5e7eb', backgroundColor: '#fff', alignItems: 'center', gap: 4 },
  typeBtnActive:  { borderColor: '#534AB7', backgroundColor: '#534AB710' },
  typeEmoji:      { fontSize: 16 },
  typeTxt:        { fontSize: 10, color: '#555', fontWeight: '500' },
  typeTxtActive:  { color: '#534AB7', fontWeight: '700' },
});