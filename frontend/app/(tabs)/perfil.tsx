import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, SafeAreaView, StyleSheet, View, Image, ScrollView, StatusBar, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Perfil = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <View style={styles.userText}>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>Usuário</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/100' }} 
            style={styles.profileImage} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Usuário</Text>
            <Text style={styles.profilePhone}>55 44 1234-5678</Text>
          </View>
          <Pressable style={styles.editButton} onPress={() => { router.navigate('/(perfil)/edicaoperfil') }}>
            <Icon name="edit" size={24} color="white" />
          </Pressable>
        </View>

        <Pressable style={styles.menuItem} onPress={() => { router.navigate('/(perfil)/endereco') }}>
          <Icon name="location-on" size={24} color="black" />
          <Text style={styles.menuText}>Gerenciar endereço</Text>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </Pressable>

        <Pressable style={styles.menuItem} onPress={() => { router.navigate('/(servico)/criaServico') }}>
          <Icon name="add" size={24} color="black" />
          <Text style={styles.menuText}>Cadastrar Serviço</Text>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </Pressable>

        <Pressable style={styles.menuItem} onPress={() => { router.navigate('/(perfil)/historico') }}>
          <Icon name="history" size={24} color="black" />
          <Text style={styles.menuText}>Histórico de Serviços</Text>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </Pressable>
        
        <Pressable style={styles.menuItem} onPress={() => { router.navigate('/(perfil)/compartilhe') }}>
          <Icon name="share" size={24} color="black" />
          <Text style={styles.menuText}>Compartilhe</Text>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </Pressable>

        <Pressable style={styles.menuItem} onPress={() => { router.navigate('/(perfil)/avaliacao') }}>
          <Icon name="star-rate" size={24} color="black" />
          <Text style={styles.menuText}>Nos avalie</Text>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </Pressable>

        <Pressable style={styles.menuItem} onPress={() => { router.navigate('/(perfil)/sobre') }}>
          <Icon name="info" size={24} color="black" />
          <Text style={styles.menuText}>Sobre o Service Maker</Text>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <Icon name="logout" size={24} color="black" />
          <Text style={styles.menuText}>Sair</Text>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FBCB1C',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 25,
    marginBottom: 20,
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
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profilePhone: {
    fontSize: 16,
    color: 'gray',
  },
  editButton: {
    backgroundColor: '#FBCB1C',
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
});

export default Perfil;
