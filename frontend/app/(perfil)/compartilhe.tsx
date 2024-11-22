import React from 'react';
import { Text, SafeAreaView, StyleSheet, View, StatusBar, Pressable, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUser } from '@/components/contextoApi';


export default function Compartilhar() {
  const { nomeUsuario } = useUser();

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

  const perfilClick = () => {
    router.navigate('/(tabs)/perfil');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <View style={styles.userText}>
          <Pressable onPress={perfilClick}>
            <Ionicons name="arrow-back-outline" size={30} style={styles.backIcon}
              color="white"
            />
          </Pressable>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>{nomeUsuario}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Compartilhe</Text>
        <Text style={styles.description}>
          Compartilhe nosso aplicativo com seus amigos e familiares!
        </Text>
        <Pressable style={styles.shareButton} onPress={onShare}>
          <Ionicons name="share-social-outline" size={24} color="white" />
          <Text style={styles.shareButtonText}>Compartilhar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FBCB1C',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 25,
    marginBottom: 20,
    width: '100%',
  },
  userText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
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
    backgroundColor: '#007BFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  shareButtonText: {
    marginLeft: 10,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backIcon: {
    paddingRight: 15,
  },
});
