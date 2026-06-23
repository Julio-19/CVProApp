import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';
import { Platform } from 'react-native';

export default function IndexScreen() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Vérifier onboarding
        let vuOnboarding = false;
        try {
          if (Platform.OS === 'web') {
            vuOnboarding = localStorage.getItem('onboarding_done') === 'true';
          } else {
            const val = await AsyncStorage.getItem('onboarding_done');
            vuOnboarding = val === 'true';
          }
        } catch (e) {
          vuOnboarding = false;
        }

        if (!vuOnboarding) {
          if (mounted) router.replace('/onboarding');
          return;
        }

        // Vérifier session
        const { data: { session } } = await supabase.auth.getSession();
        console.log('SESSION CHECK:', session ? '✅ Connecté' : '❌ Non connecté');

        if (mounted) {
          if (session) {
            router.replace('/saved');
          } else {
            router.replace('/login');
          }
        }
      } catch (error) {
        console.error('Erreur init:', error);
        if (mounted) router.replace('/login');
      } finally {
        if (mounted) setChecking(false);
      }
    };

    // Délai pour éviter la boucle
    const timer = setTimeout(init, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#534AB7' }}>
      <ActivityIndicator color="#fff" size="large" />
    </View>
  );
}