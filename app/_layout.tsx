import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web' && 'serviceWorker' in navigator) {
      // 1. Supprimer tous les anciens caches
      caches.keys().then(keys => {
        keys.forEach(key => {
          caches.delete(key);
          console.log('Cache supprimé:', key);
        });
      });

      // 2. Enregistrer notre nouveau SW sans cache
      navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
        .then(reg => {
          console.log('✅ SW enregistré');
          // Forcer la mise à jour immédiate
          reg.update();
        })
        .catch(err => console.log('SW erreur:', err));

      // 3. Quand un nouveau SW est disponible, recharger automatiquement
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 Nouveau SW actif');
      });
    }
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="templates" />
      <Stack.Screen name="saved" />
      <Stack.Screen name="paiement" />
      <Stack.Screen name="mes-cvs" />
      <Stack.Screen name="profil" />
      <Stack.Screen name="preview" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="cv/step1-profil" />
      <Stack.Screen name="cv/step2-photo" />
      <Stack.Screen name="cv/step3-experience" />
      <Stack.Screen name="cv/step4-formation" />
      <Stack.Screen name="cv/step5-competences" />
      <Stack.Screen name="cv/step6-langues" />
      <Stack.Screen name="cv/edit-reseaux" />
      <Stack.Screen name="cv/edit-certifications" />
      <Stack.Screen name="cv/edit-projets" />
      <Stack.Screen name="historique-paiements" />
      <Stack.Screen name="notifications-settings" />
      <Stack.Screen name="admin" />
      <Stack.Screen name="parametres" />
    </Stack>
  );
}