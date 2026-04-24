import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCVStore } from '../store/cvStore';
import { Colors } from '../constants/colors';
import { useEffect, useRef } from 'react';
import { supabase } from '../config/supabase';
import {
  registerForPushNotifications,
  savePushToken,
  setupNotificationListener,
  programmerRappel,
} from '../services/notificationService';

export default function SplashScreen() {
  const reset = useCVStore(state => state.reset);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => { checkSession(); }, []);

  const checkSession = async () => {
    try {
      // Vérifier onboarding
      const onboardingDone = await AsyncStorage.getItem('onboarding_done');
      if (!onboardingDone) {
        router.replace('/onboarding');
        return;
      }

      // Initialiser les notifications
      const pushToken = await registerForPushNotifications();
      if (pushToken) await savePushToken(pushToken);

      // Écouter les clics sur notifications
      setupNotificationListener((data) => {
        if (data.type === 'paiement') router.push('/historique-paiements');
        if (data.type === 'rappel')   router.push('/cv/step1-profil');
        if (data.type === 'pdf')      router.push('/saved');
      });

      // Vérifier session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('SESSION CHECK:', session ? '✅ Connecté' : '❌ Non connecté');

      if (session) {
        router.replace('/cv/step1-profil');
        return;
      }

      // Pas connecté → afficher splash
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      ]).start();

    } catch (error) {
      console.log('Erreur check session:', error);
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }
  };

  const handleReset = async () => {
    reset();
    await AsyncStorage.clear();
    console.log('Reset ✅');
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <Animated.View style={[
        styles.hero,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }
      ]}>
        <Text style={styles.emoji}>📄</Text>
        <Text style={styles.logo}>CVPro</Text>
        <Text style={styles.tagline}>Créez votre CV professionnel{'\n'}en quelques minutes</Text>
      </Animated.View>

      <Animated.View style={[styles.actions, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/signup')}>
          <Text style={styles.btnPrimaryText}>✨ Créer un compte</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSecondary} onPress={() => router.push('/login')}>
          <Text style={styles.btnSecondaryText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnOutline} onPress={() => router.push('/profil')}>
          <Text style={styles.btnOutlineText}>👤 Mon profil</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
          <Text style={styles.resetText}>Réinitialiser (debug)</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: Colors.primary, justifyContent: 'space-between', padding: 24, paddingBottom: 48, overflow: 'hidden' },
  circle1:          { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255,255,255,0.06)', top: -80, right: -60 },
  circle2:          { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.04)', bottom: 120, left: -60 },
  hero:             { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emoji:            { fontSize: 64, marginBottom: 8 },
  logo:             { fontSize: 42, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  tagline:          { fontSize: 15, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 22 },
  actions:          { gap: 12 },
  btnPrimary:       { backgroundColor: '#fff', borderRadius: 16, paddingVertical: 18, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 },
  btnPrimaryText:   { fontSize: 16, fontWeight: '700', color: Colors.primary },
  btnSecondary:     { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, paddingVertical: 18, alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)' },
  btnSecondaryText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  btnOutline:       { backgroundColor: 'transparent', borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)' },
  btnOutlineText:   { fontSize: 15, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  resetBtn:         { padding: 10, alignItems: 'center' },
  resetText:        { fontSize: 11, color: 'rgba(255,255,255,0.45)', textDecorationLine: 'underline' },
});