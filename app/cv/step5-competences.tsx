import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import ProgressBar from '../../components/ProgressBar';
import { useCVStore } from '../../store/cvStore';
import { Colors } from '../../constants/colors';

export default function Step5() {
  const { competences, addCompetence, removeCompetence } = useCVStore();
  const [input, setInput] = useState('');

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleAdd = () => {
    const val = input.trim();
    if (!val) {
      Alert.alert('Erreur', 'Entrez une compétence.');
      return;
    }
    if (competences.includes(val)) {
      Alert.alert('Erreur', 'Cette compétence existe déjà.');
      return;
    }
    addCompetence(val);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProgressBar step={5} total={6} />
      </View>

      <Animated.View style={[
        styles.animated,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}>
        <ScrollView contentContainerStyle={styles.content}>

          <Text style={styles.sectionLabel}>
            Compétences ({competences.length} ajoutée(s))
          </Text>

          {competences.length > 0 && (
            <View style={styles.chipRow}>
              {competences.map((c, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.chip}
                  onPress={() => removeCompetence(c)}
                >
                  <Text style={styles.chipText}>{c} ×</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <InputField
                label="Ajouter une compétence"
                placeholder="Ex : React Native"
                value={input}
                onChangeText={setInput}
              />
            </View>
            <View style={{ justifyContent: 'flex-end' }}>
              <Button label="+" onPress={handleAdd} />
            </View>
          </View>

          {competences.length === 0 && (
            <Text style={styles.hint}>
              Appuyez sur "+" pour ajouter chaque compétence
            </Text>
          )}

          <Button label="Suivant →" onPress={() => router.push('/cv/step6-langues')} />
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
  sectionLabel:{ fontSize: 12, fontWeight: '500', color: Colors.primary },
  chipRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:        { backgroundColor: Colors.primaryLight, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  chipText:    { fontSize: 12, color: Colors.primary },
  row:         { flexDirection: 'row', gap: 10, alignItems: 'flex-end' },
  hint:        { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', fontStyle: 'italic' },
});