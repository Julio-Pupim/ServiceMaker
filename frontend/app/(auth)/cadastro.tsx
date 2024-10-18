import axios from 'axios';
import Checkbox from 'expo-checkbox';
import { router } from 'expo-router';
import React from 'react';
import { Controller, get, useForm } from 'react-hook-form';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

type CadastroForm = {
  nome: string,
  contato: {
    telefone?: string,
    email: string,
  }
  senha: string,
  confirmaSenha: string,
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

async function handleCadastro(data: CadastroForm) {
  console.log("TO AQUI ", data);
  try {
    await axios.post("https://localhost:8080/api/auth/cadastro", data);

  } catch (error) {
    if (axios.isAxiosError(error) && error.status == 500) {
      console.error('Erro interno do sistema:', error.message);
    } else if (axios.isAxiosError(error) && error.status == 400) {
      console.error('Daodos para cadastros faltantes: ', error.message);
    } else {
      console.error(error);
    }
  }
  router.navigate("/(auth)/login");
}

const Cadastro = () => {
  const { control, handleSubmit, formState: { errors }, watch } = useForm<CadastroForm>({
    defaultValues: {
      contato: {
        email: '',
        telefone: '',
      },
      senha: '',
      confirmaSenha: '',
      cpf: '',
      endereco: {
        cep: '',
        rua: '',
        complemento: '',
        numero: '',
        tipo: '',
      },
      prestador: false,
      nome: ''
    },
    mode: "onChange"
  });
  return (
    <ScrollView style={styles.scrollContainer}>
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
        {errors.nome && <Text style={styles.labelError}>{errors.nome.message}</Text>}

        <Controller
          control={control}
          name='contato.telefone'
          rules={{
            maxLength: {
              value: 11,
              message: 'O telefone deve ter no máximo 11 dígitos (DDD + número)',
            }, pattern: {
              value: /^[1-9]{2}9\d{8}$/,
              message: 'Telefone inválido. Digite apenas números, com DDD e sem formatação.',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder='digite seu telefone'
              style={styles.textInput}
              value={value}
              onChangeText={onChange}
              inputMode='numeric'
            />
          )}
        />
        {errors.contato?.telefone && <Text style={styles.labelError}>{errors.contato.telefone.message}</Text>}

        <Controller
          control={control}
          name='contato.email'
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
        {errors.contato?.email && <Text style={styles.labelError}>{errors.contato.email.message}</Text>}

        <Controller
          control={control}
          name='cpf'
          rules={{
            validate: (value: any) => {
              if (value) {
                return cpfValidator.isValid(value) || 'CPF inválido';
              }
              return true;
            }
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder='digite seu cpf'
              style={styles.textInput}
              value={value}
              inputMode="numeric"
              onChangeText={onChange}
            />
          )}
        />
        {errors.cpf && <Text style={styles.labelError}>{errors.cpf.message}</Text>}

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
        {errors.senha && <Text style={styles.labelError}>{errors.senha.message}</Text>}
        <Controller
          control={control}
          name='confirmaSenha'
          rules={{
            required: true, validate: (valor) => {
              console.log(watch("senha"))
              const senha = watch('senha');
              return valor === senha || 'As senhas não coincidem';
            }
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder='confirmar senha'
              style={styles.textInput}
              secureTextEntry={true}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.confirmaSenha && <Text style={styles.labelError}>{errors.confirmaSenha.message}</Text>}
        <Controller
          control={control}
          name='endereco.cep'
          rules={{
            pattern: {
              value: /^\d+$/,
              message: "CEP inválido"
            }
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder='digite o cep'
              style={styles.textInput}
              value={value}
              onChangeText={onChange}
              inputMode='numeric'
            />
          )}
        />
        {errors.endereco?.cep && <Text style={styles.labelError}>{errors.endereco.cep.message}</Text>}
        <Controller
          control={control}
          name='endereco.rua'
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder='digite o endereço '
              style={styles.textInput}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name='endereco.numero'
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder='digite o numero'
              style={styles.textInput}
              value={value}
              onChangeText={onChange}
              inputMode='numeric'
            />
          )}
        />
        <Controller
          control={control}
          name='endereco.tipo'
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder='digite o tipo do endereço'
              style={styles.textInput}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name='endereco.complemento'
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder='digite o complemento '
              style={styles.textInput}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <View style={styles.checkboxContainer}>
          <Controller
            control={control}
            name='prestador'
            render={({ field: { onChange, value } }) => (
              <Checkbox onValueChange={onChange} value={value} />
            )}
          />
          <Text style={styles.checkboxLabel}>É prestador de serviço?</Text>
        </View>
        <Pressable style={styles.button} onPress={handleSubmit(handleCadastro)}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Continuar</Text>
        </Pressable>

        <Pressable onPress={() => router.navigate("/(auth)/login")}>
          <Text>Já possui uma conta? Realizar Login</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },

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
  labelError: {
    alignSelf: 'flex-start',
    color: '#ff375b',
    marginStart: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',  // Alinha o checkbox e o texto horizontalmente
    alignItems: 'center',  // Centraliza verticalmente
    marginVertical: 10,    // Espaço entre os componentes
    alignSelf: 'flex-start', // Alinha o grupo à esquerda
  },
  checkboxLabel: {
    marginLeft: 10,         // Espaçamento entre o checkbox e o texto
  },
})

export default Cadastro;
