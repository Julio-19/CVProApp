import { View, ScrollView, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { supabase } from '../config/supabase';
import { Colors } from '../constants/colors';

export default function SignupScreen() {
  const [form, setForm]       = useState({ prenom: '', nom: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleInscription = async () => {

    // ── DEBUG ────────────────────────────────────────────────────────────────
    console.log('=== SIGNUP DEBUG ===');
    console.log('PRENOM:', form.prenom);
    console.log('NOM:', form.nom);
    console.log('EMAIL:', form.email);
    console.log('PASSWORD LENGTH:', form.password.length);
    console.log('PASSWORD:', form.password); // temporaire
    console.log('===================');
    // ─────────────────────────────────────────────────────────────────────────

    // Validations
    if (!form.prenom.trim()) {
      Alert.alert('Erreur', 'Le prénom est obligatoire.');
      return;
    }
    if (!form.nom.trim()) {
      Alert.alert('Erreur', 'Le nom est obligatoire.');
      return;
    }
    if (!form.email.trim()) {
      Alert.alert('Erreur', 'L\'email est obligatoire.');
      return;
    }
    if (form.password.length < 6) {
      Alert.alert('Erreur', `Le mot de passe doit avoir au moins 6 caractères. Actuel: ${form.password.length}`);
      return;
    }

    try {
      setLoading(true);

      // Inscription
      const { data, error } = await supabase.auth.signUp({
        email:    form.email.trim(),
        password: form.password,
        options: {
          data: {
            prenom: form.prenom.trim(),
            nom:    form.nom.trim(),
          }
        }
      });

      console.log('SIGNUP RESULT:', JSON.stringify(data?.user?.email));
      console.log('SIGNUP ERROR:', JSON.stringify(error));

      if (error) throw error;
      if (!data.user) throw new Error('Utilisateur non créé');

      // Créer le profil
      const { error: profilError } = await supabase
        .from('profiles')
        .upsert(
          {
            id:     data.user.id,
            prenom: form.prenom.trim(),
            nom:    form.nom.trim(),
            email:  form.email.trim(),
          },
          { onConflict: 'id' }
        );

      if (profilError) {
        console.log('Profil erreur (ignorée):', profilError.message);
      }

      Alert.alert('✅ Compte créé !', 'Bienvenue sur CVPro !', [
        { text: 'Continuer', onPress: () => router.replace('/cv/step1-profil') },
      ]);

    } catch (error: any) {
      console.log('❌ ERREUR INSCRIPTION:', error.message);

      if (error.message.includes('already registered')) {
        Alert.alert('Erreur', 'Cet email est déjà utilisé. Connectez-vous.');
      } else if (error.message.includes('password')) {
        Alert.alert('Erreur mot de passe', `${error.message}\n\nLongueur saisie: ${form.password.length} caractères`);
      } else {
        Alert.alert('Erreur inscription', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Créer un compte</Text>

      <InputField
        label="Prénom *"
        placeholder="Jean"
        value={form.prenom}
        onChangeText={set('prenom')}
      />
      <InputField
        label="Nom *"
        placeholder="Dupont"
        value={form.nom}
        onChangeText={set('nom')}
      />
      <InputField
        label="Email *"
        placeholder="jean@email.com"
        value={form.email}
        onChangeText={set('email')}
        
      />
      <InputField
        label="Mot de passe * (min. 6 caractères)"
        placeholder="••••••••"
        value={form.password}
        onChangeText={set('password')}
        secureTextEntry
      />

      {/* Indicateur longueur mot de passe */}
      {form.password.length > 0 && (
        <Text style={[
          styles.passwordHint,
          { color: form.password.length >= 6 ? '#16a34a' : '#dc2626' }
        ]}>
          {form.password.length >= 6
            ? `✅ ${form.password.length} caractères — OK`
            : `❌ ${form.password.length}/6 caractères minimum`
          }
        </Text>
      )}

      {loading
        ? <ActivityIndicator color={Colors.primary} size="large" />
        : <Button label="Créer mon compte" onPress={handleInscription} />
      }

      <Text style={styles.loginLink} onPress={() => router.push('/login')}>
        Déjà un compte ?{' '}
        <Text style={{ color: Colors.primary }}>Se connecter</Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.background },
  content:      { padding: 20, gap: 14, paddingTop: 60 },
  title:        { fontSize: 28, fontWeight: '800', color: Colors.primary, marginBottom: 8 },
  passwordHint: { fontSize: 12, marginTop: -8 },
  loginLink:    { textAlign: 'center', fontSize: 13, color: Colors.textSecondary, marginTop: 8 },
});