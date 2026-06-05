import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// ── DEBUG ──────────────────────────────────────────────────────────────────
console.log('SUPABASE URL:', supabaseUrl);
console.log('SUPABASE KEY:', supabaseKey ? `${supabaseKey.slice(0, 20)}...` : 'MANQUANTE ❌');
console.log('Platform:', Platform.OS);
// ──────────────────────────────────────────────────────────────────────────

// Adapter de stockage pour chaque plateforme
const getStorage = () => {
  if (Platform.OS === 'web') {
    // Web : utiliser localStorage
    return {
      getItem: (key: string) => {
        const value = localStorage.getItem(key);
        return Promise.resolve(value);
      },
      setItem: (key: string, value: string) => {
        localStorage.setItem(key, value);
        return Promise.resolve();
      },
      removeItem: (key: string) => {
        localStorage.removeItem(key);
        return Promise.resolve();
      },
    };
  } else {
    // Mobile : utiliser SecureStore (iOS/Android)
    return {
      getItem: (key: string) => SecureStore.getItemAsync(key),
      setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
      removeItem: (key: string) => SecureStore.deleteItemAsync(key),
    };
  }
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: getStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});