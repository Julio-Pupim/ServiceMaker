import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function TelaEditarPerfil() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

  return (
    <SafeAreaView style={estilos.container}>
      {/* Cabeçalho */}
      <View style={estilos.header}>
        <TouchableOpacity style={estilos.btnVoltar}>
          <Icon name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={estilos.headerTexto}>Editar Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={estilos.scrollViewContainer}>
        {/* Foto de Perfil */}
        <View style={estilos.containerPerfil}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }} 
            style={estilos.imagemPerfil}
          />
        </View>

        {/* Ícone de Editar Foto */}
        <TouchableOpacity style={estilos.iconEditarPerfil}>
          <Icon name="edit" size={24} color="white" />
        </TouchableOpacity>

        {/* Formulário de Edição */}
        <View style={estilos.formulario}>
          <View style={estilos.containerInput}>
            <Text style={estilos.label}>Nome Completo</Text>
            <View style={estilos.wrapperInput}>
              <TextInput
                value={nome}
                onChangeText={setNome}
                style={estilos.input}
              />
              <Icon name="edit" size={20} color="gray" style={estilos.iconEditar} />
            </View>
          </View>

          <View style={estilos.containerInput}>
            <Text style={estilos.label}>E-mail</Text>
            <View style={estilos.wrapperInput}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={estilos.input}
                keyboardType="email-address"
              />
              <Icon name="edit" size={20} color="gray" style={estilos.iconEditar} />
            </View>
          </View>

          <View style={estilos.containerInput}>
            <Text style={estilos.label}>Número de Celular</Text>
            <View style={estilos.wrapperInput}>
              <TextInput
                value={telefone}
                onChangeText={setTelefone}
                style={estilos.input}
                keyboardType="phone-pad"
              />
              <Icon name="edit" size={20} color="gray" style={estilos.iconEditar} />
            </View>
          </View>

          <View style={estilos.containerInput}>
            <Text style={estilos.label}>Endereço</Text>
            <View style={estilos.wrapperInput}>
              <TextInput
                value={endereco}
                onChangeText={setEndereco}
                style={estilos.input}
              />
              <Icon name="edit" size={20} color="gray" style={estilos.iconEditar} />
            </View>
          </View>

          {/* Botão de Salvar */}
          <TouchableOpacity style={estilos.botaoSalvar}>
            <Text style={estilos.textoBotaoSalvar}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Rodapé */}
      <View style={estilos.rodape}>
        <TouchableOpacity style={estilos.iconRodape}>
          <Icon name="home" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={estilos.iconRodape}>
          <Icon name="shopping-cart" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={estilos.iconRodape}>
          <Icon name="person" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fbcb1c',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
  },
  headerTexto: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  btnVoltar: {
    position: 'absolute',
    left: 15,
    top: 15,
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
