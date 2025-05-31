import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { colors } from '@/constants/Colors';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      
      <Link href="/games/chess" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Play Chess</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.button,
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});