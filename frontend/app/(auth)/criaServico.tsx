import React from 'react';
import { SafeAreaView, Text, View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Picker } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialIcons';

type criarServicoForm = {
  prestador: string;
  servico: string;
  descricao: string;
  tempo: string;
  preco: number;
  setor: string;
}

export default function criaServico() {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data: criarServicoForm) => console.log(data);

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

  return (
    <SafeAreaView style={estilos.container}>
      <View style={estilos.header}>
        <TouchableOpacity style={estilos.btnVoltar}>
          <Icon name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={estilos.headerTexto}>Criar Serviço</Text>
      </View>

      <ScrollView contentContainerStyle={estilos.scrollViewContainer}>
        <View style={estilos.formulario}>

          <View style={estilos.containerInput}>
            <Controller
              control={control}
              name="prestador"
              rules={{
                required: 'Nome do prestador é obrigatório.',
                validate: value => onlyText(value) === value || 'Somente letras são permitidas.'
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={estilos.input}
                  value={value}
                  onChangeText={text => onChange(onlyText(text))}
                  placeholder="Nome do Prestador"
                />
              )}
            />
            {errors.prestador && <Text style={estilos.erro}>{errors.prestador.message}</Text>}
          </View>

          <View style={estilos.containerInput}>
            <Controller
              control={control}
              name="servico"
              rules={{
                required: 'Nome do serviço é obrigatório.',
                validate: value => onlyText(value) === value || 'Somente letras são permitidas.'
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={estilos.input}
                  value={value}
                  onChangeText={text => onChange(onlyText(text))}
                  placeholder="Nome do Serviço"
                />
              )}
            />
            {errors.servico && <Text style={estilos.erro}>{errors.servico.message}</Text>}
          </View>

          <View style={estilos.containerInput}>
            <Controller
              control={control}
              name="descricao"
              rules={{
                required: 'Descrição do serviço é obrigatória.',
                validate: value => onlyText(value) === value || 'Somente letras são permitidas.'
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[estilos.input, { height: 100, textAlignVertical: 'top' }]}
                  value={value}
                  onChangeText={text => onChange(onlyText(text))}
                  placeholder="Descrição do Serviço"
                  multiline
                />
              )}
            />
            {errors.descricao && <Text style={estilos.erro}>{errors.descricao.message}</Text>}
          </View>

          <View style={estilos.containerInput}>
            <Controller
              control={control}
              name="tempo"
              rules={{ required: 'Tempo é obrigatório.' }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={estilos.input}
                  value={value}
                  onChangeText={text => onChange(formatTime(text))}
                  placeholder="Tempo (HH:MM)"
                  keyboardType="numeric"
                  maxLength={7}
                />
              )}
            />
            {errors.tempo && <Text style={estilos.erro}>{errors.tempo.message}</Text>}
          </View>

          <View style={estilos.containerInput}>
            <Controller
              control={control}
              name="preco"
              rules={{ required: 'Preço é obrigatório.' }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={estilos.input}
                  value={value}
                  onChangeText={text => onChange(formatCurrency(text))}
                  placeholder="Preço"
                  keyboardType="numeric"
                />
              )}
            />
            {errors.preco && <Text style={estilos.erro}>{errors.preco.message}</Text>}
          </View>

          <View style={estilos.containerInput}>
            <Controller
              control={control}
              name="setor"
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  style={estilos.input}
                  onValueChange={(itemValue) => onChange(itemValue)}
                >
                  <Picker.Item label="Escolha um setor" value="" />
                  <Picker.Item label="Setor 1" value="setor1" />
                  <Picker.Item label="Setor 2" value="setor2" />
                  <Picker.Item label="Setor 3" value="setor3" />
                </Picker>
              )}
            />
          </View>

          <TouchableOpacity style={estilos.botaoSalvar} onPress={handleSubmit(onSubmit)}>
            <Text style={estilos.textoBotaoSalvar}>Salvar</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fbcb1c',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
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
});
