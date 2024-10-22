import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const Cadastro = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const login = () => {
        alert(`E-mail: ${email}`);
        alert(`Senha: ${senha}`);
    };

    const loginClick = () => {
      router.navigate('/(auth)/login');
    };

    const senhaClick = () => {
      router.navigate('/(auth)/recuperarsenha');
    };

    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <Image
          style={{ width: 200, height: 40 }}
          source={require('../../assets/images/ServiceMakerWhiteLogo.png')}
        />
        <Text>Cadastro</Text>
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
        <TouchableOpacity style={styles.button} onPress={login}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={senhaClick}>
            <Text>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={loginClick}>
            <Text>Já possui uma conta? Realizar Login</Text>
        </TouchableOpacity>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECF0F1',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  textInput: {
    width: '100%',
    height: 40,
    backgroundColor: 'FFFFFF',
    borderRadius: 10,
    paddingLeft: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#FBCB1C',
    borderRadius: 10,
    justifyContent: 'center',
  },
});

export default Cadastro;
