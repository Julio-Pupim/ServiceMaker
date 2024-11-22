import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

export default function InicioLogin() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/ServiceMakerVectorLogo.png')} style={styles.logo} />
        <Text style={styles.title}>Service Maker</Text> 
        <Text style={styles.subtitle}>Conectando cliente ao prestador</Text>
      </View>

      <Pressable style={styles.button} onPress={() => {router.navigate("/(auth)/login") }}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => { router.navigate("/(auth)/cadastro")}}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40, 
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#FFC107',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});