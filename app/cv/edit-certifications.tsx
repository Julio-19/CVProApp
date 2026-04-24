import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Animated
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useCVStore } from '../../store/cvStore';

export default function EditCertificationsScreen() {
  const { certifications, addCertification, removeCertification } = useCVStore();
  const [form, setForm] = useState({ titre: '', organisme: '', annee: '', url: '' });
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
    if (!form.titre.trim() || !form.organisme.trim()) {
      Alert.alert('Erreur', 'Le titre et l\'organisme sont obligatoires.');
      return;
    }
    addCertification({ ...form });
    setForm({ titre: '', organisme: '', annee: '', url: '' });
    Alert.alert('✅ Ajouté !', `${form.titre} ajouté à votre CV.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Certifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <ScrollView contentContainerStyle={styles.content}>

          {certifications.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🏆 Certifications ({certifications.length})</Text>
              {certifications.map((c, i) => (
                <View key={i} style={styles.certItem}>
                  <View style={styles.certIcon}>
                    <Text style={styles.certEmoji}>🏆</Text>
                  </View>
                  <View style={styles.certInfo}>
                    <Text style={styles.certTitre}>{c.titre}</Text>
                    <Text style={styles.certOrg}>{c.organisme} · {c.annee}</Text>
                    {c.url ? <Text style={styles.certUrl} numberOfLines={1}>{c.url}</Text> : null}
                  </View>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => removeCertification(i)}>
                    <Text style={styles.deleteText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>➕ Ajouter une certification</Text>
            <InputField label="Titre *" placeholder="AWS Solutions Architect" value={form.titre} onChangeText={set('titre')} />
            <InputField label="Organisme *" placeholder="Amazon, Google, Microsoft..." value={form.organisme} onChangeText={set('organisme')} />
            <InputField label="Année" placeholder="2024" value={form.annee} onChangeText={set('annee')} />
            <InputField label="URL (optionnel)" placeholder="https://credential.net/..." value={form.url} onChangeText={set('url')} />
            <Button label="+ Ajouter cette certification" variant="secondary" onPress={handleAdd} />
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
  certItem:    { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  certIcon:    { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center' },
  certEmoji:   { fontSize: 18 },
  certInfo:    { flex: 1 },
  certTitre:   { fontSize: 13, fontWeight: '600', color: '#111' },
  certOrg:     { fontSize: 11, color: '#888', marginTop: 2 },
  certUrl:     { fontSize: 10, color: '#534AB7', marginTop: 2 },
  deleteBtn:   { width: 28, height: 28, backgroundColor: '#fee2e2', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  deleteText:  { color: '#dc2626', fontSize: 12, fontWeight: '700' },
});