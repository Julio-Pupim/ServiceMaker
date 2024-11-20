import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView, StatusBar, Pressable } from 'react-native';
import { obterNomeUsuario } from '@/utils/storageUtils';

const [nomeUsuario, setNomeUsuario] = useState('Usuário');

const perfilClick = ()=>{
  router.navigate('/(tabs)/perfil')
}

export default function SobreNos() {
  const perfilClick =()=>{
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

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Sobre o Service Maker</Text>

        <Text style={styles.sectionTitle}>🌟 Nossa Missão</Text>
        <Text style={styles.text}>
          Conectar prestadores de serviços e clientes de forma fácil e eficiente, facilitando o acesso a serviços de qualidade.
        </Text>

        <Text style={styles.sectionTitle}>🔍 Situação Atual</Text>
        <Text style={styles.text}>
          Muitas pessoas enfrentam dificuldades para encontrar serviços de qualidade pela internet. O Service Maker
          surgiu para simplificar essa busca, permitindo que provedores e clientes se encontrem rapidamente.
        </Text>

        <Text style={styles.sectionTitle}>🚀 O que Oferecemos</Text>
        <Text style={styles.text}>
          Nosso aplicativo conta com diversas funcionalidades, incluindo:
        </Text>
        <View style={styles.bulletPointContainer}>
          <Text style={styles.bulletPoint}>• Maior conveniência para clientes: Encontre e agende serviços rapidamente, tudo na palma da sua mão.</Text>
          <Text style={styles.bulletPoint}>• Controle total para prestadores: Cadastre e edite serviços para um gerenciamento eficaz, garantindo informações sempre atualizadas.</Text>
          <Text style={styles.bulletPoint}>• Nunca perca seus agendamentos: Receba notificações e lembretes para não esquecer nenhum compromisso.</Text>
          <Text style={styles.bulletPoint}>• Sua segurança em primeiro lugar: Estamos comprometidos com a proteção dos seus dados pessoais.</Text>
          <Text style={styles.bulletPoint}>• Flexibilidade: Acesse o aplicativo de qualquer dispositivo, seja ele Android ou iOS.</Text>
        </View>

        <Text style={styles.sectionTitle}> Nossa Equipe</Text>
        <Text style={styles.text}>
          Este aplicativo foi desenvolvido pelo Time 13 da Escola de TI de 2024
        </Text>
        <View style={styles.bulletPointContainer}>
          <Text style={styles.bulletPoint}>• Antônio de Oliveira Agnolin</Text>
          <Text style={styles.bulletPoint}>• Emanuel Fernandes Diniz</Text>
          <Text style={styles.bulletPoint}>• Júlio Matheus Minella Pupim</Text>
          <Text style={styles.bulletPoint}>• Pedro Augusto Muniz de Oliveira</Text>
          <Text style={styles.bulletPoint}>• Rafael Henrique Nogueira Luiz</Text>
          <Text style={styles.bulletPoint}>• Vinícius Renan de Paula Michels</Text>
        </View>

        <Text style={styles.sectionTitle}>🤝 Junte-se a Nós!</Text>
        <Text style={styles.text}>
          Venha fazer parte da nossa comunidade! Experimente o Service Maker e descubra como podemos facilitar o seu dia a dia.
        </Text>
      </ScrollView>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FBCB1C',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#FBCB1C',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    color: '#333',
  },
  bulletPointContainer: {
    marginLeft: 10,
    marginBottom: 20,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 5,
  },
  backIcon: {
    paddingRight: 15,
  }
});
