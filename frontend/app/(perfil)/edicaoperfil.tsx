import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, StyleSheet, View, TextInput, Image, ScrollView, StatusBar, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UsuarioService from '../../service/UsuarioService'
import ContatoService from '../../service/ContatoService'
import EnderecoService from '../../service/EnderecoService'
import AsyncStorage from '@react-native-async-storage/async-storage';

const perfilClick = ()=>{
  router.navigate('/(tabs)/perfil')
}

export default function EdicaoPerfil() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {

        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          console.warn('ID do usuário não encontrado');
          return;
        }

        const usuarioData = await UsuarioService.getUsuarioById();
        const contatoData = await ContatoService.getContatoById();
        const enderecoData = await EnderecoService.getEnderecoById();

        setNome(usuarioData.nome);
        setEmail(contatoData.email);
        setTelefone(contatoData.telefone);
        setEndereco(enderecoData.endereco);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchData();
  }, []);

  const perfilClick = () => {
    router.navigate('/(tabs)/perfil');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <View style={styles.userText}>
          <Pressable onPress={perfilClick}>
            <Ionicons name="arrow-back-outline" size={30} style={styles.backIcon} color="white" />
          </Pressable>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>Usuário</Text>
        </View>
      </View>

      <Text style={styles.title}>Edição do Perfil</Text>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.containerPerfil}>
          <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.imagemPerfil} />
        </View>

        <Pressable style={styles.iconEditarPerfil}>
          <Icon name="edit" size={24} color="white" />
        </Pressable>

        <View style={styles.formulario}>
          <View>
            <Text style={styles.label}>Nome Completo</Text>
            <View style={styles.wrapperInput}>
              <TextInput value={nome} onChangeText={setNome} style={styles.input} />
              <Icon name="edit" size={20} color="gray" style={styles.iconEditar} />
            </View>
          </View>

          <View>
            <Text style={styles.label}>E-mail</Text>
            <View style={styles.wrapperInput}>
              <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
              <Icon name="edit" size={20} color="gray" style={styles.iconEditar} />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Número de Celular</Text>
            <View style={styles.wrapperInput}>
              <TextInput value={telefone} onChangeText={setTelefone} style={styles.input} keyboardType="phone-pad" />
              <Icon name="edit" size={20} color="gray" style={styles.iconEditar} />
            </View>
          </View>

          <View>
            <Text style={styles.label}>Endereço</Text>
            <View style={styles.wrapperInput}>
              <TextInput value={endereco} onChangeText={setEndereco} style={styles.input} />
              <Icon name="edit" size={20} color="gray" style={styles.iconEditar} />
            </View>
          </View>

          <Pressable style={styles.saveButton}>
            <Text style={styles.saveText}>Salvar</Text>
          </Pressable>

        </View>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  scrollViewContainer: {
    paddingBottom: 100, 
  },
  containerPerfil: {
    alignItems: 'center',
    marginTop: 30,
  },
  imagemPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#fbcb1c',
    borderWidth: 2,
  },
  iconEditarPerfil: {
    backgroundColor: '#007BFF',
    borderRadius: 15,
    padding: 5,
    alignSelf: 'center',
    marginTop: 10,
  },
  formulario: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  label: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  wrapperInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    padding: 0,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1, 
    height: 40,
    paddingLeft: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
  },
  iconEditar: {
    marginLeft: 10,
    position: 'absolute',
    right: 10, 
  },
  saveButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  cancelText: {
    color: '#007BFF',
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fbcb1c',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  iconRodape: {
    paddingHorizontal: 20,
  },
  backIcon: {
    paddingRight: 15,
  },
});