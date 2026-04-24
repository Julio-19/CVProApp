import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

type Props = { step: number; total: number };

export default function ProgressBar({ step, total }: Props) {
  const percent = (step / total) * 100;
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Étape {step}/{total}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 4 },
  label: { fontSize: 11, color: Colors.primaryLight, textAlign: 'right' },
  track: { height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 },
  fill: { height: 4, backgroundColor: Colors.white, borderRadius: 2 },
});