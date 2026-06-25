import { View, ScrollView, Text, StyleSheet, Alert, Animated, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import ProgressBar from '../../components/ProgressBar';
import { useCVStore } from '../../store/cvStore';
import { Colors } from '../../constants/colors';

export default function Step4() {
  const { formations, addFormation, removeFormation, updateFormation } = useCVStore();

  const [form, setForm] = useState({ diplome: '', etablissement: '', annee: '' });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: Platform.OS !== 'web' }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 8, useNativeDriver: Platform.OS !== 'web' }),
    ]).start();
  }, []);

  const handleAdd = () => {
    if (!form.diplome || !form.etablissement) {
      Alert.alert('Erreur', 'Le diplôme et l\'établissement sont obligatoires.');
      return;
    }

    if (editIndex !== null) {
      updateFormation(editIndex, { ...form });
      setEditIndex(null);
      Alert.alert('✅ Modifié', `${form.diplome} modifié !`);
    } else {
      addFormation({ ...form });
      Alert.alert('✅ Ajouté', `${form.diplome} ajouté !`);
    }

    setForm({ diplome: '', etablissement: '', annee: '' });
  };

  const handleEdit = (index: number) => {
    const f = formations[index];
    setForm({ diplome: f.diplome, etablissement: f.etablissement, annee: f.annee });
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    Alert.alert(
      '🗑️ Supprimer',
      `Voulez-vous supprimer "${formations[index].diplome}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            removeFormation(index);
            if (editIndex === index) {
              setEditIndex(null);
              setForm({ diplome: '', etablissement: '', annee: '' });
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    setEditIndex(null);
    setForm({ diplome: '', etablissement: '', annee: '' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProgressBar step={4} total={6} />
      </View>

      <Animated.View style={[styles.animated, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <ScrollView contentContainerStyle={styles.content}>

          {/* Liste des formations ajoutées */}
          {formations.length > 0 && (
            <View style={styles.addedList}>
              <Text style={styles.addedTitle}>
                {formations.length} formation(s) ajoutée(s) ✅
              </Text>
              {formations.map((f, i) => (
                <View key={i} style={[styles.card, editIndex === i && styles.cardEditing]}>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{f.diplome}</Text>
                    <Text style={styles.cardSub}>{f.etablissement} · {f.annee}</Text>
                  </View>
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.btnEdit}
                      onPress={() => handleEdit(i)}
                    >
                      <Text style={styles.btnEditText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btnDelete}
                      onPress={() => handleDelete(i)}
                    >
                      <Text style={styles.btnDeleteText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Formulaire */}
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>
              {editIndex !== null
                ? `✏️ Modifier la formation n°${editIndex + 1}`
                : formations.length === 0
                  ? 'Ajouter une formation'
                  : 'Ajouter une autre formation'
              }
            </Text>

            <InputField
              label="Diplôme obtenu *"
              placeholder="Ex : Licence Informatique"
              value={form.diplome}
              onChangeText={set('diplome')}
            />
            <InputField
              label="Établissement *"
              placeholder="Université, école..."
              value={form.etablissement}
              onChangeText={set('etablissement')}
            />
            <InputField
              label="Année d'obtention"
              placeholder="2023"
              value={form.annee}
              onChangeText={set('annee')}
            />

            {editIndex !== null ? (
              <View style={styles.editBtns}>
                <Button
                  label="✅ Enregistrer les modifications"
                  variant="secondary"
                  onPress={handleAdd}
                />
                <Button
                  label="❌ Annuler"
                  variant="outline"
                  onPress={handleCancel}
                />
              </View>
            ) : (
              <Button
                label="+ Ajouter cette formation"
                variant="secondary"
                onPress={handleAdd}
              />
            )}
          </View>

          <Button label="Suivant →" onPress={() => router.push('/cv/step5-competences')} />
          <Button label="← Retour" variant="outline" onPress={() => router.back()} />

        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.background },
  header:       { backgroundColor: Colors.primary, padding: 16, paddingTop: 48 },
  animated:     { flex: 1 },
  content:      { padding: 20, gap: 14 },
  addedList:    { backgroundColor: Colors.primaryLight, borderRadius: 10, padding: 12, gap: 8 },
  addedTitle:   { fontSize: 12, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  card:         { backgroundColor: Colors.white, borderRadius: 8, padding: 10, borderLeftWidth: 3, borderLeftColor: Colors.primaryMuted, flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardEditing:  { borderLeftColor: '#f59e0b', backgroundColor: '#fffbeb' },
  cardContent:  { flex: 1 },
  cardTitle:    { fontSize: 12, fontWeight: '600', color: Colors.textPrimary },
  cardSub:      { fontSize: 10, color: Colors.textSecondary, marginTop: 2 },
  cardActions:  { flexDirection: 'row', gap: 6 },
  btnEdit:      { backgroundColor: '#eff6ff', borderRadius: 6, padding: 6 },
  btnEditText:  { fontSize: 16 },
  btnDelete:    { backgroundColor: '#fef2f2', borderRadius: 6, padding: 6 },
  btnDeleteText:{ fontSize: 16 },
  formSection:  { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 10, elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 1 }, shadowRadius: 3 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  editBtns:     { gap: 8 },
});