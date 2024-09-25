import { Text, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

const App = () => {
  return (
    <View>
      <Text>App</Text>
      <Link href="./(auth)/cadastro" style={{ color: 'blue' }}>Go to Home</Link>
    </View>
  );
};

export default App;