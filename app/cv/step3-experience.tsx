import { View, ScrollView, Text, StyleSheet, Alert, Animated, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import ProgressBar from '../../components/ProgressBar';
import { useCVStore } from '../../store/cvStore';
import { Colors } from '../../constants/colors';

export default function Step3() {
  const { experiences, addExperience, removeExperience, updateExperience } = useCVStore();

  const [form, setForm] = useState({
    poste: '', entreprise: '', debut: '', fin: '', description: ''
  });
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
    if (!form.poste || !form.entreprise) {
      Alert.alert('Erreur', 'Le poste et l\'entreprise sont obligatoires.');
      return;
    }

    if (editIndex !== null) {
      // Modifier l'expérience existante
      updateExperience(editIndex, { ...form });
      setEditIndex(null);
      Alert.alert('✅ Modifié', `${form.poste} chez ${form.entreprise} modifié !`);
    } else {
      // Ajouter une nouvelle expérience
      addExperience({ ...form });
      Alert.alert('✅ Ajouté', `${form.poste} chez ${form.entreprise} ajouté !`);
    }

    setForm({ poste: '', entreprise: '', debut: '', fin: '', description: '' });
  };

  const handleEdit = (index: number) => {
    const exp = experiences[index];
    setForm({
      poste: exp.poste,
      entreprise: exp.entreprise,
      debut: exp.debut,
      fin: exp.fin,
      description: exp.description,
    });
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    Alert.alert(
      '🗑️ Supprimer',
      `Voulez-vous supprimer "${experiences[index].poste}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            removeExperience(index);
            if (editIndex === index) {
              setEditIndex(null);
              setForm({ poste: '', entreprise: '', debut: '', fin: '', description: '' });
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    setEditIndex(null);
    setForm({ poste: '', entreprise: '', debut: '', fin: '', description: '' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProgressBar step={3} total={6} />
      </View>

      <Animated.View style={[styles.animated, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <ScrollView contentContainerStyle={styles.content}>

          {/* Liste des expériences ajoutées */}
          {experiences.length > 0 && (
            <View style={styles.addedList}>
              <Text style={styles.addedTitle}>
                {experiences.length} expérience(s) ajoutée(s) ✅
              </Text>
              {experiences.map((exp, i) => (
                <View key={i} style={[styles.expCard, editIndex === i && styles.expCardEditing]}>
                  <View style={styles.expContent}>
                    <Text style={styles.expPoste}>{exp.poste}</Text>
                    <Text style={styles.expSub}>{exp.entreprise} · {exp.debut} – {exp.fin}</Text>
                    {exp.description ? (
                      <Text style={styles.expDesc} numberOfLines={2}>{exp.description}</Text>
                    ) : null}
                  </View>
                  <View style={styles.expActions}>
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
                ? `✏️ Modifier l'expérience n°${editIndex + 1}`
                : experiences.length === 0
                  ? 'Ajouter une expérience'
                  : 'Ajouter une autre expérience'
              }
            </Text>

            <InputField
              label="Intitulé du poste *"
              placeholder="Ex : Chef de projet"
              value={form.poste}
              onChangeText={set('poste')}
            />
            <InputField
              label="Entreprise *"
              placeholder="Nom de l'entreprise"
              value={form.entreprise}
              onChangeText={set('entreprise')}
            />
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InputField
                  label="Début"
                  placeholder="01/2022"
                  value={form.debut}
                  onChangeText={set('debut')}
                />
              </View>
              <View style={{ flex: 1 }}>
                <InputField
                  label="Fin"
                  placeholder="Présent"
                  value={form.fin}
                  onChangeText={set('fin')}
                />
              </View>
            </View>
            <InputField
              label="Description"
              placeholder="Décrivez vos missions..."
              value={form.description}
              onChangeText={set('description')}
              multiline
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
                label="+ Ajouter cette expérience"
                variant="secondary"
                onPress={handleAdd}
              />
            )}
          </View>

          <Button label="Suivant →" onPress={() => router.push('/cv/step4-formation')} />
          <Button label="← Retour" variant="outline" onPress={() => router.back()} />

        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: Colors.background },
  header:         { backgroundColor: Colors.primary, padding: 16, paddingTop: 48 },
  animated:       { flex: 1 },
  content:        { padding: 20, gap: 14 },
  addedList:      { backgroundColor: Colors.primaryLight, borderRadius: 10, padding: 12, gap: 8 },
  addedTitle:     { fontSize: 12, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  expCard:        { backgroundColor: Colors.white, borderRadius: 8, padding: 10, borderLeftWidth: 3, borderLeftColor: Colors.primary, flexDirection: 'row', alignItems: 'center', gap: 8 },
  expCardEditing: { borderLeftColor: '#f59e0b', backgroundColor: '#fffbeb' },
  expContent:     { flex: 1 },
  expPoste:       { fontSize: 12, fontWeight: '600', color: Colors.textPrimary },
  expSub:         { fontSize: 10, color: Colors.textSecondary, marginTop: 2 },
  expDesc:        { fontSize: 10, color: '#6b7280', marginTop: 3, fontStyle: 'italic' },
  expActions:     { flexDirection: 'row', gap: 6 },
  btnEdit:        { backgroundColor: '#eff6ff', borderRadius: 6, padding: 6 },
  btnEditText:    { fontSize: 16 },
  btnDelete:      { backgroundColor: '#fef2f2', borderRadius: 6, padding: 6 },
  btnDeleteText:  { fontSize: 16 },
  formSection:    { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 10, elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 1 }, shadowRadius: 3 },
  sectionLabel:   { fontSize: 13, fontWeight: '600', color: Colors.primary },
  row:            { flexDirection: 'row', gap: 10 },
  editBtns:       { gap: 8 },
});