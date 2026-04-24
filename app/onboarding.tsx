import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { programmerRappel } from '../services/notificationService';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    emoji: '📄',
    title: 'Créez votre CV',
    subtitle: 'En quelques minutes, un CV professionnel prêt à télécharger',
    bg: '#534AB7',
    accent: '#7B73D4',
  },
  {
    id: 2,
    emoji: '🎨',
    title: '40 Templates',
    subtitle: 'Choisissez parmi nos designs modernes et professionnels',
    bg: '#1a3a5c',
    accent: '#2d5a8a',
  },
  {
    id: 3,
    emoji: '📱',
    title: 'Téléchargez & Partagez',
    subtitle: 'Exportez en PDF, partagez en un clic depuis votre téléphone',
    bg: '#16a34a',
    accent: '#2d5a27',
  },
];

export default function OnboardingScreen() {
  const [current, setCurrent] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const emojiAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const animateIn = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(40);
    scaleAnim.setValue(0.8);
    emojiAnim.setValue(0);

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(200),
        Animated.spring(emojiAnim, { toValue: 1, tension: 60, friction: 6, useNativeDriver: true }),
      ]),
    ]).start();
  };

  useEffect(() => { animateIn(); }, [current]);

  const handleNext = () => {
    if (current < SLIDES.length - 1) {
      setCurrent(current + 1);
    } else {
      handleStart();
    }
  };

  // Dans handleStart() :
const handleStart = async () => {
  await AsyncStorage.setItem('onboarding_done', 'true');
  await programmerRappel(24); // rappel dans 24h
  router.replace('/');
};

  const slide = SLIDES[current];

  const emojiScale = emojiAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.2, 1],
  });

  return (
    <View style={[styles.container, { backgroundColor: slide.bg }]}>
      {/* Background circles décoratifs */}
      <View style={[styles.circle1, { backgroundColor: slide.accent }]} />
      <View style={[styles.circle2, { backgroundColor: slide.accent }]} />

      {/* Skip */}
      <TouchableOpacity style={styles.skipBtn} onPress={handleStart}>
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>

      {/* Contenu */}
      <View style={styles.content}>
        <Animated.View style={[styles.emojiContainer, { transform: [{ scale: emojiScale }] }]}>
          <Text style={styles.emoji}>{slide.emoji}</Text>
        </Animated.View>

        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>
        </Animated.View>

        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <Animated.View
              key={i}
              style={[styles.dot, i === current && styles.dotActive]}
            />
          ))}
        </View>
      </View>

      {/* Bouton */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>
            {current === SLIDES.length - 1 ? 'Commencer 🚀' : 'Suivant →'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, position: 'relative' },
  circle1:       { position: 'absolute', width: 300, height: 300, borderRadius: 150, top: -80, right: -80, opacity: 0.3 },
  circle2:       { position: 'absolute', width: 200, height: 200, borderRadius: 100, bottom: 100, left: -60, opacity: 0.2 },
  skipBtn:       { position: 'absolute', top: 56, right: 24, zIndex: 10 },
  skipText:      { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  content:       { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emojiContainer:{ width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  emoji:         { fontSize: 56 },
  title:         { fontSize: 32, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 16 },
  subtitle:      { fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 24 },
  dots:          { flexDirection: 'row', gap: 8, marginTop: 40 },
  dot:           { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive:     { width: 24, backgroundColor: '#fff' },
  footer:        { padding: 32, paddingBottom: 48 },
  nextBtn:       { backgroundColor: '#fff', borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  nextText:      { fontSize: 16, fontWeight: '700', color: '#534AB7' },
});