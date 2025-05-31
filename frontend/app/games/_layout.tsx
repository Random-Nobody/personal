import { View } from 'react-native';
import { Slot } from 'expo-router';

export default function GamesLayout() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 600 }}>
        <Slot />
      </View>
    </View>
  );
}