import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Animated, RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../config/supabase';

type Transaction = {
  id: string;
  fedapay_id: string;
  template_id: string;
  montant: number;
  mode_paiement: string;
  statut: string;
  created_at: string;
};

const STATUT_CONFIG: Record<string, { color: string; bg: string; label: string; emoji: string }> = {
  paye:        { color: '#16a34a', bg: '#f0fdf4', label: 'Payé',       emoji: '✅' },
  en_attente:  { color: '#f59e0b', bg: '#fffbeb', label: 'En attente', emoji: '⏳' },
  decline:     { color: '#dc2626', bg: '#fef2f2', label: 'Refusé',     emoji: '❌' },
  rembourse:   { color: '#6b7280', bg: '#f9fafb', label: 'Remboursé',  emoji: '↩️' },
};

const MODE_CONFIG: Record<string, { label: string; emoji: string }> = {
  mtn:    { label: 'MTN Mobile Money', emoji: '📱' },
  moov:   { label: 'Moov Money',       emoji: '💳' },
  carte:  { label: 'Carte bancaire',   emoji: '🏦' },
  inconnu:{ label: 'Inconnu',          emoji: '❓' },
};

export default function HistoriquePaiementsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [totalDepense, setTotalDepense] = useState(0);
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => { charger(); }, []);

  const charger = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const txs = data ?? [];
      setTransactions(txs);

      // Calcul total dépensé
      const total = txs
        .filter(t => t.statut === 'paye')
        .reduce((acc, t) => acc + (t.montant ?? 0), 0);
      setTotalDepense(total);

      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
      ]).start();

    } catch (e: any) {
      console.error(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); charger(); };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const getNomTemplate = (id: string) =>
    id?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) ?? 'Template';

  const renderTransaction = ({ item: tx }: { item: Transaction }) => {
    const statut = STATUT_CONFIG[tx.statut] ?? STATUT_CONFIG['en_attente'];
    const mode   = MODE_CONFIG[tx.mode_paiement] ?? MODE_CONFIG['inconnu'];

    return (
      <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.statusBadge, { backgroundColor: statut.bg }]}>
            <Text style={styles.statusEmoji}>{statut.emoji}</Text>
            <Text style={[styles.statusLabel, { color: statut.color }]}>{statut.label}</Text>
          </View>
          <Text style={styles.montant}>{(tx.montant ?? 0).toLocaleString()} XOF</Text>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🎨 Template</Text>
            <Text style={styles.infoValue}>{getNomTemplate(tx.template_id)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{mode.emoji} Mode</Text>
            <Text style={styles.infoValue}>{mode.label}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🕐 Date</Text>
            <Text style={styles.infoValue}>{formatDate(tx.created_at)}</Text>
          </View>
          {tx.fedapay_id && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🔖 Référence</Text>
              <Text style={[styles.infoValue, styles.reference]}>#{tx.fedapay_id}</Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  const nbPayes     = transactions.filter(t => t.statut === 'paye').length;
  const nbAttente   = transactions.filter(t => t.statut === 'en_attente').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Historique des achats</Text>
          <Text style={styles.headerSub}>{transactions.length} transaction(s)</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <Text style={styles.refreshText}>↺</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      {!loading && transactions.length > 0 && (
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{totalDepense.toLocaleString()}</Text>
            <Text style={styles.statLabel}>XOF dépensés</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: '#16a34a' }]}>{nbPayes}</Text>
            <Text style={styles.statLabel}>Payés</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: '#f59e0b' }]}>{nbAttente}</Text>
            <Text style={styles.statLabel}>En attente</Text>
          </View>
        </View>
      )}

      {/* Contenu */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#534AB7" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🧾</Text>
          <Text style={styles.emptyTitle}>Aucune transaction</Text>
          <Text style={styles.emptySub}>
            Vos achats de templates apparaîtront ici.
          </Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/templates')}>
            <Text style={styles.emptyBtnText}>🎨 Voir les templates</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={t => t.id}
          renderItem={renderTransaction}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#534AB7']}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#f5f7fa' },
  header:           { backgroundColor: '#534AB7', paddingTop: 52, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  backBtn:          { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backText:         { color: '#fff', fontSize: 24, fontWeight: '300' },
  headerCenter:     { flex: 1, alignItems: 'center' },
  headerTitle:      { color: '#fff', fontSize: 18, fontWeight: '600' },
  headerSub:        { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  refreshBtn:       { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  refreshText:      { color: '#fff', fontSize: 22 },
  statsBar:         { backgroundColor: '#fff', flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  statItem:         { flex: 1, alignItems: 'center' },
  statNum:          { fontSize: 20, fontWeight: '800', color: '#534AB7' },
  statLabel:        { fontSize: 11, color: '#888', marginTop: 2 },
  statDivider:      { width: 1, backgroundColor: '#eee' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText:      { color: '#888', fontSize: 14 },
  emptyContainer:   { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
  emptyEmoji:       { fontSize: 64 },
  emptyTitle:       { fontSize: 20, fontWeight: '700', color: '#111' },
  emptySub:         { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 22 },
  emptyBtn:         { backgroundColor: '#534AB7', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 28 },
  emptyBtnText:     { color: '#fff', fontSize: 14, fontWeight: '700' },
  list:             { padding: 16, paddingBottom: 40 },
  card:             { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6 },
  cardHeader:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  statusBadge:      { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusEmoji:      { fontSize: 14 },
  statusLabel:      { fontSize: 12, fontWeight: '700' },
  montant:          { fontSize: 18, fontWeight: '800', color: '#534AB7' },
  cardBody:         { padding: 14, gap: 10 },
  infoRow:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel:        { fontSize: 12, color: '#888' },
  infoValue:        { fontSize: 12, fontWeight: '600', color: '#111', maxWidth: '60%', textAlign: 'right' },
  reference:        { color: '#534AB7', fontSize: 11 },
});