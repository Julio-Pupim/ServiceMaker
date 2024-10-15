import { View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

const App = () => {
  return (
    <View>
      <Link href="./(auth)/login" style={{ color: 'blue' }}>Auth</Link>
      <Link href="./(tabs)/inicio" style={{ color: 'blue' }}>App</Link>
    </View>
  );
};

export default App;