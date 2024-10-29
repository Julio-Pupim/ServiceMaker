import { View, Text, StatusBar, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [codigoVerificacao, setCodigoVerificacao] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [step, setStep] = useState(1);

  const verificarEmail = async () => {
    console.log('Verificando email...');
    setStep(2);
  };

  const verificarCelular = async () => {
    console.log('Verificando número de celular...');
    setStep(2);
  };

  const verificarCodigo = async () => {
    console.log('Verificando código...');
    setStep(3);
  };

  const setNovaSenha = async () => {
    console.log('Configurando nova senha...');
  };

  const renderizarPassos = () => {
    switch (step) {
      case 1:
        return (
          <SafeAreaView style={styles.container}>
            <StatusBar hidden />
            <Image
              style={{ width: 200, height: 40 }}
              src='../../assets/images/ServiceMakerWhiteLogo.png'
            />
            <TextInput
              placeholder='Email'
              style={styles.textInput}
              onChangeText={text => setEmail(text)}
            />
            <TouchableOpacity style={styles.button} onPress={verificarEmail}>
              <Text style={styles.button}>Continuar</Text>
            </TouchableOpacity>
          </SafeAreaView>
        );
      case 2:
        return (
          <View style={styles.container}>
            <StatusBar hidden />
            <Image
              style={{ width: 200, height: 40 }}
              src='../../assets/images/ServiceMakerLogoWhiteLogo.png'
            />
            <TextInput
              placeholder='Código de verificação'
              style={styles.textInput}
              onChangeText={text => setCodigoVerificacao(text)}
            />
            <TouchableOpacity style={styles.button} onPress={verificarCodigo}>
              <Text style={styles.button}>Continuar</Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <View style={styles.container}>
            <StatusBar hidden />
            <Image
              style={{ width: 200, height: 40 }}
              src='../../assets/images/ServiceMakerWhiteLogo.png'
            />
            <TextInput
              placeholder='Senha'
              style={styles.textInput}
              onChangeText={text => setSenha(text)}
            />
            <TextInput
              placeholder='Confirmar senha'
              style={styles.textInput}
              onChangeText={text => setConfirmarSenha(text)}
            />
            <TouchableOpacity style={styles.button} onPress={verificarEmail}>
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return renderizarPassos();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECF0F1',
    padding: 20,
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
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: '#000',
  },
});

export default RecuperarSenha