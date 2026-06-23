import { useEffect, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { supabase } from '../config/supabase';

export default function IndexScreen() {
  const navigated = useRef(false);

  useEffect(() => {
    if (navigated.current) return;

    const init = async () => {
      try {
        // Vérifier si onboarding déjà vu
        let vuOnboarding = false;
        try {
          if (Platform.OS === 'web') {
            vuOnboarding = localStorage.getItem('onboarding_done') === 'true';
          } else {
            const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
            const val = await AsyncStorage.getItem('onboarding_done');
            vuOnboarding = val === 'true';
          }
        } catch(e) {
          vuOnboarding = false;
        }

        if (!vuOnboarding) {
          if (!navigated.current) {
            navigated.current = true;
            router.replace('/onboarding');
          }
          return;
        }

        // Vérifier session Supabase
        const { data: { session } } = await supabase.auth.getSession();
        console.log('SESSION CHECK:', session ? '✅ Connecté' : '❌ Non connecté');

        if (!navigated.current) {
          navigated.current = true;
          if (session) {
            router.replace('/saved');
          } else {
            router.replace('/login');
          }
        }

      } catch (error: any) {
        console.error('Erreur init:', error);
        if (!navigated.current) {
          navigated.current = true;
          router.replace('/onboarding');
        }
      }
    };

    const timer = setTimeout(init, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#534AB7' }}>
      <ActivityIndicator color="#fff" size="large" />
    </View>
  );
}