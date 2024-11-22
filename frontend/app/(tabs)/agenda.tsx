import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, StatusBar, Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { obterNomeUsuario } from '@/utils/storageUtils';



type AgendamentoForm = {
  servico: string;
  prestador: string;
  localizacao: string;
  anotacao: string;
};

const inicioClick = () => {
  router.navigate('/(tabs)/inicio')

}


const AgendaScreen = () => {
  const [nomeUsuario, setNomeUsuario] = useState('Usuário');


  const { control, handleSubmit, formState: { errors, isValid } } = useForm<AgendamentoForm>({
    defaultValues: {
      servico: '',
      prestador: '',
      localizacao: '',
      anotacao: '',
    },
    mode: 'onChange',
  });

  const { idPrestador, idServico } = useLocalSearchParams();


  const agandamentoClick = (dataAgendamento: string) => {
    router.push({ pathname: "/(agenda)/agendamento", params: { idPrestador: idPrestador, idServico: idServico, dataAgendamento: dataAgendamento } })
  }

  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <View style={styles.userText}>
          <Pressable onPress={inicioClick}>
            <Ionicons name="arrow-back-outline" size={30} style={styles.backIcon}
              color="white"
            />
          </Pressable>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>{nomeUsuario}</Text>
        </View>
      </View>

      <ScrollView>
        <Text style={styles.title}>Agenda</Text>
        <Calendar
          style={styles.calendar}
          onDayPress={handleDayPress}
          current={'2024-10-22'}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: '#00ADF5' },
          }}
          markingType={'multi-dot'}
          theme={{
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#00ADF5',
            todayTextColor: '#00ADF5',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            arrowColor: 'black',
            monthTextColor: 'black',
          }}
        />

        <View style={styles.tasks}>
          <Text style={[styles.task, { color: 'red' }]}>Aparar a grama - José - 7:00</Text>
          <Text style={[styles.task, { color: 'green' }]}>Consertar a pia - Rafael - 15:00</Text>
          <Text style={[styles.task, { color: 'purple' }]}>Cortar o cabelo - Juliana - 14:00</Text>
        </View>

        <Pressable style={styles.addButton} onPress={() => agandamentoClick(selectedDate)}>
          <Ionicons name="add" size={30} color="white" />
        </Pressable>

        <Pressable style={styles.cronogramaButton} onPress={() => router.navigate('/(agenda)/cronograma')}>
          <Ionicons name="timer-outline" size={30} color="white" />
        </Pressable>
      </ScrollView>
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
  calendar: {
    marginBottom: 20,
  },
  tasks: {
    paddingHorizontal: 20,
  },
  task: {
    fontSize: 16,
    marginVertical: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: -30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  cronogramaButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  backIcon: {
    paddingRight: 15,
  },
});

export default AgendaScreen;
