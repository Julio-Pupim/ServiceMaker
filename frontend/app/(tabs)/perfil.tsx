import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, View, TextInput, TouchableOpacity, Image, ScrollView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

const inicio = () => {
  router.navigate('/inicio');
};

export default function Perfil() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <View style={styles.userText}>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>Usuário</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.containerPerfil}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }} 
            style={styles.imagemPerfil}
          />
        </View>

        <TouchableOpacity style={styles.iconEditarPerfil}>
          <Icon name="edit" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.formulario}>
          <View style={styles.containerInput}>
            <Text style={styles.label}>Nome Completo</Text>
            <View style={styles.wrapperInput}>
              <TextInput
                value={nome}
                onChangeText={setNome}
                style={styles.input}
              />
              <Icon name="edit" size={20} color="gray" style={styles.iconEditar} />
            </View>
          </View>

          <View style={styles.containerInput}>
            <Text style={styles.label}>E-mail</Text>
            <View style={styles.wrapperInput}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
              />
              <Icon name="edit" size={20} color="gray" style={styles.iconEditar} />
            </View>
          </View>

          <View style={styles.containerInput}>
            <Text style={styles.label}>Número de Celular</Text>
            <View style={styles.wrapperInput}>
              <TextInput
                value={telefone}
                onChangeText={setTelefone}
                style={styles.input}
                keyboardType="phone-pad"
              />
              <Icon name="edit" size={20} color="gray" style={styles.iconEditar} />
            </View>
          </View>

          <View style={styles.containerInput}>
            <Text style={styles.label}>Endereço</Text>
            <View style={styles.wrapperInput}>
              <TextInput
                value={endereco}
                onChangeText={setEndereco}
                style={styles.input}
              />
              <Icon name="edit" size={20} color="gray" style={styles.iconEditar} />
            </View>
          </View>

          <TouchableOpacity style={styles.botaoSalvar} onPress={inicio}>
            <Text style={styles.textoBotaoSalvar}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  containerInput: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  wrapperInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  iconEditar: {
    marginLeft: 10,
  },
  botaoSalvar: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotaoSalvar: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default Perfil;
