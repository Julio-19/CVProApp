import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../config/supabase";
import { notifPaiementConfirme } from "../services/notificationService";
import { useCVStore } from "../store/cvStore";

const FEDAPAY_PUBLIC_KEY = "pk_sandbox_B0aTsAAsn3u0fTjzemCsZIEG";

type ModePaiement = "mtn" | "moov" | "carte";
type Etape = "choix" | "processing" | "succes" | "echec";

export default function PaiementScreen() {
  const { templateId, prix: prixParam } = useLocalSearchParams<{
    templateId: string;
    prix: string;
  }>();
  const { setTemplate } = useCVStore();

  const [mode, setMode] = useState<ModePaiement>("mtn");
  const [etape, setEtape] = useState<Etape>("choix");
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const prix = parseInt(prixParam ?? "1000", 10);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const subscription = Linking.addEventListener("url", async () => {
      if (transactionId && etape === "processing") {
        await verifierPaiement(transactionId);
      }
    });
    return () => subscription.remove();
  }, [transactionId, etape]);

  const getNomTemplate = () =>
    templateId?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ??
    "Template";

  // ── LANCER PAIEMENT ────────────────────────────────────────────────────────
  const lancerPaiement = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      console.log("=== DEBUG PAIEMENT ===");
      console.log("USER:", user?.email);
      console.log("AUTH ERROR:", JSON.stringify(authError));
      console.log("TEMPLATE ID:", templateId);
      console.log("PRIX:", prix);
      console.log("======================");

      if (!user) {
        Alert.alert("Non connecté", "Veuillez vous reconnecter.", [
          { text: "Se connecter", onPress: () => router.push("/login") },
          { text: "Annuler", style: "cancel" },
        ]);
        return;
      }

      // Vérifier si déjà acheté
      const { data: existant } = await supabase
        .from("templates_achetes")
        .select("id")
        .eq("user_id", user.id)
        .eq("template_id", templateId)
        .single();

      if (existant) {
        setTemplate(templateId!);
        Alert.alert("✅ Déjà acheté !", "Ce template vous appartient déjà.", [
          { text: "Générer mon CV", onPress: () => router.push("/saved") },
        ]);
        return;
      }

      // Récupérer le profil
      const { data: profil } = await supabase
        .from("profiles")
        .select("prenom, nom")
        .eq("id", user.id)
        .single();

      // Appeler la Edge Function
      console.log("📡 Appel Edge Function create-payment...");
      const { data, error } = await supabase.functions.invoke(
        "create-payment",
        {
          body: {
            templateId,
            montant: prix,
            userId: user.id,
            userEmail: user.email,
            prenom: profil?.prenom ?? "Client",
            nom: profil?.nom ?? "CVPro",
            mode,
          },
        },
      );

      console.log("EDGE FUNCTION DATA:", JSON.stringify(data));
      console.log("EDGE FUNCTION ERROR:", JSON.stringify(error));

      if (error || !data?.paymentUrl) {
        throw new Error(
          error?.message ?? `Réponse invalide: ${JSON.stringify(data)}`,
        );
      }

      console.log("✅ Payment URL:", data.paymentUrl);
      console.log("✅ Transaction ID:", data.transactionId);

      setPaymentUrl(data.paymentUrl);
      setTransactionId(String(data.transactionId));

      console.log("🌐 Ouverture navigateur...");
      const result = await WebBrowser.openBrowserAsync(data.paymentUrl, {
        showTitle: true,
        toolbarColor: "#534AB7",
      });
      console.log("BROWSER RESULT:", JSON.stringify(result));

      setEtape("processing");
    } catch (err: any) {
      console.error("❌ ERREUR PAIEMENT:", err.message);
      Alert.alert("Erreur", err.message ?? "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  // ── VÉRIFIER PAIEMENT ──────────────────────────────────────────────────────
  const verifierPaiement = async (txId?: string) => {
    const id = txId ?? transactionId;
    if (!id) return;

    setVerifying(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      console.log("🔍 Vérification via Edge Function...");
      await new Promise((r) => setTimeout(r, 2000));

      const { data, error } = await supabase.functions.invoke(
        "verify-payment",
        {
          body: { transactionId: id, userId: user.id, templateId },
        },
      );

      console.log("VERIFY RESULT:", JSON.stringify(data));
      console.log("VERIFY ERROR:", JSON.stringify(error));

      if (error) throw new Error(error.message);

      if (data?.confirme === true) {
        console.log("✅ Paiement confirmé !");
        setTemplate(templateId!);
        setEtape("succes");
        // Notification push
        await notifPaiementConfirme(templateId!);
      } else {
        Alert.alert(
          "Paiement non encore confirmé",
          `Statut: ${data?.statut ?? "inconnu"}\n\nSi vous avez payé, patientez et réessayez.`,
          [
            { text: "Vérifier à nouveau", onPress: () => verifierPaiement() },
            {
              text: "Annuler",
              style: "cancel",
              onPress: () => setEtape("choix"),
            },
          ],
        );
      }
    } catch (err: any) {
      console.error("❌ ERREUR VÉRIFICATION:", err.message);
      Alert.alert("Erreur", err.message);
    } finally {
      setVerifying(false);
    }
  };

  // ── RENDU ──────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {etape === "succes"
            ? "✅ Paiement confirmé"
            : etape === "processing"
              ? "⏳ Vérification..."
              : "Paiement sécurisé"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
        >
          {/* ── CHOIX ── */}
          {etape === "choix" && (
            <>
              <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderEmoji}>🎨</Text>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderNom}>{getNomTemplate()}</Text>
                    <Text style={styles.orderSub}>
                      Template CV professionnel
                    </Text>
                  </View>
                  <View style={styles.orderPrixContainer}>
                    <Text style={styles.orderPrix}>
                      {prix.toLocaleString()}
                    </Text>
                    <Text style={styles.orderDevise}>XOF</Text>
                  </View>
                </View>
                <View style={styles.orderDivider} />
                <View style={styles.orderRow}>
                  <Text style={styles.orderLabel}>Accès illimité</Text>
                  <Text style={styles.orderCheck}>✓</Text>
                </View>
                <View style={styles.orderRow}>
                  <Text style={styles.orderLabel}>Téléchargement PDF</Text>
                  <Text style={styles.orderCheck}>✓</Text>
                </View>
                <View style={styles.orderRow}>
                  <Text style={styles.orderLabel}>
                    Paiement sécurisé FedaPay
                  </Text>
                  <Text style={styles.orderCheck}>✓</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Mode de paiement</Text>

              {[
                {
                  key: "mtn",
                  label: "MTN Mobile Money",
                  sub: "Paiement rapide · Confirmation immédiate",
                  emoji: "📱",
                  bg: "#FFC30033",
                },
                {
                  key: "moov",
                  label: "Moov Money",
                  sub: "Paiement via Moov Africa",
                  emoji: "💳",
                  bg: "#3B82F633",
                },
                {
                  key: "carte",
                  label: "Carte Visa / Mastercard",
                  sub: "Paiement international sécurisé",
                  emoji: "🏦",
                  bg: "#8B5CF633",
                },
              ].map((m) => (
                <TouchableOpacity
                  key={m.key}
                  style={[
                    styles.modeCard,
                    mode === m.key && styles.modeCardActive,
                  ]}
                  onPress={() => setMode(m.key as ModePaiement)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.modeIconBg, { backgroundColor: m.bg }]}>
                    <Text style={styles.modeEmoji}>{m.emoji}</Text>
                  </View>
                  <View style={styles.modeInfo}>
                    <Text style={styles.modeName}>{m.label}</Text>
                    <Text style={styles.modeSub}>{m.sub}</Text>
                  </View>
                  <View
                    style={[styles.radio, mode === m.key && styles.radioActive]}
                  >
                    {mode === m.key && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              ))}

              {mode === "carte" && (
                <View style={styles.cardsRow}>
                  {["VISA", "MC", "AMEX"].map((c) => (
                    <View key={c} style={styles.cardLogo}>
                      <Text style={styles.cardLogoText}>{c}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.securityInfo}>
                <Text style={styles.securityText}>
                  🔒 Paiement 100% sécurisé via FedaPay · SSL · Données
                  chiffrées
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.btnPayer, loading && styles.btnDisabled]}
                onPress={lancerPaiement}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.btnPayerText}>
                    Payer {prix.toLocaleString()} XOF →
                  </Text>
                )}
              </TouchableOpacity>

              <Text style={styles.redirectInfo}>
                Vous serez redirigé vers la page de paiement sécurisée FedaPay
              </Text>
            </>
          )}

          {/* ── PROCESSING ── */}
          {etape === "processing" && (
            <View style={styles.processingContainer}>
              <View style={styles.processingIconBg}>
                <Text style={styles.processingEmoji}>⏳</Text>
              </View>
              <Text style={styles.processingTitle}>Paiement en cours...</Text>
              <Text style={styles.processingSub}>
                Complétez le paiement dans votre navigateur.{"\n"}
                Revenez ici une fois le paiement effectué.
              </Text>
              {paymentUrl && (
                <TouchableOpacity
                  style={styles.btnReouvrir}
                  onPress={() => Linking.openURL(paymentUrl!)}
                >
                  <Text style={styles.btnReouvrirText}>
                    ↗ Rouvrir la page de paiement
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.btnVerifier, verifying && styles.btnDisabled]}
                onPress={() => verifierPaiement()}
                disabled={verifying}
              >
                {verifying ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.btnVerifierText}>
                    ✓ J'ai payé — Vérifier le paiement
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEtape("choix")}>
                <Text style={styles.annulerLink}>Annuler et recommencer</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── SUCCÈS ── */}
          {etape === "succes" && (
            <View style={styles.successContainer}>
              <View style={styles.successIconBg}>
                <Text style={styles.successEmoji}>✅</Text>
              </View>
              <Text style={styles.successTitle}>Paiement confirmé !</Text>
              <Text style={styles.successSub}>
                Le template <Text style={styles.bold}>{getNomTemplate()}</Text>{" "}
                est maintenant actif.
              </Text>
              <View style={styles.successDetails}>
                <View style={styles.successRow}>
                  <Text style={styles.successLabel}>Template</Text>
                  <Text style={styles.successValue}>{getNomTemplate()}</Text>
                </View>
                <View style={styles.successRow}>
                  <Text style={styles.successLabel}>Montant payé</Text>
                  <Text style={styles.successValue}>
                    {prix.toLocaleString()} XOF
                  </Text>
                </View>
                <View style={styles.successRow}>
                  <Text style={styles.successLabel}>Statut</Text>
                  <Text style={[styles.successValue, { color: "#16a34a" }]}>
                    ✓ Confirmé
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.btnGenerer}
                onPress={() => router.push("/saved")}
              >
                <Text style={styles.btnGenererText}>Générer mon CV →</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/templates")}>
                <Text style={styles.annulerLink}>
                  Acheter un autre template
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── ÉCHEC ── */}
          {etape === "echec" && (
            <View style={styles.successContainer}>
              <Text style={styles.successEmoji}>❌</Text>
              <Text style={[styles.successTitle, { color: "#dc2626" }]}>
                Paiement échoué
              </Text>
              <Text style={styles.successSub}>
                Le paiement n'a pas pu être confirmé. Vérifiez votre solde et
                réessayez.
              </Text>
              <TouchableOpacity
                style={styles.btnGenerer}
                onPress={() => setEtape("choix")}
              >
                <Text style={styles.btnGenererText}>Réessayer →</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa" },
  header: {
    backgroundColor: "#534AB7",
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
  headerTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    gap: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  orderHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  orderEmoji: { fontSize: 36 },
  orderInfo: { flex: 1 },
  orderNom: { fontSize: 15, fontWeight: "700", color: "#111" },
  orderSub: { fontSize: 12, color: "#888", marginTop: 2 },
  orderPrixContainer: { alignItems: "flex-end" },
  orderPrix: { fontSize: 22, fontWeight: "900", color: "#534AB7" },
  orderDevise: { fontSize: 11, color: "#888", marginTop: 2 },
  orderDivider: { height: 1, backgroundColor: "#f0f0f0" },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderLabel: { fontSize: 13, color: "#555" },
  orderCheck: { fontSize: 14, color: "#16a34a", fontWeight: "700" },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginTop: 4,
  },
  modeCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: "transparent",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  modeCardActive: { borderColor: "#534AB7", backgroundColor: "#534AB708" },
  modeIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  modeEmoji: { fontSize: 22 },
  modeInfo: { flex: 1 },
  modeName: { fontSize: 14, fontWeight: "700", color: "#111" },
  modeSub: { fontSize: 11, color: "#888", marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: "#534AB7" },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#534AB7",
  },
  cardsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 4 },
  cardLogo: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 1,
  },
  cardLogoText: { fontSize: 11, fontWeight: "800", color: "#374151" },
  securityInfo: {
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  securityText: {
    fontSize: 11,
    color: "#15803d",
    textAlign: "center",
    lineHeight: 16,
  },
  btnPayer: {
    backgroundColor: "#534AB7",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#534AB7",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  btnPayerText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  btnDisabled: { opacity: 0.55 },
  redirectInfo: {
    textAlign: "center",
    fontSize: 11,
    color: "#aaa",
    marginTop: -4,
  },
  processingContainer: {
    alignItems: "center",
    padding: 16,
    gap: 20,
    marginTop: 24,
  },
  processingIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fef3c7",
    alignItems: "center",
    justifyContent: "center",
  },
  processingEmoji: { fontSize: 48 },
  processingTitle: { fontSize: 22, fontWeight: "800", color: "#111" },
  processingSub: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
  },
  btnReouvrir: {
    backgroundColor: "#f0f0f0",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
  },
  btnReouvrirText: { fontSize: 14, color: "#534AB7", fontWeight: "600" },
  btnVerifier: {
    backgroundColor: "#534AB7",
    borderRadius: 16,
    paddingVertical: 18,
    width: "100%",
    alignItems: "center",
    elevation: 3,
  },
  btnVerifierText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  annulerLink: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 13,
    marginTop: 4,
  },
  successContainer: {
    alignItems: "center",
    padding: 16,
    gap: 20,
    marginTop: 24,
  },
  successIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
  },
  successEmoji: { fontSize: 48 },
  successTitle: { fontSize: 24, fontWeight: "800", color: "#111" },
  successSub: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
  },
  bold: { fontWeight: "700", color: "#111" },
  successDetails: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    gap: 12,
    width: "100%",
    elevation: 2,
  },
  successRow: { flexDirection: "row", justifyContent: "space-between" },
  successLabel: { fontSize: 13, color: "#888" },
  successValue: { fontSize: 13, fontWeight: "600", color: "#111" },
  btnGenerer: {
    backgroundColor: "#16a34a",
    borderRadius: 16,
    paddingVertical: 18,
    width: "100%",
    alignItems: "center",
    elevation: 3,
  },
  btnGenererText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
