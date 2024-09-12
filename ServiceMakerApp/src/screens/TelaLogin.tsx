import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { Navigator } from 'react-navigation';

const TelaLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const login = () => {
        alert(`E-mail: ${email}`);
        alert(`Senha: ${senha}`);
    };

    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <Image
          style={{ width: 200, height: 40 }}
          source={require('../../assets/images/ServiceMakerWhiteLogo.png')}
        />
        <Text>Login</Text>
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
        <TouchableOpacity style={styles.botaoLogin} onPress={login}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Navigator.navigate('Recuperacao')}>
            <Text>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Navigator.navigate('Cadastro')}>
            <Text>Não possui uma conta? Realizar Cadastro</Text>
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
  botaoLogin: {
    width: '100%',
    height: 40,
    backgroundColor: '#FBCB1C',
    borderRadius: 10,
    justifyContent: 'center',
  },
});

export default TelaLogin;