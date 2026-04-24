import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import ProgressBar from '../../components/ProgressBar';
import { useCVStore } from '../../store/cvStore';
import { Colors } from '../../constants/colors';

const NIVEAUX = ['Débutant', 'Intermédiaire', 'Avancé', 'Natif'];

export default function Step6() {
  const { langues, loisirs, addLangue, addLoisir } = useCVStore();
  const [langue, setLangue] = useState('');
  const [niveau, setNiveau] = useState('Intermédiaire');
  const [loisir, setLoisir] = useState('');

  const handleAddLangue = () => {
    if (!langue.trim()) {
      Alert.alert('Erreur', 'Entrez le nom de la langue.');
      return;
    }
    addLangue({ langue: langue.trim(), niveau });
    setLangue('');
    Alert.alert('✅ Ajouté', `${langue} ajouté !`);
  };

  const handleAddLoisir = () => {
    if (!loisir.trim()) {
      Alert.alert('Erreur', 'Entrez un loisir.');
      return;
    }
    addLoisir(loisir.trim());
    setLoisir('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProgressBar step={6} total={6} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.sectionLabel}>
          Langues ({langues.length} ajoutée(s))
        </Text>

        {langues.length > 0 && (
          <View style={styles.addedList}>
            {langues.map((l, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cardTitle}>{l.langue}</Text>
                <Text style={styles.cardSub}>{l.niveau}</Text>
              </View>
            ))}
          </View>
        )}

        <InputField
          label="Langue"
          placeholder="Ex : Anglais"
          value={langue}
          onChangeText={setLangue}
        />

        <View style={styles.niveauxRow}>
          {NIVEAUX.map(n => (
            <TouchableOpacity
              key={n}
              style={[styles.niveauBtn, niveau === n && styles.niveauActive]}
              onPress={() => setNiveau(n)}
            >
              <Text style={[styles.niveauText, niveau === n && styles.niveauTextActive]}>
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          label="+ Ajouter cette langue"
          variant="secondary"
          onPress={handleAddLangue}
        />

        <Text style={styles.sectionLabel}>
          Centres d'intérêt ({loisirs.length} ajouté(s))
        </Text>

        {loisirs.length > 0 && (
          <View style={styles.chipRow}>
            {loisirs.map((l, i) => (
              <View key={i} style={styles.chip}>
                <Text style={styles.chipText}>{l}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <InputField
              label="Loisir"
              placeholder="Ex : Photographie"
              value={loisir}
              onChangeText={setLoisir}
            />
          </View>
          <View style={{ justifyContent: 'flex-end' }}>
            <Button label="+" onPress={handleAddLoisir} />
          </View>
        </View>

        <Button
          label="Choisir un template →"
          onPress={() => router.push('/templates')}
        />
        <Button
          label="← Retour"
          variant="outline"
          onPress={() => router.back()}
        />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, padding: 16, paddingTop: 48 },
  content: { padding: 20, gap: 14 },
  sectionLabel: { fontSize: 12, fontWeight: '500', color: Colors.primary },
  addedList: { gap: 6 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  cardTitle: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  cardSub: { fontSize: 11, color: Colors.textSecondary },
  niveauxRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  niveauBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  niveauActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  niveauText: { fontSize: 12, color: Colors.textSecondary },
  niveauTextActive: { color: Colors.white },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: { fontSize: 12, color: Colors.primary },
  row: { flexDirection: 'row', gap: 10, alignItems: 'flex-end' },
});