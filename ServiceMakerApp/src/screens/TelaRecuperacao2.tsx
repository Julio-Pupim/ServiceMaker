import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';

const TelaRecuperacao2: React.FC = () => {
    const [codigo, setCodigo] = useState('');

    const recuperacao = () => {
        alert(`Código de verificacao: ${codigo}`);
    };

    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <Image
          style={{ width: 200, height: 40 }}
          source={require('../../assets/images/ServiceMakerLogoWhiteLogo.png')}
        />
        <TextInput 
          placeholder='Código de verificação' 
          style={styles.textInput} 
          onChangeText={text => setCodigo(text)} 
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

export default TelaRecuperacao2;