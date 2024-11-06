import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, Pressable, ScrollView, StatusBar } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type CronogramaForm = {
  diasSemana: string[];
  horaInicio: string;
  horaFim: string;
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
      diasSemana: [],
      horaInicio: '',
      horaFim: '',
    },
  });

  const [cronogramas, setCronogramas] = useState<CronogramaForm[]>([]);

  const onSubmit = (data: CronogramaForm) => {
    if (data.diasSemana.length === 0 || !data.horaInicio || !data.horaFim) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setCronogramas([...cronogramas, data]);
    Alert.alert('Cronograma adicionado com sucesso!');
  };

  const handleDelete = (index: number) => {
    const updatedCronogramas = cronogramas.filter((_, i) => i !== index);
    setCronogramas(updatedCronogramas);
  };

  const handleDuplicate = (index: number) => {
    const cronograma = cronogramas[index];
    setCronogramas([...cronogramas, cronograma]);
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
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <View style={styles.userText}>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>Usuário</Text>
        </View>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.containerInput}>
          <Controller
            control={control}
            name="diasSemana"
            rules={{ required: 'Selecione ao menos um dia da semana.' }}
            render={({ field: { onChange, value } }) => (
              <Picker
                selectedValue={value}
                style={styles.input}
                onValueChange={(selectedValue) => onChange([selectedValue])}
              >
                <Picker.Item label="Selecione os dias da semana" value={[]} />
                {diasSemana.map((dia) => (
                  <Picker.Item key={dia.value} label={dia.label} value={dia.value} />
                ))}
              </Picker>
            )}
          />
          {errors.diasSemana && <Text style={styles.errorText}>{errors.diasSemana.message}</Text>}
        </View>

        <View style={styles.containerInput}>
          <Controller
            control={control}
            name="horaInicio"
            rules={{ required: 'Hora de início é obrigatória.' }}
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
          {errors.horaInicio && <Text style={styles.errorText}>{errors.horaInicio.message}</Text>}
        </View>

        <View style={styles.containerInput}>
          <Controller
            control={control}
            name="horaFim"
            rules={{ required: 'Hora final é obrigatória.' }}
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
          {errors.horaFim && <Text style={styles.errorText}>{errors.horaFim.message}</Text>}
        </View>

        <Button title="Adicionar Cronograma" onPress={handleSubmit(onSubmit)} />
      </ScrollView>

      <View style={styles.cronogramasContainer}>
        <Text style={styles.title}>Cronogramas Cadastrados:</Text>
        {cronogramas.length > 0 ? (
          cronogramas.map((item, index) => (
            <View key={index} style={styles.cronogramaItem}>
              <Text style={styles.cronogramaText}>
                {item.diasSemana && Array.isArray(item.diasSemana) && item.diasSemana.length > 0 ? (
                  item.diasSemana.map((dia) => 
                    diasSemana.find(d => d.value === dia)?.label
                  ).join(', ')
                ) : (
                  <Text style={styles.cronogramaText}>Nenhum dia selecionado</Text>
                )}
                | {item.horaInicio} - {item.horaFim}
              </Text>
              <View style={styles.actions}>
                <Pressable onPress={() => handleDuplicate(index)} style={styles.duplicateButton}>
                  <Ionicons name="copy" size={20} color="#FFF" />
                </Pressable>
                <Pressable onPress={() => handleDelete(index)} style={styles.deleteButton}>
                  <Ionicons name="trash" size={20} color="#FFF" />
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noCronogramaText}>Nenhum cronograma cadastrado.</Text>
        )}
      </View>
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
  cronogramasContainer: {
    marginTop: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cronogramaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cronogramaText: {
    fontSize: 16,
  },
  duplicateButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF5733',
    borderRadius: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  noCronogramaText: {
    fontSize: 16,
    color: '#888',
  },
});
