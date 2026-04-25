import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../config/supabase";

// ⚠️ Remplacez par votre email admin
const ADMIN_EMAIL = "sounoujulio@gmail.com";

type Stats = {
  totalUsers: number;
  totalCVs: number;
  totalTransactions: number;
  totalRevenu: number;
  transactionsPaye: number;
  transactionsAttente: number;
};

type Transaction = {
  id: string;
  fedapay_id: string;
  template_id: string;
  montant: number;
  mode_paiement: string;
  statut: string;
  created_at: string;
  user_email?: string;
};

type User = {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  created_at: string;
  nb_cvs: number;
  nb_achats: number;
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "stats" | "transactions" | "users"
  >("stats");
  const [stats, setStats] = useState<Stats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    verifierAdmin();
  }, []);

  const verifierAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
    
    console.log('=== ADMIN CHECK ===');
    console.log('USER EMAIL:', user?.email);
    console.log('ADMIN EMAIL:', ADMIN_EMAIL);
    console.log('MATCH:', user?.email === ADMIN_EMAIL);
    console.log('==================');
    
    if (!user || user.email !== ADMIN_EMAIL) {
      Alert.alert('Accès refusé', `Email: ${user?.email}\nAdmin requis: ${ADMIN_EMAIL}`);
      router.replace('/');
      return;
    }
      setIsAdmin(true);
      await chargerDonnees();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } catch (e: any) {
      Alert.alert("Erreur", e.message);
    } finally {
      setLoading(false);
    }
  };

  const chargerDonnees = async () => {
    await Promise.all([chargerStats(), chargerTransactions(), chargerUsers()]);
  };

  const chargerStats = async () => {
    try {
      // Total transactions
      const { data: txs } = await supabase
        .from("transactions")
        .select("montant, statut");

      const total = txs ?? [];
      const payees = total.filter((t) => t.statut === "paye");
      const enAttente = total.filter((t) => t.statut === "en_attente");
      const revenu = payees.reduce((acc, t) => acc + (t.montant ?? 0), 0);

      // Total CVs
      const { count: nbCVs } = await supabase
        .from("cvs")
        .select("*", { count: "exact", head: true });

      // Total users
      const { count: nbUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      setStats({
        totalUsers: nbUsers ?? 0,
        totalCVs: nbCVs ?? 0,
        totalTransactions: total.length,
        totalRevenu: revenu,
        transactionsPaye: payees.length,
        transactionsAttente: enAttente.length,
      });
    } catch (e: any) {
      console.error("Erreur stats:", e.message);
    }
  };

  const chargerTransactions = async () => {
    try {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      setTransactions(data ?? []);
    } catch (e: any) {
      console.error("Erreur transactions:", e.message);
    }
  };

  const chargerUsers = async () => {
    try {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, prenom, nom, email, created_at")
        .order("created_at", { ascending: false });

      if (!profiles) return;

      const usersWithStats = await Promise.all(
        profiles.map(async (p) => {
          const { count: nbCVs } = await supabase
            .from("cvs")
            .select("*", { count: "exact", head: true })
            .eq("user_id", p.id);
          const { count: nbAchats } = await supabase
            .from("templates_achetes")
            .select("*", { count: "exact", head: true })
            .eq("user_id", p.id);
          return { ...p, nb_cvs: nbCVs ?? 0, nb_achats: nbAchats ?? 0 };
        }),
      );
      setUsers(usersWithStats);
    } catch (e: any) {
      console.error("Erreur users:", e.message);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await chargerDonnees();
    setRefreshing(false);
  };

  const confirmerTransaction = async (tx: Transaction) => {
    Alert.alert(
      "Confirmer le paiement",
      `Confirmer manuellement le paiement de ${tx.montant?.toLocaleString()} XOF pour ${tx.template_id} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: async () => {
            await supabase
              .from("transactions")
              .update({ statut: "paye" })
              .eq("id", tx.id);
            await supabase.from("templates_achetes").upsert(
              {
                user_id: tx.id,
                template_id: tx.template_id,
                acheteur_le: new Date().toISOString(),
              },
              { onConflict: "user_id,template_id" },
            );
            await chargerDonnees();
            Alert.alert("✅ Confirmé !");
          },
        },
      ],
    );
  };

  const rembourserTransaction = async (tx: Transaction) => {
    Alert.alert("Rembourser", `Marquer cette transaction comme remboursée ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Rembourser",
        style: "destructive",
        onPress: async () => {
          await supabase
            .from("transactions")
            .update({ statut: "rembourse" })
            .eq("id", tx.id);
          await chargerDonnees();
          Alert.alert("✅ Marqué comme remboursé");
        },
      },
    ]);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getStatutConfig = (statut: string) => {
    switch (statut) {
      case "paye":
        return { color: "#16a34a", bg: "#f0fdf4", label: "Payé", emoji: "✅" };
      case "en_attente":
        return {
          color: "#f59e0b",
          bg: "#fffbeb",
          label: "En attente",
          emoji: "⏳",
        };
      case "decline":
        return {
          color: "#dc2626",
          bg: "#fef2f2",
          label: "Refusé",
          emoji: "❌",
        };
      case "rembourse":
        return {
          color: "#6b7280",
          bg: "#f9fafb",
          label: "Remboursé",
          emoji: "↩️",
        };
      default:
        return { color: "#6b7280", bg: "#f9fafb", label: statut, emoji: "❓" };
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#534AB7" />
        <Text style={styles.loadingText}>Chargement admin...</Text>
      </View>
    );
  }

  if (!isAdmin) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Dashboard Admin</Text>
          <Text style={styles.headerSub}>CVPro · Administration</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <Text style={styles.refreshText}>↺</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(
          [
            { key: "stats", label: "📊 Stats" },
            { key: "transactions", label: "💰 Paiements" },
            { key: "users", label: "👥 Utilisateurs" },
          ] as const
        ).map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === t.key && styles.tabTextActive,
              ]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#534AB7"]}
          />
        }
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* ── TAB STATS ── */}
          {activeTab === "stats" && stats && (
            <>
              {/* Revenus */}
              <View style={styles.revenueCard}>
                <Text style={styles.revenueLabel}>💰 Revenus totaux</Text>
                <Text style={styles.revenueAmount}>
                  {stats.totalRevenu.toLocaleString()} XOF
                </Text>
                <Text style={styles.revenueSub}>
                  {stats.transactionsPaye} paiement(s) confirmé(s)
                </Text>
              </View>

              {/* Grille de stats */}
              <View style={styles.statsGrid}>
                {[
                  {
                    num: stats.totalUsers,
                    label: "Utilisateurs",
                    emoji: "👥",
                    color: "#2563eb",
                  },
                  {
                    num: stats.totalCVs,
                    label: "CVs créés",
                    emoji: "📄",
                    color: "#16a34a",
                  },
                  {
                    num: stats.totalTransactions,
                    label: "Transactions",
                    emoji: "💳",
                    color: "#7c3aed",
                  },
                  {
                    num: stats.transactionsAttente,
                    label: "En attente",
                    emoji: "⏳",
                    color: "#f59e0b",
                  },
                ].map((s, i) => (
                  <View
                    key={i}
                    style={[styles.statCard, { borderLeftColor: s.color }]}
                  >
                    <Text style={styles.statEmoji}>{s.emoji}</Text>
                    <Text style={[styles.statNum, { color: s.color }]}>
                      {s.num}
                    </Text>
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </View>
                ))}
              </View>

              {/* Dernières transactions */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>🕐 Dernières transactions</Text>
                {transactions.slice(0, 5).map((tx, i) => {
                  const s = getStatutConfig(tx.statut);
                  return (
                    <View key={i} style={styles.miniTx}>
                      <View
                        style={[styles.miniTxBadge, { backgroundColor: s.bg }]}
                      >
                        <Text style={styles.miniTxEmoji}>{s.emoji}</Text>
                      </View>
                      <View style={styles.miniTxInfo}>
                        <Text style={styles.miniTxTemplate}>
                          {tx.template_id?.replace(/_/g, " ")}
                        </Text>
                        <Text style={styles.miniTxDate}>
                          {formatDate(tx.created_at)}
                        </Text>
                      </View>
                      <Text style={[styles.miniTxMontant, { color: s.color }]}>
                        {tx.montant?.toLocaleString()} XOF
                      </Text>
                    </View>
                  );
                })}
                <TouchableOpacity onPress={() => setActiveTab("transactions")}>
                  <Text style={styles.voirTout}>Voir tout →</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* ── TAB TRANSACTIONS ── */}
          {activeTab === "transactions" && (
            <>
              <Text style={styles.sectionTitle}>
                {transactions.length} transaction(s) au total
              </Text>

              {transactions.map((tx, i) => {
                const s = getStatutConfig(tx.statut);
                return (
                  <View key={i} style={styles.txCard}>
                    <View style={styles.txHeader}>
                      <View style={[styles.txBadge, { backgroundColor: s.bg }]}>
                        <Text style={styles.txBadgeEmoji}>{s.emoji}</Text>
                        <Text style={[styles.txBadgeLabel, { color: s.color }]}>
                          {s.label}
                        </Text>
                      </View>
                      <Text style={styles.txMontant}>
                        {tx.montant?.toLocaleString()} XOF
                      </Text>
                    </View>

                    <View style={styles.txBody}>
                      <View style={styles.txRow}>
                        <Text style={styles.txLabel}>Template</Text>
                        <Text style={styles.txValue}>
                          {tx.template_id?.replace(/_/g, " ")}
                        </Text>
                      </View>
                      <View style={styles.txRow}>
                        <Text style={styles.txLabel}>Mode</Text>
                        <Text style={styles.txValue}>
                          {tx.mode_paiement ?? "—"}
                        </Text>
                      </View>
                      <View style={styles.txRow}>
                        <Text style={styles.txLabel}>Date</Text>
                        <Text style={styles.txValue}>
                          {formatDate(tx.created_at)}
                        </Text>
                      </View>
                      {tx.fedapay_id && (
                        <View style={styles.txRow}>
                          <Text style={styles.txLabel}>Réf FedaPay</Text>
                          <Text style={[styles.txValue, { color: "#534AB7" }]}>
                            #{tx.fedapay_id}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Actions admin */}
                    {tx.statut === "en_attente" && (
                      <View style={styles.txActions}>
                        <TouchableOpacity
                          style={[styles.txActionBtn, styles.txActionConfirm]}
                          onPress={() => confirmerTransaction(tx)}
                        >
                          <Text style={styles.txActionConfirmText}>
                            ✅ Confirmer
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.txActionBtn, styles.txActionRefund]}
                          onPress={() => rembourserTransaction(tx)}
                        >
                          <Text style={styles.txActionRefundText}>
                            ↩️ Rembourser
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    {tx.statut === "paye" && (
                      <View style={styles.txActions}>
                        <TouchableOpacity
                          style={[styles.txActionBtn, styles.txActionRefund]}
                          onPress={() => rembourserTransaction(tx)}
                        >
                          <Text style={styles.txActionRefundText}>
                            ↩️ Rembourser
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}

              {transactions.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyEmoji}>🧾</Text>
                  <Text style={styles.emptyTitle}>Aucune transaction</Text>
                </View>
              )}
            </>
          )}

          {/* ── TAB UTILISATEURS ── */}
          {activeTab === "users" && (
            <>
              <Text style={styles.sectionTitle}>
                {users.length} utilisateur(s) inscrit(s)
              </Text>

              {users.map((u, i) => (
                <View key={i} style={styles.userCard}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>
                      {`${u.prenom?.[0] ?? ""}${u.nom?.[0] ?? ""}`.toUpperCase() ||
                        "?"}
                    </Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                      {u.prenom} {u.nom}
                    </Text>
                    <Text style={styles.userEmail}>{u.email}</Text>
                    <Text style={styles.userDate}>
                      Inscrit le {formatDate(u.created_at)}
                    </Text>
                    <View style={styles.userStats}>
                      <View style={styles.userStat}>
                        <Text style={styles.userStatNum}>{u.nb_cvs}</Text>
                        <Text style={styles.userStatLabel}>CVs</Text>
                      </View>
                      <View style={styles.userStat}>
                        <Text style={styles.userStatNum}>{u.nb_achats}</Text>
                        <Text style={styles.userStatLabel}>Achats</Text>
                      </View>
                      {u.email === ADMIN_EMAIL && (
                        <View style={styles.adminBadge}>
                          <Text style={styles.adminBadgeText}>ADMIN</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}

              {users.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyEmoji}>👥</Text>
                  <Text style={styles.emptyTitle}>Aucun utilisateur</Text>
                </View>
              )}
            </>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa" },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: { color: "#888", fontSize: 14 },
  header: {
    backgroundColor: "#1a1a2e",
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { color: "#fff", fontSize: 24, fontWeight: "300" },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  headerSub: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 2 },
  refreshBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  refreshText: { color: "#fff", fontSize: 22 },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 8 },
  tabActive: { backgroundColor: "#534AB7" },
  tabText: { fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: "500" },
  tabTextActive: { color: "#fff", fontWeight: "700" },
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  revenueCard: {
    background: "linear-gradient(135deg, #534AB7, #7c3aed)",
    backgroundColor: "#534AB7",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 4,
  },
  revenueLabel: { fontSize: 13, color: "rgba(255,255,255,0.8)" },
  revenueAmount: { fontSize: 36, fontWeight: "900", color: "#fff" },
  revenueSub: { fontSize: 12, color: "rgba(255,255,255,0.7)" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 4,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  statEmoji: { fontSize: 22 },
  statNum: { fontSize: 28, fontWeight: "800" },
  statLabel: { fontSize: 11, color: "#888" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  miniTx: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
  },
  miniTxBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  miniTxEmoji: { fontSize: 14 },
  miniTxInfo: { flex: 1 },
  miniTxTemplate: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111",
    textTransform: "capitalize",
  },
  miniTxDate: { fontSize: 10, color: "#888" },
  miniTxMontant: { fontSize: 13, fontWeight: "700" },
  voirTout: {
    textAlign: "center",
    color: "#534AB7",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  txCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  txHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  txBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  txBadgeEmoji: { fontSize: 14 },
  txBadgeLabel: { fontSize: 12, fontWeight: "700" },
  txMontant: { fontSize: 18, fontWeight: "800", color: "#534AB7" },
  txBody: { padding: 14, gap: 8 },
  txRow: { flexDirection: "row", justifyContent: "space-between" },
  txLabel: { fontSize: 12, color: "#888" },
  txValue: { fontSize: 12, fontWeight: "600", color: "#111" },
  txActions: { flexDirection: "row", gap: 8, padding: 14, paddingTop: 0 },
  txActionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  txActionConfirm: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#86efac",
  },
  txActionConfirmText: { color: "#16a34a", fontSize: 13, fontWeight: "700" },
  txActionRefund: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fca5a5",
  },
  txActionRefundText: { color: "#dc2626", fontSize: 13, fontWeight: "700" },
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#534AB7",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  userAvatarText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  userInfo: { flex: 1, gap: 2 },
  userName: { fontSize: 14, fontWeight: "700", color: "#111" },
  userEmail: { fontSize: 12, color: "#888" },
  userDate: { fontSize: 11, color: "#aaa" },
  userStats: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
    alignItems: "center",
  },
  userStat: { alignItems: "center" },
  userStatNum: { fontSize: 16, fontWeight: "800", color: "#534AB7" },
  userStatLabel: { fontSize: 10, color: "#888" },
  adminBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  adminBadgeText: { fontSize: 10, fontWeight: "800", color: "#d97706" },
  emptyContainer: { alignItems: "center", padding: 32, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: "#888" },
});
