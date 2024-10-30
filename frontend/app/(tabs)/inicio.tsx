import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { Icon } from 'lucide-react-native';
import { TextInput } from 'react-native-gesture-handler';
import Pesquisa from '../search/[query]';

const Inicio = () => {
  const [searchText, setSearchText] = useState('');

  //const navigation = useNavigation();

  const promocoes = [
    { id: '1', titulo: 'Serviços de jardinagem', desconto: '20% de desconto' },
    { id: '2', titulo: 'Reparo de celulares', desconto: '15% de desconto' },
  ];

  const servicosFrequentes = [
    { id: '1', descricao: 'Encanador', icon: 'construct-outline' },
    { id: '2', descricao: 'Eletricista', icon: 'flash-outline' },
    { id: '3', descricao: 'Técnico', icon: 'cog-outline' },
    { id: '4', descricao: 'Carpinteiro', icon: 'hammer-outline' },
    { id: '5', descricao: 'Mecânico', icon: 'car-outline' },
    { id: '6', descricao: 'Jardineiro', icon: 'leaf-outline' },
    { id: '7', descricao: 'Pintor', icon: 'color-palette-outline' },
    { id: '8', descricao: 'Designer de interiores', icon: 'home-outline' },
    { id: '9', descricao: 'Nutricionista', icon: 'restaurant-outline' },
    { id: '10', descricao: 'Personal Trainer', icon: 'fitness-outline' },
  ];

  const profissionais = [
    { id: '1', nome: 'Rafael' },
    { id: '2', nome: 'Michelle' },
    { id: '3', nome: 'Rodrigo' },
    { id: '4', nome: 'Manuel' },
    { id: '5', nome: 'Emanuelle' },
    { id: '6', nome: 'Fernanda' },
    { id: '7', nome: 'Carlos' },
    { id: '8', nome: 'Ana' },
    { id: '9', nome: 'Juliano' },
    { id: '10', nome: 'Patrícia' },
    { id: '11', nome: 'Cláudio' },
    { id: '12', nome: 'Sofia' },
  ];

  const agendaClick = () => {
    router.navigate('/(tabs)/agenda');
  };

  const profissionalClick = () => {
    router.navigate('/(tabs)/perfil');
  };
  
  const pesquisaClick = () => {
    router.navigate('/(tabs)/perfil');
  };

  const prestadorClick = () => {
    router.navigate('/(extra)/prestador')
  }
  

  return (
    <ScrollView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <View style={styles.userText}>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>Usuário</Text>
        </View>
      </View>

      <View>
        <Text style={styles.greetings}>Olá, usuário!</Text>
      </View>

      <View style={styles.pesquisa}>
        <Ionicons name = "search" size = {20} color = "black" style={styles.iconPesquisa} />
        <TextInput
          style={styles.textoPesquisa}  
          placeholder="O que você procura hoje?" 
          value={searchText}
          onChangeText={setSearchText}  
        />

      </View>

      <View style={styles.promocoesContainer}>
        {promocoes.map(promo => (
          <TouchableOpacity key={promo.id} style={styles.promoCard} onPress={pesquisaClick}>
            <Text style={styles.promoTitle}>{promo.titulo}</Text>
            <Text style={styles.promoDesc}>{promo.desconto}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Serviços frequentes</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.servicosScroll}>
        {servicosFrequentes.map(servico => (
          <TouchableOpacity key={servico.id} style={styles.servicoItem} onPress={prestadorClick}>
            <Ionicons name={servico.icon} size={35} color="black"/>
            <Text style={styles.servicoText}>{servico.descricao}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Encontre profissionais</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.profissionaisScroll}>
        {profissionais.map(profissional => (
          <TouchableOpacity key={profissional.id} style={styles.servicoItem} onPress={profissionalClick}>
            <View key={profissional.id} style={styles.profissionalItem}>
              <Text style={styles.profissionalNome}>{profissional.nome}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
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
  greetings: {
    color: 'black',
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  subText: {
    color: 'gray',
    fontSize: 16,
    marginLeft: 20,
    marginBottom: 25,
  },
  promocoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 10,
  },
  promoCard: {
    backgroundColor: '#E0F7FA',
    padding: 20,
    borderRadius: 10,
    width: '45%',
  },
  promoTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  promoDesc: {
    color: '#00ACC1',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 25,
    marginLeft: 20,
  },
  servicosScroll: {
    marginHorizontal: 20,
  },
  servicoItem: {
    alignItems: 'center',
    marginRight: 35,
  },
  servicoText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  profissionaisScroll: {
    marginHorizontal: 20,
  },
  profissionalItem: {
    alignItems: 'center',
    marginRight: 35,
  },
  profissionalNome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pesquisa:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    height: 40,
  },
  iconPesquisa: {
    marginRight: 10
  },
  textoPesquisa:{
    flex: 1,
    fontSize: 16,
  },

});

export default Inicio;
