import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Animated
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useCVStore } from '../../store/cvStore';

export default function EditProjetsScreen() {
  const { projets, addProjet, removeProjet } = useCVStore();
  const [form, setForm] = useState({ titre: '', description: '', technologies: '', url: '' });
  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleAdd = () => {
    if (!form.titre.trim() || !form.description.trim()) {
      Alert.alert('Erreur', 'Le titre et la description sont obligatoires.');
      return;
    }
    addProjet({ ...form });
    setForm({ titre: '', description: '', technologies: '', url: '' });
    Alert.alert('✅ Ajouté !', `${form.titre} ajouté à votre CV.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Projets personnels</Text>
        <View style={{ width: 40 }} />
      </View>

      <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <ScrollView contentContainerStyle={styles.content}>

          {projets.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🚀 Projets ({projets.length})</Text>
              {projets.map((p, i) => (
                <View key={i} style={styles.projetItem}>
                  <View style={styles.projetIcon}>
                    <Text style={styles.projetEmoji}>🚀</Text>
                  </View>
                  <View style={styles.projetInfo}>
                    <Text style={styles.projetTitre}>{p.titre}</Text>
                    <Text style={styles.projetDesc} numberOfLines={2}>{p.description}</Text>
                    {p.technologies ? (
                      <View style={styles.techRow}>
                        {p.technologies.split(',').map((t, ti) => (
                          <View key={ti} style={styles.techBadge}>
                            <Text style={styles.techText}>{t.trim()}</Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                    {p.url ? <Text style={styles.projetUrl} numberOfLines={1}>{p.url}</Text> : null}
                  </View>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => removeProjet(i)}>
                    <Text style={styles.deleteText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>➕ Ajouter un projet</Text>
            <InputField label="Titre *" placeholder="Application mobile CVPro" value={form.titre} onChangeText={set('titre')} />
            <InputField label="Description *" placeholder="Décrivez votre projet..." value={form.description} onChangeText={set('description')} multiline />
            <InputField label="Technologies" placeholder="React Native, Node.js, Supabase" value={form.technologies} onChangeText={set('technologies')} />
            <InputField label="URL (optionnel)" placeholder="https://github.com/..." value={form.url} onChangeText={set('url')} />
            <Button label="+ Ajouter ce projet" variant="secondary" onPress={handleAdd} />
          </View>

          <Button label="← Retour au CV" variant="outline" onPress={() => router.back()} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#f5f7fa' },
  header:      { backgroundColor: '#534AB7', paddingTop: 52, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  backBtn:     { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backText:    { color: '#fff', fontSize: 24, fontWeight: '300' },
  headerTitle: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
  content:     { padding: 16, gap: 14, paddingBottom: 40 },
  card:        { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  cardTitle:   { fontSize: 13, fontWeight: '700', color: '#111' },
  projetItem:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  projetIcon:  { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f4ff', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  projetEmoji: { fontSize: 18 },
  projetInfo:  { flex: 1, gap: 4 },
  projetTitre: { fontSize: 13, fontWeight: '600', color: '#111' },
  projetDesc:  { fontSize: 11, color: '#555', lineHeight: 16 },
  techRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  techBadge:   { backgroundColor: '#f0f4ff', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  techText:    { fontSize: 9, color: '#534AB7', fontWeight: '600' },
  projetUrl:   { fontSize: 10, color: '#534AB7', marginTop: 2 },
  deleteBtn:   { width: 28, height: 28, backgroundColor: '#fee2e2', borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  deleteText:  { color: '#dc2626', fontSize: 12, fontWeight: '700' },
});