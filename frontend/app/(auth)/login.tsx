import React from 'react';
import { Text, TextInput, Image, StyleSheet, Pressable } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useAuth } from '../../components/contextoApi';

type LoginForm = {
  email: string;
  senha: string;
}

const login = async (data: LoginForm) => {
  try {

    const response = await axios.post('http://localhost:8080/api/auth/login', data);
    return response.data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro na requisição HTTP:', error.message);
    } else {
      console.error("Erro na requisição de login: ", error);
    }
  }
}

const storeToken = async (data: any) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Ambiente navegador
      window.localStorage.setItem('jwt_token', data.token);
      console.log('windows')
    } else {
      // Ambiente móvel
      await AsyncStorage.setItem('jwt_token', data.token);
      console.log('movel')
    }
  } catch (error) {
    console.error('Erro ao salvar token:', error);
  }
};

const LoginScreen = () => {
  const { setAuthData } = useAuth()
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      senha: ''
    },
    mode: "onChange"
  });
  const handleLogin = async (credentials: LoginForm) => {

    try {
      const response = await login(credentials); // Função de login
      console.log(response);
      const { token, usuario} = response;
  
      setAuthData(token, usuario);
      console.log(`Bem-vindo, ${usuario.nome}!`);
      router.push('/(tabs)/inicio');
  } catch (error) {
      console.error('Erro durante o login:', error);
    }
  };
  

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

      <Pressable style={styles.button} onPress={handleSubmit((data) => handleLogin(data))}
        disabled={!isValid}  >
        <Text style={{ color: 'white', textAlign: 'center' }}>Continuar</Text>
      </Pressable>

      <Pressable style={styles.redirect} onPress={() => { router.navigate('/cadastro') }}>
        <Text style={styles.redirectText}>Não possui uma conta? Realizar Cadastro</Text>
      </Pressable>

      <Pressable style={styles.redirect} onPress={() => { router.navigate('/recuperarsenha') }}>
        <Text style={styles.redirectText}>Esqueceu sua senha?</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
  redirect: {
    marginTop: 20,
  },
  redirectText: {
    color: '#000',
    textAlign: 'center',
  },
});

export default LoginScreen