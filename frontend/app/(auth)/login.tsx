import React from 'react';
import { Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

type LoginForm = {
  email: string;
  senha: string;
}

const login = async (data: LoginForm) => {
  try {

    const response = await axios.post('https://localhost:8080/api/login', data);
    return response.data.token;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro na requisição HTTP:', error.message);
    } else {
      console.error("Erro na requisição de login: ", error);
    }
  }
}
const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('jwt_token', token);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao salvar token no AsyncStorage:', error);
    }
    throw error;
  }
};

async function handleLogin(data: LoginForm) {
  try {
    const token = await login(data);

    await storeToken(token);

    router.push("/(tabs)/inicio");

  } catch (error) {
    console.error('Falha no processo de login:', error);
  }
}

const LoginScreen = () => {
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      senha: ''
    },
    mode: "onChange"
  });

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo}
        source={require('../../assets/images/ServiceMakerWhiteLogo.png')}
      />
      <Controller
        control={control}
        name='email'
        rules={{ required: 'email obrigatório', pattern: { value: /^\S+@\S+$/i, message: "email inválido" } }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder='digite seu email'
            style={styles.textInput}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {<Text style={styles.labelError}>{errors?.email?.message}</Text>}

      <Controller
        control={control}
        name='senha'
        rules={{ required: 'Senha obrigatória' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder='Senha'
            style={styles.textInput}
            secureTextEntry={true}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {<Text style={styles.labelError}>{errors?.senha?.message}</Text>}

      <TouchableOpacity style={[styles.button, { opacity: isValid ? 1 : 0.5 }]} onPress={handleSubmit(handleLogin)} disabled={!isValid}  >
        <Text style={{ color: 'white', textAlign: 'center' }}>Continuar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => { router.navigate('/recuperarsenha') }}>
        <Text>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => { router.navigate('/cadastro') }}>
        <Text>Não possui uma conta? Realizar Cadastro</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
  labelError: {
    alignSelf: 'flex-start',
    color: '#ff375b',
    marginStart: 8,
  },
  logo: {
    width: 200,
    height: 40,
  },

});

export default LoginScreen