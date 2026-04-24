import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
};

export default function Button({ label, onPress, variant = 'primary' }: Props) {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant]]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, variant !== 'primary' && styles.textDark]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  primary: { backgroundColor: Colors.primary },
  secondary: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.primary },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.border },
  text: { color: Colors.white, fontSize: 14, fontWeight: '500' },
  textDark: { color: Colors.primary },
});