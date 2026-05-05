import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator, Animated
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../config/supabase';
import { useCVStore } from '../store/cvStore';
import InputField from '../components/InputField';

type Profil = {
  prenom: string;
  nom: string;
  email: string;
};

export default function ProfilScreen() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [profil, setProfil]   = useState<Profil>({ prenom: '', nom: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [achetes, setAchetes] = useState<string[]>([]);
  const [nbCVs, setNbCVs]     = useState(0);
  const reset                 = useCVStore(s => s.reset);
  const fadeAnim              = useRef(new Animated.Value(0)).current;

  useEffect(() => { chargerProfil(); }, []);

  const chargerProfil = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }

      if (user.email === 'sounoujulio@gmail.com') {
        setIsAdmin(true);
      }

      const { data: p } = await supabase
        .from('profiles').select('prenom, nom').eq('id', user.id).single();
      setProfil({ prenom: p?.prenom ?? '', nom: p?.nom ?? '', email: user.email ?? '' });

      const { data: t } = await supabase
        .from('templates_achetes').select('template_id').eq('user_id', user.id);
      setAchetes((t ?? []).map((r: any) => r.template_id));

      const { count } = await supabase
        .from('cvs').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      setNbCVs(count ?? 0);

      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    } catch (e: any) {
      Alert.alert('Erreur', e.message);
    } finally {
      setLoading(false);
    }
  };

  const sauvegarderProfil = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from('profiles').upsert(
        { id: user.id, prenom: profil.prenom.trim(), nom: profil.nom.trim(), email: profil.email },
        { onConflict: 'id' }
      );
      Alert.alert('✅ Profil mis à jour !');
    } catch (e: any) {
      Alert.alert('Erreur', e.message);
    } finally {
      setSaving(false);
    }
  };

  const deconnexion = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnecter',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          reset();
          router.replace('/');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#534AB7" />
      </View>
    );
  }

  const initiales = `${profil.prenom?.[0] ?? ''}${profil.nom?.[0] ?? ''}`.toUpperCase() || '?';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Profil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initiales}</Text>
            </View>
            <Text style={styles.avatarName}>{profil.prenom} {profil.nom}</Text>
            <Text style={styles.avatarEmail}>{profil.email}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsCard}>
            {[
              { num: nbCVs,          label: 'CVs créés',    emoji: '📄' },
              { num: achetes.length, label: 'Templates',     emoji: '🎨' },
              { num: nbCVs * 1000,   label: 'XOF investis', emoji: '💰' },
            ].map((s, i) => (
              <View key={i} style={styles.statItem}>
                <Text style={styles.statEmoji}>{s.emoji}</Text>
                <Text style={styles.statNum}>{s.num}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Modifier profil */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>✏️ Modifier le profil</Text>
            <InputField label="Prénom" placeholder="Jean" value={profil.prenom}
              onChangeText={v => setProfil(p => ({ ...p, prenom: v }))} />
            <InputField label="Nom" placeholder="Dupont" value={profil.nom}
              onChangeText={v => setProfil(p => ({ ...p, nom: v }))} />
            <InputField label="Email" placeholder="jean@email.com" value={profil.email}
              onChangeText={v => setProfil(p => ({ ...p, email: v }))} />
            <TouchableOpacity
              style={[styles.btnSave, saving && styles.btnDisabled]}
              onPress={sauvegarderProfil}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={styles.btnSaveText}>Sauvegarder</Text>
              }
            </TouchableOpacity>
          </View>

          {/* Templates achetés */}
          {achetes.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🎨 Templates achetés ({achetes.length})</Text>
              <View style={styles.templatesList}>
                {achetes.map((t, i) => (
                  <View key={i} style={styles.templateItem}>
                    <Text style={styles.templateDot}>✓</Text>
                    <Text style={styles.templateName}>
                      {t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Menu compte */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>⚙️ Compte</Text>

            {[
              { icon: '📂', label: 'Mes CVs sauvegardés',   route: '/mes-cvs' },
              { icon: '🎨', label: 'Parcourir les templates', route: '/templates' },
              { icon: '🧾', label: 'Historique des achats',  route: '/historique-paiements' },
              { icon: '🔔', label: 'Notifications',          route: '/notifications-settings' },
              { icon: '⚙️', label: 'Paramètres', route: '/parametres' },
            ].map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.menuItem}
                onPress={() => router.push(item.route as any)}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuArrow}>→</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemDanger]}
              onPress={deconnexion}
            >
              <Text style={styles.menuIcon}>🚪</Text>
              <Text style={[styles.menuLabel, { color: '#dc2626' }]}>Se déconnecter</Text>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>

            {isAdmin && (
              <TouchableOpacity
                    style={[styles.menuItem, { backgroundColor: '#1a1a2e08' }]}
                    onPress={() => router.push('/admin')}
  >
                <Text style={styles.menuIcon}>📊</Text>
                <Text style={[styles.menuLabel, { color: '#1a1a2e' }]}>Dashboard Admin</Text>
                <Text style={styles.menuArrow}>→</Text>
                </TouchableOpacity>
                )}
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#f5f7fa' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header:           { backgroundColor: '#534AB7', paddingTop: 52, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  backBtn:          { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backText:         { color: '#fff', fontSize: 24, fontWeight: '300' },
  headerTitle:      { flex: 1, color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
  content:          { padding: 20, gap: 16, paddingBottom: 40 },
  avatarSection:    { alignItems: 'center', gap: 8, paddingVertical: 16 },
  avatar:           { width: 80, height: 80, borderRadius: 40, backgroundColor: '#534AB7', alignItems: 'center', justifyContent: 'center' },
  avatarText:       { color: '#fff', fontSize: 28, fontWeight: '800' },
  avatarName:       { fontSize: 20, fontWeight: '700', color: '#111' },
  avatarEmail:      { fontSize: 13, color: '#888' },
  statsCard:        { backgroundColor: '#fff', borderRadius: 16, padding: 20, flexDirection: 'row', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  statItem:         { flex: 1, alignItems: 'center', gap: 4 },
  statEmoji:        { fontSize: 22 },
  statNum:          { fontSize: 20, fontWeight: '800', color: '#534AB7' },
  statLabel:        { fontSize: 10, color: '#888', textAlign: 'center' },
  card:             { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  cardTitle:        { fontSize: 13, fontWeight: '700', color: '#111', marginBottom: 4 },
  btnSave:          { backgroundColor: '#534AB7', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  btnSaveText:      { color: '#fff', fontSize: 15, fontWeight: '700' },
  btnDisabled:      { opacity: 0.55 },
  templatesList:    { gap: 8 },
  templateItem:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  templateDot:      { color: '#16a34a', fontSize: 14, fontWeight: '700' },
  templateName:     { fontSize: 13, color: '#374151' },
  menuItem:         { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  menuItemDanger:   { borderBottomWidth: 0 },
  menuIcon:         { fontSize: 20, width: 28 },
  menuLabel:        { flex: 1, fontSize: 14, color: '#374151', fontWeight: '500' },
  menuArrow:        { fontSize: 16, color: '#aaa' },
});