import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Button, StatusBar, Alert, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type AgendamentoForm = {
  servico: string;
  prestador: string;
  localizacao: string;
  anotacao: string;
  data: string;
  hora: string;
  horaFim: string;
};

const prestadorClick = ()=>{
  router.navigate('/(servico)/prestador')
}

export default function Agendamento() {
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<AgendamentoForm>({
    defaultValues: {
      servico: '',
      prestador: '',
      localizacao: '',
      anotacao: '',
      data: '',
      hora: '',
    },
    mode: 'onChange',
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [show, setShow] = useState(false);

  const onChange = (event: DateTimePickerEvent, selectedValue?: Date) => {
    const currentDate = selectedValue || selectedDate;
    setShowDatePicker(false);
    setShowTimePicker(false);
    setSelectedDate(currentDate);
  };

  const showMode = (currentMode: 'date' | 'time') => {
    setMode(currentMode);
    setShow(true);
  };

  const addTask = async (data: AgendamentoForm) => {
    if (!selectedDate || !data.servico || !data.prestador || !data.localizacao || !data.anotacao) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos e selecione uma data.');
      return;
    }
    console.log('Agendamento adicionado:', { ...data, date: selectedDate });
    Alert.alert('Agendamento adicionado com sucesso!');
    router.push('/(tabs)/inicio');
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

  const formatDate = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, '');
    let formattedValue = onlyNumbers.slice(0, 8);

    if (formattedValue.length >= 6) {
      formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}/${formattedValue.slice(4)}`;
    } else if (formattedValue.length >= 4) {
      formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
    } else if (formattedValue.length >= 2) {
      formattedValue = `${formattedValue.slice(0, 2)}`;
    }

    return formattedValue;
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
          <Text style={styles.userName}>Usuário</Text>
        </View>
      </View>

      <Text style={styles.title}>Agendamento</Text>

      <Controller
        control={control}
        name="servico"
        rules={{ required: 'Serviço é um campo obrigatório' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Serviço"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.servico && <Text style={styles.errorText}>{errors.servico.message}</Text>}

      <Controller
        control={control}
        name="prestador"
        rules={{ required: 'Prestador é um campo obrigatório' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Prestador"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.prestador && <Text style={styles.errorText}>{errors.prestador.message}</Text>}

      <Controller
        control={control}
        name="data"
        rules={{ required: 'Data é obrigatória.' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            placeholder="Data"
            keyboardType="numeric"
            maxLength={10}
          />
        )}
      />
      {errors.data && <Text style={styles.errorText}>{errors.data.message}</Text>}

      <Controller
        control={control}
        name="hora"
        rules={{ required: 'Hora de início é obrigatória.' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={text => onChange(formatTime(text))}
            placeholder="Hora"
            keyboardType="numeric"
            maxLength={7}
            />
          )}
        />
        {errors.hora && <Text style={styles.errorText}>{errors.hora.message}</Text>}

      <Controller
        control={control}
        name="localizacao"
        rules={{ required: 'Localização é um campo obrigatório' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Localização"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.localizacao && <Text style={styles.errorText}>{errors.localizacao.message}</Text>}

      <Controller
        control={control}
        name="anotacao"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Anotação"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Pressable
        style={[styles.button]}
        onPress={handleSubmit(addTask)}
        disabled={!isValid || !selectedDate}
      >
        <Text style={styles.buttonText} onPress={() => router.push('/(tabs)/agenda')}>Adicionar Agendamento</Text>
      </Pressable>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  input: {
    height: 40,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingLeft: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    height: 50,
    backgroundColor: '#FBCB1C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  cancelText: {
    color: '#007BFF',
  },
  errorText: {
    color: '#FF375B',
    marginLeft: 10,
  },
  backIcon: {
    paddingRight: 15,
  },
});
