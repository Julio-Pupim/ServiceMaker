import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, StatusBar, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';

const Agenda = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const addTask = () => {
    if (!task || !selectedDate) {
      Alert.alert('Erro', 'Por favor, insira uma tarefa e selecione uma data.');
      return;
    }

    const newTask = {
      date: selectedDate,
      description: task,
    };

    setTasks([...tasks, newTask]);
    setTask('');
    setSelectedDate('');
  };
  return (
    <ScrollView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <View style={styles.userText}>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>Usuário</Text>
        </View>
      </View>

      <Text style={styles.title}>Agendamento</Text>

      <Calendar
        style={styles.calendar}
        onDayPress={handleDayPress}
        current={'2024-08-22'}
        markedDates={{
          '2024-08-22': {
            dots: [
              { key: '1', color: 'red', selectedDotColor: 'red' },
              { key: '2', color: 'green', selectedDotColor: 'green' },
              { key: '3', color: 'purple', selectedDotColor: 'purple' },
            ],
            selected: true,
            selectedColor: '#00ADF5',
          },
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

      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FFD700',
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
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
  },
});

export default Agenda;