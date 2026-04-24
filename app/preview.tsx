import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Animated
} from 'react-native';
import { router } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useState, useEffect, useRef } from 'react';
import { useCVStore } from '../store/cvStore';
import { generateCVHTML } from '../services/templateService';
import * as FileSystem from 'expo-file-system/legacy';

export default function PreviewScreen() {
  const cv = useCVStore();
  const [html, setHtml]         = useState<string>('');
  const [loading, setLoading]   = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    genererApercu();
  }, []);

  const genererApercu = async () => {
    setLoading(true);
    try {
      let photoData: string | null = null;
      if (cv.photo) {
        if (cv.photo.startsWith('data:image')) {
          photoData = cv.photo;
        } else {
          try {
            const base64 = await FileSystem.readAsStringAsync(cv.photo, { encoding: 'base64' });
            photoData = `data:image/jpeg;base64,${base64}`;
          } catch { photoData = null; }
        }
      }
      const generatedHtml = generateCVHTML(cv, photoData, cv.templateId ?? 'sidebar_bleu');
      setHtml(generatedHtml);
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Aperçu du CV</Text>
          <Text style={styles.headerSub}>
            {cv.templateId?.replace(/_/g, ' ') ?? 'Sidebar Bleu'}
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={genererApercu}>
          <Text style={styles.refreshText}>↺</Text>
        </TouchableOpacity>
      </View>

      {/* Barre d'actions rapides */}
      <View style={styles.quickBar}>
        <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/edit')}>
          <Text style={styles.quickEmoji}>✏️</Text>
          <Text style={styles.quickLabel}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/templates')}>
          <Text style={styles.quickEmoji}>🎨</Text>
          <Text style={styles.quickLabel}>Template</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/saved')}>
          <Text style={styles.quickEmoji}>📄</Text>
          <Text style={styles.quickLabel}>Générer PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn} onPress={genererApercu}>
          <Text style={styles.quickEmoji}>🔄</Text>
          <Text style={styles.quickLabel}>Actualiser</Text>
        </TouchableOpacity>
      </View>

      {/* Aperçu WebView */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#534AB7" />
          <Text style={styles.loadingText}>Génération de l'aperçu...</Text>
        </View>
      ) : (
        <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
          <WebView
            source={{ html }}
            style={styles.webview}
            scalesPageToFit={true}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            originWhitelist={['*']}
          />
        </Animated.View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          👆 Pincer pour zoomer · Défiler pour voir tout le CV
        </Text>
      </View>
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
  quickBar:         { backgroundColor: '#fff', flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  quickBtn:         { flex: 1, alignItems: 'center', gap: 4 },
  quickEmoji:       { fontSize: 20 },
  quickLabel:       { fontSize: 10, color: '#555', fontWeight: '500' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText:      { color: '#888', fontSize: 14 },
  webview:          { flex: 1, backgroundColor: '#f5f7fa' },
  footer:           { backgroundColor: '#fff', padding: 10, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee' },
  footerText:       { fontSize: 11, color: '#aaa' },
});