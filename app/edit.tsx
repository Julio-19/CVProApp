import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert, Animated
} from 'react-native';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useCVStore } from '../store/cvStore';
import { Colors } from '../constants/colors';

export default function EditScreen() {
  const cv = useCVStore();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const getCompletionScore = () => {
    const fields  = [cv.prenom, cv.nom, cv.email, cv.telephone, cv.ville, cv.titre, cv.objectif, cv.photo];
    const filled  = fields.filter(Boolean).length;
    const extras  = [
      cv.experiences?.length > 0,
      cv.formations?.length > 0,
      cv.competences?.length > 0,
      cv.langues?.length > 0,
    ].filter(Boolean).length;
    return Math.round(((filled + extras) / 12) * 100);
  };

  const score = getCompletionScore();

  const SECTIONS = [
    {
      category: '👤 Informations personnelles',
      items: [
        {
          label:  'Profil & Contact',
          sub:    `${cv.prenom || '—'} ${cv.nom || ''} · ${cv.titre || 'Titre non défini'}`,
          route:  '/cv/step1-profil',
          status: cv.prenom && cv.nom ? 'ok' : 'warning',
          emoji:  '👤',
        },
        {
          label:  'Photo de profil',
          sub:    cv.photo ? '✅ Photo ajoutée' : '⚠️ Aucune photo',
          route:  '/cv/step2-photo',
          status: cv.photo ? 'ok' : 'warning',
          emoji:  '📷',
        },
        {
          label:  'Réseaux sociaux',
          sub:    cv.reseaux?.length > 0 ? `${cv.reseaux.length} réseau(x) ajouté(s)` : 'LinkedIn, GitHub...',
          route:  '/cv/edit-reseaux',
          status: cv.reseaux?.length > 0 ? 'ok' : 'empty',
          emoji:  '🔗',
        },
      ],
    },
    {
      category: '💼 Parcours',
      items: [
        {
          label:  'Expériences professionnelles',
          sub:    cv.experiences?.length > 0 ? `${cv.experiences.length} expérience(s)` : 'Aucune expérience',
          route:  '/cv/step3-experience',
          status: cv.experiences?.length > 0 ? 'ok' : 'empty',
          emoji:  '💼',
        },
        {
          label:  'Formations & Diplômes',
          sub:    cv.formations?.length > 0 ? `${cv.formations.length} formation(s)` : 'Aucune formation',
          route:  '/cv/step4-formation',
          status: cv.formations?.length > 0 ? 'ok' : 'empty',
          emoji:  '🎓',
        },
        {
          label:  'Certifications',
          sub:    cv.certifications?.length > 0 ? `${cv.certifications.length} certification(s)` : 'AWS, Google, Microsoft...',
          route:  '/cv/edit-certifications',
          status: cv.certifications?.length > 0 ? 'ok' : 'empty',
          emoji:  '🏆',
        },
      ],
    },
    {
      category: '⚡ Compétences',
      items: [
        {
          label:  'Compétences',
          sub:    cv.competences?.length > 0 ? `${cv.competences.length} compétence(s)` : 'Aucune compétence',
          route:  '/cv/step5-competences',
          status: cv.competences?.length > 0 ? 'ok' : 'empty',
          emoji:  '⚡',
        },
        {
          label:  'Langues',
          sub:    cv.langues?.length > 0 ? `${cv.langues.length} langue(s)` : 'Aucune langue',
          route:  '/cv/step6-langues',
          status: cv.langues?.length > 0 ? 'ok' : 'empty',
          emoji:  '🌍',
        },
        {
          label:  'Projets personnels',
          sub:    cv.projets?.length > 0 ? `${cv.projets.length} projet(s)` : 'Portfolio, side projects...',
          route:  '/cv/edit-projets',
          status: cv.projets?.length > 0 ? 'ok' : 'empty',
          emoji:  '🚀',
        },
      ],
    },
    {
      category: '🎨 Design',
      items: [
        {
          label:  'Template CV',
          sub:    cv.templateId ? `Template: ${cv.templateId.replace(/_/g, ' ')}` : 'Aucun template choisi',
          route:  '/templates',
          status: cv.templateId ? 'ok' : 'warning',
          emoji:  '🎨',
        },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'ok')      return '#16a34a';
    if (status === 'warning') return '#f59e0b';
    return '#9ca3af';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'ok')      return '✓';
    if (status === 'warning') return '!';
    return '○';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Modifier mon CV</Text>
          <Text style={styles.headerSub}>{cv.prenom} {cv.nom}</Text>
        </View>
        {/* Aperçu live */}
        <TouchableOpacity onPress={() => router.push('/preview')} style={styles.previewBtn}>
          <Text style={styles.previewText}>👁</Text>
        </TouchableOpacity>
      </View>

      {/* Score */}
      <View style={styles.scoreBar}>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Complétion</Text>
          <Text style={[styles.scorePct, {
            color: score >= 80 ? '#16a34a' : score >= 50 ? '#f59e0b' : '#dc2626'
          }]}>
            {score}%
          </Text>
        </View>
        <View style={styles.scoreTrack}>
          <View style={[
            styles.scoreFill,
            {
              width: `${score}%` as any,
              backgroundColor: score >= 80 ? '#16a34a' : score >= 50 ? '#f59e0b' : '#dc2626',
            }
          ]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {SECTIONS.map((section, si) => (
            <View key={si} style={styles.sectionGroup}>
              <Text style={styles.sectionCategory}>{section.category}</Text>
              <View style={styles.sectionCard}>
                {section.items.map((item, ii) => (
                  <TouchableOpacity
                    key={ii}
                    style={[styles.item, ii < section.items.length - 1 && styles.itemBorder]}
                    onPress={() => router.push(item.route as any)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.itemLeft}>
                      <View style={[styles.itemIconBg, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                        <Text style={styles.itemIcon}>{item.emoji}</Text>
                      </View>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemLabel}>{item.label}</Text>
                        <Text style={styles.itemSub} numberOfLines={1}>{item.sub}</Text>
                      </View>
                    </View>
                    <View style={styles.itemRight}>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                        <Text style={[styles.statusIcon, { color: getStatusColor(item.status) }]}>
                          {getStatusIcon(item.status)}
                        </Text>
                      </View>
                      <Text style={styles.arrow}>›</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Actions */}
          <View style={styles.actionsCard}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push('/saved')}
            >
              <Text style={styles.actionBtnText}>📄 Générer le PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnDanger]}
              onPress={() => Alert.alert(
                'Réinitialiser',
                'Voulez-vous effacer toutes les données du CV ?',
                [
                  { text: 'Annuler', style: 'cancel' },
                  { text: 'Effacer', style: 'destructive', onPress: () => {
                    useCVStore.getState().reset();
                    router.push('/cv/step1-profil');
                  }},
                ]
              )}
            >
              <Text style={[styles.actionBtnText, { color: '#dc2626' }]}>🗑 Réinitialiser le CV</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#f5f7fa' },
  header:          { backgroundColor: '#534AB7', paddingTop: 52, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  backBtn:         { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backText:        { color: '#fff', fontSize: 24, fontWeight: '300' },
  headerCenter:    { flex: 1, alignItems: 'center' },
  headerTitle:     { color: '#fff', fontSize: 18, fontWeight: '600' },
  headerSub:       { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  previewBtn:      { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  previewText:     { fontSize: 22 },
  scoreBar:        { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  scoreRow:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  scoreLabel:      { fontSize: 12, color: '#555', fontWeight: '500' },
  scorePct:        { fontSize: 12, fontWeight: '700' },
  scoreTrack:      { height: 6, backgroundColor: '#f0f0f0', borderRadius: 3 },
  scoreFill:       { height: 6, borderRadius: 3 },
  content:         { padding: 16, gap: 16, paddingBottom: 40 },
  sectionGroup:    { gap: 8 },
  sectionCategory: { fontSize: 12, fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: 1, paddingLeft: 4 },
  sectionCard:     { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  item:            { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  itemBorder:      { borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  itemLeft:        { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemIconBg:      { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  itemIcon:        { fontSize: 18 },
  itemInfo:        { flex: 1 },
  itemLabel:       { fontSize: 14, fontWeight: '600', color: '#111' },
  itemSub:         { fontSize: 11, color: '#888', marginTop: 2 },
  itemRight:       { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusBadge:     { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statusIcon:      { fontSize: 12, fontWeight: '700' },
  arrow:           { fontSize: 20, color: '#ccc', fontWeight: '300' },
  actionsCard:     { backgroundColor: '#fff', borderRadius: 16, padding: 8, gap: 4, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  actionBtn:       { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center' },
  actionBtnText:   { fontSize: 14, fontWeight: '600', color: '#534AB7' },
  actionBtnDanger: { backgroundColor: '#fee2e2' },
});