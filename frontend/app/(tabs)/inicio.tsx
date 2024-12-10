import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '@/components/contextoApi';
import SetorService from '../../service/SetorService';
import PrestadorService from '../../service/PrestadorService';

const Inicio = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [setores, setSetores] = useState([]);
  const [prestadores, setPrestadores] = useState([]);

  // Carregar dados de setores e prestadores
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [setoresData, prestadoresData] = await Promise.all([
          SetorService.getAllSetores(),
          PrestadorService.getAllPrestadores(),
        ]);
        setSetores(setoresData || []);
        setPrestadores(prestadoresData || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchData();
  }, []);

  // Filtrar setores
  const filteredSetores = setores.filter(setor =>
    setor.descricao?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Filtrar prestadores
  const filteredPrestadores = prestadores.filter(prestador =>
    prestador.nome?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Navegar para a tela de serviços de um prestador
  const navigateToListaServicos = (idPrestador: number) => {
    router.push(`/servicoprestador?id=${idPrestador}`);
  };

  // Navegar para a tela de serviços de um setor
  const navigateToListaPrestadores = (idSetor: number) => {
    router.push({ pathname: '/prestador', params: { id: idSetor } });
  };

  // Renderizar ícone baseado no ID do setor
  const renderSetorIcon = setor => {
    const icons = {
      1: 'water-outline',
      2: 'flash-outline',
      3: 'school-outline',
      4: 'construct-outline',
      5: 'car-outline',
      6: 'flower-outline',
      7: 'image-outline',
      8: 'home-outline',
      9: 'school-outline',
    };
    return (
      <Ionicons
        name={icons[setor.id] || 'construct-outline'} 
        size={35}
        color="black"
      />
    );
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
        <Text style={styles.greetings}>Olá, {user?.nome || 'Usuário'}</Text>
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.servicosScroll}
      >
        {filteredSetores.length > 0 ? (
          filteredSetores.map(setor => (
            <Pressable
              key={setor.id}
              style={styles.servicoItem}
              onPress={() => navigateToListaPrestadores(setor.id)}
            >
              {renderSetorIcon(setor)}
              <Text style={styles.servicoText}>{setor.descricao}</Text>
            </Pressable>
          ))
        ) : (
          <Text style={styles.noResults}>Nenhum setor encontrado</Text>
        )}
      </ScrollView>

      <Text style={styles.sectionTitle}>Encontre prestadores</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.prestadoresScroll}
      >
        {filteredPrestadores.length > 0 ? (
          filteredPrestadores.map(prestador => (
            <Pressable
              key={prestador.id}
              style={styles.servicoItem}
              onPress={() => navigateToListaServicos(prestador.id)}
            >
              <Ionicons name="person-outline" size={35} color="black" />
              <Text style={styles.prestadorNome}>{prestador.nome}</Text>
            </Pressable>
          ))
        ) : (
          <Text style={styles.noResults}>Nenhum prestador encontrado</Text>
        )}
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
  prestadoresScroll: {
    marginHorizontal: 20,
  },
  prestadorNome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noResults: {
    fontSize: 16,
    color: 'gray',
    marginLeft: 20,
  },
});

export default Inicio;
