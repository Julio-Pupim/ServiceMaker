import { View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaView>
      <Link href="./(auth)/login" style={{ color: 'blue' }}>Auth</Link>
      <Link href="./(tabs)/inicio" style={{ color: 'blue' }}>App</Link>
    </SafeAreaView>
  );
};

export default App;