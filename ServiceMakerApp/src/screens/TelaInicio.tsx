import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const TelaInicio: React.FC = () => {
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
      ];
    
      const profissionais = [
        { id: '1', nome: 'Rafael' },
        { id: '2', nome: 'Michelle' },
        { id: '3', nome: 'Rodrigo' },
        { id: '4', nome: 'Manuel' },
        { id: '5', nome: 'Emanuelle' },
        { id: '6', nome: 'Fernanda' },
      ];
    
      return (
        <ScrollView style={styles.container}>
          <StatusBar hidden />
          <View style={styles.header}>
            <View style={styles.userText}>
              <Ionicons name="person-circle-outline" size={30} color="white" />
              <Text style={styles.userName}>Usuário</Text>
            </View>
          </View>
    
          <View>
            <Text style={styles.greetings}>Olá, usuário!</Text>
            <Text style={styles.subText}>O que você procura hoje?</Text>
          </View>
    
          <View style={styles.promocoesContainer}>
            {promocoes.map(promo => (
              <TouchableOpacity key={promo.id} style={styles.promoCard}>
                <Text style={styles.promoTitle}>{promo.titulo}</Text>
                <Text style={styles.promoDesc}>{promo.desconto}</Text>
              </TouchableOpacity>
            ))}
          </View>
    
          <Text style={styles.sectionTitle}>Serviços frequentes</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.servicosScroll}>
        {servicosFrequentes.map((servico) => (
          <View key={servico.id} style={styles.servicoItem}>
            <Ionicons name={servico.icon} size={40} color="#FFC107" />
            <Text style={styles.servicoText}>{servico.descricao}</Text>
          </View>
        ))}
      </ScrollView>
    
          <Text style={styles.sectionTitle}>Encontre profissionais</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.profissionaisScroll}>
        {profissionais.map((profissional) => (
          <View key={profissional.id} style={styles.profissionalItem}>
            <Image source={{ uri: profissional.imagem }} style={styles.profissionalImage} />
            <Text style={styles.profissionalNome}>{profissional.nome}</Text>
          </View>
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
    backgroundColor: '#FFD700',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  userText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  greetings: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  subText: {
    color: 'gray',
    fontSize: 14,
    marginLeft: 20,
    marginBottom: 20,
  },
  promocoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 10,
  },
  promoCard: {
    backgroundColor: '#E0F7FA',
    padding: 15,
    borderRadius: 10,
    width: '45%',
  },
  promoTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  promoDesc: {
    color: '#00ACC1',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
    marginLeft: 20,
  },
  servicosScroll: {
    marginHorizontal: 20,
  },
  servicoItem: {
    alignItems: 'center',
    marginRight: 30,
  },
  servicoText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  profissionaisScroll: {
    marginHorizontal: 20,
  },
  profissionalItem: {
    alignItems: 'center',
    marginRight: 30,
  },
  profissionalImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  profissionalNome: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default TelaInicio;