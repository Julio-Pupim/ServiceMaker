import React, { useState } from 'react';
import { Controller, get, useForm, useWatch } from 'react-hook-form';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type CadastroForm = {
  nome: string,
  email: string,
  senha: string,
  confirmaSenha: string,
  telefone?: string,
  endereco?: {
    rua: string,
    numero: string,
    cep: string,
    complemento: string,
    tipo: string
  }
  cpf?: string
  prestador: boolean
}

const Cadastro = () => {
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<CadastroForm>({
    defaultValues: {
      email: '',
      senha: '',
      confirmaSenha: '',
      cpf: '',
      endereco: {}
    },
    mode: "onChange"
  });
  return (
    <View style={styles.container}>
      <Image
        style={{ width: 200, height: 40 }}
        source={require('../../assets/images/ServiceMakerWhiteLogo.png')}
      />
      <Controller
        control={control}
        name='nome'
        rules={{ required: 'nome obrigatório' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder='digite seu nome'
            style={styles.textInput}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name='senha'
        rules={{ required: 'Senha obrigatória' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder='Digite sua senha'
            style={styles.textInput}
            secureTextEntry={true}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name='confirmaSenha'
        rules={{
          required: true, validate: (valor) => {
            const senha = get('senha').value;
            return valor === senha || 'As senhas não coincidem';
          }
        }}
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
      <TouchableOpacity style={styles.button} onPress={(data) => console.log(data)}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Continuar</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity>
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
