import { View, ScrollView, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { supabase } from '../config/supabase';
import { Colors } from '../constants/colors';

export default function LoginScreen() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleConnexion = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email:    form.email.trim(),
        password: form.password,
      });

      console.log('=== LOGIN DEBUG ===');
      console.log('USER:', data?.user?.email);
      console.log('SESSION:', data?.session ? '✅ OK' : '❌ NULL');
      console.log('ERROR:', error?.message);
      console.log('==================');

      if (error) {
        // Traduire les erreurs en français
        if (error.message.includes('Email not confirmed')) {
          Alert.alert(
            'Email non confirmé',
            'Allez sur Supabase Dashboard → Authentication → Settings et désactivez "Enable email confirmations".',
          );
        } else if (error.message.includes('Invalid login credentials')) {
          Alert.alert('Erreur', 'Email ou mot de passe incorrect.');
        } else {
          Alert.alert('Erreur connexion', error.message);
        }
        return;
      }

      if (!data.session) {
        Alert.alert('Erreur', 'Session non créée. Réessayez.');
        return;
      }

      console.log('✅ Connexion réussie !');

      // Attendre que la session soit bien sauvegardée
      await new Promise(r => setTimeout(r, 500));

      // Vérifier que la session est bien là
      const { data: { user } } = await supabase.auth.getUser();
      console.log('USER APRÈS LOGIN:', user?.email);

      router.replace('/');

    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Connexion</Text>
      <InputField
        label="Email"
        placeholder="jean@email.com"
        value={form.email}
        onChangeText={set('email')}
      />
      <InputField
        label="Mot de passe"
        placeholder="••••••••"
        value={form.password}
        onChangeText={set('password')}
        secureTextEntry
      />
      {loading
        ? <ActivityIndicator color={Colors.primary} size="large" />
        : <Button label="Se connecter" onPress={handleConnexion} />
      }
      <Text style={styles.signupLink} onPress={() => router.push('/signup')}>
        Pas encore de compte ?{' '}
        <Text style={{ color: Colors.primary }}>S'inscrire</Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.background },
  content:    { padding: 20, gap: 14, paddingTop: 60 },
  title:      { fontSize: 28, fontWeight: '800', color: Colors.primary, marginBottom: 8 },
  signupLink: { textAlign: 'center', fontSize: 13, color: Colors.textSecondary, marginTop: 8 },
});