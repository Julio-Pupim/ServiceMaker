import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { Navigator } from 'react-navigation';

const TelaCadastro: React.FC = () => {
    const [nome, setNome] = useState('');
    const [celular, setCelular] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const cadastro = () => {
        alert(`Nome completo: ${nome}`);
        alert(`Nº de celular: ${celular}`);
        alert(`E-mail: ${email}`);
        alert(`Senha: ${senha}`);
    };

    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <Image
          style={{ width: 200, height: 40 }}
          source={require('../../assets/images/ServiceMakerLogoWhiteLogo.png')}
        />
        <Text>Cadastro</Text>
        <TextInput 
          placeholder='Nome completo' 
          style={styles.textInput} 
          onChangeText={text => setNome(text)} 
        />
        <TextInput 
          placeholder='Nº de celular' 
          style={styles.textInput} 
          onChangeText={text => setCelular(text)} 
        />
        <TextInput 
          placeholder='E-mail' 
          style={styles.textInput} 
          onChangeText={text => setEmail(text)} 
        />
        <TextInput 
          placeholder='Senha' 
          style={styles.textInput} 
          secureTextEntry
          onChangeText={text => setSenha(text)} 
        />
        <TouchableOpacity style={styles.botaoCadastro} onPress={cadastro}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Continuar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => Navigator.goBack()}>
            <Text>Já possui uma conta? Fazer login</Text>
        </TouchableOpacity>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 20,
  },
  textInput: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  botaoCadastro: {
    width: '100%',
    height: 40,
    backgroundColor: '#FBCB1C',
    borderRadius: 10,
    justifyContent: 'center',
  },
});

export default TelaCadastro;