import React from 'react';
import { SafeAreaView, Text, View, TextInput, StyleSheet, ScrollView, Pressable, StatusBar } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import ServicoService from '../../service/ServicoService'
import { Setor } from '@/constants/SetorEnum';
import { router } from 'expo-router';

const usuarioLogado = { id: 1, nome: 'p' };

type criarServicoForm = {
  servico: string;
  descricao: string;
  tempoServico: string;
  preco: string;
  setor: Setor;
}

export default function criaServico() {
  const { control, handleSubmit, formState: { errors } } = useForm<criarServicoForm>({
    defaultValues: {
      descricao: '',
      preco: '',
      servico: '',
      setor: undefined,
      tempoServico: ''
    },
    mode: "onChange"
  });

  const toNumber = (preco: string): number => {
    preco = preco.replace(',', '.');
    preco = preco.replace("R$", '');
    return parseFloat(preco);
  }
  const toDateTime = (tempo: string) => {
    const match = RegExp(/(\d+)h:(\d+)m/).exec(tempo);

    if (!match) {
      throw new Error("Formato de tempo inválido");
    }

    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.toLocaleTimeString("pt-BR");
  }


  const onSubmit = async (data: criarServicoForm) => {

    try {

      const servicoData = {
        prestador: { id: usuarioLogado.id },
        descricao: data.descricao,
        tempoServico: toDateTime(data.tempoServico),
        preco: toNumber(data.preco),
        setor: { id: parseInt(data.setor.toString()) }
      }
      console.log(servicoData)
      await ServicoService.createServico(servicoData);
      router.navigate("/(servico)/editaservico");

    } catch (error) {
      console.error('Erro ao cadastrar serviço:', error);
    }
  };

  const onlyText = (text: string) => text.replace(/[^a-zA-Z\s]/g, '');

  const formatCurrency = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, '');
    const numberValue = (parseInt(onlyNumbers, 10) / 100).toFixed(2);
    return `R$ ${numberValue.replace('.', ',')}`;
  };

  const formatTime = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, '');

    let formattedValue = onlyNumbers.slice(0, 4);

    if (formattedValue.length >= 3) {
      formattedValue = `${formattedValue.slice(0, 2)}h:${formattedValue.slice(2)}m`;
    } else if (formattedValue.length >= 1) {
      formattedValue = `${formattedValue}h`;
    }

    return formattedValue;
  };

  const perfilClick = ()=>{
    router.navigate('/(tabs)/perfil')
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <View style={styles.userText}>
          <Pressable onPress={perfilClick}>
            <Ionicons name="arrow-back-outline" size={30} style={styles.backIcon}
              color="white"
            />
          </Pressable>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>Usuário</Text>
        </View>
      </View>

      <Text style={styles.title}>Cadastrar Serviço</Text>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.formulario}>

          <View style={styles.containerInput}>
            <Controller
              control={control}
              name="servico"
              rules={{
                required: 'Nome do serviço é obrigatório.',
                validate: value => onlyText(value) === value || 'Somente letras são permitidas.'
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={text => onChange(onlyText(text))}
                  placeholder="Nome do Serviço"
                />
              )}
            />
            {errors.servico && <Text style={styles.erro}>{errors.servico.message}</Text>}
          </View>

          <View style={styles.containerInput}>
            <Controller
              control={control}
              name="descricao"
              rules={{
                required: 'Descrição do serviço é obrigatória.',
                validate: value => onlyText(value) === value || 'Somente letras são permitidas.'
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                  value={value}
                  onChangeText={text => onChange(onlyText(text))}
                  placeholder="Descrição do Serviço"
                  multiline
                />
              )}
            />
            {errors.descricao && <Text style={styles.erro}>{errors.descricao.message}</Text>}
          </View>

          <View style={styles.containerInput}>
            <Controller
              control={control}
              name="tempoServico"
              rules={{ required: 'Tempo é obrigatório.' }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={text => onChange(formatTime(text))}
                  placeholder="Tempo (HH:MM)"
                  keyboardType="numeric"
                  maxLength={7}
                />
              )}
            />
            {errors.tempoServico && <Text style={styles.erro}>{errors.tempoServico?.message}</Text>}
          </View>

          <View style={styles.containerInput}>
            <Controller
              control={control}
              name="preco"
              rules={{ required: 'Preço é obrigatório.' }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={valor => onChange(formatCurrency(valor))}
                  placeholder="Preço"
                  inputMode="numeric"
                />
              )}
            />
            {errors.preco && <Text style={styles.erro}>{errors.preco?.message}</Text>}
          </View>

          <View style={styles.containerInput}>
            <Controller
              control={control}
              name="setor"
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  style={styles.input}
                  onValueChange={(itemValue: Setor) => onChange(itemValue)}
                >
                  <Picker.Item label="Escolha um setor" value={null} />
                  <Picker.Item label="Setor 1" value={Setor.SETOR1} />
                  <Picker.Item label="Setor 2" value={Setor.SETOR2} />
                  <Picker.Item label="Setor 3" value={Setor.SETOR3} />
                </Picker>
              )}
            />
          </View>
          <Pressable style={styles.botaoSalvar} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.textoBotaoSalvar}>Salvar</Text>
          </Pressable>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FBCB1C',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 25,
    marginBottom: 20,
  },
  userText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  headerTexto: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  scrollViewContainer: {
    paddingBottom: 100,
  },
  formulario: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  containerInput: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  erro: {
    color: 'red',
    marginTop: 5,
  },
  botaoSalvar: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotaoSalvar: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnVoltar: {
    position: 'absolute',
    left: 15,
    top: 15,
  },
  backIcon: {
    paddingRight: 15,
  },
});