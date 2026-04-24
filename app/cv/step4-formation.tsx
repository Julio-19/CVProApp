import { View, ScrollView, Text, StyleSheet, Alert, Animated } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import ProgressBar from '../../components/ProgressBar';
import { useCVStore } from '../../store/cvStore';
import { Colors } from '../../constants/colors';

export default function Step4() {
  const { formations, addFormation } = useCVStore();
  const [form, setForm] = useState({ diplome: '', etablissement: '', annee: '' });
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleAdd = () => {
    if (!form.diplome || !form.etablissement) {
      Alert.alert('Erreur', 'Le diplôme et l\'établissement sont obligatoires.');
      return;
    }
    addFormation({ ...form });
    setForm({ diplome: '', etablissement: '', annee: '' });
    Alert.alert('✅ Ajouté', `${form.diplome} ajouté !`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProgressBar step={4} total={6} />
      </View>

      <Animated.View style={[
        styles.animated,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}>
        <ScrollView contentContainerStyle={styles.content}>

          {formations.length > 0 && (
            <View style={styles.addedList}>
              <Text style={styles.addedTitle}>
                {formations.length} formation(s) ajoutée(s) ✅
              </Text>
              {formations.map((f, i) => (
                <View key={i} style={styles.card}>
                  <Text style={styles.cardTitle}>{f.diplome}</Text>
                  <Text style={styles.cardSub}>{f.etablissement} · {f.annee}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.sectionLabel}>
            {formations.length === 0 ? 'Ajouter une formation' : 'Ajouter une autre formation'}
          </Text>

          <InputField label="Diplôme obtenu *" placeholder="Ex : Licence Informatique"
            value={form.diplome} onChangeText={set('diplome')} />
          <InputField label="Établissement *" placeholder="Université, école..."
            value={form.etablissement} onChangeText={set('etablissement')} />
          <InputField label="Année d'obtention" placeholder="2023"
            value={form.annee} onChangeText={set('annee')} />

          <Button label="+ Ajouter cette formation" variant="secondary" onPress={handleAdd} />
          <Button label="Suivant →" onPress={() => router.push('/cv/step5-competences')} />
          <Button label="← Retour" variant="outline" onPress={() => router.back()} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.background },
  header:      { backgroundColor: Colors.primary, padding: 16, paddingTop: 48 },
  animated:    { flex: 1 },
  content:     { padding: 20, gap: 14 },
  addedList:   { backgroundColor: Colors.primaryLight, borderRadius: 10, padding: 12, gap: 8 },
  addedTitle:  { fontSize: 12, fontWeight: '500', color: Colors.primary },
  card:        { backgroundColor: Colors.white, borderRadius: 8, padding: 10, borderLeftWidth: 3, borderLeftColor: Colors.primaryMuted },
  cardTitle:   { fontSize: 12, fontWeight: '500', color: Colors.textPrimary },
  cardSub:     { fontSize: 10, color: Colors.textSecondary, marginTop: 2 },
  sectionLabel:{ fontSize: 12, fontWeight: '500', color: Colors.primary },
});