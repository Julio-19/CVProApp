import {
  View, Text, StyleSheet, TouchableOpacity,
  Switch, ScrollView, Alert, Animated
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import {
  registerForPushNotifications,
  programmerRappel,
  annulerTousLesRappels,
  envoyerNotificationLocale,
} from '../services/notificationService';

export default function NotificationsSettingsScreen() {
  const [notifPaiement, setNotifPaiement] = useState(true);
  const [notifSauvegarde, setNotifSauvegarde] = useState(true);
  const [notifRappels, setNotifRappels]   = useState(false);
  const [permissionOk, setPermissionOk]  = useState(false);
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkPermission();
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const checkPermission = async () => {
    const token = await registerForPushNotifications();
    setPermissionOk(!!token);
  };

  const handleRappels = async (value: boolean) => {
    setNotifRappels(value);
    if (value) {
      await programmerRappel(24);
      Alert.alert('✅', 'Rappel programmé dans 24h');
    } else {
      await annulerTousLesRappels();
      Alert.alert('✅', 'Rappels désactivés');
    }
  };

  const testerNotification = async () => {
    await envoyerNotificationLocale(
      '🔔 Test CVPro',
      'Les notifications fonctionnent correctement !',
      { type: 'test' }
    );
    Alert.alert('✅', 'Notification envoyée ! Regardez votre barre de notifications.');
  };

  const ToggleItem = ({
    emoji, titre, sub, value, onToggle
  }: {
    emoji: string; titre: string; sub: string;
    value: boolean; onToggle: (v: boolean) => void;
  }) => (
    <View style={styles.toggleItem}>
      <View style={styles.toggleLeft}>
        <View style={styles.toggleIconBg}>
          <Text style={styles.toggleEmoji}>{emoji}</Text>
        </View>
        <View style={styles.toggleInfo}>
          <Text style={styles.toggleTitre}>{titre}</Text>
          <Text style={styles.toggleSub}>{sub}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#e5e7eb', true: '#534AB780' }}
        thumbColor={value ? '#534AB7' : '#f4f4f5'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={{ opacity: fadeAnim }}>

          {/* Statut permission */}
          <View style={[styles.permCard, { borderColor: permissionOk ? '#16a34a' : '#f59e0b' }]}>
            <Text style={styles.permEmoji}>{permissionOk ? '✅' : '⚠️'}</Text>
            <View style={styles.permInfo}>
              <Text style={styles.permTitre}>
                {permissionOk ? 'Notifications activées' : 'Notifications désactivées'}
              </Text>
              <Text style={styles.permSub}>
                {permissionOk
                  ? 'Vous recevrez les notifications CVPro'
                  : 'Activez les notifications dans les paramètres'}
              </Text>
            </View>
          </View>

          {/* Paramètres */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>⚙️ Paramètres</Text>

            <ToggleItem
              emoji="✅"
              titre="Confirmation de paiement"
              sub="Notifié quand votre paiement est confirmé"
              value={notifPaiement}
              onToggle={setNotifPaiement}
            />

            <ToggleItem
              emoji="💾"
              titre="Sauvegarde CV"
              sub="Notifié quand votre CV est sauvegardé"
              value={notifSauvegarde}
              onToggle={setNotifSauvegarde}
            />

            <ToggleItem
              emoji="⏰"
              titre="Rappels quotidiens"
              sub="Rappel pour compléter votre CV (24h)"
              value={notifRappels}
              onToggle={handleRappels}
            />
          </View>

          {/* Test */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🧪 Tester</Text>
            <Text style={styles.testSub}>
              Envoyez une notification test pour vérifier que tout fonctionne.
            </Text>
            <TouchableOpacity style={styles.testBtn} onPress={testerNotification}>
              <Text style={styles.testBtnText}>🔔 Envoyer une notification test</Text>
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              💡 Les notifications vous aident à ne pas oublier de compléter votre CV et vous informent de l'état de vos paiements en temps réel.
            </Text>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#f5f7fa' },
  header:         { backgroundColor: '#534AB7', paddingTop: 52, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  backBtn:        { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backText:       { color: '#fff', fontSize: 24, fontWeight: '300' },
  headerTitle:    { flex: 1, color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
  content:        { padding: 16, gap: 16, paddingBottom: 40 },
  permCard:       { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 2, elevation: 2 },
  permEmoji:      { fontSize: 32 },
  permInfo:       { flex: 1 },
  permTitre:      { fontSize: 14, fontWeight: '700', color: '#111' },
  permSub:        { fontSize: 12, color: '#888', marginTop: 2 },
  card:           { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  cardTitle:      { fontSize: 13, fontWeight: '700', color: '#111' },
  toggleItem:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleLeft:     { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  toggleIconBg:   { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0f4ff', alignItems: 'center', justifyContent: 'center' },
  toggleEmoji:    { fontSize: 18 },
  toggleInfo:     { flex: 1 },
  toggleTitre:    { fontSize: 13, fontWeight: '600', color: '#111' },
  toggleSub:      { fontSize: 11, color: '#888', marginTop: 2 },
  testSub:        { fontSize: 13, color: '#555', lineHeight: 20 },
  testBtn:        { backgroundColor: '#534AB7', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  testBtnText:    { color: '#fff', fontSize: 14, fontWeight: '700' },
  infoCard:       { backgroundColor: '#eff6ff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#bfdbfe' },
  infoText:       { fontSize: 12, color: '#1d4ed8', lineHeight: 18 },
});