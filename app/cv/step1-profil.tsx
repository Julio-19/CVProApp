import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { useCVStore } from '../../store/cvStore';
import { Colors } from '../../constants/colors';

export default function Step1() {
  const { titre, objectif, telephone, ville, prenom, nom, email, setField } = useCVStore();
  //const { titre, objectif, telephone, ville, setField } = useCVStore();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProgressBar step={1} total={6} />
      </View>

      <Animated.View style={[
        styles.animated,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}>
        <ScrollView contentContainerStyle={styles.content}>
          // Et les InputField correspondants
<InputField
  label="Prénom *"
  placeholder="Jean"
  value={prenom}
  onChangeText={(v) => setField('prenom', v)}
/>
<InputField
  label="Nom *"
  placeholder="Dupont"
  value={nom}
  onChangeText={(v) => setField('nom', v)}
/>
<InputField
  label="Email *"
  placeholder="jean@email.com"
  value={email}
  onChangeText={(v) => setField('email', v)}
/>  
          <InputField
            label="Titre du poste visé"
            placeholder="Ex : Développeur Web, Comptable..."
            value={titre}
            onChangeText={(v) => setField('titre', v)}
          />
          <InputField
            label="À propos de moi"
            placeholder="Décrivez votre profil en 2-3 phrases..."
            value={objectif}
            onChangeText={(v) => setField('objectif', v)}
            multiline
          />
          <InputField
            label="Téléphone"
            placeholder="+229 xx xx xx xx"
            value={telephone}
            onChangeText={(v) => setField('telephone', v)}
          />
          <InputField
            label="Ville"
            placeholder="Cotonou"
            value={ville}
            onChangeText={(v) => setField('ville', v)}
          />
          <Button label="Suivant →" onPress={() => router.push('/cv/step2-photo')} />
          <Button label="← Retour" variant="outline" onPress={() => router.back()} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header:    { backgroundColor: Colors.primary, padding: 16, paddingTop: 48 },
  animated:  { flex: 1 },
  content:   { padding: 20, gap: 14 },
});