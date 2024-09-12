import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';

const TelaRecuperacao1: React.FC = () => {
    const [celular, setCelular] = useState('');
    const [email, setEmail] = useState('');

    const recuperacao = () => {
        alert(`Nº de celular: ${celular}`);
        alert(`E-mail: ${email}`);
    };

    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <Image
          style={{ width: 200, height: 40 }}
          source={require('../../assets/images/ServiceMakerWhiteLogo.png')}
        />
        <Text>Insira alguma de suas credenciais para receber o código de recuperação de conta.</Text>
        <TextInput 
          placeholder='Nº de celular' 
          style={styles.textInput} 
          onChangeText={text => setCelular(text)} 
        />
        <Text>ou</Text>
        <TextInput 
          placeholder='E-mail' 
          style={styles.textInput} 
          onChangeText={text => setEmail(text)} 
        />
        <TouchableOpacity style={styles.botaoRecuperacao} onPress={recuperacao}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Enviar Código</Text>
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
  botaoRecuperacao: {
    width: '100%',
    height: 40,
    backgroundColor: '#FBCB1C',
    borderRadius: 10,
    justifyContent: 'center',
  },
});

export default TelaRecuperacao1;