import { Stack } from 'expo-router';

export default function RootLayout() {
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
    </Stack>
  );
}

