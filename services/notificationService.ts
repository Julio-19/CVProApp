import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from '../config/supabase';

// ── Nouvelle API SDK 53 ───────────────────────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async (_notification) => ({
    shouldShowAlert:  true,
    shouldPlaySound:  true,
    shouldSetBadge:   false,
    shouldShowBanner: true,
    shouldShowList:   true,
  }),
});

// ── Push token ────────────────────────────────────────────────────────────────
export const registerForPushNotifications = async (): Promise<string | null> => {
  if (!Device.isDevice) {
    console.log('Émulateur détecté — notifications limitées');
    return null;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permission notifications refusée');
      return null;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('cvpro', {
        name:             'CVPro',
        importance:       Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor:       '#534AB7',
        sound:            'default',
      });
    }

    console.log('✅ Notifications locales activées');
    return 'local-only';

  } catch (error: any) {
    console.log('Notifications non disponibles:', error.message);
    return null;
  }
};

// ── Sauvegarder token ─────────────────────────────────────────────────────────
export const savePushToken = async (token: string) => {
  if (token === 'local-only') return;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('profiles').upsert(
      { id: user.id, push_token: token },
      { onConflict: 'id' }
    );
  } catch (error: any) {
    console.error('Erreur token:', error.message);
  }
};

// ── Notification locale immédiate ─────────────────────────────────────────────
export const envoyerNotificationLocale = async (
  titre: string,
  corps: string,
  data?: Record<string, any>
) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: titre,
        body:  corps,
        data:  data ?? {},
        sound: 'default',
      },
      trigger: null,
    });
    console.log('✅ Notification:', titre);
  } catch (error: any) {
    console.log('Erreur notification:', error.message);
  }
};

// ── Notifications prédéfinies ─────────────────────────────────────────────────
export const notifPaiementConfirme = (templateId: string) =>
  envoyerNotificationLocale(
    '✅ Paiement confirmé !',
    `Le template "${templateId.replace(/_/g, ' ')}" est maintenant actif.`,
    { type: 'paiement', templateId }
  );

export const notifCVSauvegarde = () =>
  envoyerNotificationLocale(
    '💾 CV sauvegardé !',
    'Votre CV a été sauvegardé en ligne avec succès.',
    { type: 'sauvegarde' }
  );

export const notifPDFGenere = (nom: string) =>
  envoyerNotificationLocale(
    '📄 PDF généré !',
    `Le CV de ${nom} est prêt à être téléchargé.`,
    { type: 'pdf' }
  );

export const notifCVIncomplet = () =>
  envoyerNotificationLocale(
    '📄 Complétez votre CV !',
    'Ajoutez vos expériences et formations.',
    { type: 'rappel' }
  );

// ── Rappel programmé ──────────────────────────────────────────────────────────
export const programmerRappel = async (heures: number = 24) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Rappel CVPro',
        body:  'N\'oubliez pas de compléter et télécharger votre CV !',
        data:  { type: 'rappel' },
      },
      trigger: {
        type:    Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: heures * 3600,
        repeats: false,
      },
    });
    console.log(`✅ Rappel dans ${heures}h`);
  } catch (error: any) {
    console.log('Erreur rappel:', error.message);
  }
};

export const annulerTousLesRappels = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log('✅ Rappels annulés');
};

// ── Listener clic notification ────────────────────────────────────────────────
export const setupNotificationListener = (
  onNotification: (data: Record<string, any>) => void
) => {
  return Notifications.addNotificationResponseReceivedListener(response => {
    const data = response.notification.request.content.data;
    onNotification(data);
  });
};