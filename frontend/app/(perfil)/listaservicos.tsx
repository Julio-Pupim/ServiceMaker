import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, ScrollView, Pressable, FlatList, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ServicoService from '../../service/ServicoService';
import { Setor } from '@/constants/SetorEnum';
import { router } from 'expo-router';

const usuarioLogado = { id: 1, nome: 'p' };

type Servico = {
  id: number;
  servico: string;
  descricao: string;
  tempoServico: string;
  preco: number;
  setor: Setor;
  prestador: {
    id: number;
    nome: string;
  };
};

export default function ListagemDeServicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const response = await ServicoService.getAllServicos();
        setServicos(response);
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServicos();
  }, []);

  const perfilClick =()=>{
    router.navigate('/(tabs)/perfil');
  };

  const renderItem = ({ item }: { item: Servico }) => (
    <View style={styles.servicoItem}>
      <Text style={styles.servicoTitulo}>{item.servico}</Text>
      <Text style={styles.servicoDescricao}>{item.descricao}</Text>
      <Text style={styles.servicoDetalhes}>
        Tempo: {item.tempoServico} | Preço: R$ {item.preco.toFixed(2).replace('.', ',')} | Setor: {Setor[item.setor]}
      </Text>

      <View style={styles.actionButtons}>
        <Pressable
          style={styles.button}
          onPress={() => console.log('Editar serviço', item.id)}
        >
          <Ionicons name="create" size={20} color="white" />
          <Text style={styles.buttonText}>Editar</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.buttonExcluir]}
          onPress={() => console.log('Excluir serviço', item.id)}
        >
          <Ionicons name="trash" size={20} color="white" />
          <Text style={styles.buttonText}>Excluir</Text>
        </Pressable>
      </View>
    </View>
  );

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
          <Text style={styles.userName}>Usuário</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.titulo}>Serviços Cadastrados</Text>
        
        {loading ? (
          <Text>Carregando...</Text>
        ) : (
          <FlatList
            data={servicos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 20,
  },
  scrollViewContainer: {
    paddingBottom: 100,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  servicoItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  servicoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  servicoDescricao: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  servicoDetalhes: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#FBCB1C',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonExcluir: {
    backgroundColor: '#DC3545',
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  backIcon: {
    paddingRight: 15,
  },
});
