import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';

const TelaRecuperacao3: React.FC = () => {
    const [senha, setSenha] = useState('');
    const [confirmar, setConfirmar] = useState('');

    const recuperacao = () => {
        alert(`Senha: ${senha}`);
        alert(`Confirmar Senha: ${confirmar}`);
    };

    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <Image
          style={{ width: 200, height: 40 }}
          source={require('../../assets/images/ServiceMakerWhiteLogo.png')}
        />
        <Text>Digite sua nova senha.</Text>
        <TextInput 
          placeholder='Senha' 
          style={styles.textInput} 
          onChangeText={text => setSenha(text)} 
        />
        <TextInput 
          placeholder='Confirmar senha' 
          style={styles.textInput} 
          onChangeText={text => setConfirmar(text)} 
        />
        <TouchableOpacity style={styles.botaoRecuperacao} onPress={recuperacao}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Continuar</Text>
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

export default TelaRecuperacao3;