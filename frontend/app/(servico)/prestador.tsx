import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, StatusBar, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import SetorService from '../../service/SetorService'
import UsuarioService from '../../service/UsuarioService'


const Prestadores = () => {
  const [prestadores, setPrestadores] = useState([]);
  const [nomeUsuario, setNomeUsuario] = useState('Usuário');
  const [setores, setSetor] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {

    const fetchData = async () => {
      try {
        const usuariosData = await UsuarioService.getAllUsuarios();
        console.log('Dados de usuários:', usuariosData);
        setPrestadores(usuariosData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    fetchData();
  }, []);

  const servicoPrestadorClick = (prestador: any) => {
    router.navigate('/(servico)/servicoprestador');
    router.push({ pathname: "/(servico)/servicoprestador", params: { id: prestador.id } })

  };

  const inicioClick = () => {
    router.navigate('/(tabs)/inicio');
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userText}>
        <TouchableOpacity onPress={inicioClick}>
            <Ionicons name="arrow-back-outline" size={30} style={styles.backIcon}
              color="white"
            />
          </TouchableOpacity>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>{nomeUsuario}</Text>
        </View>
      </View>

      <Text style={styles.title}>Prestador</Text>

      <ScrollView>
        {prestadores.map((prestador: any) => (
          <View style={styles.header} key={prestador.id}>
            <View style={styles.posicao}>
              <Image source={require('../../assets/images/prestador.jpg')} style={styles.imagem} />
              <View style={styles.textoContainer}>
                <Text style={styles.nomePrestador}>Nome: {prestador.nome}</Text>
                <Text style={styles.infoPrestador}>
                  {prestador.setor?.descricao}
                </Text>
              </View>
            </View>
            <Pressable onPress={() => servicoPrestadorClick(prestador)}>
              <View style={styles.botaoServicos}>
                <Text style={styles.textServicos}>Serviços</Text>
              </View>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topoTela: {
    backgroundColor: '#FFD700',
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
  header: {
    backgroundColor: '#FBCB1C',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 25,
    marginBottom: 20,
  },
  imagem: {
    flexDirection: 'row',
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 10
  },
  nomePrestador: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  infoPrestador: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textoContainer: {
    justifyContent: 'flex-start',
    margin: 10
  },
  posicao: {
    flexDirection: 'row'
  },
  textServicos: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  botaoServicos: {
    backgroundColor: '#FFD700',
    borderRadius: 5,
    marginVertical: 10,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center'
  },
  backIcon: {
    paddingRight: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
});
export default Prestadores;