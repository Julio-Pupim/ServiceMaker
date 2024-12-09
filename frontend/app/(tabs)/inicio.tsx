import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useAuth } from '@/components/contextoApi';
import SetorService from '../../service/SetorService';
import PrestadorService from '../../service/PrestadorService' ;

const Inicio = () => {
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [setores, setSetores] = useState([]);
  const [profissionais, setProfissionais] = useState([]);

  // Unificando os dois useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [setoresData, usuariosData] = await Promise.all([
          SetorService.getAllSetores(),
          PrestadorService.getAllPrestadores(),
        ]);
        setSetores(setoresData);
        setProfissionais(usuariosData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchData();
  }, []);

  const renderSetorIcon = (setor: any) => {
    // Aqui você pode adicionar diferentes ícones com base nas características do setor
    switch (setor.id) {
      case 1:
        return <Ionicons name="water-outline" size={35} color="black" />;
      case 2:
        return <Ionicons name="flash-outline" size={35} color="black" />;
      case 3:
        return <Ionicons name="school-outline" size={35} color="black" />;
      case 4:
        return <Ionicons name="construct-outline" size={35} color="black" />;
      case 5:
        return <Ionicons name="car-outline" size={35} color="black" />;
      case 6:
        return <Ionicons name="flower-outline" size={35} color="black" />;
      case 7:
        return <Ionicons name="image-outline" size={35} color="black" />;
      case 8:
        return <Ionicons name="home-outline" size={35} color="black" />;
      case 9:
        return <Ionicons name="school-outline" size={35} color="black" />;
      
      default:
        return <Ionicons name="construct-outline" size={35} color="black" />;
    }
  };

  const profissionalClick = () => {
    router.navigate('/(servico)/prestador');
  };

  const prestadorClick = () => {
    router.navigate('/(servico)/prestador');
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <View style={styles.userText}>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>{user?.nome}</Text>
        </View>
      </View>

      <View>
        <Text style={styles.greetings}>Olá, {user?.nome}</Text>
      </View>

      <View style={styles.pesquisa}>
        <Ionicons name="search" size={20} color="black" style={styles.iconPesquisa} />
        <TextInput
          style={styles.textoPesquisa}
          placeholder="O que você procura hoje?"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <Text style={styles.sectionTitle}>Setores</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.servicosScroll}>
        {setores.map((setor) => (
          <Pressable key={setor.id} style={styles.servicoItem} onPress={prestadorClick}>
            {renderSetorIcon(setor)}
            <Text style={styles.servicoText}>{setor.descricao}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Encontre profissionais</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.profissionaisScroll}>
        {profissionais.map((profissional) => (
          <Pressable key={profissional.id} style={styles.servicoItem} onPress={profissionalClick}>
            <View key={profissional.id} style={styles.profissionalItem}>
              <Ionicons name="person-outline" size={35} color="black" />
              <Text style={styles.profissionalNome}>{profissional.nome}</Text>
            </View>
          </Pressable>
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
  pesquisa: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    height: 40,
  },
  iconPesquisa: {
    marginRight: 10,
  },
  textoPesquisa: {
    flex: 1,
    fontSize: 16,
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
    marginRight: 20,
  },
  profissionalNome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Inicio;
