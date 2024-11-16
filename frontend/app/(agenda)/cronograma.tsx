import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, Pressable, ScrollView, StatusBar } from 'react-native';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import MultiSelect from 'react-native-multiple-select';
import { router } from 'expo-router';
import { obterNomeUsuario } from '@/utils/storageUtils';

const [nomeUsuario, setNomeUsuario] = useState('Usuário');

useEffect(() => {
  const carregarNomeUsuario = async () => {
    const nome = await obterNomeUsuario();
    setNomeUsuario(nome);
  };

  carregarNomeUsuario();
}, []);

type CronogramaForm = {
  cronogramas: {
    diasSemana: string[];
    horaInicio: string;
    horaFim: string;
  }[];
};

const diasSemana = [
  { label: 'Domingo', value: '0' },
  { label: 'Segunda-feira', value: '1' },
  { label: 'Terça-feira', value: '2' },
  { label: 'Quarta-feira', value: '3' },
  { label: 'Quinta-feira', value: '4' },
  { label: 'Sexta-feira', value: '5' },
  { label: 'Sábado', value: '6' },
];

export default function Cronograma() {
  const { control, handleSubmit, formState: { errors } } = useForm<CronogramaForm>({
    defaultValues: {
      cronogramas: [{
        diasSemana: [],
        horaInicio: '',
        horaFim: '',
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cronogramas",
  });

  const onSubmit = (data: CronogramaForm) => {
    if (data.cronogramas.some(item => item.diasSemana.length === 0 || !item.horaInicio || !item.horaFim)) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    Alert.alert('Cronogramas adicionados com sucesso!');
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

  const validateTime = (time: string): boolean => {
    const regex = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
    
    if (!regex.test(time)) {
      return false;
    }
  
    const [hours, minutes] = time.split(':').map(Number);
  
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return true;
    }
    return false;
  };

  const agendaClick =()=>{
    router.navigate('/(tabs)/agenda');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <View style={styles.userText}>
          <Pressable onPress={agendaClick}>
            <Ionicons name="arrow-back-outline" size={30} style={styles.backIcon}
              color="white"
            />
          </Pressable>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>{nomeUsuario}</Text>
        </View>
      </View>

      <ScrollView style={styles.form}>
        {fields.map((item, index) => (
          <View key={item.id} style={styles.containerInput}>
            <Text style={styles.title}>Cronograma de Atendimento</Text>
            <Controller
              control={control}
              name={`cronogramas[${index}].diasSemana`}
              rules={{ required: 'Selecione ao menos um dia da semana.' }}
              render={({ field: { onChange, value } }) => (
                <MultiSelect
                  items={diasSemana}
                  uniqueKey="value"
                  displayKey="label"
                  selectedItems={value}
                  onSelectedItemsChange={(selectedItems) => onChange(selectedItems)}
                  selectText="Selecione os dias da semana"
                  searchInputPlaceholderText="Procurar dias..."
                  tagRemoveIconColor="#FBCB1C"
                  tagBorderColor="#FBCB1C"
                  tagTextColor="#FBCB1C"
                  selectedItemTextColor="#FBCB1C"
                  selectedItemIconColor="#FBCB1C"
                  submitButtonColor="#FBCB1C"
                  submitButtonText="Confirmar"
                />
              )}
            />
            {errors.cronogramas?.[index]?.diasSemana && <Text style={styles.errorText}>{errors.cronogramas[index].diasSemana.message}</Text>}

            <Controller
              control={control}
              name={`cronogramas[${index}].horaInicio`}
              rules={{
                required: 'Hora de início é obrigatória.',
                validate: value => validateTime(value) || 'Hora inválida. Deve ser no formato HH:MM (máximo 23:59).'
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={text => onChange(formatTime(text))}
                  placeholder="Hora de Início"
                  keyboardType="numeric"
                  maxLength={7}
                />
              )}
            />
            {errors.cronogramas?.[index]?.horaInicio && <Text style={styles.errorText}>{errors.cronogramas[index].horaInicio.message}</Text>}

            <Controller
              control={control}
              name={`cronogramas[${index}].horaFim`}
              rules={{
                required: 'Hora final é obrigatória.',
                validate: value => validateTime(value) || 'Hora inválida. Deve ser no formato HH:MM (máximo 23:59).'
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={text => onChange(formatTime(text))}
                  placeholder="Hora Final"
                  keyboardType="numeric"
                  maxLength={7}
                />
              )}
            />
            {errors.cronogramas?.[index]?.horaFim && <Text style={styles.errorText}>{errors.cronogramas[index].horaFim.message}</Text>}

            <Pressable onPress={() => remove(index)} style={styles.deleteButton}>
              <Ionicons name="trash" size={20} color="#FFF" />
            </Pressable>
          </View>
        ))}

        <Button title="Adicionar Cronograma" onPress={() => append({ diasSemana: [], horaInicio: '', horaFim: '' })} />
        <Button title="Salvar Cronogramas" onPress={handleSubmit(onSubmit)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  form: {
    marginBottom: 20,
  },
  containerInput: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#FF5733',
    borderRadius: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  backIcon: {
    paddingRight: 15,
  },
});
