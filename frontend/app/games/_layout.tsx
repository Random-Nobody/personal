import { StyleSheet, View } from 'react-native';
import { Slot } from 'expo-router';

export default function GamesLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    maxWidth: 600,
  }
});