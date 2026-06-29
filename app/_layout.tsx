import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    let lastHidden = 0;

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        lastHidden = Date.now();
      } else if (document.visibilityState === 'visible') {
        const hiddenDuration = Date.now() - lastHidden;
        // Si l'app était en arrière-plan plus de 5 minutes → recharger
        if (lastHidden > 0 && hiddenDuration > 5 * 60 * 1000) {
          console.log('🔄 Rechargement après arrière-plan');
          window.location.reload();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
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