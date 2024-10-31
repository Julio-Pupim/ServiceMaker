import React from 'react';
import { Text, SafeAreaView, StyleSheet, View, StatusBar, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Share } from 'react-native';
import { router } from 'expo-router';

export default function Compartilhar() {
  const onShare = async () => {
    try {
      await Share.share({
        message: 'Compartilhe nosso aplicativo com seus amigos e familiares!',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Ocorreu um erro ao compartilhar.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <Text style={styles.headerText}>Compartilhe</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>
          Compartilhe nosso aplicativo com seus amigos e familiares!
        </Text>
        <Pressable style={styles.shareButton} onPress={onShare}>
          <Ionicons name="share-social-outline" size={24} color="white" />
          <Text style={styles.shareButtonText}>Compartilhar</Text>
        </Pressable>

        <Pressable style={styles.returnButton} onPress={() => router.push('/(tabs)/perfil')}>
          <Text style={styles.returnText}>Voltar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FBCB1C',
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  shareButton: {
    backgroundColor: '#FBCB1C',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  shareButtonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  returnButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  returnText: {
    color: '#007BFF',
  },
});
