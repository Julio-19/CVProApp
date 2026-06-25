// app/CVProApp.js
import { View, Text, StyleSheet } from 'react-native';

export default function CVProApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur CVProApp</Text>
      <Text>Cette page est accessible via /CVProApp</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});