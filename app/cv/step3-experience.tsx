import { View, ScrollView, Text, StyleSheet, Alert, Animated } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import ProgressBar from '../../components/ProgressBar';
import { useCVStore } from '../../store/cvStore';
import { Colors } from '../../constants/colors';

export default function Step3() {
  const { experiences, addExperience } = useCVStore();
  const [form, setForm] = useState({
    poste: '', entreprise: '', debut: '', fin: '', description: ''
  });
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
    if (!form.poste || !form.entreprise) {
      Alert.alert('Erreur', 'Le poste et l\'entreprise sont obligatoires.');
      return;
    }
    addExperience({ ...form });
    setForm({ poste: '', entreprise: '', debut: '', fin: '', description: '' });
    Alert.alert('✅ Ajouté', `${form.poste} chez ${form.entreprise} ajouté !`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProgressBar step={3} total={6} />
      </View>

      <Animated.View style={[
        styles.animated,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}>
        <ScrollView contentContainerStyle={styles.content}>

          {experiences.length > 0 && (
            <View style={styles.addedList}>
              <Text style={styles.addedTitle}>
                {experiences.length} expérience(s) ajoutée(s) ✅
              </Text>
              {experiences.map((exp, i) => (
                <View key={i} style={styles.expCard}>
                  <Text style={styles.expPoste}>{exp.poste}</Text>
                  <Text style={styles.expSub}>{exp.entreprise} · {exp.debut} – {exp.fin}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.sectionLabel}>
            {experiences.length === 0 ? 'Ajouter une expérience' : 'Ajouter une autre expérience'}
          </Text>

          <InputField label="Intitulé du poste *" placeholder="Ex : Chef de projet"
            value={form.poste} onChangeText={set('poste')} />
          <InputField label="Entreprise *" placeholder="Nom de l'entreprise"
            value={form.entreprise} onChangeText={set('entreprise')} />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <InputField label="Début" placeholder="01/2022"
                value={form.debut} onChangeText={set('debut')} />
            </View>
            <View style={{ flex: 1 }}>
              <InputField label="Fin" placeholder="Présent"
                value={form.fin} onChangeText={set('fin')} />
            </View>
          </View>
          <InputField label="Description" placeholder="Décrivez vos missions..."
            value={form.description} onChangeText={set('description')} multiline />

          <Button label="+ Ajouter cette expérience" variant="secondary" onPress={handleAdd} />
          <Button label="Suivant →" onPress={() => router.push('/cv/step4-formation')} />
          <Button label="← Retour" variant="outline" onPress={() => router.back()} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.background },
  header:     { backgroundColor: Colors.primary, padding: 16, paddingTop: 48 },
  animated:   { flex: 1 },
  content:    { padding: 20, gap: 14 },
  addedList:  { backgroundColor: Colors.primaryLight, borderRadius: 10, padding: 12, gap: 8 },
  addedTitle: { fontSize: 12, fontWeight: '500', color: Colors.primary },
  expCard:    { backgroundColor: Colors.white, borderRadius: 8, padding: 10, borderLeftWidth: 3, borderLeftColor: Colors.primary },
  expPoste:   { fontSize: 12, fontWeight: '500', color: Colors.textPrimary },
  expSub:     { fontSize: 10, color: Colors.textSecondary, marginTop: 2 },
  sectionLabel:{ fontSize: 12, fontWeight: '500', color: Colors.primary },
  row:        { flexDirection: 'row', gap: 10 },
});