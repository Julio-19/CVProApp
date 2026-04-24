import { View, ScrollView, Image, StyleSheet, Text, Alert } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { useCVStore } from '../../store/cvStore';
import { Colors } from '../../constants/colors';

export default function Step2() {
  const { photo, setField } = useCVStore();

  const savePhotoAsBase64 = async (uri: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });
      const photoData = `data:image/jpeg;base64,${base64}`;
      setField('photo', photoData);
      Alert.alert('✅', 'Photo ajoutée avec succès !');
    } catch (error) {
      console.log('Erreur:', error);
      Alert.alert('Erreur', 'Impossible de traiter la photo. Réessayez.');
    }
  };

  const pickImage = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Permission refusée', 'Autorisez l\'accès à la galerie.');
    return;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'] as any,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.5,
    base64: true,
  });
  if (!result.canceled && result.assets[0]) {
    const asset = result.assets[0];
    if (asset.base64) {
      const photoData = `data:image/jpeg;base64,${asset.base64}`;
      setField('photo', photoData);
      Alert.alert('✅', 'Photo ajoutée avec succès !');
    } else {
      await savePhotoAsBase64(asset.uri);
    }
  }
};

  const takePhoto = async () => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Permission refusée', 'Autorisez l\'accès à la caméra.');
    return;
  }
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.5,
    base64: true,
  });
  if (!result.canceled && result.assets[0]) {
    const asset = result.assets[0];
    if (asset.base64) {
      const photoData = `data:image/jpeg;base64,${asset.base64}`;
      setField('photo', photoData);
      Alert.alert('✅', 'Photo ajoutée avec succès !');
    } else {
      await savePhotoAsBase64(asset.uri);
    }
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProgressBar step={2} total={6} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Utilisez une photo avec fond blanc uni, bonne luminosité et tenue professionnelle.
          </Text>
        </View>

        <View style={styles.uploadZone}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photoPreview} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Aucune photo{'\n'}sélectionnée</Text>
            </View>
          )}
        </View>

        {photo && (
          <View style={styles.successBadge}>
            <Text style={styles.successText}>
              ✅ Photo prête — {photo.startsWith('data:image') ? 'Base64 ✅' : 'URI ⚠️'}
            </Text>
          </View>
        )}

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Button label="Appareil photo" variant="outline" onPress={takePhoto} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Galerie" variant="outline" onPress={pickImage} />
          </View>
        </View>

        {photo && (
          <Button
            label="Changer la photo"
            variant="outline"
            onPress={() => setField('photo', null)}
          />
        )}

        <Button label="Suivant →" onPress={() => router.push('/cv/step3-experience')} />
        <Button label="← Retour" variant="outline" onPress={() => router.back()} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, padding: 16, paddingTop: 48 },
  content: { padding: 20, gap: 14 },
  infoBox: { backgroundColor: Colors.primaryLight, borderRadius: 8, padding: 10 },
  infoText: { fontSize: 12, color: Colors.primary },
  uploadZone: {
    alignItems: 'center',
    padding: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 12,
  },
  photoPreview: { width: 140, height: 140, borderRadius: 70 },
  placeholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center' },
  successBadge: {
    backgroundColor: '#E1F5EE',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  successText: { fontSize: 12, color: Colors.success, fontWeight: '500' },
  row: { flexDirection: 'row', gap: 10 },
});