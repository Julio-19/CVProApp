import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, Linking, Animated, Share
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';

export default function ParametresScreen() {
  const [langueActive, setLangueActive] = useState('Français');
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const LANGUES = ['Français', 'English', 'Español', 'Português'];

  const handleLangue = () => {
    Alert.alert(
      '🌍 Langue de l\'application',
      'Choisissez votre langue :',
      [
        ...LANGUES.map(l => ({
          text: `${langueActive === l ? '✓ ' : ''}${l}`,
          onPress: () => {
            setLangueActive(l);
            Alert.alert('✅ Langue changée', `L'application est maintenant en ${l}.`);
          },
        })),
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const handleEvaluer = () => {
    Alert.alert(
      '⭐ Évaluez CVPro',
      'Votre avis nous aide à améliorer l\'application !',
      [
        {
          text: '⭐⭐⭐⭐⭐ Excellent',
          onPress: () => Alert.alert('Merci !', '🙏 Merci pour votre soutien ! Cela nous motive beaucoup.'),
        },
        {
          text: '⭐⭐⭐⭐ Bien',
          onPress: () => Alert.alert('Merci !', '😊 Merci ! Nous travaillons à améliorer l\'application.'),
        },
        {
          text: '⭐⭐⭐ Moyen',
          onPress: () => Alert.alert('Merci !', '🔧 Merci ! Dites-nous ce que nous pouvons améliorer.'),
        },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const handleRetour = () => {
    Alert.alert(
      '💬 Retour d\'information',
      'Comment pouvons-nous améliorer CVPro ?',
      [
        {
          text: '📧 Envoyer un email',
          onPress: () => Linking.openURL('mailto:support@cvpro.app?subject=Retour CVPro&body=Bonjour,\n\nVoici mon retour sur l\'application CVPro :\n\n'),
        },
        {
          text: '🐛 Signaler un bug',
          onPress: () => Linking.openURL('mailto:bugs@cvpro.app?subject=Bug CVPro&body=Bonjour,\n\nJ\'ai rencontré un problème :\n\n'),
        },
        {
          text: '💡 Suggérer une fonctionnalité',
          onPress: () => Linking.openURL('mailto:ideas@cvpro.app?subject=Suggestion CVPro&body=Bonjour,\n\nJ\'aimerais suggérer :\n\n'),
        },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  const handlePartager = async () => {
    try {
      await Share.share({
        message: '📄 CVPro — Créez votre CV professionnel en quelques minutes !\n\nTéléchargez l\'application ici : https://play.google.com/store/apps/details?id=com.votrecompany.cvpro',
        title: 'CVPro - Créateur de CV',
      });
    } catch (error: any) {
      console.log('Erreur partage:', error.message);
    }
  };

  const handlePolitique = () => {
    Alert.alert(
      '🔒 Politique de confidentialité',
      `CVPro respecte votre vie privée.\n\n📌 Données collectées :\n• Informations de votre CV\n• Email et prénom/nom\n• Photo de profil (optionnel)\n\n🔐 Comment nous les protégeons :\n• Stockage sécurisé via Supabase\n• Chiffrement SSL\n• Aucune vente de données\n\n🗑️ Suppression :\nVous pouvez demander la suppression de vos données à tout moment via : privacy@cvpro.app\n\n📅 Mise à jour : Avril 2026`,
      [
        { text: 'Voir en ligne', onPress: () => Linking.openURL('https://cvpro.app/privacy') },
        { text: 'Fermer', style: 'cancel' },
      ]
    );
  };

  const QUESTIONS_ENTRETIEN = [
    {
      categorie: '💼 Questions générales',
      questions: [
        { q: 'Parlez-moi de vous', r: 'Présentez votre parcours en 2 minutes : formation → expériences → pourquoi ce poste.' },
        { q: 'Quelles sont vos forces ?', r: 'Citez 3 forces avec des exemples concrets. Ex: "Je suis organisé — j\'ai géré X projets simultanément."' },
        { q: 'Quelles sont vos faiblesses ?', r: 'Mentionnez une faiblesse réelle que vous travaillez à améliorer. Montrez votre progression.' },
        { q: 'Pourquoi voulez-vous ce poste ?', r: 'Liez vos ambitions à la mission de l\'entreprise. Montrez que vous avez fait des recherches.' },
        { q: 'Où vous voyez-vous dans 5 ans ?', r: 'Montrez de l\'ambition alignée avec l\'évolution possible dans l\'entreprise.' },
      ],
    },
    {
      categorie: '🧠 Questions comportementales',
      questions: [
        { q: 'Décrivez un défi professionnel surmonté', r: 'Utilisez la méthode STAR : Situation, Tâche, Action, Résultat.' },
        { q: 'Comment gérez-vous les conflits ?', r: 'Montrez votre écoute active, votre diplomatie et votre capacité à trouver des solutions.' },
        { q: 'Donnez un exemple de travail en équipe', r: 'Décrivez votre rôle précis, vos contributions et le résultat collectif.' },
        { q: 'Comment gérez-vous la pression ?', r: 'Donnez des exemples de situations stressantes gérées avec méthode et calme.' },
        { q: 'Avez-vous déjà raté quelque chose ?', r: 'Admettez l\'erreur, expliquez ce que vous avez appris et comment vous avez rectifié.' },
      ],
    },
    {
      categorie: '💰 Questions sur le salaire',
      questions: [
        { q: 'Quelles sont vos prétentions salariales ?', r: 'Faites des recherches sur les salaires du marché. Donnez une fourchette. Ex: "Entre X et Y selon les avantages."' },
        { q: 'Êtes-vous flexible sur le salaire ?', r: 'Restez ouvert mais connaissez votre valeur. Mentionnez les avantages non-salariaux importants pour vous.' },
        { q: 'Quel était votre salaire précédent ?', r: 'Vous pouvez répondre ou dire que vous préférez vous concentrer sur ce poste. Restez diplomate.' },
      ],
    },
    {
      categorie: '❓ Questions à poser au recruteur',
      questions: [
        { q: 'Quelles sont les priorités pour ce poste ?', r: 'Montre votre sérieux et votre préparation.' },
        { q: 'Comment se passe l\'intégration ?', r: 'Indique votre intérêt pour bien démarrer.' },
        { q: 'Quelles sont les opportunités d\'évolution ?', r: 'Montre votre ambition et vision long terme.' },
        { q: 'Quelle est la culture de l\'équipe ?', r: 'Évalue si l\'environnement vous correspond.' },
        { q: 'Quelles sont les prochaines étapes ?', r: 'Conclut l\'entretien avec professionnalisme.' },
      ],
    },
  ];

  const [questionOuverte, setQuestionOuverte] = useState<string | null>(null);
  const [categorieOuverte, setCategorieOuverte] = useState<string | null>(null);

  const MenuItem = ({
    emoji, titre, sous, onPress, couleur
  }: {
    emoji: string; titre: string; sous: string; onPress: () => void; couleur?: string;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIconBg, { backgroundColor: (couleur ?? '#534AB7') + '18' }]}>
        <Text style={styles.menuEmoji}>{emoji}</Text>
      </View>
      <View style={styles.menuInfo}>
        <Text style={styles.menuTitre}>{titre}</Text>
        <Text style={styles.menuSous}>{sous}</Text>
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* ── Questions d'entretien ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Préparation</Text>
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setCategorieOuverte(categorieOuverte ? null : 'entretien')}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconBg, { backgroundColor: '#7c3aed18' }]}>
                  <Text style={styles.menuEmoji}>🎤</Text>
                </View>
                <View style={styles.menuInfo}>
                  <Text style={styles.menuTitre}>Questions d'entretien</Text>
                  <Text style={styles.menuSous}>Préparez vos entretiens professionnels</Text>
                </View>
                <Text style={styles.menuArrow}>{categorieOuverte === 'entretien' ? '↓' : '›'}</Text>
              </TouchableOpacity>

              {categorieOuverte === 'entretien' && (
                <View style={styles.entretienContainer}>
                  {QUESTIONS_ENTRETIEN.map((cat, ci) => (
                    <View key={ci} style={styles.categorie}>
                      <Text style={styles.categorieTitle}>{cat.categorie}</Text>
                      {cat.questions.map((item, qi) => {
                        const key = `${ci}-${qi}`;
                        const isOpen = questionOuverte === key;
                        return (
                          <TouchableOpacity
                            key={qi}
                            style={[styles.questionItem, isOpen && styles.questionItemOpen]}
                            onPress={() => setQuestionOuverte(isOpen ? null : key)}
                            activeOpacity={0.8}
                          >
                            <View style={styles.questionHeader}>
                              <Text style={styles.questionQ}>❓ {item.q}</Text>
                              <Text style={styles.questionArrow}>{isOpen ? '▲' : '▼'}</Text>
                            </View>
                            {isOpen && (
                              <View style={styles.reponseBox}>
                                <Text style={styles.reponseLabel}>💡 Conseil :</Text>
                                <Text style={styles.reponseText}>{item.r}</Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* ── Paramètres app ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚙️ Application</Text>
            <View style={styles.card}>
              <MenuItem
                emoji="🌍"
                titre="Langue de l'application"
                sous={`Langue actuelle : ${langueActive}`}
                onPress={handleLangue}
                couleur="#0284c7"
              />
              <View style={styles.divider} />
              <MenuItem
                emoji="⭐"
                titre="Évaluez-nous"
                sous="Donnez votre avis sur CVPro"
                onPress={handleEvaluer}
                couleur="#f59e0b"
              />
              <View style={styles.divider} />
              <MenuItem
                emoji="💬"
                titre="Retour d'information"
                sous="Partagez votre expérience"
                onPress={handleRetour}
                couleur="#10b981"
              />
              <View style={styles.divider} />
              <MenuItem
                emoji="📤"
                titre="Partager l'application"
                sous="Recommandez CVPro à vos contacts"
                onPress={handlePartager}
                couleur="#534AB7"
              />
            </View>
          </View>

          {/* ── Légal ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Légal</Text>
            <View style={styles.card}>
              <MenuItem
                emoji="🔒"
                titre="Politique de confidentialité"
                sous="Comment nous protégeons vos données"
                onPress={handlePolitique}
                couleur="#374151"
              />
              <View style={styles.divider} />
              <MenuItem
                emoji="📄"
                titre="Conditions d'utilisation"
                sous="Termes et conditions de CVPro"
                onPress={() => Alert.alert('Conditions d\'utilisation', 'En utilisant CVPro, vous acceptez nos conditions d\'utilisation. Pour plus d\'informations, visitez cvpro.app/terms',[{text:'Voir en ligne',onPress:()=>Linking.openURL('https://cvpro.app/terms')},{text:'Fermer',style:'cancel'}])}
                couleur="#374151"
              />
              <View style={styles.divider} />
              <MenuItem
                emoji="ℹ️"
                titre="À propos de CVPro"
                sous="Version 1.0.0 — Fait avec ❤️"
                onPress={() => Alert.alert('CVPro v1.0.0','📄 CVPro — Créateur de CV Professionnel\n\n🏢 Développé par CVPro Team\n📅 2026\n🌍 Disponible sur Android & iOS\n\n💪 150 templates premium\n☁️ Sauvegarde en ligne\n💳 Paiement Mobile Money',[{text:'Fermer',style:'cancel'}])}
                couleur="#6b7280"
              />
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>CVPro v1.0.0</Text>
            <Text style={styles.footerSub}>Fait avec ❤️ pour vous aider à réussir</Text>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#f5f7fa' },
  header:             { backgroundColor: '#534AB7', paddingTop: 52, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  backBtn:            { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backText:           { color: '#fff', fontSize: 24, fontWeight: '300' },
  headerTitle:        { flex: 1, color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
  content:            { padding: 16, gap: 16, paddingBottom: 40 },
  section:            { gap: 8 },
  sectionTitle:       { fontSize: 12, fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: 1, paddingLeft: 4 },
  card:               { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  menuItem:           { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  menuIconBg:         { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  menuEmoji:          { fontSize: 20 },
  menuInfo:           { flex: 1 },
  menuTitre:          { fontSize: 14, fontWeight: '600', color: '#111' },
  menuSous:           { fontSize: 11, color: '#888', marginTop: 2 },
  menuArrow:          { fontSize: 18, color: '#ccc', fontWeight: '300' },
  divider:            { height: 1, backgroundColor: '#f5f5f5', marginLeft: 68 },
  entretienContainer: { backgroundColor: '#f8f9fa', paddingBottom: 8 },
  categorie:          { padding: 12, paddingTop: 8 },
  categorieTitle:     { fontSize: 12, fontWeight: '700', color: '#534AB7', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  questionItem:       { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 6, borderWidth: 1, borderColor: '#e5e7eb' },
  questionItemOpen:   { borderColor: '#534AB7', backgroundColor: '#f5f3ff' },
  questionHeader:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  questionQ:          { fontSize: 12, fontWeight: '600', color: '#111', flex: 1 },
  questionArrow:      { fontSize: 10, color: '#534AB7', marginLeft: 8 },
  reponseBox:         { marginTop: 10, padding: 10, backgroundColor: '#ede9fe', borderRadius: 8 },
  reponseLabel:       { fontSize: 11, fontWeight: '700', color: '#7c3aed', marginBottom: 4 },
  reponseText:        { fontSize: 11, color: '#444', lineHeight: 18 },
  footer:             { alignItems: 'center', paddingVertical: 16, gap: 4 },
  footerText:         { fontSize: 12, color: '#aaa', fontWeight: '600' },
  footerSub:          { fontSize: 11, color: '#ccc' },
});